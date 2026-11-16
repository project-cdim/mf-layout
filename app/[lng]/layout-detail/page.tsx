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

import { useEffect, useState } from 'react';

import dagre from '@dagrejs/dagre';
import { Box, Card, Center, Group, LoadingOverlay, Space, Stack, Stepper, Text, useMatches } from '@mantine/core';
import _ from 'lodash';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useLocale, useTranslations } from 'next-intl';
import { Handle, Position, ReactFlow } from 'reactflow';
import type { Edge, Node, NodeProps } from 'reactflow';
import 'reactflow/dist/style.css';
import useSWRImmutable from 'swr/immutable';

import { CardLoading, MessageBox, PageHeader, PageLink } from '@/shared-modules/components';
import { PAGE_SIZES, TABLE_MIN_HEIGHT } from '@/shared-modules/constant';
import { APIresources } from '@/shared-modules/types';
import { formatUnitValue, typeToUnit } from '@/shared-modules/utils';
import { fetcher } from '@/shared-modules/utils/fetcher';
import { useLoading, useMSW, useQuery } from '@/shared-modules/utils/hooks';

import { APIDeviceTypeLowerCamel, APILayoutDetail, APPProcedure } from '@/types';

import { useColumns } from '@/utils/hooks/detail/useColumns';
import {
  applyState,
  changeToAPPCase,
  dateParse,
  designState,
  formatDuration,
  formatLCtype,
  makeDate,
} from '@/utils/parse';

/* eslint-disable complexity */

/**
 * Renders the layout detail page.
 *
 * @returns The JSX element representing the layout detail page.
 */
