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
    labelPosition: boundProp({
      type: 'string',
      control: 'Select',
      props: { options: [{ text: 'before', value: 'before' }, { text: 'after', value: 'after' }] },
      documentation: 'Renders label either before or after the checkbox'
    }),
    value: boundProp({ type: 'boolean' }),
    text: boundProp({
      documentation: 'You can render text as a checkbox label, if you wish to keep both labels.'
    }),
    inline: boundProp({
      type: 'boolean',
      documentation:
        'Decides how the label is rendered, whether on a separate line or next to the checkbox.'
    })
  }),
  defaultProps: {
    inline: true
  }
};
