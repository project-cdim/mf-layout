/*
 * Copyright 2025 NEC Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

'use client';

import { CardLoading, PageLink } from '@/shared-modules/components';
import { APIresource } from '@/shared-modules/types';
import { formatUnitValue, typeToUnit } from '@/shared-modules/utils';
import { APIDeviceTypeLowerCamel, APINode } from '@/types';
import { changeToAPPCase, formatLCtype } from '@/utils/parse';
import dagre from '@dagrejs/dagre';
import { Card, Center, Stack, Text, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';
import type { Edge, Node, NodeProps } from 'reactflow';
import { Handle, Position, ReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';

type NodeNodeType = {
  id: string;
  data: {
    label: string;
  };
  type: 'node';
  position: {
    x: number;
    y: number;
  };
};
type DeviceNodeType = {
  id: string;
  data: {
    deviceType: APIDeviceTypeLowerCamel;
    spec: string | number;
  };
  type: 'device';
  position: {
    x: number;
    y: number;
  };
};
type EdgeType = {
  id: string;
  type: string;
  source: string;
  target: string;
};

const CustomNodeNode = (props: NodeProps<{ label: string }>) => {
  return (
    <>
      <Card withBorder w={350} h={80} padding={0} bg='gray.3' title={`${props.id}`}>
        <Center h={'100%'}>
          <Text ta='center' fw='bold' size='26px'>{`${props.data.label}`}</Text>
        </Center>
      </Card>
      <Handle type='source' position={Position.Right} />
    </>
  );
};

const CustomDeviceNode = (props: NodeProps<{ deviceType: APIDeviceTypeLowerCamel; spec: string | number }>) => {
  const t = useTranslations();
  let spec = '';
  if (typeof props.data.spec === 'number') {
    const unit = typeToUnit(formatLCtype(props.data.deviceType), props.data.spec);
    const specValue = formatUnitValue(formatLCtype(props.data.deviceType), props.data.spec, unit);
    spec = specValue + unit;
  } else {
    spec = props.data.spec;
  }
  return (
    <>
      <Handle type='target' position={Position.Left} />
      <Card withBorder w={650} h={80} padding={0}>
        <Stack h={80} gap={0} align='center' justify='center'>
          <PageLink title={t('Resource Details')} path='/cdim/res-resource-detail' query={{ id: props.id }}>
            <Text fw='bold' size='xl' ta='center'>{`${changeToAPPCase(props.data.deviceType)} (${props.id})`}</Text>
            <Text size='xl' ta='center'>{`${spec}`}</Text>
          </PageLink>
        </Stack>
      </Card>
    </>
  );
};

/**
 * A React component that displays a layout of nodes and devices using a directed graph.
 *
 * This component utilizes the Dagre library to generate a graph layout and positions nodes
 * for a flow diagram using React Flow. It parses the provided API node data, creates the graph
 * nodes and edges accordingly, and applies a layout algorithm to compute the visual positions.
 *
 * @param props - The component props.
 * @param props.nodes - An array of API node objects to be visualized.
 * @param props.getDeviceByID - A callback function that retrieves device information by its ID.
 * @param props.loading - A boolean indicating whether the component is in a loading state.
 *
 * @returns A JSX element that renders the graph layout if node data is available; otherwise, a message indicating no data.
 */
export const NodeLayout = (props: {
  nodes: APINode[];
  getDeviceByID: (deviceID: string) => APIresource['device'] | undefined;
  loading: boolean;
}) => {
  /** dagreGraph object */
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const parseLayoutData = (
    nodesData: APINode[]
  ): [Node<NodeNodeType['data'] | DeviceNodeType['data'], 'node' | 'device'>[], Edge[]] => {
    const position = { x: 0, y: 0 };
    const nodes: Node<NodeNodeType['data'] | DeviceNodeType['data'], 'node' | 'device'>[] = [];
    const edges: EdgeType[] = [];
    let count = 1;

    for (const nodeData of nodesData) {
      // const nodeId: string = nodeData.nodeID ? `Node (${nodeData.nodeID})` : `unknow node ${count++}`;
      const nodeId = `Node ${count++}`;
      nodes.push({ id: nodeId, data: { label: nodeId }, type: 'node', position: position });
      for (const [deviceType, deviceTypeData] of Object.entries(nodeData.device)) {
        for (const deviceId of deviceTypeData.deviceIDs) {
          {
            /* Get data and display actual data for each resource */
          }
          const device = props.getDeviceByID(deviceId);
          const spec = device?.totalCores ?? device?.capacityMiB ?? device?.driveCapacityBytes ?? '-';
          nodes.push({
            id: deviceId,
            data: { deviceType: deviceType as APIDeviceTypeLowerCamel, spec: spec },
            type: 'device',
            position: position,
          });
          edges.push({ id: `${nodeId}-${deviceId}`, type: 'simplebezier', source: nodeId, target: deviceId });
        }
      }
    }
    return [nodes, edges];
  };

  const getLayoutedElements = (
    nodes: Node<NodeNodeType['data'] | DeviceNodeType['data'], 'node' | 'device'>[],
    edges: Edge[]
  ) => {
    /** Display interval information for each element of the node tree */
    const nodeWidth = 500; // Set larger to create horizontal space
    const nodeHeight = 80;

    // Early return if there is no node or edge information
    if (nodes.length === 0 && edges.length === 0) {
      return { nodes: [], edges: [] };
    }
    dagreGraph.setGraph({ rankdir: 'LR' });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = Position.Left;
      node.sourcePosition = Position.Right;

      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      node.position = {
        x: nodeWithPosition.x - nodeWidth,
        y: nodeWithPosition.y - nodeHeight,
      };

      return node;
    });

    return { nodes, edges };
  };
  const parsedData = parseLayoutData(props.nodes);
  const { nodes, edges } = getLayoutedElements(parsedData[0], parsedData[1]);
  const t = useTranslations();

  return (
    <>
      <Title order={2} fz='lg'>
        {t('Node Layout')}
      </Title>
      {props.nodes.length !== 0 ? (
        <CardLoading withBorder loading={props.loading}>
          {/* If the card width exceeds the width of the div, nothing will be displayed in that part, so match the display width to the parent element */}
          <div style={{ width: '100%', height: '600px' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={{ node: CustomNodeNode, device: CustomDeviceNode }}
              fitView
              proOptions={{ hideAttribution: true }}
              nodesFocusable={false}
              edgesFocusable={false}
              panActivationKeyCode={null}
            />
          </div>
        </CardLoading>
      ) : (
        <Text>{t('No data')}</Text>
      )}
    </>
  );
};
