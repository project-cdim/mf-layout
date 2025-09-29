import { render, screen } from '@testing-library/react';
import { PolicyModal } from '@/components/PolicyModal';
import { APIPolicyError } from '@/types';
import { AxiosError } from 'axios';
import { ComponentProps } from 'react';
import { MantineProvider } from '@mantine/core';
import { PolicyConfirmModal, PolicyEditModal } from '@/components';

// Mocks

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(() => (key: string) => key),
}));
jest.mock('@/components', () => ({
  // PolicyEditModal: jest.fn((props) => <div data-testid='PolicyEditModal'>{props.modalMode}</div>),
  PolicyEditModal: jest.fn(),
  // PolicyConfirmModal: jest.fn((props) => <div data-testid='PolicyConfirmModal'>{props.modalMode}</div>),
  PolicyConfirmModal: jest.fn((props) => <div data-testid='PolicyConfirmModal'>{props.modalMode}</div>),
}));

describe('PolicyModal Component', () => {
  // SetUp

  const mockModalError = new AxiosError<APIPolicyError>('error msg', '404');

  const mockProps = {
    data: undefined,
    modalOpened: true,
    modalMode: 'add',
    category: 'nodeConfigurationPolicy',
    selectedPolicyId: '123',
    policyTitle: 'Test Policy',
    modalTitle: 'Add Policy',
    submitFunc: jest.fn(),
    inputStatus: undefined,
    modalError: mockModalError,
    setModalClose: jest.fn(),
  } as const satisfies ComponentProps<typeof PolicyModal>;

  it('renders modal with correct title and ID', () => {
    // Arrange
    render(
      <MantineProvider>
        <PolicyModal {...mockProps} />
      </MantineProvider>
    );
    // Act
    // Assert
    expect(screen.getByText('Node Layout Policy')).toBeInTheDocument(); // Category
    expect(screen.getByText('Add Policy')).toBeInTheDocument(); // Title
    expect(screen.getByText('ID')).toBeInTheDocument(); // ID(label)
    expect(screen.getByText('123')).toBeInTheDocument(); // ID
  });

  it('calls setModalClose when modal is closed', () => {
    // Arrange
    render(
      <MantineProvider>
        <PolicyModal {...mockProps} />
      </MantineProvider>
    );
    const closeButton = screen.getByRole('button', { name: '' }); // This is the close button.
    // Act
    closeButton.click();
    // Assert
    expect(mockProps.setModalClose).toHaveBeenCalled();
  });

  it('renders PolicyEditModal for "add" mode', () => {
    // Arrange
    const mockPolicyEditModal = require('@/components').PolicyEditModal as any;
    const props = {
      ...mockProps,
      modalMode: 'add',
      selectedPolicyId: undefined,
      policyTitle: undefined,
    } as const satisfies ComponentProps<typeof PolicyModal>;
    render(
      <MantineProvider>
        <PolicyModal {...props} />
      </MantineProvider>
    );
    // Act
    // Assert
    const propsPolicyEditModal = {
      category: props.category,
      modalMode: props.modalMode,
      selectedPolicyId: props.selectedPolicyId,
      policyTitle: props.policyTitle,
      modalClose: props.setModalClose,
      submit: props.submitFunc,
      inputStatus: props.inputStatus,
      error: props.modalError,
      data: props.data,
    } as const satisfies ComponentProps<typeof PolicyEditModal>;
    expect(mockPolicyEditModal).toHaveBeenCalledWith(expect.objectContaining(propsPolicyEditModal), undefined);
  });

  it('renders PolicyEditModal for "edit" mode', () => {
    // Arrange
    const mockPolicyEditModal = require('@/components').PolicyEditModal as any;
    const props = {
      ...mockProps,
      modalMode: 'edit',
      selectedPolicyId: '456',
      policyTitle: 'dummy title',
    } as const satisfies ComponentProps<typeof PolicyModal>;
    render(
      <MantineProvider>
        <PolicyModal {...props} />
      </MantineProvider>
    );
    // Act
    // Assert
    const propsPolicyEditModal = {
      category: props.category,
      modalMode: props.modalMode,
      selectedPolicyId: props.selectedPolicyId,
      policyTitle: props.policyTitle,
      modalClose: props.setModalClose,
      submit: props.submitFunc,
      inputStatus: props.inputStatus,
      error: props.modalError,
      data: props.data,
    } as const satisfies ComponentProps<typeof PolicyEditModal>;
    expect(mockPolicyEditModal).toHaveBeenCalledWith(expect.objectContaining(propsPolicyEditModal), undefined);
  });

  it('renders PolicyConfirmModal for "delete" mode', () => {
    // Arrange
    const mockPolicyConfirmModal = require('@/components').PolicyConfirmModal as any;
    const props = { ...mockProps, modalMode: 'delete' } as const satisfies ComponentProps<typeof PolicyModal>;
    render(
      <MantineProvider>
        <PolicyModal {...props} />
      </MantineProvider>
    );
    // Act
    // Assert
    const propsPolicyConfirmModal = {
      modalMode: props.modalMode,
      selectedPolicyId: props.selectedPolicyId,
      policyTitle: props.policyTitle,
      modalClose: props.setModalClose,
      submit: props.submitFunc,
      error: props.modalError,
    } as const satisfies ComponentProps<typeof PolicyConfirmModal>;
    expect(mockPolicyConfirmModal).toHaveBeenCalledWith(expect.objectContaining(propsPolicyConfirmModal), undefined);
  });

  it('renders PolicyConfirmModal for "enable" mode', () => {
    // Arrange
    const mockPolicyConfirmModal = require('@/components').PolicyConfirmModal as any;
    const props = { ...mockProps, modalMode: 'enable' } as const satisfies ComponentProps<typeof PolicyModal>;
    render(
      <MantineProvider>
        <PolicyModal {...props} />
      </MantineProvider>
    );
    // Act
    // Assert
    const propsPolicyConfirmModal = {
      modalMode: props.modalMode,
      selectedPolicyId: props.selectedPolicyId,
      policyTitle: props.policyTitle,
      modalClose: props.setModalClose,
      submit: props.submitFunc,
      error: props.modalError,
    } as const satisfies ComponentProps<typeof PolicyConfirmModal>;
    expect(mockPolicyConfirmModal).toHaveBeenCalledWith(expect.objectContaining(propsPolicyConfirmModal), undefined);
  });

  it('renders PolicyConfirmModal for "disable" mode', () => {
    // Arrange
    const mockPolicyConfirmModal = require('@/components').PolicyConfirmModal as any;
    const props = { ...mockProps, modalMode: 'disable' } as const satisfies ComponentProps<typeof PolicyModal>;
    render(
      <MantineProvider>
        <PolicyModal {...props} />
      </MantineProvider>
    );
    // Act
    // Assert
    const propsPolicyConfirmModal = {
      modalMode: props.modalMode,
      selectedPolicyId: props.selectedPolicyId,
      policyTitle: props.policyTitle,
      modalClose: props.setModalClose,
      submit: props.submitFunc,
      error: props.modalError,
    } as const satisfies ComponentProps<typeof PolicyConfirmModal>;
    expect(mockPolicyConfirmModal).toHaveBeenCalledWith(expect.objectContaining(propsPolicyConfirmModal), undefined);
  });
});
