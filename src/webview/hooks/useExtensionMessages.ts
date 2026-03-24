import { useState, useEffect, useCallback } from 'react';
import type { GraphData, ExtensionToWebviewMessage, WebviewToExtensionMessage, FileReference } from '../../shared/types.js';

// marker:start VsCodeApi
type VsCodeApi = {
  postMessage: (message: WebviewToExtensionMessage) => void;
  getState: () => unknown;
  setState: (state: unknown) => void;
};

declare function acquireVsCodeApi(): VsCodeApi;

let vscodeApi: VsCodeApi | undefined;
const getApi = (): VsCodeApi | undefined => {
  if (vscodeApi) return vscodeApi;
  try {
    vscodeApi = acquireVsCodeApi();
    return vscodeApi;
  } catch {
    // Not in a webview context (standalone dev mode)
    return undefined;
  }
};
// marker:end VsCodeApi

// marker:start UseExtensionMessages
export const useExtensionMessages = () => {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const api = getApi();

    const handleMessage = (event: MessageEvent<ExtensionToWebviewMessage>) => {
      const msg = event.data;
      switch (msg.type) {
        case 'update':
          setGraphData(msg.data);
          setError(null);
          break;
        case 'error':
          setError(msg.message);
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    // Tell the extension we're ready
    api?.postMessage({ type: 'ready' });

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const openFile = useCallback((fileRef: FileReference) => {
    const api = getApi();
    api?.postMessage({ type: 'openFile', fileRef });
  }, []);

  return { graphData, error, openFile };
};
// marker:end UseExtensionMessages
