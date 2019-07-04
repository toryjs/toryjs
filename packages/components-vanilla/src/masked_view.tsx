import * as React from 'react';

import { FormComponentProps } from '@toryjs/form';
import InputMask from 'react-input-mask';
import dayjs from 'dayjs';

import { processControl, getValue, DynamicComponent } from '@toryjs/ui';
import { observer } from 'mobx-react';

const inputProps = ['mask', 'placeholder', 'value', 'defaultValue'];

export type MaskedProps = {
  mask: string;
  placeholder: string;
  dateFormat: string;
};

export const MaskedView: React.FC<FormComponentProps<MaskedProps>> = observer(props => {
  let { source, disabled, handleChange, value, context } = processControl(props);

  const dateFormat = getValue(props, context, 'dateFormat');
  if (dateFormat) {
    value = dayjs(value).format(dateFormat);
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
