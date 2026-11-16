/*
 * Copyright 2025-2026 NEC Corporation.
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

import { HttpResponse, http } from 'msw';

// import { APIPostPolicy, APIPutPolicy } from '@/types';
import { dummyAPILayoutDesignList } from '@/utils/dummy-data/layoutList/dummyAPILayoutDesignList';
import { dummyPolicy } from '@/utils/dummy-data/policy/Policy';

import { dummyAPIApplyIDGetResponse as dummyAPIApplyIDGetResponse01 } from '../dummy-data/layoutApplyDetail/dummyAPIApplyIDGetResponse01';
import { dummyAPIApplyIDGetResponse as dummyAPIApplyIDGetResponse04 } from '../dummy-data/layoutApplyDetail/dummyAPIApplyIDGetResponse04';
import { dummyAPIApplyIDGetResponse as dummyAPIApplyIDGetResponse05 } from '../dummy-data/layoutApplyDetail/dummyAPIApplyIDGetResponse05';
import { dummyAPIApplyIDGetResponse as dummyAPIApplyIDGetResponse06 } from '../dummy-data/layoutApplyDetail/dummyAPIApplyIDGetResponse06';
import { dummyAPIApplyIDGetResponse as dummyAPIApplyIDGetResponse07 } from '../dummy-data/layoutApplyDetail/dummyAPIApplyIDGetResponse07';
// import { dummyAPILayoutApplyList } from '../dummy-data/layoutApplyList/dummyAPILayoutApplyList';
import {
  dummyAPILayoutApplyListBefore,
  dummyAPILayoutApplyListAfter,
} from '../dummy-data/layoutApplyList/dummyAPILayoutApplyListBA';
import { dummyAPILayoutDesign } from '../dummy-data/layoutDesignDetail/dummyAPILayoutDesignDetail';
// import { dummyAPILayoutDesign as dummyAPILayoutDesign2 } from '../dummy-data/layoutDesignDetail/dummyAPILayoutDesignDetail2';
import {
  dummyAPIresourcesForLayout,
  dummyAPIresourcesSummaryForLayout,
} from '@/utils/dummy-data/resources/dummyAPIresourcesForLayout';

const layoutDesignUrl = process.env.NEXT_PUBLIC_URL_BE_LAYOUT_DESIGN;
const policyManagerUrl = process.env.NEXT_PUBLIC_URL_BE_POLICY_MANAGER;
const layoutApplyUrl = process.env.NEXT_PUBLIC_URL_BE_LAYOUT_APPLY;
const configManagerUrl = process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER;

const editPolicy = dummyPolicy;
let count = 0;

/**
 * MSW Handlers for API Mocking
 *
 * Pages and their corresponding API endpoints:
 *
 * 1. Layout Design List (/layout-design-list)
 *    - GET /layout-designs?limit=1000
 *
 * 2. Layout Design Detail (/layout-design-detail/:id)
 *    - GET /layout-designs/:designID
 *    - GET /resources?detail=true
 *
 * 3. Layout Apply List (/layout-apply-list)
 *    - GET /layout-apply?limit=1000
 *
 * 4. Layout Apply Detail (/layout-apply-detail/:id)
 *    - GET /layout-apply/:layoutApplyID
 *    - GET /resources?detail=false
 *    - PUT /layout-apply/:applyID?action={cancel|rollback}
 *
 * 5. Policy (/policy)
 *    - GET /policies?sortBy=createdAt&orderBy=desc
 *    - DELETE /policies/:policyID
 *    - PUT /policies/change-enabled
 *    - POST /policies
 *    - PUT /policies/:policyID
 */

// ===== Layout Designs Handlers =====
// Endpoints: GET /layout-designs, GET /layout-designs/:designID
const layoutDesignsHandlers = [
  http.get(`${layoutDesignUrl}/layout-designs?limit=1000`, () => {
    return HttpResponse.json(dummyAPILayoutDesignList);
  }),

  http.get(`${layoutDesignUrl}/layout-designs/:designID`, () => {
    return HttpResponse.json(dummyAPILayoutDesign);
    // return HttpResponse.json(dummyAPILayoutDesign2);
  }),
];

