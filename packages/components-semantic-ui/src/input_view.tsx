import * as React from 'react';

import { observer } from 'mobx-react';
import { Form, Input, InputProps } from 'semantic-ui-react';
import { DataSet, FormComponentProps, FormComponent } from '@toryjs/form';
import { processControl, getValue, DynamicComponent } from '@toryjs/ui';

import { ErrorLabel } from './error_view';

const inputProps = [
  // 'action',
  // 'actionPosition',
  'fluid',
  'focus',
  'icon',
  'iconPosition',
  'inverted',
  'label',
  'labelPosition',
  'loading',
  'onChange',
  'size',
  'transparent',
  'placeholder',
  'value'
];

const InputComponent: React.FC<FormComponentProps<InputProps>> = props => {
  const { source, disabled, error, handleChange, owner, context, value } = processControl(props);
  const schema = owner.getSchema(source);

  const inputLabel = getValue(props, context, 'inputLabel');

  return (
    <DynamicComponent
      {...props}
      control={Input}
      controlProps={inputProps}
      name={source}
      disabled={disabled}
      error={!!error}
      type={schema.type === 'integer' || schema.type === 'number' ? 'number' : 'text'}
      label={inputLabel || undefined}
      onChange={handleChange}
      showError={true}
      value={value || ''}
    />
  );
};

InputComponent.displayName = 'Input';

export const InputView: FormComponent = {
  Component: observer(InputComponent),
  toString: (_owner, props, context) => getValue(props, context)
};

interface InputBoundProps {
  name: string;
  owner: DataSet;
  label: string;
}

export class FormInputComponent extends React.Component<InputBoundProps & InputProps> {
  handleInputChange: React.ReactEventHandler<HTMLInputElement> = e => {
    // find value
    this.props.owner.setValue(this.props.name, e.currentTarget.value);
  };

  render() {
    const { owner, name, label } = this.props;

    return (
      <Form.Field>
        <label>{label}</label>
        <Input
          name={name}
          error={!!owner.getError(name)}
          value={owner.getValue(name)}
          onChange={this.handleInputChange}
          disabled={this.props.readOnly}
        />

        <ErrorLabel error={owner.getError(name)} />
      </Form.Field>
    );
  }
}

export const FormInput = observer(FormInputComponent);
