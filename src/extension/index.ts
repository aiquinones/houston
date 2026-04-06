import * as vscode from 'vscode';
import { createHoustonPanel, postMessage } from './panel.js';
import { enablePlugins, disablePlugins } from './plugins.js';
import { createWatcher, findArchitectureFile, readAndParse } from './watcher.js';

let panel: vscode.WebviewPanel | undefined;

// marker:start Activate
export const activate = (context: vscode.ExtensionContext): void => {
  const openCommand = vscode.commands.registerCommand('houston.open', () => {
    if (panel) {
      panel.reveal();
      return;
    }

    panel = createHoustonPanel(context, () => {
      // Webview is ready — send initial data
      sendGraphData();
    });

    // Watch for architecture.md changes
    const watchers = createWatcher(
      context,
      (data) => {
        if (panel) postMessage(panel, { type: 'update', data });
      },
      (message) => {
        if (panel) postMessage(panel, { type: 'error', message });
      }
    );

    panel.onDidDispose(() => {
      panel = undefined;
      watchers.forEach((w) => w.dispose());
    });
  });

  const refreshCommand = vscode.commands.registerCommand('houston.refresh', () => {
    sendGraphData();
  });

  const enablePluginsCmd = vscode.commands.registerCommand('houston.enablePlugins', enablePlugins);
  const disablePluginsCmd = vscode.commands.registerCommand('houston.disablePlugins', disablePlugins);

  context.subscriptions.push(openCommand, refreshCommand, enablePluginsCmd, disablePluginsCmd);
};
// marker:end Activate

// marker:start SendGraphData
const sendGraphData = async (): Promise<void> => {
  if (!panel) return;

  const filePath = await findArchitectureFile();
  if (!filePath) {
    postMessage(panel, {
      type: 'error',
      message: 'No architecture.md found. Create one in your workspace root or .houston/ folder.',
    });
    return;
  }

  try {
    const data = await readAndParse(filePath);
    postMessage(panel, { type: 'update', data });
  } catch (err) {
    postMessage(panel, {
      type: 'error',
      message: `Failed to parse architecture.md: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
};
// marker:end SendGraphData

export const deactivate = (): void => {
  // cleanup handled by disposables
};
