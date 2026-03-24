import * as vscode from 'vscode';
import type { ExtensionToWebviewMessage, WebviewToExtensionMessage, FileReference } from '../shared/types.js';

export const createHoustonPanel = (
  context: vscode.ExtensionContext,
  onReady: () => void
): vscode.WebviewPanel => {
  const panel = vscode.window.createWebviewPanel(
    'houston',
    'Houston',
    vscode.ViewColumn.Beside,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'dist', 'webview')],
    }
  );

  panel.iconPath = vscode.Uri.joinPath(context.extensionUri, 'media', 'icon.svg');
  panel.webview.html = getWebviewHtml(panel.webview, context.extensionUri);

  panel.webview.onDidReceiveMessage(
    (msg: WebviewToExtensionMessage) => {
      switch (msg.type) {
        case 'ready':
          onReady();
          break;
        case 'openFile':
          openFileReference(msg.fileRef);
          break;
      }
    },
    undefined,
    context.subscriptions
  );

  return panel;
};

export const postMessage = (
  panel: vscode.WebviewPanel,
  message: ExtensionToWebviewMessage
): void => {
  panel.webview.postMessage(message);
};

const openFileReference = async (fileRef: FileReference): Promise<void> => {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri;
  if (!workspaceRoot) return;

  const fileUri = vscode.Uri.joinPath(workspaceRoot, fileRef.path);

  try {
    const doc = await vscode.workspace.openTextDocument(fileUri);
    const line = fileRef.line ? fileRef.line - 1 : 0;
    const range = new vscode.Range(line, 0, line, 0);

    await vscode.window.showTextDocument(doc, {
      selection: range,
      viewColumn: vscode.ViewColumn.One,
    });
  } catch {
    vscode.window.showWarningMessage(`Houston: Could not open ${fileRef.path}`);
  }
};

const getWebviewHtml = (
  webview: vscode.Webview,
  extensionUri: vscode.Uri
): string => {
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'dist', 'webview', 'index.js')
  );
  const cssUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'dist', 'webview', 'index.css')
  );

  const nonce = getNonce();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';" />
  <link rel="stylesheet" href="${cssUri}" />
  <title>Houston</title>
  <style>
    html, body, #root {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #0a0e17;
      color: #c8d3e0;
      font-family: var(--vscode-font-family, 'SF Mono', 'Fira Code', monospace);
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
};

const getNonce = (): string => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
