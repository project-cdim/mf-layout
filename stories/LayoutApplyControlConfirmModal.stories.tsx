import type { Meta, StoryObj } from '@storybook/react';
import { LayoutApplyControlConfirmModal } from '@/components';
import { useState } from 'react';
import { AxiosError } from 'axios';

const modalPropsDUMMY = {
  close: () => alert('close'),
  submitFunction: () => alert('submitFunction'),
  id: 'test-id',
  isOpen: true,
  confirmTitle: 'Confirm Title',
  confirmMessage: 'Are you sure you want to proceed?',
  submitButtonLabel: 'Submit',
  cancelButtonLabel: 'Cancel',
  errorTitle: 'Error',
  error: undefined,
};
const meta: Meta = {
  title: 'Components/LayoutApplyControlConfirmModal',
  component: LayoutApplyControlConfirmModal,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    modalProps: { ...modalPropsDUMMY },
  },
} satisfies Meta<typeof LayoutApplyControlConfirmModal>;

export default meta;

type Story = StoryObj<typeof LayoutApplyControlConfirmModal>;

export const Default: Story = {
  args: {},
  render: () => {
    const [openModal, setOpenModal] = useState(false);
    const modalProps = {
      ...modalPropsDUMMY,
      close: () => {
        setOpenModal(false);
      },
      isOpen: openModal,
    };
    return (
      <>
        <button
          onClick={() => {
            setOpenModal(true);
          }}
        >
          open
        </button>
        <LayoutApplyControlConfirmModal modalProps={{ ...modalProps }} />
      </>
    );
  },
};

export const Error: Story = {
  args: {},
  render: () => {
    const [openModal, setOpenModal] = useState(false);
    const [error, setError] = useState<AxiosError<{ code: string; message: string }> | undefined>(undefined);
    const modalProps = {
      ...modalPropsDUMMY,
      close: () => {
        setError(undefined);
        setOpenModal(false);
      },
      submitFunction: () => {
        setError(new AxiosError('error message', 'error code'));
      },
      error,
      isOpen: openModal,
    };
    return (
      <>
        <button
          onClick={() => {
            setOpenModal(true);
          }}
        >
          open
        </button>
        <LayoutApplyControlConfirmModal modalProps={{ ...modalProps }} />
      </>
    );
  },
};
