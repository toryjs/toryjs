import React from 'react';

import { observer } from 'mobx-react';
import { FormComponentProps, FormComponent } from '@toryjs/form';

import {} from '@toryjs/ui';
import { processControl, getValue, DynamicComponent } from '@toryjs/ui';
import { ReactComponent } from './common';

export function createCheckboxComponent(
  component: ReactComponent,
  checkboxProps: string[] = [],
  extraProps: any,
  extraControls: (props: FormComponentProps) => JSX.Element
) {
  const Checkbox: React.FC<FormComponentProps> = props => {
    const { source, disabled, controlProps, value, handleChange, error } = processControl(props);
    console.log(error);
    return (
      <DynamicComponent
        {...props}
        {...extraProps}
        control={component}
        controlProps={checkboxProps}
        name={source}
        label={controlProps.text}
        labelPosition={controlProps.labelPosition}
        readOnly={disabled}
        checked={!!value}
        onChange={handleChange}
        disabled={disabled}
        showError={true}
        extraControls={extraControls && extraControls(props)}
      />
    );
  };
  return Checkbox;
}

export const CheckboxView: FormComponent = {
  Component: observer(
    createCheckboxComponent(
      'input',
      [],
      { type: 'checkbox' },
      props =>
        props.formElement.props.text && (
          <label className="checkboxLabel">{props.formElement.props.text}</label>
        )
    )
  ),
  toString: (_owner, props, context) => (getValue(props, context) ? 'Yes' : 'No')
};
