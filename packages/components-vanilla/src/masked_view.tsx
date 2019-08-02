import * as React from 'react';

import { FormComponentProps } from '@toryjs/form';
import InputMask from 'react-input-mask';
import dayjs from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc';

import { processControl, getValue, DynamicComponent } from '@toryjs/ui';
import { observer } from 'mobx-react';

dayjs.extend(utcPlugin);

const inputProps = ['mask', 'placeholder', 'value', 'defaultValue'];

export type MaskedProps = {
  mask: string;
  placeholder: string;
  dateFormat: string;
  local: boolean;
};

export const MaskedView: React.FC<FormComponentProps<MaskedProps>> = observer(props => {
  let { source, disabled, handleChange, value, context } = processControl(props);

  const format = getValue(props, context, 'dateFormat');
  const local = getValue(props, context, 'local');

  if (format) {
    value = local ? dayjs(value).format(format) : dayjs.utc(value).format(format);
  }

  return (
    <DynamicComponent
      {...props}
      control={InputMask}
      controlProps={inputProps}
      name={source}
      disabled={disabled}
      onChange={handleChange}
      showError={true}
      value={value || ''}
    />
  );
});

MaskedView.displayName = 'MaskedView';
