import type {
  ArchitectureData,
  GraphData,
  HoustonNode,
  HoustonEdge,
  Step,
} from '../../shared/types.js';

const SYSTEM_WIDTH = 520;
const SYSTEM_HEADER = 80;
const FLOW_HEIGHT = 50;
const STEP_HEIGHT = 70;
const STEP_INDENT = 30;
const PADDING = 24;
const SYSTEM_GAP = 80;

export const toGraphData = (arch: ArchitectureData): GraphData => {
  const nodes: HoustonNode[] = [];
  const edges: HoustonEdge[] = [];

  let systemX = 0;

  for (const system of arch.systems) {
    let innerY = SYSTEM_HEADER;
    const flowNodes: HoustonNode[] = [];
    const flowEdges: HoustonEdge[] = [];

    for (const flow of system.flows) {
      // Flow label node
      flowNodes.push({
        id: flow.id,
        type: 'flow',
        position: { x: PADDING, y: innerY },
        data: {
          label: flow.name,
          nodeType: 'flow',
          systemId: system.id,
          flowId: flow.id,
        },
        parentId: system.id,
        extent: 'parent',
      });
      innerY += FLOW_HEIGHT;

      // Steps
      let prevStepId: string | undefined;
      const flatSteps = flattenSteps(flow.steps);

      for (const { step, depth } of flatSteps) {
        flowNodes.push({
          id: step.id,
          type: 'step',
          position: { x: PADDING + STEP_INDENT * depth + STEP_INDENT, y: innerY },
          data: {
            label: step.label,
            description: step.description,
            fileRef: step.fileRef,
            nodeType: 'step',
            systemId: system.id,
            flowId: flow.id,
          },
          parentId: system.id,
          extent: 'parent',
        });

        if (prevStepId) {
          flowEdges.push({
            id: `e-${prevStepId}-${step.id}`,
            source: prevStepId,
            target: step.id,
            type: 'smoothstep',
            animated: false,
          });
        } else {
          // Connect flow label to first step
          flowEdges.push({
            id: `e-${flow.id}-${step.id}`,
            source: flow.id,
            target: step.id,
            type: 'smoothstep',
            animated: false,
          });
        }

        prevStepId = step.id;
        innerY += STEP_HEIGHT;
      }

      innerY += PADDING;
    }

    const systemHeight = Math.max(innerY + PADDING, 120);

    // System container node
    nodes.push({
      id: system.id,
      type: 'system',
      position: { x: systemX, y: 0 },
      data: {
        label: system.name,
        description: system.description,
        nodeType: 'system',
      },
      style: {
        width: SYSTEM_WIDTH,
        height: systemHeight,
      },
    });

    nodes.push(...flowNodes);
    edges.push(...flowEdges);

    // Cross-system connection edges
    for (const conn of system.connections) {
      const source = conn.direction === '←' ? conn.target : conn.source;
      const target = conn.direction === '←' ? conn.source : conn.target;
      const edgeId = `conn-${source}-${target}`;

      // Avoid duplicate edges
      if (!edges.some((e) => e.id === edgeId)) {
        edges.push({
          id: edgeId,
          source,
          target,
          type: 'smoothstep',
          animated: true,
          label: conn.description,
          style: { opacity: 0.5 },
        });
      }
    }

    systemX += SYSTEM_WIDTH + SYSTEM_GAP;
  }

  return { nodes, edges, frontmatter: arch.frontmatter };
};

// Flatten nested steps with depth tracking
const flattenSteps = (steps: Step[], depth = 0): Array<{ step: Step; depth: number }> => {
  const result: Array<{ step: Step; depth: number }> = [];
  for (const step of steps) {
    result.push({ step, depth });
    if (step.children.length > 0) {
      result.push(...flattenSteps(step.children, depth + 1));
    }
  }
  return result;
};
