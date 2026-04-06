import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const MARKETPLACE_SOURCE = {
  source: 'github' as const,
  repo: 'aiquinones/houston',
};

const MARKETPLACE_NAME = 'houston-plugins';

type SettingsJson = {
  extraKnownMarketplaces?: Record<string, { source: typeof MARKETPLACE_SOURCE }>;
  [key: string]: unknown;
};

const getClaudeSettingsPath = (): string | undefined => {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) return undefined;
  return path.join(workspaceFolder.uri.fsPath, '.claude', 'settings.json');
};

const readSettings = (settingsPath: string): SettingsJson => {
  if (!fs.existsSync(settingsPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(settingsPath, 'utf-8')) as SettingsJson;
  } catch {
    return {};
  }
};

const writeSettings = (settingsPath: string, settings: SettingsJson): void => {
  const dir = path.dirname(settingsPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n', 'utf-8');
};

const isPluginEnabled = (settings: SettingsJson): boolean =>
  settings.extraKnownMarketplaces?.[MARKETPLACE_NAME] !== undefined;

export const enablePlugins = async (): Promise<void> => {
  const settingsPath = getClaudeSettingsPath();
  if (!settingsPath) {
    vscode.window.showErrorMessage('No workspace folder open.');
    return;
  }

  const settings = readSettings(settingsPath);

  if (isPluginEnabled(settings)) {
    vscode.window.showInformationMessage('Houston plugins are already enabled.');
    return;
  }

  settings.extraKnownMarketplaces = {
    ...settings.extraKnownMarketplaces,
    [MARKETPLACE_NAME]: { source: MARKETPLACE_SOURCE },
  };

  writeSettings(settingsPath, settings);
  vscode.window.showInformationMessage(
    'Houston plugins enabled. Claude Code will pick them up in your next session.'
  );
};

export const disablePlugins = async (): Promise<void> => {
  const settingsPath = getClaudeSettingsPath();
  if (!settingsPath) {
    vscode.window.showErrorMessage('No workspace folder open.');
    return;
  }

  const settings = readSettings(settingsPath);

  if (!isPluginEnabled(settings)) {
    vscode.window.showInformationMessage('Houston plugins are already disabled.');
    return;
  }

  const { [MARKETPLACE_NAME]: _, ...rest } = settings.extraKnownMarketplaces ?? {};
  if (Object.keys(rest).length === 0) {
    delete settings.extraKnownMarketplaces;
  } else {
    settings.extraKnownMarketplaces = rest;
  }

  writeSettings(settingsPath, settings);
  vscode.window.showInformationMessage('Houston plugins disabled.');
};
