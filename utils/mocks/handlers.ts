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

const editPolicy = dummyPolicy;
let count = 0;

export const handlers = [
  // GET /layout-designs
  http.get(`${process.env.NEXT_PUBLIC_URL_BE_LAYOUT_DESIGN}/layout-designs?limit=1000`, () => {
    return HttpResponse.json(dummyAPILayoutDesignList);
  }),
  // GET /layout-designs/{designID}
  http.get(`${process.env.NEXT_PUBLIC_URL_BE_LAYOUT_DESIGN}/layout-designs/:designID`, () => {
    return HttpResponse.json(dummyAPILayoutDesign);
    // return HttpResponse.json(dummyAPILayoutDesign2);
  }),
  // GET /policies
  http.get(`${process.env.NEXT_PUBLIC_URL_BE_POLICY_MANAGER}/policies`, () => {
    return HttpResponse.json(editPolicy);
  }),
  // GET /layout-apply-list
  http.get(`${process.env.NEXT_PUBLIC_URL_BE_LAYOUT_APPLY}/layout-apply?limit=1000`, () => {
    // return HttpResponse.json(dummyAPILayoutApplyList);
    count++;
    if (count % 2 === 0) {
      return HttpResponse.json(dummyAPILayoutApplyListBefore);
    } else {
      return HttpResponse.json(dummyAPILayoutApplyListAfter);
    }
  }),
  // GET /layout-apply/{id}
  http.get(`${process.env.NEXT_PUBLIC_URL_BE_LAYOUT_APPLY}/layout-apply/:layoutApplyID`, () => {
    let responseData = dummyAPIApplyIDGetResponse01; // Apply : CANCLED, Rollback: FAILED
    responseData = dummyAPIApplyIDGetResponse04; // Apply : CANCELING, Rollback: IN_PROGRESS
    responseData = dummyAPIApplyIDGetResponse05; // Apply : CANCELED, Rollback: FAILD (applyResult[0].status:FAILED and rollbackResult[0].status:FAILED)
    responseData = dummyAPIApplyIDGetResponse06; // Apply : COMPLETED, operations: 15
    responseData = dummyAPIApplyIDGetResponse07; // Apply : CANCELED, Rollback: COMPLETED, operations: 15
    return HttpResponse.json(responseData);
  }),
  // Convert the following to the new API format:
  // // DELETE /policies/{id}
  // http.delete(`${process.env.NEXT_PUBLIC_URL_BE_POLICY_MANAGER}/policies/:policyID`, async ({ params }) => {
  //   const { policyID } = params;
  //   // Remove the policy that matches the policyID from editPolicy
  //   editPolicy = {
  //     count: editPolicy.policies.length - 1,
  //     policies: editPolicy.policies.filter((policy) => policy.policyID !== policyID),
  //   };
  //   // return res(ctx.status(204));
  //   return new HttpResponse('No Content', { status: 204 });

  //   // // Error
  //   // const be_error = {
  //   //   code: 'E10005',
  //   //   message: `Specified ${policyID} is not found`,
  //   // };
  //   // return res(ctx.status(404), ctx.json(be_error));
  // }),
  // // PUT /policies/change-enabled
  // http.put(`${process.env.NEXT_PUBLIC_URL_BE_POLICY_MANAGER}/policies/change-enabled`, async ({ request, params }) => {
  //   // Change the enabled status of the policy that matches enableIDList or disableIDList
  //   request.json().then((data) => {
  //     editPolicy = {
  //       ...editPolicy,
  //       policies: editPolicy.policies.map((policy) => {
  //         if (policy.policyID === data?.enableIDList?.[0]) {
  //           return { ...policy, enabled: true };
  //         } else if (policy.policyID === data?.disableIDList?.[0]) {
  //           return { ...policy, enabled: false };
  //         } else {
  //           return policy;
  //         }
  //       }),
  //     };
  //   });
  //   // return res(ctx.status(201));
  //   return new HttpResponse('Created', { status: 201 });

  //   // Error
  //   // const be_error = {
  //   //   code: 'E10002',
  //   //   message: 'Failed to load policydb_config.yaml',
  //   // };
  //   // return res(ctx.status(500), ctx.json(be_error));
  // }),
  // // POST /policies
  // http.post(`${process.env.NEXT_PUBLIC_URL_BE_POLICY_MANAGER}/policies`, async ({ request, params }) => {
  //   // Add a new policy
  //   // Generate a random ID with 10 characters
  //   const newID = [...Array(10)].map(() => Math.random().toString(36)[2]).join('');
  //   request.json().then((data: APIPostPolicy) => {
  //     // const newPolicy = ;
  //     editPolicy = {
  //       count: editPolicy.policies.length + 1,
  //       policies: [
  //         ...editPolicy.policies,
  //         {
  //           ...data,
  //           policyID: newID,
  //           createdAt: new Date().toISOString(),
  //           updatedAt: new Date().toISOString(),
  //         },
  //       ],
  //     };
  //   });
  //   // return res(ctx.status(201), ctx.json({ policyID: newID }));
  //   return HttpResponse.json({ policyID: newID }, { status: 201 });

  //   // Error
  //   // const be_error = {
  //   //   "code": "E10002",
  //   //   "message": "Failed to load policydb_config.yaml"
  //   // }
  //   // return res(ctx.status(500), ctx.json(be_error));
  // }),
  // // PUT /policies/{id}
  // http.put(`${process.env.NEXT_PUBLIC_URL_BE_POLICY_MANAGER}/policies/:policyID`, async ({ request, params }) => {
  //   const { policyID } = request;
  //   // Update the policy that matches the policyID
  //   request.json().then((data: APIPutPolicy) => {
  //     editPolicy = {
  //       ...editPolicy,
  //       policies: editPolicy.policies.map((policy) => {
  //         if (policy.policyID === policyID) {
  //           return { ...policy, ...data, updatedAt: new Date().toISOString() };
  //         } else {
  //           return policy;
  //         }
  //       }),
  //     };
  //   });
  //   console.log('rest.put', editPolicy);
  //   return new HttpResponse('No Content', { status: 204 });

  //   // Error
  //   // const be_error = {
  //   //   code: 'E10005',
  //   //   message: `Specified ${policyID} is not found`,
  //   // };
  //   // return res(ctx.status(404), ctx.json(be_error));
  // }),
];
