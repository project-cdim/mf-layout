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

import { PageLink } from '@/shared-modules/components';
import { useTranslations } from 'next-intl';

/**
 * Renders a link to the resource details page using the provided resource identifier.
 *
 * The component expects an identifier string that may be in the form "DeviceType(id)" or a simple "id".
 * When the identifier is in the "DeviceType(id)" format, it extracts the content within the parentheses to use as the ID for querying the details.
 * If no valid identifier is provided (i.e., it is undefined), the component renders nothing.
 *
 * @param id - A string representing the resource identifier, which might include additional context.
 *             It can be in the format "DeviceType(id)" where only the inner id part will be used, or a basic id string.
 * @returns A PageLink component pointing to the resource details page with the computed query parameter,
 *          or null if the provided identifier is undefined.
 */
export const ResourceIdWithPageLink = ({ id }: { id: string | undefined }) => {
  const t = useTranslations();

  if (!id) return null;
  // id format is 'DeviceType(id)' or 'id'. Extract the ID part.
  const match = id.match(/\((.*)\)/)?.[1] ?? id;

  return (
    <PageLink title={t('Resource Details')} path='/cdim/res-resource-detail' query={{ id: match }}>
      {id}
    </PageLink>
  );
};
