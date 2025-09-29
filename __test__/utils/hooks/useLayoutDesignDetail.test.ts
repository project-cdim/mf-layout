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

import { renderHook, waitFor } from '@testing-library/react';
import { useLayoutDesignDetail } from '@/utils/hooks/useLayoutDesignDetail';
import { dummyAPILayoutDesign } from '@/utils/dummy-data/layoutDesignDetail/dummyAPILayoutDesignDetail';
import { APIresources } from '@/shared-modules/types';
import { KIB } from '@/shared-modules/constant';

// Mock the dependencies
jest.mock('@/shared-modules/utils/hooks', () => ({
  useQuery: jest.fn().mockReturnValue({ id: '100000000000000000000001' }),
}));

jest.mock('swr/immutable', () => {
  const originalModule = jest.requireActual('swr/immutable');
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(),
  };
});

jest.mock('@/shared-modules/utils/', () => ({
  fetcher: jest.fn(),
}));

// Sample device data for testing
const mockDevices: APIresources = {
  resources: [
    {
      device: {
        deviceID: 'res10102',
        type: 'CPU',
        totalCores: 8,
        capacityMiB: 0,
      },
    },
    {
      device: {
        deviceID: 'res10203',
        type: 'memory',
        totalCores: 0,
        capacityMiB: 16384, // 16GB
      },
    },
    {
      device: {
        deviceID: 'res10302',
        type: 'storage',
        totalCores: 0,
        capacityMiB: 1048576, // 1TB
      },
    },
    {
      device: {
        deviceID: 'res10401',
        type: 'networkInterface',
        totalCores: 0,
        capacityMiB: 0,
      },
    },
  ],
};

