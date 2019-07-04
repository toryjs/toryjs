import React from 'react';

import { observer } from 'mobx-react';
import { FormComponentProps, FormComponent } from '@toryjs/form';

import { processControl, getValue, DynamicComponent } from '@toryjs/ui';
import { ReactComponent } from './common';

type InputProps = {
  placeholder: string;
  inputLabel: string;
  value: string;
};

export function createInputComponent(
  component: ReactComponent,
  inputProps = ['placeholder', 'value']
) {
  const BaseInputComponent: React.FC<FormComponentProps<InputProps>> = props => {
    const { source, disabled, error, handleChange, owner, value, context } = processControl(props);
    const schema = owner.getSchema(source);

    const inputLabel = getValue(props, context, 'inputLabel');

    return (
      <DynamicComponent
        {...props}
        control={component}
        controlProps={inputProps}
        name={source}
        disabled={disabled}
        error={error}
        type={schema.type === 'integer' || schema.type === 'number' ? 'number' : 'text'}
        label={inputLabel || undefined}
        onChange={handleChange}
        showError={true}
        value={value || ''}
      />
    );
  };
  return BaseInputComponent;
}

export const InputComponent = createInputComponent('input');

export const InputView: FormComponent = {
  Component: observer(InputComponent),
  toString: (_owner, props, context) => getValue(props, context)
};
