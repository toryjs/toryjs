import React from 'react';
import { FormComponentProps } from '@toryjs/form';

import { DynamicControl, getValues } from '@toryjs/ui';

import dayjs from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc';

dayjs.extend(utcPlugin);

export type DateProps = {
  value: string;
  format: string;
  local: boolean;
};

export const DateView: React.FC<FormComponentProps<DateProps>> = props => {
  const [text, format, local] = getValues(props, 'value', 'format', 'local');

  let date = text ? (local ? dayjs(text).format(format) : dayjs.utc(text).format(format)) : null;

  return <DynamicControl {...props}>{date || ''}</DynamicControl>;
};
