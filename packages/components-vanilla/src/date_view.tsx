import React from 'react';
import { FormComponentProps } from '@toryjs/form';

import { Context, getValue, DynamicControl } from '@toryjs/ui';

import dayjs from 'dayjs';

export type DateProps = {
  value: string;
  format: string;
};

export const DateView: React.FC<FormComponentProps<DateProps>> = props => {
  const context = React.useContext(Context);
  const text = getValue(props, context, 'value');
  const format = getValue(props, context, 'format');

  let date = text ? dayjs(text).format(format) : null;

  return <DynamicControl {...props}>{date || ''}</DynamicControl>;
};
