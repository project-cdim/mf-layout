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

import { render } from '@/shared-modules/__test__/test-utils';
import { screen } from '@testing-library/react';
import { InfoCard } from '@/components/InfoCard';

jest.mock('@/shared-modules/components', () => ({
  CardLoading: jest.fn(({ children, loading }) => (
    <div data-testid='card-loading' data-loading={loading}>
      {children}
    </div>
  )),
  IconWithInfo: jest.fn(({ type, label }) => (
    <div data-testid='icon-with-info' data-type={type} data-label={label}>
      Icon
    </div>
  )),
}));

import { CardLoading, IconWithInfo } from '@/shared-modules/components';

describe('InfoCard', () => {
  const defaultProps = {
    title: 'Test Title',
    infoLabel: 'Test Info Label',
    value: 'Test Value',
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component with provided props', () => {
    render(<InfoCard {...defaultProps} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Value')).toBeInTheDocument();

    // Check CardLoading props using mock.calls
    expect(CardLoading).toHaveBeenCalledTimes(1);
    expect((CardLoading as jest.Mock).mock.calls[0][0].loading).toBe(false);
    expect((CardLoading as jest.Mock).mock.calls[0][0].withBorder).toBe(true);
    expect((CardLoading as jest.Mock).mock.calls[0][0].maw).toBe(400);

    // Check IconWithInfo props using mock.calls
    expect(IconWithInfo).toHaveBeenCalledTimes(1);
    expect((IconWithInfo as jest.Mock).mock.calls[0][0].type).toBe('info');
    expect((IconWithInfo as jest.Mock).mock.calls[0][0].label).toBe('Test Info Label');
  });

  test('passes loading state to CardLoading component', () => {
    render(<InfoCard {...defaultProps} loading={true} />);

    expect(CardLoading).toHaveBeenCalledTimes(1);
    expect((CardLoading as jest.Mock).mock.calls[0][0].loading).toBe(true);
  });

  test('renders numeric values correctly', () => {
    render(<InfoCard {...defaultProps} value={42} />);

    expect(screen.getByText('42')).toBeInTheDocument();
  });

  test('renders with undefined value', () => {
    render(<InfoCard {...defaultProps} value={undefined} />);

    // When value is undefined, there should be no text for it
    expect(screen.queryByText('undefined')).not.toBeInTheDocument();
  });

  test('passes correct props to IconWithInfo', () => {
    render(<InfoCard {...defaultProps} />);

    expect(IconWithInfo).toHaveBeenCalledTimes(1);
    const iconProps = (IconWithInfo as jest.Mock).mock.calls[0][0];
    expect(iconProps.type).toBe('info');
    expect(iconProps.label).toBe('Test Info Label');
  });
});
