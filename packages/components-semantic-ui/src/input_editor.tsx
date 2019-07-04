import { EditorComponent } from '@toryjs/form';
import { propGroup, boundProp } from '@toryjs/ui';

import { InputView } from './input_view';
import { sizes } from './enums';

export const InputEditor: EditorComponent = {
  Component: InputView.Component,
  title: 'Input',
  control: 'Input',
  icon: 'square outline',
  bound: true,
  props: propGroup('Input', {
    fluid: boundProp({ type: 'boolean' }),
    focus: boundProp({ type: 'boolean' }),
    icon: boundProp(),
    iconPosition: boundProp({
      control: 'Select',
      props: { options: [{ text: 'Left', value: 'left' }, { text: 'Right', value: 'right' }] }
    }),
    inverted: boundProp({ type: 'boolean' }),
    inputLabel: boundProp(),
    labelPosition: boundProp({
      control: 'Select',
      props: { options: [{ text: 'Left', value: 'left' }, { text: 'Right', value: 'right' }] }
    }),
    loading: boundProp({ type: 'boolean' }),
    size: boundProp({ control: 'Select', props: { options: sizes } }),
    transparent: boundProp({ type: 'boolean' }),
    value: boundProp(),
    placeholder: boundProp()
  }),
  defaultProps: {
    fluid: true
  }
};
