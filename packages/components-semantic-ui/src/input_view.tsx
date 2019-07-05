import { observer } from 'mobx-react';
import { Input } from 'semantic-ui-react';
import { FormComponent } from '@toryjs/form';
import { getValue } from '@toryjs/ui';
import { createInputComponent } from '@toryjs/components-vanilla';

const inputProps = [
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

const InputComponent = createInputComponent(Input, inputProps);
InputComponent.displayName = 'Input';

export const InputView: FormComponent = {
  Component: observer(InputComponent),
  toString: (_owner, props, context) => getValue(props, context)
};
