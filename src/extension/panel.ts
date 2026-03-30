import * as vscode from 'vscode';
import { randomBytes } from 'crypto';
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

  const themeDisposable = vscode.window.onDidChangeActiveColorTheme((theme) => {
    panel.webview.postMessage({ type: 'themeChanged', kind: theme.kind });
  });
  panel.onDidDispose(() => themeDisposable.dispose());

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

  const normalized = fileRef.path.replace(/\\/g, '/');
  if (normalized.includes('..') || normalized.startsWith('/')) {
    vscode.window.showWarningMessage(`Houston: Blocked suspicious path: ${fileRef.path}`);
    return;
  }

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

  const themeKind = vscode.window.activeColorTheme.kind;
  const isDark = themeKind !== 1 && themeKind !== 4; // 1=Light, 4=HighContrastLight
  const initialBg = isDark ? '#0a0e17' : '#f8f9fb';
  const initialColor = isDark ? '#c8d3e0' : '#1e293b';

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
      background: ${initialBg};
      color: ${initialColor};
      font-family: var(--vscode-font-family, 'SF Mono', 'Fira Code', monospace);
    }
  </style>
</head>
<body data-vscode-theme="${themeKind}">
  <div id="root"></div>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
};

const getNonce = (): string => randomBytes(16).toString('hex');
