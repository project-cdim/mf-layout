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

import { renderHook, act } from '@testing-library/react';
import { usePolicyModal } from '@/utils/hooks/usePolicyModal';
import axios from 'axios';
// import { APIPolicies } from '@/types';
import { dummyPolicy } from '@/utils/dummy-data/policy/Policy';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
// const deleteApiMock = jest.spyOn(axios, 'delete');

describe('usePolicyModal', () => {
  // Setup
  const mockMutate = jest.fn();
  const mockSetSuccessInfo = jest.fn();

  const setup = () =>
    renderHook(() =>
      usePolicyModal({
        data: dummyPolicy,
        setSuccessInfo: mockSetSuccessInfo,
        mutate: mockMutate,
      })
    );

  test('initialize with default values', () => {
    // Arrange
    const { result } = setup();
    const [state] = result.current;
    // Act
    // Assert
    expect(state.modalOpened).toBe(false);
    expect(state.modalMode).toBeUndefined();
    expect(state.category).toBeUndefined();
    expect(state.selectedPolicyId).toBe('');
    expect(state.modalTitle).toBe('');
    expect(state.inputStatus).toBeUndefined();
    expect(state.modalError).toBeUndefined();
    expect(state.data).toEqual(dummyPolicy);
  });

  test('open and close the modal', () => {
    // Arrange
    const { result } = setup();
    const [, actions] = result.current;
    // Act 1
    act(() => {
      actions.setModalOpen();
    });
    // Assert 1
    expect(result.current[0].modalOpened).toBe(true);
    // Act 2
    act(() => {
      actions.setModalClose();
    });
    // Assert 2
    expect(result.current[0].modalOpened).toBe(false);
  });

  test('change status (modalMode, modalTitle, modalError)', async () => {
    // Arrange
    const { result } = setup();
    const [, actions] = result.current;
    // Act 1
    await act(() => {
      actions.changeModalMode('delete');
    });
    // Assert 1
    expect(result.current[0].modalMode).toBe('delete');
    expect(result.current[0].modalTitle).toBe('Delete');
    expect(result.current[0].modalError).toBe(undefined);
    // Act 2
    act(() => {
      actions.changeModalMode('enable');
    });
    // Assert 2
    expect(result.current[0].modalMode).toBe('enable');
    expect(result.current[0].modalTitle).toBe('Enable');
    expect(result.current[0].modalError).toBe(undefined);
    // Act 3
    act(() => {
      actions.changeModalMode('disable');
    });
    // Assert 3
    expect(result.current[0].modalMode).toBe('disable');
    expect(result.current[0].modalTitle).toBe('Disable');
    expect(result.current[0].modalError).toBe(undefined);
    // Act 4
    act(() => {
      actions.changeModalMode('edit');
    });
    // Assert 4
    expect(result.current[0].modalMode).toBe('edit');
    expect(result.current[0].modalTitle).toBe('Edit');
    expect(result.current[0].modalError).toBe(undefined);
    // Act 5
    act(() => {
      actions.changeModalMode('add');
    });
    // Assert 5
    expect(result.current[0].modalMode).toBe('add');
    expect(result.current[0].modalTitle).toBe('Add');
    expect(result.current[0].modalError).toBe(undefined);
    // Act 6
    act(() => {
      actions.changeModalMode(undefined);
    });
    // Assert 6
    expect(result.current[0].modalMode).toBe(undefined);
    expect(result.current[0].modalTitle).toBe('');
    expect(result.current[0].modalError).toBe(undefined);
  });

  test('set status (category)', () => {
    // Arrange
    const { result } = setup();
    const [, actions] = result.current;
    // Act 1
    act(() => {
      actions.setCategory('nodeConfigurationPolicy');
    });
    // Assert 1
    expect(result.current[0].category).toBe('nodeConfigurationPolicy');
    // Act 2
    act(() => {
      actions.setCategory('systemOperationPolicy');
    });
    // Assert 2
    expect(result.current[0].category).toBe('systemOperationPolicy');
    // Act 3
    act(() => {
      actions.setCategory(undefined);
    });
    // Assert 3
    expect(result.current[0].category).toBeUndefined();
  });
  test('set status (selectedPolicyId)', () => {
    // Arrange
    const { result } = setup();
    const [, actions] = result.current;
    // Act
    act(() => {
      actions.setSelectedPolicyId('IDxxxxxxxxxxxx');
    });
    // Assert
    expect(result.current[0].selectedPolicyId).toBe('IDxxxxxxxxxxxx');
  });

  test('handle submitDelete successfully', async () => {
    // Arrange
    mockedAxios.delete.mockResolvedValueOnce({});
    const { result } = setup();
    const [, actions] = result.current;
    // Act
    act(() => {
      actions.changeModalMode('delete');
    });
    await act(async () => {
      await result.current[0].submitFunc!(dummyPolicy.policies[0].policyID);
    });
    // Assert
    expect(mockSetSuccessInfo).toHaveBeenCalledWith({
      id: dummyPolicy.policies[0].policyID,
      title: dummyPolicy.policies[0].title,
      operation: 'Delete',
    });
    expect(mockMutate).toHaveBeenCalled();
    expect(result.current[0].modalOpened).toBe(false);
  });

  test('handle submitDelete error', async () => {
    // Arrange
    const error = new Error('Delete failed');
    mockedAxios.delete.mockRejectedValueOnce(error);
    const { result } = setup();
    const [, actions] = result.current;
    // Act
    act(() => {
      actions.changeModalMode('delete');
    });
    await act(async () => {
      await result.current[0].submitFunc!('WrongIDXXXXXXXX');
    });
    // Assert
    expect(result.current[0].modalError).toBe(error);
  });

  test('handle submitEnable successfully', async () => {
    // Arrange
    mockedAxios.put.mockResolvedValueOnce({});
    const { result } = setup();
    const [, actions] = result.current;
    // Act
    act(() => {
      actions.changeModalMode('enable');
    });
    await act(async () => {
      await result.current[0].submitFunc!(dummyPolicy.policies[0].policyID, true);
    });
    // Assert
    expect(mockSetSuccessInfo).toHaveBeenCalledWith({
      id: dummyPolicy.policies[0].policyID,
      title: dummyPolicy.policies[0].title,
      operation: 'Enable',
    });
    expect(mockMutate).toHaveBeenCalled();
    expect(result.current[0].modalOpened).toBe(false);
  });

  test('handle submitEnable error', async () => {
    // Arrange
    const error = new Error('Enable failed');
    mockedAxios.put.mockRejectedValueOnce(error);
    const { result } = setup();
    const [, actions] = result.current;
    // Act
    act(() => {
      actions.changeModalMode('enable');
    });
    await act(async () => {
      await result.current[0].submitFunc!('WrongIDXXXXXXXX', true);
    });
    // Assert
    expect(result.current[0].modalError).toBe(error);
  });

  test('handle submitDisable successfully', async () => {
    // Arrange
    mockedAxios.put.mockResolvedValueOnce({});
    const { result } = setup();
    const [, actions] = result.current;
    // Act
    act(() => {
      actions.changeModalMode('disable');
    });
    await act(async () => {
      await result.current[0].submitFunc!(dummyPolicy.policies[0].policyID, false);
    });
    // Assert
    expect(mockSetSuccessInfo).toHaveBeenCalledWith({
      id: dummyPolicy.policies[0].policyID,
      title: dummyPolicy.policies[0].title,
      operation: 'Disable',
    });
    expect(mockMutate).toHaveBeenCalled();
    expect(result.current[0].modalOpened).toBe(false);
  });

  test('should handle submitDisable error', async () => {
    // Arrange
    const error = new Error('Disable failed');
    mockedAxios.put.mockRejectedValueOnce(error);
    const { result } = setup();
    const [, actions] = result.current;
    // Act
    act(() => {
      actions.changeModalMode('disable');
    });
    await act(async () => {
      await result.current[0].submitFunc!('WrongIDXXXXXXXX', false);
    });
    // Assert
    expect(result.current[0].modalError).toBe(error);
  });

  test('handle submitAdd successfully (nodeConfigurationPolicy)', async () => {
    // Arrange
    mockedAxios.post.mockResolvedValueOnce({ data: { policyID: '3' } });
    // ANCHOR
    const newPolicy = {
      category: 'nodeConfigurationPolicy',
      title: 'New Policy',
      policies: {},
    };
    const { result } = setup();
    const [, actions] = result.current;
    // Act
    act(() => {
      actions.changeModalMode('add');
    });
    await act(async () => {
      await result.current[0].submitFunc!(newPolicy);
    });
    // Assert
    expect(mockSetSuccessInfo).toHaveBeenCalledWith({
      id: '3',
      title: 'New Policy',
      operation: 'Add',
    });
    expect(mockMutate).toHaveBeenCalled();
    expect(result.current[0].modalOpened).toBe(false);
  });
  test('handle submitAdd successfully (systemOperationPolicy)', async () => {
    // Arrange
    mockedAxios.post.mockResolvedValueOnce({ data: { policyID: '3' } });
    // ANCHOR
    const newPolicy = {
      category: 'systemOperationPolicy',
      title: 'New Policy',
      policies: {
        accelerator: {
          enabled: true,
          value: 100,
          unit: 'percent',
          comparison: 'le',
        },
      },
    };
    const { result } = setup();
    const [, actions] = result.current;
    // Act
    act(() => {
      actions.changeModalMode('add');
    });
    await act(async () => {
      await result.current[0].submitFunc!(newPolicy);
    });
    // Assert
    expect(mockSetSuccessInfo).toHaveBeenCalledWith({
      id: '3',
      title: 'New Policy',
      operation: 'Add',
    });
    expect(mockMutate).toHaveBeenCalled();
    expect(result.current[0].modalOpened).toBe(false);
  });

  test('handle submitAdd error', async () => {
    // Arrange
    const error = new Error('Add failed');
    mockedAxios.post.mockRejectedValueOnce(error);
    const newPolicy = {
      category: 'nodeConfigurationPolicy',
      title: 'New Policy',
      policies: {},
    };
    const { result } = setup();
    const [, actions] = result.current;
    // Act
    act(() => {
      actions.changeModalMode('add');
    });
    await act(async () => {
      await result.current[0].submitFunc!(newPolicy);
    });
    // Assert
    expect(result.current[0].modalError).toBe(error);
  });

  test('handle submitEdit successfully', async () => {
    // Arrange
    mockedAxios.put.mockResolvedValueOnce({});
    const updatedPolicy = {
      category: 'nodeConfigurationPolicy',
      title: 'Updated Policy',
      policies: {
        deviceType1: { enabled: true, minNum: 1, maxNum: 5 },
      },
    };
    const { result } = setup();
    const [, actions] = result.current;
    // Act
    act(() => {
      actions.changeModalMode('edit');
    });
    await act(async () => {
      await result.current[0].submitFunc!(dummyPolicy.policies[0].policyID, updatedPolicy);
    });
    // Assert
    expect(mockSetSuccessInfo).toHaveBeenCalledWith({
      id: dummyPolicy.policies[0].policyID,
      title: 'Updated Policy',
      operation: 'Update',
    });
    expect(mockMutate).toHaveBeenCalled();
    expect(result.current[0].modalOpened).toBe(false);
  });

  test('should handle submitEdit error', async () => {
    // Arrange
    const error = new Error('Edit failed');
    mockedAxios.put.mockRejectedValueOnce(error);
    const updatedPolicy = {
      category: 'nodeConfigurationPolicy',
      title: 'Updated Policy',
      policies: {
        deviceType1: { enabled: true, minNum: 1, maxNum: 5 },
      },
    };
    const { result } = setup();
    const [, actions] = result.current;
    // Act
    act(() => {
      actions.changeModalMode('edit');
    });
    await act(async () => {
      await result.current[0].submitFunc!(dummyPolicy.policies[0].policyID, updatedPolicy);
    });
    // Assert
    expect(result.current[0].modalError).toBe(error);
    expect(result.current[0].inputStatus).toEqual(updatedPolicy);
  });
});