// ===== Policies Handlers =====
// Endpoints: GET /policies, DELETE /policies/:id, PUT /policies/change-enabled, POST /policies, PUT /policies/:id
const policiesHandlers = [
  // GET /policies with optional query parameters (sortBy, orderBy)
  http.get(`${policyManagerUrl}/policies`, ({ request }) => {
    const url = new URL(request.url);
    const sortBy = url.searchParams.get('sortBy');
    const orderBy = url.searchParams.get('orderBy');

    // You can implement sorting logic here if needed
    console.log(`Policies GET: sortBy=${sortBy}, orderBy=${orderBy}`);

    return HttpResponse.json(editPolicy);
  }),

  // DELETE /policies/{id}
  http.delete(`${policyManagerUrl}/policies/:policyID`, async (/* { params } */) => {
    // const { policyID } = params;
    // Remove the policy that matches the policyID from editPolicy
    // editPolicy = {
    //   count: editPolicy.policies.length - 1,
    //   policies: editPolicy.policies.filter((policy) => policy.policyID !== policyID),
    // };
    return new HttpResponse('No Content', { status: 204 });

    // Error example
    // const be_error = {
    //   code: 'E10005',
    //   message: `Specified ${policyID} is not found`,
    // };
    // return HttpResponse.json(be_error, { status: 404 });
  }),

  // PUT /policies/change-enabled
  http.put(`${policyManagerUrl}/policies/change-enabled`, async (/* { request } */) => {
    // Change the enabled status of the policy that matches enableIDList or disableIDList
    // const data = await request.json();
    // editPolicy = {
    //   ...editPolicy,
    //   policies: editPolicy.policies.map((policy) => {
    //     if (policy.policyID === data?.enableIDList?.[0]) {
    //       return { ...policy, enabled: true };
    //     } else if (policy.policyID === data?.disableIDList?.[0]) {
    //       return { ...policy, enabled: false };
    //     } else {
    //       return policy;
    //     }
    //   }),
    // };
    return new HttpResponse('Created', { status: 201 });

    // Error example
    // const be_error = {
    //   code: 'E10002',
    //   message: 'Failed to load policydb_config.yaml',
    // };
    // return HttpResponse.json(be_error, { status: 500 });
  }),

  // POST /policies
  http.post(`${policyManagerUrl}/policies`, async (/* { request } */) => {
    // Add a new policy
    // Generate a random ID with 10 characters
    const newID = [...Array(10)].map(() => Math.random().toString(36)[2]).join('');
    // const data = (await request.json()) as APIPostPolicy;
    // editPolicy = {
    //   count: editPolicy.policies.length + 1,
    //   policies: [
    //     ...editPolicy.policies,
    //     {
    //       ...data,
    //       policyID: newID,
    //       createdAt: new Date().toISOString(),
    //       updatedAt: new Date().toISOString(),
    //     },
    //   ],
    // };
    return HttpResponse.json({ policyID: newID }, { status: 201 });

    // Error example
    // const be_error = {
    //   "code": "E10002",
    //   "message": "Failed to load policydb_config.yaml"
    // }
    // return HttpResponse.json(be_error, { status: 500 });
  }),

  // PUT /policies/{id}
  http.put(`${policyManagerUrl}/policies/:policyID`, async (/* { request, params } */) => {
    // const { policyID } = params;
    // Update the policy that matches the policyID
    // const data = (await request.json()) as APIPutPolicy;
    // editPolicy = {
    //   ...editPolicy,
    //   policies: editPolicy.policies.map((policy) => {
    //     if (policy.policyID === policyID) {
    //       return { ...policy, ...data, updatedAt: new Date().toISOString() };
    //     } else {
    //       return policy;
    //     }
    //   }),
    // };
    return new HttpResponse('No Content', { status: 204 });

    // Error example
    // const be_error = {
    //   code: 'E10005',
    //   message: `Specified ${policyID} is not found`,
    // };
    // return HttpResponse.json(be_error, { status: 404 });
  }),
];

// ===== Layout Apply Handlers =====
// Endpoints: GET /layout-apply, GET /layout-apply/:layoutApplyID, PUT /layout-apply/:applyID
const layoutApplyHandlers = [
  http.get(`${layoutApplyUrl}/layout-apply?limit=1000`, () => {
    // return HttpResponse.json(dummyAPILayoutApplyList);
    count++;
    if (count % 2 === 0) {
      return HttpResponse.json(dummyAPILayoutApplyListBefore);
    } else {
      return HttpResponse.json(dummyAPILayoutApplyListAfter);
    }
  }),

  http.get(`${layoutApplyUrl}/layout-apply/:layoutApplyID`, () => {
    let responseData = dummyAPIApplyIDGetResponse01; // Apply : CANCLED, Rollback: FAILED
    responseData = dummyAPIApplyIDGetResponse04; // Apply : CANCELING, Rollback: IN_PROGRESS
    responseData = dummyAPIApplyIDGetResponse05; // Apply : CANCELED, Rollback: FAILD (applyResult[0].status:FAILED and rollbackResult[0].status:FAILED)
    responseData = dummyAPIApplyIDGetResponse06; // Apply : COMPLETED, operations: 15
    responseData = dummyAPIApplyIDGetResponse07; // Apply : CANCELED, Rollback: COMPLETED, operations: 15
    return HttpResponse.json(responseData);
  }),

  // PUT /layout-apply/:applyID
  http.put(`${layoutApplyUrl}/layout-apply/:applyID`, async ({ request, params }) => {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const { applyID } = params;

    // Handle different actions: cancel, rollback, etc.
    // Example: action can be 'cancel', 'rollback'
    console.log(`Layout Apply PUT: applyID=${applyID}, action=${action}`);

    return new HttpResponse('No Content', { status: 204 });

    // Error example
    // const be_error = {
    //   code: 'E20001',
    //   message: `Failed to ${action} layout apply ${applyID}`,
    // };
    // return HttpResponse.json(be_error, { status: 400 });
  }),
];

// ===== Resources Handlers =====
// Endpoints: GET /resources?detail=true, GET /resources?detail=false
const resourcesHandlers = [
  http.get(`${configManagerUrl}/resources`, ({ request }) => {
    const url = new URL(request.url);
    const detail = url.searchParams.get('detail');

    if (detail === 'true') {
      return HttpResponse.json(dummyAPIresourcesForLayout);
    } else if (detail === 'false') {
      return HttpResponse.json(dummyAPIresourcesSummaryForLayout);
    }

    // Default to full resources if detail param is not specified
    return HttpResponse.json(dummyAPIresourcesForLayout);
  }),
];

// Default export for backward compatibility
export const handlers = [...layoutDesignsHandlers, ...policiesHandlers, ...layoutApplyHandlers, ...resourcesHandlers];

/**
 * Create handlers based on configuration
 * @returns Array of enabled MSW request handlers
 */
export const createHandlers = () => {
  // Import config dynamically to avoid issues during module initialization
  const { getMSWMockConfig } = require('./config');
  const config = getMSWMockConfig();
  const handlers = [];

  if (config.layoutDesigns) handlers.push(...layoutDesignsHandlers);
  if (config.policies) handlers.push(...policiesHandlers);
  if (config.layoutApply) handlers.push(...layoutApplyHandlers);
  if (config.resources) handlers.push(...resourcesHandlers);

  return handlers;
};
