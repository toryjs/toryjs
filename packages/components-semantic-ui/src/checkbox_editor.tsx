import { EditorComponent } from '@toryjs/form';

import { CheckboxView } from './checkbox_view';
import { propGroup, boundProp } from '@toryjs/ui';

export type CheckBoxProps = {
  text: string;
};

export const CheckboxEditor: EditorComponent = {
  Component: CheckboxView.Component,
  bound: true,
  title: 'Checkbox',
  control: 'Checkbox',
  icon: 'check square outline',
  props: propGroup('Checkbox', {
    value: boundProp({ type: 'boolean' }),
    text: boundProp(),
    radio: boundProp({ type: 'boolean' }),
    slider: boundProp({ type: 'boolean' }),
    toggle: boundProp({ type: 'boolean' })
  })
};
