import * as React from 'react';

import { observer } from 'mobx-react';
import { Checkbox } from 'semantic-ui-react';
import { FormComponentProps, FormComponent } from '@toryjs/form';
import { DynamicComponent, processControl, getValue } from '@toryjs/ui';

const checkboxProps = ['radio', 'slider', 'toggle'];

const CheckboxComponent: React.FC<FormComponentProps> = props => {
  const { source, disabled, controlProps, value, handleChange } = processControl(props);

  return (
    <DynamicComponent
      {...props}
      control={Checkbox}
      controlProps={checkboxProps}
      name={source}
      label={controlProps.text}
      readOnly={disabled}
      checked={!!value}
      onChange={handleChange}
      disabled={disabled}
    />
  );
};

export const CheckboxView: FormComponent = {
  Component: observer(CheckboxComponent),
  toString: (_owner, props, context) => (getValue(props, context) ? 'Yes' : 'No')
};
