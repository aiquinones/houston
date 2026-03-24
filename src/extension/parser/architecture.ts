import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import { parse as parseYaml } from 'yaml';
import type { Root, Heading, List, ListItem, Paragraph, Link, Text } from 'mdast';
import type {
  ArchitectureData,
  ArchitectureFrontmatter,
  System,
  Flow,
  Step,
  Connection,
  ConnectionDirection,
  FileReference,
} from '../../shared/types.js';

const parser = unified().use(remarkParse).use(remarkFrontmatter, ['yaml']);

export const parseArchitectureMd = (content: string): ArchitectureData => {
  const tree = parser.parse(content) as Root;

  const frontmatter = extractFrontmatter(tree);
  const systems = extractSystems(tree);

  return { frontmatter, systems };
};

// ── Frontmatter ──

const extractFrontmatter = (tree: Root): ArchitectureFrontmatter => {
  const yamlNode = tree.children.find((n) => n.type === 'yaml');
  if (!yamlNode || !('value' in yamlNode)) {
    return { name: 'Untitled' };
  }
  const parsed = parseYaml(yamlNode.value as string);
  return {
    name: parsed?.name ?? 'Untitled',
    version: parsed?.version,
    description: parsed?.description,
    theme: parsed?.theme,
  };
};

// ── Systems (H2 headings) ──

const extractSystems = (tree: Root): System[] => {
  const systems: System[] = [];
  const children = tree.children;

  let i = 0;
  while (i < children.length) {
    const node = children[i];
    if (isHeading(node, 2)) {
      const name = getHeadingText(node);
      const id = slugify(name);

      // Collect all nodes until the next H2
      const sectionNodes = [];
      i++;
      while (i < children.length && !isHeading(children[i], 2)) {
        sectionNodes.push(children[i]);
        i++;
      }

      const description = extractDescription(sectionNodes);
      const flows = extractFlows(sectionNodes, id);
      const connections = extractConnections(sectionNodes);

      systems.push({ id, name, description, flows, connections });
    } else {
      i++;
    }
  }

  return systems;
};

// ── Flows (H3 headings) ──

const extractFlows = (nodes: Root['children'], systemId: string): Flow[] => {
  const flows: Flow[] = [];

  let i = 0;
  while (i < nodes.length) {
    const node = nodes[i];
    if (isHeading(node, 3)) {
      const name = getHeadingText(node);

      // Skip the "Connections" section — handled separately
      if (name.toLowerCase() === 'connections') {
        i++;
        while (i < nodes.length && !isHeading(nodes[i], 3)) {
          i++;
        }
        continue;
      }

      const id = `${systemId}-${slugify(name)}`;

      // Collect list nodes until next H3
      const steps: Step[] = [];
      i++;
      while (i < nodes.length && !isHeading(nodes[i], 3)) {
        if (nodes[i].type === 'list') {
          const listSteps = extractSteps(nodes[i] as List, id);
          steps.push(...listSteps);
        }
        i++;
      }

      flows.push({ id, name, steps });
    } else {
      i++;
    }
  }

  return flows;
};

// ── Steps (list items) ──

const extractSteps = (list: List, parentId: string): Step[] => {
  return list.children.map((item, idx) => extractStep(item, `${parentId}-${idx}`));
};

const extractStep = (item: ListItem, id: string): Step => {
  const firstParagraph = item.children.find((c) => c.type === 'paragraph') as Paragraph | undefined;

  let label = '';
  let description: string | undefined;
  let fileRef: FileReference | undefined;

  if (firstParagraph) {
    const parsed = parseStepContent(firstParagraph);
    label = parsed.label;
    description = parsed.description;
    fileRef = parsed.fileRef;
  }

  // Recursively extract children from nested lists
  const children: Step[] = [];
  const nestedList = item.children.find((c) => c.type === 'list') as List | undefined;
  if (nestedList) {
    const childSteps = nestedList.children.map((child, idx) =>
      extractStep(child, `${id}-${idx}`)
    );
    children.push(...childSteps);
  }

  return { id, label, description, fileRef, children };
};

