import { EditorComponent } from '@toryjs/form';
import { InputView } from './input_view';
import { propGroup, boundProp } from '@toryjs/ui';

export const InputEditor: EditorComponent = {
  Component: InputView.Component,
  title: 'Input',
  control: 'Input',
  icon: 'square outline',
  bound: true,
  props: propGroup('Input', {
    value: boundProp(),
    placeholder: boundProp()
  }),
  defaultProps: {
    fluid: true
  }
};