const LayoutDetail = () => {
  const FIRST_PAGE = 1;
  const DEFAULT_RECORDS = 0;
  const t = useTranslations();
  const query = useQuery();
  const items = [
    { title: t('Layout Management') },
    { title: t('Layout Designs'), href: '/cdim/lay-layout-list' },
    { title: `${t('Layout Design Details')} <${query.id}>` },
  ];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [Page, setPage] = useState(FIRST_PAGE);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<APPProcedure>>({
    columnAccessor: 'operationID',
    direction: 'asc',
  });
  const [records, setRecords] = useState<APPProcedure[] | undefined>(undefined);
  const [procedureRecords, setProcedureRecords] = useState<APPProcedure[] | undefined>(undefined);
  const [totalRecords, setTotalRecords] = useState(DEFAULT_RECORDS);
  const currentLocale = useLocale();

  const mswInitializing = useMSW();

  const layoutSWRResponse = useSWRImmutable<APILayoutDetail>(
    query.id && !mswInitializing && `${process.env.NEXT_PUBLIC_URL_BE_LAYOUT_MANAGER}/layout/${query.id}`, // Temporary
    fetcher
  );
  const resourceSWRResponse = useSWRImmutable<APIresources>(
    layoutSWRResponse.data &&
      layoutSWRResponse.data.design.node?.length != null &&
      `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resources?detail=true`, // Get all resource list (when search conditions are implemented, get by deviceID)
    fetcher
  );

  useEffect(() => {
    // Convert API response data to table data
    const newLayoutList = layoutSWRResponse.data?.procedure.map((item) => {
      const returnObject: APPProcedure = {
        /** Procedure ID */
        operationID: item.operationId,
        /** Operation type */
        operation: item.operation,
        /** Host CPU ID */
        hostCpuID: item.targetCpuId,
        /** Device ID */
        targetDeviceID: item.targetDeviceId || '',
        /** List of procedure IDs with dependencies operationID,... */
        dependencies: item.dependencies.join(','),
        /** Execution result status(endDate) */
        result: '',
      };
      switch (item.applyResults?.status) {
        case 'IN_PROGRESS':
          returnObject.result = t('Executing');
          break;
        case 'COMPLETED':
          returnObject.result = `${t('Completed')} (${dateParse(item.applyResults.endDate, currentLocale)})`;
          break;
        case 'FAILED':
          returnObject.result = `${t('Failed')} (${dateParse(item.applyResults.endDate, currentLocale)})`;
          break;
        case 'SKIPPED':
          returnObject.result = `${t('Skipped')} (${dateParse(item.applyResults.endDate, currentLocale)})`;
          break;
        case 'CANCELED':
          returnObject.result = `${t('Cancel')} (${dateParse(item.applyResults.endDate, currentLocale)})`;
          break;
        default:
          break;
      }
      return returnObject;
    });
    // TS support. Remove undefined
    const newLayoutListExcludeNullableItem = newLayoutList?.filter(
      (item): item is NonNullable<APPProcedure> => item !== undefined
    );
    // Set migration procedure records. If it is an empty array, set undefined
    setProcedureRecords(newLayoutListExcludeNullableItem?.length === 0 ? undefined : newLayoutListExcludeNullableItem);
    // Set total number of records
    setTotalRecords(newLayoutListExcludeNullableItem?.length || 0);
    // Set records to be displayed
    setRecords(newLayoutListExcludeNullableItem?.slice((Page - 1) * pageSize, Page * pageSize));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutSWRResponse.data]);

  /** Sort */
  useEffect(() => {
    const from = (Page - 1) * pageSize;
    const to = from + pageSize;
    const sortedRecords = _.orderBy(procedureRecords, [sortStatus.columnAccessor], [sortStatus.direction]);
    setRecords(_.slice(sortedRecords, from, to));
  }, [Page, sortStatus, pageSize, procedureRecords]);

  const handleSortStatus = (status: DataTableSortStatus<APPProcedure>) => {
    setSortStatus(status);
  };

  const designStepDescription = () => {
    return (
      <>
        {!layoutSWRResponse.data ? (
          <p>-</p>
        ) : (
          <>
            <p>{t(designState[layoutSWRResponse.data.status.design.status])}</p>
            <p>{makeDate(layoutSWRResponse.data.status.design, currentLocale)}</p>
            <p>{formatDuration(layoutSWRResponse.data.status.design.durationSec)}</p>
          </>
        )}
      </>
    );
  };

  const applyStepDescription = () => {
    return (
      <>
        {!layoutSWRResponse.data?.status.apply ? (
          <p>-</p>
        ) : (
          <>
            <p>{t(applyState[layoutSWRResponse.data.status.apply.status])}</p>
            <p>{makeDate(layoutSWRResponse.data.status.apply, currentLocale)}</p>
            <p>{formatDuration(layoutSWRResponse.data.status.apply.durationSec)}</p>
          </>
        )}
      </>
    );
  };

  const activeState = {
    ACTIVE: 'In Use',
    INACTIVE: 'Used',
  };

  const activeStepDescription = () => {
    return (
      <>
        {!layoutSWRResponse.data?.status.active ? (
          <p>-</p>
        ) : (
          <>
            <p>{t(activeState[layoutSWRResponse.data.status.active.status])}</p>
            <p>{makeDate(layoutSWRResponse.data.status.active, currentLocale)}</p>
            <p>{formatDuration(layoutSWRResponse.data.status.active.durationSec)}</p>
          </>
        )}
      </>
    );
  };

  /**
   * xs, sm, md, lg, xl values are used when the viewport width is larger that the value of corresponding breakpoint specified in theme.breakpoints
   */
  const stepperAlignment = useMatches<'vertical' | 'horizontal'>({
    base: 'vertical',
    sm: 'horizontal',
  });

  const mutate = () => {
    layoutSWRResponse.mutate();
    resourceSWRResponse.mutate();
  };
  const loading = useLoading(layoutSWRResponse.isValidating || resourceSWRResponse.isValidating || mswInitializing);
  const layoutLoading = useLoading(layoutSWRResponse.isValidating || mswInitializing);

  return (
    <>
      <PageHeader pageTitle={t('Layout Design Details')} items={items} mutate={mutate} loading={loading} />
      {layoutSWRResponse.error && (
        <>
          <Space h='xl' />
          <MessageBox
            type='error'
            title={layoutSWRResponse.error.message}
            message={layoutSWRResponse.error.response?.data.message || ''}
          />
        </>
      )}
      {resourceSWRResponse.error && (
        <>
          <Space h='xl' />
          <MessageBox
            type='error'
            title={resourceSWRResponse.error.message}
            message={resourceSWRResponse.error.response?.data.message || ''}
          />
        </>
      )}
      <Card p='0'>
        <Group pl='md' pr='md' mt='md'>
          <CardLoading withBorder w={'43em'} loading={layoutLoading}>
            <Text fz='sm'>{t('Layout ID')}</Text>
            <Text fz='lg' fw={500}>
              {layoutSWRResponse.data?.designID}
            </Text>
          </CardLoading>
        </Group>

        <Space h='xl' />

        <Box pos='relative'>
          <LoadingOverlay visible={layoutLoading} />
          <div style={{ maxWidth: '78%', paddingLeft: '16px' }}>
            <Stepper active={-1} orientation={stepperAlignment}>
              <Stepper.Step label={t('Design')} description={designStepDescription} />
              <Stepper.Step label={t('Apply')} description={applyStepDescription} />
              <Stepper.Step label={t('Use')} description={activeStepDescription} />
            </Stepper>
          </div>
        </Box>

        <Space h='xl' />

        <Group pl='md' w={'43em'}>
          {layoutSWRResponse.data?.status.design?.status === 'FAILED' && (
            <CardLoading withBorder style={{ flex: 1 }} ml='lg' loading={layoutLoading}>
              <Text fz='sm' fw={500}>
                {t('Design')}
                {t(designState[layoutSWRResponse.data.status.design.status])} : [
                {layoutSWRResponse.data.status.design.code}] {layoutSWRResponse.data.status.design.message}
              </Text>
            </CardLoading>
          )}
          {layoutSWRResponse.data?.status.apply?.status === 'FAILED' && (
            <CardLoading withBorder style={{ flex: 1 }} ml='lg' loading={layoutLoading}>
              <Text fz='sm' fw={500}>
                {t('Apply')}
                {t(applyState[layoutSWRResponse.data.status.apply.status])} : [
                {layoutSWRResponse.data.status.apply.code}] {layoutSWRResponse.data.status.apply.message}
              </Text>
            </CardLoading>
          )}
        </Group>
      </Card>

      <Space h='xl' />
      {layoutSWRResponse.data && (
        <NodeLayout layoutData={layoutSWRResponse.data} resourceData={resourceSWRResponse.data} loading={loading} />
      )}

      <Space h='xl' />

      <div>
        <Text fz='lg' fw={700}>
          {t('Migration Steps')}
        </Text>
      </div>
      <div style={{ position: 'relative', overflow: 'auto' }}>
        <DataTable<APPProcedure>
          minHeight={totalRecords === 0 ? TABLE_MIN_HEIGHT : 0}
          noRecordsText={t('No records')}
          withTableBorder
          borderRadius='sm'
          shadow='sm'
          striped
          verticalSpacing='xs'
          columns={useColumns()}
          records={records}
          totalRecords={totalRecords}
          recordsPerPage={pageSize}
          page={Page}
          onPageChange={(p) => setPage(p)}
          recordsPerPageOptions={PAGE_SIZES}
          onRecordsPerPageChange={setPageSize}
          recordsPerPageLabel={t('Records per page')}
          sortStatus={sortStatus}
          onSortStatusChange={handleSortStatus}
          fetching={layoutLoading}
          idAccessor='operationID'
        />
      </div>
    </>
  );
};

