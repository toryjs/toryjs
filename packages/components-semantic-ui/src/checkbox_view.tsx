import { observer } from 'mobx-react';
import { Checkbox } from 'semantic-ui-react';
import { FormComponent } from '@toryjs/form';
import { getValue } from '@toryjs/ui';
import { createCheckboxComponent } from '@toryjs/components-vanilla';

const checkboxProps = ['radio', 'slider', 'toggle'];

const CheckboxComponent = createCheckboxComponent(Checkbox, checkboxProps);

export const CheckboxView: FormComponent = {
  Component: observer(CheckboxComponent),
  toString: (_owner, props, context) => (getValue(props, context) ? 'Yes' : 'No')
};
