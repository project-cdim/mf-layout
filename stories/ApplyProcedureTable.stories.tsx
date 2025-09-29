import type { Meta, StoryObj } from '@storybook/react';
import { ApplyProcedureTable } from '@/components';

const meta: Meta = {
  title: 'Components/ApplyProcedureTable',
  component: ApplyProcedureTable,
  parameters: {
    nextjs: {
      router: {
        basePath: '',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ApplyProcedureTable>;

export const Default: Story = {
  args: {},
};