//----------- Node Layout ----------------
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
      <Card withBorder w={450} h={80} padding={0} bg='gray.3' title={`${props.id}`}>
        <Center h={'100%'}>
          <Text ta='center' fw='bold'>{`${props.data.label}`}</Text>
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
      <Card withBorder w={600} h={80} padding={0}>
        <PageLink title={t('Resource Details')} path='/cdim/res-resource-detail' query={{ id: props.id }}>
          <Stack h={80} gap={0} align='center' justify='center'>
            <Text fw='bold'>{`${changeToAPPCase(props.data.deviceType)} (${props.id})`}</Text>
            <Text>{`${spec}`}</Text>
          </Stack>
        </PageLink>
      </Card>
    </>
  );
};

const NodeLayout = (props: {
  layoutData: APILayoutDetail;
  resourceData: APIresources | undefined;
  loading: boolean;
}) => {
  /** dagreGraph object */
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const parseLayoutData = (
    layoutData: APILayoutDetail['design']['node'] | undefined
  ): [Node<NodeNodeType['data'] | DeviceNodeType['data'], 'node' | 'device'>[], Edge[]] => {
    if (!layoutData) return [[], []];
    const position = { x: 0, y: 0 };
    const nodes: Node<NodeNodeType['data'] | DeviceNodeType['data'], 'node' | 'device'>[] = [];
    const edges: EdgeType[] = [];
    let count = 1;

    for (const nodeData of layoutData) {
      const nodeId: string = nodeData.nodeID ? `Node (${nodeData.nodeID})` : `unknow node ${count++}`;
      nodes.push({ id: nodeId, data: { label: nodeId }, type: 'node', position: position });
      for (const [deviceType, deviceTypeData] of Object.entries(nodeData.device)) {
        for (const deviceId of deviceTypeData.deviceID) {
          {
            /* Get data and display actual data for each resource */
          }
          const resource = props.resourceData?.resources.find((resource) => resource.device.deviceID === deviceId);
          const spec: number | '-' =
            resource?.device.totalCores || resource?.device.capacityMiB || resource?.device.driveCapacityBytes || '-';
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

  const parsedData = parseLayoutData(props.layoutData.design.node);
  const { nodes, edges } = getLayoutedElements(parsedData[0], parsedData[1]);
  const t = useTranslations();

  return (
    <>
      <Text fz='lg' fw={700}>
        {t('Node Layout')}
      </Text>
      <CardLoading withBorder loading={props.loading}>
        {/* If the card width exceeds the width of the div, nothing will be displayed in that part, so match the display width to the parent element */}
        <div style={{ width: '100%', height: '600px' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={{ node: CustomNodeNode, device: CustomDeviceNode }}
            fitView
            proOptions={{ hideAttribution: true }}
          />
        </div>
      </CardLoading>
    </>
  );
};

export default LayoutDetail;
