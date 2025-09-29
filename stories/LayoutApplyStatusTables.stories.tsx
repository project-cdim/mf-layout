import type { Meta, StoryObj } from '@storybook/react';

import { StatusTables as LayoutApplyStatusTables } from '@/components';

const meta = {
  title: 'Components/LayoutApplyStatusTables',
  component: LayoutApplyStatusTables,
  argTypes: {},
  args: {},
} satisfies Meta<typeof LayoutApplyStatusTables>;

export default meta;

type Story = StoryObj<typeof LayoutApplyStatusTables>;

export const Standard: Story = {
  args: {},
};