describe('useLayoutDesignDetail', () => {
  // Store the original environment variables
  const originalEnv = process.env;

  beforeEach(() => {
    // Setup environment variables
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_URL_BE_LAYOUT_DESIGN: 'http://layout-design-api',
      NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER: 'http://config-manager-api',
    };

    // Mock SWR responses
    const useSWRImmutable = require('swr/immutable').default;
    useSWRImmutable.mockImplementation((url: string) => {
      if (url && url.includes('layout-designs')) {
        return {
          data: dummyAPILayoutDesign,
          error: undefined,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      if (url && url.includes('resources')) {
        return {
          data: mockDevices,
          error: undefined,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      return {
        data: undefined,
        error: undefined,
        isValidating: false,
        mutate: jest.fn(),
      };
    });
  });

  afterEach(() => {
    // Restore environment variables
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  // eslint-disable-next-line complexity
  test('should return layout design detail data with mapped device information', async () => {
    // Render the hook
    const { result } = renderHook(() => useLayoutDesignDetail());

    // Wait for the hook to resolve
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    // Check if data is correctly transformed
    expect(result.current.data?.designID).toBe(dummyAPILayoutDesign.designID);
    expect(result.current.data?.status).toBe(dummyAPILayoutDesign.status);
    expect(result.current.data?.startedAt).toEqual(new Date(dummyAPILayoutDesign.startedAt));
    expect(result.current.data?.endedAt).toEqual(new Date(dummyAPILayoutDesign.endedAt as string));
    expect(result.current.data?.nodes).toEqual(dummyAPILayoutDesign.design.nodes);

    // Verify procedures mapping
    expect(result.current.data?.procedures?.[0].operationID).toBe(dummyAPILayoutDesign.procedures[0].operationID);
    expect(result.current.data?.procedures?.[0].operation).toBe(dummyAPILayoutDesign.procedures[0].operation);
    expect(result.current.data?.procedures?.[0].targetDevice).toBe('CPU(res10102)');

    // Check conditions mapping
    expect(result.current.data?.conditions?.energyCriteria).toBe(dummyAPILayoutDesign.conditions?.energyCriteria);

    // Verify tolerance criteria
    const cpuCriteria = result.current.data?.conditions?.toleranceCriteria?.cpu;
    expect(cpuCriteria?.[0].devices[1].id).toBe('res10102');
    expect(cpuCriteria?.[0].devices[1].cores).toBe(8);

    const memoryCriteria = result.current.data?.conditions?.toleranceCriteria?.memory;
    expect(memoryCriteria?.[0].devices[1].id).toBe('res10203');
    expect(memoryCriteria?.[0].devices[1].capacity).toBe(16384 * KIB * KIB); // MiB to Bytes
  });

  test('should handle empty or undefined layout design data', async () => {
    // Mock SWR to return undefined data
    const useSWRImmutable = require('swr/immutable').default;
    useSWRImmutable.mockImplementation((url: string) => {
      if (url && url.includes('resources')) {
        return {
          data: mockDevices,
          error: undefined,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      return {
        data: undefined,
        error: undefined,
        isValidating: false,
        mutate: jest.fn(),
      };
    });

    // Render the hook
    const { result } = renderHook(() => useLayoutDesignDetail());

    // Wait for the hook to resolve
    await waitFor(() => {
      expect(result.current.data).toBeUndefined();
    });
  });

  test('should handle empty or undefined resource data', async () => {
    // Mock SWR to return undefined resource data
    const useSWRImmutable = require('swr/immutable').default;
    useSWRImmutable.mockImplementation((url: string) => {
      if (url && url.includes('layout-designs')) {
        return {
          data: dummyAPILayoutDesign,
          error: undefined,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      return {
        data: undefined,
        error: undefined,
        isValidating: false,
        mutate: jest.fn(),
      };
    });

    // Render the hook
    const { result } = renderHook(() => useLayoutDesignDetail());

    // Wait for the hook to resolve
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    // Check if target device uses only deviceID (no type info)
    expect(result.current.data?.procedures?.[0].targetDevice).toBe('res10102');
  });

  test('should handle errors in API responses', async () => {
    // Mock SWR to return errors
    const layoutError = new Error('Layout API error');
    const resourceError = new Error('Resource API error');

    const useSWRImmutable = require('swr/immutable').default;
    useSWRImmutable.mockImplementation((url: string) => {
      if (url && url.includes('layout-designs')) {
        return {
          data: undefined,
          error: layoutError,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      if (url && url.includes('resources')) {
        return {
          data: undefined,
          error: resourceError,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      return {
        data: undefined,
        error: undefined,
        isValidating: false,
        mutate: jest.fn(),
      };
    });

    // Render the hook
    const { result } = renderHook(() => useLayoutDesignDetail());

    // Wait for the hook to resolve
    await waitFor(() => {
      expect(result.current.error.layout).toBe(layoutError);
      expect(result.current.error.resource).toBe(resourceError);
    });
  });

  test('should handle isValidating state', async () => {
    // Mock SWR to return validating state
    const useSWRImmutable = require('swr/immutable').default;
    useSWRImmutable.mockImplementation((url: string) => {
      if (url && url.includes('layout-designs')) {
        return {
          data: undefined,
          error: undefined,
          isValidating: true,
          mutate: jest.fn(),
        };
      }
      if (url && url.includes('resources')) {
        return {
          data: undefined,
          error: undefined,
          isValidating: true,
          mutate: jest.fn(),
        };
      }
      return {
        data: undefined,
        error: undefined,
        isValidating: false,
        mutate: jest.fn(),
      };
    });

    // Render the hook
    const { result } = renderHook(() => useLayoutDesignDetail());

    // Wait for the hook to resolve
    await waitFor(() => {
      expect(result.current.isValidating.layout).toBe(true);
      expect(result.current.isValidating.resource).toBe(true);
    });
  });

  test('should call mutate functions for both resources', async () => {
    // Create mock mutate functions
    const layoutMutate = jest.fn();
    const resourceMutate = jest.fn();

    const useSWRImmutable = require('swr/immutable').default;
    useSWRImmutable.mockImplementation((url: string) => {
      if (url && url.includes('layout-designs')) {
        return {
          data: dummyAPILayoutDesign,
          error: undefined,
          isValidating: false,
          mutate: layoutMutate,
        };
      }
      if (url && url.includes('resources')) {
        return {
          data: mockDevices,
          error: undefined,
          isValidating: false,
          mutate: resourceMutate,
        };
      }
      return {
        data: undefined,
        error: undefined,
        isValidating: false,
        mutate: jest.fn(),
      };
    });

    // Render the hook
    const { result } = renderHook(() => useLayoutDesignDetail());

    // Call the mutate function
    result.current.mutate();

    // Verify both mutate functions were called
    expect(layoutMutate.mock.calls.length).toBe(1);
    expect(resourceMutate.mock.calls.length).toBe(1);
  });

  test('should handle layout design without conditions', async () => {
    // Create a modified dummy data without conditions
    const designWithoutConditions = {
      ...dummyAPILayoutDesign,
      conditions: undefined,
    };

    const useSWRImmutable = require('swr/immutable').default;
    useSWRImmutable.mockImplementation((url: string) => {
      if (url && url.includes('layout-designs')) {
        return {
          data: designWithoutConditions,
          error: undefined,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      if (url && url.includes('resources')) {
        return {
          data: mockDevices,
          error: undefined,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      return {
        data: undefined,
        error: undefined,
        isValidating: false,
        mutate: jest.fn(),
      };
    });

    // Render the hook
    const { result } = renderHook(() => useLayoutDesignDetail());

    // Wait for the hook to resolve
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    // Check that conditions is undefined
    expect(result.current.data?.conditions).toBeUndefined();
  });

  test('should handle layout design with empty conditions object', async () => {
    // Create a modified dummy data with empty conditions
    const designWithEmptyConditions = {
      ...dummyAPILayoutDesign,
      conditions: {},
    };

    const useSWRImmutable = require('swr/immutable').default;
    useSWRImmutable.mockImplementation((url: string) => {
      if (url && url.includes('layout-designs')) {
        return {
          data: designWithEmptyConditions,
          error: undefined,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      if (url && url.includes('resources')) {
        return {
          data: mockDevices,
          error: undefined,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      return {
        data: undefined,
        error: undefined,
        isValidating: false,
        mutate: jest.fn(),
      };
    });

    // Render the hook
    const { result } = renderHook(() => useLayoutDesignDetail());

    // Wait for the hook to resolve
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    // Check that conditions is undefined when empty object is provided
    expect(result.current.data?.conditions).toBeUndefined();
  });

  test('should handle getDeviceByID function correctly', async () => {
    // Render the hook
    const { result } = renderHook(() => useLayoutDesignDetail());

    // Wait for the hook to resolve
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    // Test getDeviceByID with existing device
    const device = result.current.getDeviceByID('res10102');
    expect(device).toBeDefined();
    expect(device?.type).toBe('CPU');
    expect(device?.totalCores).toBe(8);

    // Test getDeviceByID with non-existing device
    const nonExistingDevice = result.current.getDeviceByID('non-existing-id');
    expect(nonExistingDevice).toBeUndefined();
  });

  test('should handle layout design without endedAt', async () => {
    // Create a modified dummy data without endedAt
    const designWithoutEndedAt = {
      ...dummyAPILayoutDesign,
      endedAt: undefined,
    };

    const useSWRImmutable = require('swr/immutable').default;
    useSWRImmutable.mockImplementation((url: string) => {
      if (url && url.includes('layout-designs')) {
        return {
          data: designWithoutEndedAt,
          error: undefined,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      if (url && url.includes('resources')) {
        return {
          data: mockDevices,
          error: undefined,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      return {
        data: undefined,
        error: undefined,
        isValidating: false,
        mutate: jest.fn(),
      };
    });

    // Render the hook
    const { result } = renderHook(() => useLayoutDesignDetail());

    // Wait for the hook to resolve
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    // Check that endedAt is undefined
    expect(result.current.data?.endedAt).toBeUndefined();
  });

  test('should handle undefined weights and averageUseRate in CPU tolerance criteria', async () => {
    // Create a modified dummy data with undefined weights and averageUseRate
    const designWithUndefinedValues = {
      ...dummyAPILayoutDesign,
      conditions: {
        ...dummyAPILayoutDesign.conditions,
        toleranceCriteria: {
          ...dummyAPILayoutDesign.conditions?.toleranceCriteria,
          cpu: [
            {
              deviceIDs: ['res10102', 'res10101'],
              limit: {
                weights: [], // Empty array to test the index out of bounds condition
                averageUseRate: undefined, // Undefined averageUseRate
              },
            },
          ],
        },
      },
    };

    const useSWRImmutable = require('swr/immutable').default;
    useSWRImmutable.mockImplementation((url: string) => {
      if (url && url.includes('layout-designs')) {
        return {
          data: designWithUndefinedValues,
          error: undefined,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      if (url && url.includes('resources')) {
        return {
          data: mockDevices,
          error: undefined,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      return {
        data: undefined,
        error: undefined,
        isValidating: false,
        mutate: jest.fn(),
      };
    });

    // Render the hook
    const { result } = renderHook(() => useLayoutDesignDetail());

    // Wait for the hook to resolve
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    // Check that weights is undefined due to index out of bounds
    const cpuCriteria = result.current.data?.conditions?.toleranceCriteria?.cpu;
    expect(cpuCriteria).toBeDefined();
    expect(cpuCriteria?.[0].devices[0].weights).toBeUndefined();
    expect(cpuCriteria?.[0].devices[1].weights).toBeUndefined();

    // Check that averageUseRate is undefined
    expect(cpuCriteria?.[0].limit.averageUseRate).toBeUndefined();
  });

  test('should handle mixed undefined and defined values in tolerance criteria', async () => {
    // Create a modified dummy data with mixed undefined and defined values
    const designWithMixedValues = {
      ...dummyAPILayoutDesign,
      conditions: {
        ...dummyAPILayoutDesign.conditions,
        toleranceCriteria: {
          ...dummyAPILayoutDesign.conditions?.toleranceCriteria,
          cpu: [
            {
              deviceIDs: ['res10102', 'res10101', 'res10103'],
              limit: {
                weights: [0.5, undefined, 0.3], // Some weights defined, some undefined
                averageUseRate: 0.75, // Defined averageUseRate
              },
            },
          ],
        },
      },
    };

    const useSWRImmutable = require('swr/immutable').default;
    useSWRImmutable.mockImplementation((url: string) => {
      if (url && url.includes('layout-designs')) {
        return {
          data: designWithMixedValues,
          error: undefined,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      if (url && url.includes('resources')) {
        return {
          data: mockDevices,
          error: undefined,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      return {
        data: undefined,
        error: undefined,
        isValidating: false,
        mutate: jest.fn(),
      };
    });

    // Render the hook
    const { result } = renderHook(() => useLayoutDesignDetail());

    // Wait for the hook to resolve
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    // Check that weights are correctly mapped
    const cpuCriteria = result.current.data?.conditions?.toleranceCriteria?.cpu;
    expect(cpuCriteria).toBeDefined();
    expect(cpuCriteria?.[0].devices[0].weights).toBe(0.5);
    expect(cpuCriteria?.[0].devices[1].weights).toBeUndefined();
    expect(cpuCriteria?.[0].devices[2].weights).toBe(0.3);

    // Check that averageUseRate is defined
    expect(cpuCriteria?.[0].limit.averageUseRate).toBe(0.75);
  });

  test('should handle undefined CPU and memory in tolerance criteria', async () => {
    // Create a modified dummy data with undefined CPU and memory in toleranceCriteria
    const designWithUndefinedCpuAndMemory = {
      ...dummyAPILayoutDesign,
      conditions: {
        ...dummyAPILayoutDesign.conditions,
        toleranceCriteria: {
          // CPU and memory are intentionally omitted
        },
      },
    };

    const useSWRImmutable = require('swr/immutable').default;
    useSWRImmutable.mockImplementation((url: string) => {
      if (url && url.includes('layout-designs')) {
        return {
          data: designWithUndefinedCpuAndMemory,
          error: undefined,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      if (url && url.includes('resources')) {
        return {
          data: mockDevices,
          error: undefined,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      return {
        data: undefined,
        error: undefined,
        isValidating: false,
        mutate: jest.fn(),
      };
    });

    // Render the hook
    const { result } = renderHook(() => useLayoutDesignDetail());

    // Wait for the hook to resolve
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    // Check that CPU and memory criteria are empty arrays
    const toleranceCriteria = result.current.data?.conditions?.toleranceCriteria;
    expect(toleranceCriteria).toBeDefined();
    expect(toleranceCriteria?.cpu).toEqual([]);
    expect(toleranceCriteria?.memory).toEqual([]);
  });
});
