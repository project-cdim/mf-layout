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

import { PolicyEditModalNodeConfigurationPolicy, PolicyEditModalSystemOperationPolicy } from '@/components';

import { ComponentProps } from 'react';

/**
 * Component that displays a form for adding/editing policy conditions
 * @param props
 * @returns
 */

export const PolicyEditModal = (
  props:
    | ({ category: 'nodeConfigurationPolicy' } & ComponentProps<typeof PolicyEditModalNodeConfigurationPolicy>)
    | ({ category: 'systemOperationPolicy' } & ComponentProps<typeof PolicyEditModalSystemOperationPolicy>)
) => {
  const { category, ...restProps } = props;
  switch (category) {
    case 'nodeConfigurationPolicy':
      return (
        <PolicyEditModalNodeConfigurationPolicy
          {...(restProps as ComponentProps<typeof PolicyEditModalNodeConfigurationPolicy>)}
        />
      );
    case 'systemOperationPolicy':
      return (
        <PolicyEditModalSystemOperationPolicy
          {...(restProps as ComponentProps<typeof PolicyEditModalSystemOperationPolicy>)}
        />
      );
  }
};
