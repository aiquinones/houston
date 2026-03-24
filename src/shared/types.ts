// ── Architecture.md schema ──

export type ArchitectureFrontmatter = {
  name: string;
  version?: string;
  description?: string;
  theme?: 'default' | 'minimal' | 'blueprint';
};

export type FileReference = {
  path: string;
  functionName?: string;
  line?: number;
  lineEnd?: number;
  marker?: string;
};

export type Step = {
  id: string;
  label: string;
  description?: string;
  fileRef?: FileReference;
  children: Step[];
};

export type ConnectionDirection = '→' | '←' | '↔';

export type Connection = {
  source: string;
  target: string;
  direction: ConnectionDirection;
  description?: string;
};

export type Flow = {
  id: string;
  name: string;
  steps: Step[];
};

export type System = {
  id: string;
  name: string;
  description?: string;
  flows: Flow[];
  connections: Connection[];
};

export type ArchitectureData = {
  frontmatter: ArchitectureFrontmatter;
  systems: System[];
};

// ── React Flow graph data ──

export type HoustonNodeType = 'system' | 'flow' | 'step' | 'stepGroup';

export type StepSummary = {
  label: string;
  description?: string;
  fileRef?: FileReference;
};

export type HoustonNodeData = {
  label: string;
  description?: string;
  fileRef?: FileReference;
  nodeType: HoustonNodeType;
  systemId?: string;
  flowId?: string;
  depth?: number;
  childCount?: number;
  children?: StepSummary[];
};

export type HoustonNode = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: HoustonNodeData;
  parentId?: string;
  extent?: 'parent';
  style?: Record<string, string | number>;
};

export type HoustonEdge = {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  label?: string;
  style?: Record<string, string | number>;
};

export type GraphData = {
  nodes: HoustonNode[];
  edges: HoustonEdge[];
  frontmatter: ArchitectureFrontmatter;
};

// ── Extension ↔ Webview messages ──

export type ExtensionToWebviewMessage =
  | { type: 'update'; data: GraphData }
  | { type: 'error'; message: string };

export type WebviewToExtensionMessage =
  | { type: 'openFile'; fileRef: FileReference }
  | { type: 'ready' };
