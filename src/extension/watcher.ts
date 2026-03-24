import * as vscode from 'vscode';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { parseArchitectureMd } from './parser/architecture.js';
import { toGraphData } from './parser/layout.js';
import type { GraphData } from '../shared/types.js';

export type WatcherCallback = (data: GraphData) => void;
export type ErrorCallback = (message: string) => void;

const ARCHITECTURE_FILES = ['architecture.md', '.houston/architecture.md'];

export const findArchitectureFile = async (): Promise<string | undefined> => {
  const root = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!root) return undefined;

  for (const file of ARCHITECTURE_FILES) {
    const fullPath = join(root, file);
    try {
      await vscode.workspace.fs.stat(vscode.Uri.file(fullPath));
      return fullPath;
    } catch {
      // file doesn't exist, continue
    }
  }
  return undefined;
};

export const readAndParse = async (filePath: string): Promise<GraphData> => {
  const content = await readFile(filePath, 'utf-8');
  const arch = parseArchitectureMd(content);
  return toGraphData(arch);
};

export const createWatcher = (
  context: vscode.ExtensionContext,
  onChange: WatcherCallback,
  onError: ErrorCallback
): vscode.Disposable[] => {
  const disposables: vscode.Disposable[] = [];

  for (const pattern of ARCHITECTURE_FILES) {
    const watcher = vscode.workspace.createFileSystemWatcher(`**/${pattern}`);

    const handleChange = async (uri: vscode.Uri) => {
      try {
        const data = await readAndParse(uri.fsPath);
        onChange(data);
      } catch (err) {
        onError(`Failed to parse ${pattern}: ${err instanceof Error ? err.message : String(err)}`);
      }
    };

    watcher.onDidChange(handleChange);
    watcher.onDidCreate(handleChange);
    watcher.onDidDelete(() => {
      onError(`${pattern} was deleted`);
    });

    disposables.push(watcher);
  }

  return disposables;
};