// ── Parse step content: `[Label](file_ref) → Description` ──

const parseStepContent = (
  paragraph: Paragraph
): { label: string; description?: string; fileRef?: FileReference } => {
  let label = '';
  let description: string | undefined;
  let fileRef: FileReference | undefined;

  for (const child of paragraph.children) {
    if (child.type === 'link') {
      const link = child as Link;
      label = getTextContent(link);
      fileRef = parseFileReference(link.url);
    } else if (child.type === 'text') {
      const text = (child as Text).value;
      // Check for → separator
      const arrowMatch = text.match(/^\s*→\s*(.*)/);
      if (arrowMatch) {
        description = arrowMatch[1].trim();
      } else if (!label) {
        label = text.trim();
      }
    }
  }

  return { label, description, fileRef };
};

// ── File references ──

const parseFileReference = (url: string): FileReference | undefined => {
  if (!url || url.startsWith('http')) return undefined;

  // path@MarkerName
  const markerMatch = url.match(/^(.+)@(.+)$/);
  if (markerMatch) {
    return { path: markerMatch[1], marker: markerMatch[2] };
  }

  // path#functionName
  const funcMatch = url.match(/^(.+)#(.+)$/);
  if (funcMatch) {
    return { path: funcMatch[1], functionName: funcMatch[2] };
  }

  // path:line-lineEnd
  const rangeMatch = url.match(/^(.+):(\d+)-(\d+)$/);
  if (rangeMatch) {
    return { path: rangeMatch[1], line: parseInt(rangeMatch[2]), lineEnd: parseInt(rangeMatch[3]) };
  }

  // path:line
  const lineMatch = url.match(/^(.+):(\d+)$/);
  if (lineMatch) {
    return { path: lineMatch[1], line: parseInt(lineMatch[2]) };
  }

  return { path: url };
};

// ── Connections ──

const extractConnections = (nodes: Root['children']): Connection[] => {
  const connections: Connection[] = [];

  let inConnections = false;
  for (const node of nodes) {
    if (isHeading(node, 3) && getHeadingText(node).toLowerCase() === 'connections') {
      inConnections = true;
      continue;
    }
    if (isHeading(node, 3) && inConnections) {
      break;
    }
    if (inConnections && node.type === 'list') {
      for (const item of (node as List).children) {
        const conn = parseConnection(item);
        if (conn) connections.push(conn);
      }
    }
  }

  return connections;
};

const parseConnection = (item: ListItem): Connection | null => {
  const paragraph = item.children.find((c) => c.type === 'paragraph') as Paragraph | undefined;
  if (!paragraph) return null;

  const text = getTextContent(paragraph);
  // [Source] → [Target] : description
  const match = text.match(
    /\[([^\]]+)\]\s*(→|←|↔)\s*\[([^\]]+)\]\s*(?::\s*(.+))?/
  );
  if (!match) return null;

  return {
    source: slugify(match[1]),
    target: slugify(match[3]),
    direction: match[2] as ConnectionDirection,
    description: match[4]?.trim(),
  };
};

// ── Helpers ──

const isHeading = (node: Root['children'][number], depth: number): node is Heading =>
  node.type === 'heading' && (node as Heading).depth === depth;

const getHeadingText = (heading: Heading): string =>
  heading.children
    .filter((c): c is Text => c.type === 'text')
    .map((c) => c.value)
    .join('');

const getTextContent = (node: { children: Array<{ type: string; value?: string; children?: Array<{ type: string; value?: string }> }> }): string => {
  let text = '';
  for (const child of node.children) {
    if ('value' in child && typeof child.value === 'string') {
      text += child.value;
    }
    if ('children' in child && Array.isArray(child.children)) {
      for (const grandchild of child.children) {
        if ('value' in grandchild && typeof grandchild.value === 'string') {
          text += grandchild.value;
        }
      }
    }
  }
  return text;
};

const extractDescription = (nodes: Root['children']): string | undefined => {
  const para = nodes.find((n) => n.type === 'paragraph') as Paragraph | undefined;
  if (!para) return undefined;
  return getTextContent(para);
};

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
