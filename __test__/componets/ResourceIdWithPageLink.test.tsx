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

import { screen } from '@testing-library/react';

import { render } from '@/shared-modules/__test__/test-utils';
import { PageLink } from '@/shared-modules/components';

import { ResourceIdWithPageLink } from '@/components';

// Mock the PageLink component which is used inside ResourceIdWithPageLink
jest.mock('@/shared-modules/components', () => ({
  PageLink: jest.fn(({ title, path, query, children }) => (
    <div data-testid='mock-page-link' data-title={title} data-path={path} data-query={JSON.stringify(query)}>
      {children}
    </div>
  )),
}));

describe('ResourceIdWithPageLink', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('renders with a simple string ID', () => {
    render(<ResourceIdWithPageLink id='simple-id' />);

    expect((PageLink as jest.Mock).mock.calls.length).toBe(1);
    expect((PageLink as jest.Mock).mock.calls[0][0]).toEqual({
      children: 'simple-id',
      title: 'Resource Details',
      path: '/cdim/res-resource-detail',
      query: { id: 'simple-id' },
    });
    expect((PageLink as jest.Mock).mock.calls[0][1]).toBeUndefined();
    expect(screen.getByText('simple-id')).toBeInTheDocument();
  });

  test('renders with a DeviceType(id) format and extracts the inner ID', () => {
    render(<ResourceIdWithPageLink id='DeviceType(inner-id)' />);

    expect((PageLink as jest.Mock).mock.calls.length).toBe(1);
    expect((PageLink as jest.Mock).mock.calls[0][0]).toEqual({
      children: 'DeviceType(inner-id)',
      title: 'Resource Details',
      path: '/cdim/res-resource-detail',
      query: { id: 'inner-id' },
    });
    expect(screen.getByText('DeviceType(inner-id)')).toBeInTheDocument();
  });

  test('renders with other parentheses format and extracts the inner ID', () => {
    render(<ResourceIdWithPageLink id='SomeType(123)' />);

    expect((PageLink as jest.Mock).mock.calls.length).toBe(1);
    expect((PageLink as jest.Mock).mock.calls[0][0]).toEqual({
      children: 'SomeType(123)',
      title: 'Resource Details',
      path: '/cdim/res-resource-detail',
      query: { id: '123' },
    });
    expect(screen.getByText('SomeType(123)')).toBeInTheDocument();
  });

  test('renders nothing when id is undefined', () => {
    render(<ResourceIdWithPageLink id={undefined} />);
    expect((PageLink as jest.Mock).mock.calls.length).toBe(0);
  });

  test('renders nothing when id is null', () => {
    // @ts-expect-error Testing invalid prop type
    render(<ResourceIdWithPageLink id={null} />);
    expect((PageLink as jest.Mock).mock.calls.length).toBe(0);
  });

  test('renders nothing when id is an empty string', () => {
    render(<ResourceIdWithPageLink id='' />);
    expect((PageLink as jest.Mock).mock.calls.length).toBe(0);
  });

  test('passes the correct title to PageLink', () => {
    render(<ResourceIdWithPageLink id='test-id' />);

    expect((PageLink as jest.Mock).mock.calls.length).toBe(1);
    expect((PageLink as jest.Mock).mock.calls[0][0]).toEqual({
      children: 'test-id',
      title: 'Resource Details',
      path: '/cdim/res-resource-detail',
      query: { id: 'test-id' },
    });
  });
});
