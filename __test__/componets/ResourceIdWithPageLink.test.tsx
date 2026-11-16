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

import { screen } from '@testing-library/react';

import { render } from '@/shared-modules/__test__/test-utils';
import { PageLink, LongSentences } from '@/shared-modules/components';

import { ResourceIdWithPageLink } from '@/components';

// Mock the PageLink and LongSentenses component which is used inside ResourceIdWithPageLink
jest.mock('@/shared-modules/components', () => ({
  PageLink: jest.fn(({ title, path, query, children }) => (
    <div data-testid='mock-page-link' data-title={title} data-path={path} data-query={JSON.stringify(query)}>
      {children}
    </div>
  )),
  LongSentences: jest.fn(({ text }) => <>{text}</>),
}));

describe('ResourceIdWithPageLink', () => {
  // SetUp
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('renders with a simple string ID', () => {
    // Arrange
    render(<ResourceIdWithPageLink id='simple-id' />);
    const pageLinkProps = (PageLink as jest.Mock).mock.calls[0][0];
    // Act
    // Assert
    expect((PageLink as jest.Mock).mock.calls.length).toBe(1);
    expect(pageLinkProps.title).toBe('Resource Details');
    expect(pageLinkProps.path).toBe('/cdim/res-resource-detail');
    expect(pageLinkProps.query).toEqual({ id: 'simple-id' });
    expect((LongSentences as jest.Mock).mock.calls.length).toBe(1);
    expect((LongSentences as jest.Mock).mock.calls[0][0]).toEqual({ text: 'simple-id' });
    expect(screen.getByText('simple-id')).toBeInTheDocument();
  });

  test('renders with a DeviceType(id) format and extracts the inner ID', () => {
    // Arrange
    render(<ResourceIdWithPageLink id='DeviceType(inner-id)' />);
    const pageLinkProps = (PageLink as jest.Mock).mock.calls[0][0];
    // Act
    // Assert
    expect((PageLink as jest.Mock).mock.calls.length).toBe(1);
    expect(pageLinkProps.title).toBe('Resource Details');
    expect(pageLinkProps.path).toBe('/cdim/res-resource-detail');
    expect(pageLinkProps.query).toEqual({ id: 'inner-id' });
    expect((LongSentences as jest.Mock).mock.calls.length).toBe(1);
    expect((LongSentences as jest.Mock).mock.calls[0][0]).toEqual({ text: 'DeviceType(inner-id)' });
    expect(screen.getByText('DeviceType(inner-id)')).toBeInTheDocument();
  });

  test('renders with other parentheses format and extracts the inner ID', () => {
    // Arrange
    render(<ResourceIdWithPageLink id='SomeType(123)' />);
    const pageLinkProps = (PageLink as jest.Mock).mock.calls[0][0];
    // Act
    // Assert
    expect((PageLink as jest.Mock).mock.calls.length).toBe(1);
    expect(pageLinkProps.title).toBe('Resource Details');
    expect(pageLinkProps.path).toBe('/cdim/res-resource-detail');
    expect(pageLinkProps.query).toEqual({ id: '123' });
    expect((LongSentences as jest.Mock).mock.calls.length).toBe(1);
    expect((LongSentences as jest.Mock).mock.calls[0][0]).toEqual({ text: 'SomeType(123)' });
    expect(screen.getByText('SomeType(123)')).toBeInTheDocument();
  });

  test('renders nothing when id is undefined', () => {
    // Arrange
    render(<ResourceIdWithPageLink id={undefined} />);
    // Act
    // Assert
    expect((PageLink as jest.Mock).mock.calls.length).toBe(0);
  });

  test('renders nothing when id is null', () => {
    // Arrange
    // @ts-expect-error Testing invalid prop type
    render(<ResourceIdWithPageLink id={null} />);
    // Act
    // Assert
    expect((PageLink as jest.Mock).mock.calls.length).toBe(0);
  });

  test('renders nothing when id is an empty string', () => {
    // Arrange
    render(<ResourceIdWithPageLink id='' />);
    // Act
    // Assert
    expect((PageLink as jest.Mock).mock.calls.length).toBe(0);
  });

  test('passes the correct title to PageLink', () => {
    // Arrange
    render(<ResourceIdWithPageLink id='test-id' />);
    const pageLinkProps = (PageLink as jest.Mock).mock.calls[0][0];
    // Act
    // Assert
    expect((PageLink as jest.Mock).mock.calls.length).toBe(1);
    expect(pageLinkProps.title).toBe('Resource Details');
    expect(pageLinkProps.path).toBe('/cdim/res-resource-detail');
    expect(pageLinkProps.query).toEqual({ id: 'test-id' });
    expect((LongSentences as jest.Mock).mock.calls.length).toBe(1);
    expect((LongSentences as jest.Mock).mock.calls[0][0]).toEqual({ text: 'test-id' });
  });
});
