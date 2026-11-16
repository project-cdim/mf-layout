/*
 * Copyright 2026 NEC Corporation.
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

import { getMSWMockConfig, isMSWEnabled } from '@/utils/mocks/config';

describe('getMSWMockConfig', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('returns all false when no env vars set', () => {
    delete process.env.NEXT_PUBLIC_MSW_MOCK_LAYOUT_MANAGER;
    delete process.env.NEXT_PUBLIC_MSW_MOCK_POLICY_MANAGER;
    delete process.env.NEXT_PUBLIC_MSW_MOCK_LAYOUT_DESIGN;
    delete process.env.NEXT_PUBLIC_MSW_MOCK_RESOURCES;

    const cfg = getMSWMockConfig();
    expect(cfg.layoutApply).toBe(false);
    expect(cfg.policies).toBe(false);
    expect(cfg.layoutDesigns).toBe(false);
    expect(cfg.resources).toBe(false);
  });

  test('parses true strings to booleans per-key', () => {
    process.env.NEXT_PUBLIC_MSW_MOCK_LAYOUT_MANAGER = 'true';
    process.env.NEXT_PUBLIC_MSW_MOCK_POLICY_MANAGER = 'false';
    process.env.NEXT_PUBLIC_MSW_MOCK_LAYOUT_DESIGN = 'true';
    process.env.NEXT_PUBLIC_MSW_MOCK_RESOURCES = 'true';

    const cfg = getMSWMockConfig();
    expect(cfg.layoutApply).toBe(true);
    expect(cfg.policies).toBe(false);
    expect(cfg.layoutDesigns).toBe(true);
    expect(cfg.resources).toBe(true);
  });

  test('returns all true when all env vars are set to true', () => {
    process.env.NEXT_PUBLIC_MSW_MOCK_LAYOUT_MANAGER = 'true';
    process.env.NEXT_PUBLIC_MSW_MOCK_POLICY_MANAGER = 'true';
    process.env.NEXT_PUBLIC_MSW_MOCK_LAYOUT_DESIGN = 'true';
    process.env.NEXT_PUBLIC_MSW_MOCK_RESOURCES = 'true';

    const cfg = getMSWMockConfig();
    expect(cfg.layoutApply).toBe(true);
    expect(cfg.policies).toBe(true);
    expect(cfg.layoutDesigns).toBe(true);
    expect(cfg.resources).toBe(true);
  });

  test('returns false for non-"true" string values', () => {
    process.env.NEXT_PUBLIC_MSW_MOCK_LAYOUT_MANAGER = 'false';
    process.env.NEXT_PUBLIC_MSW_MOCK_POLICY_MANAGER = 'TRUE';
    process.env.NEXT_PUBLIC_MSW_MOCK_LAYOUT_DESIGN = '1';
    process.env.NEXT_PUBLIC_MSW_MOCK_RESOURCES = 'yes';

    const cfg = getMSWMockConfig();
    expect(cfg.layoutApply).toBe(false);
    expect(cfg.policies).toBe(false);
    expect(cfg.layoutDesigns).toBe(false);
    expect(cfg.resources).toBe(false);
  });
});

describe('isMSWEnabled', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('returns true when NODE_ENV is development', () => {
    process.env = { ...OLD_ENV, NODE_ENV: 'development' };
    delete process.env.NEXT_PUBLIC_USE_MSW;
    expect(isMSWEnabled()).toBe(true);
  });

  test('returns true when NEXT_PUBLIC_USE_MSW is "true"', () => {
    process.env = { ...OLD_ENV, NODE_ENV: 'production', NEXT_PUBLIC_USE_MSW: 'true' };
    expect(isMSWEnabled()).toBe(true);
  });

  test('returns false when NODE_ENV is production and NEXT_PUBLIC_USE_MSW is not set', () => {
    process.env = { ...OLD_ENV, NODE_ENV: 'production' };
    delete process.env.NEXT_PUBLIC_USE_MSW;
    expect(isMSWEnabled()).toBe(false);
  });

  test('returns false when NODE_ENV is production and NEXT_PUBLIC_USE_MSW is false', () => {
    process.env = { ...OLD_ENV, NODE_ENV: 'production', NEXT_PUBLIC_USE_MSW: 'false' };
    expect(isMSWEnabled()).toBe(false);
  });

  test('returns true when NODE_ENV is test and NEXT_PUBLIC_USE_MSW is true', () => {
    process.env = { ...OLD_ENV, NODE_ENV: 'test', NEXT_PUBLIC_USE_MSW: 'true' };
    expect(isMSWEnabled()).toBe(true);
  });
});
