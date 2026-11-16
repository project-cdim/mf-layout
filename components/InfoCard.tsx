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

import { Group, Space, Text } from '@mantine/core';
import { CardLoading, IconWithInfo } from '@/shared-modules/components';

type InfoCardProps = {
  title: string;
  infoLabel: string;
  value: string | number | undefined;
  loading: boolean;
};

/**
 * Renders an information card with a title, an info icon, and a value.
 *
 * @param title - The title to display on the card.
 * @param infoLabel - The tooltip label for the info icon.
 * @param value - The value or content to display next to the title.
 * @param loading - Indicates whether the card should display a loading state.
 * @returns The rendered InfoCard component.
 */
export const InfoCard = ({ title, infoLabel, value, loading }: InfoCardProps) => {
  return (
    <CardLoading withBorder maw={400} loading={loading}>
      <Group gap={5}>
        <Text fw={600}>{title}</Text>
        <IconWithInfo type='info' label={infoLabel} />
        <Space w={5} />
        <Text>{value}</Text>
      </Group>
    </CardLoading>
  );
};
