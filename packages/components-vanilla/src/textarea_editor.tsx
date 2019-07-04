import { EditorComponent } from '@toryjs/form';
import { propGroup, prop, boundProp } from '@toryjs/ui';

import { TextAreaView } from './textarea_view';

export const TextAreaEditor: EditorComponent = {
  Component: TextAreaView.Component,
  title: 'Text Area',
  control: 'Textarea',
  icon: 'window maximize outline',
  bound: true,
  props: propGroup('Text Area', {
    value: boundProp(),
    placeholder: prop()
  })
};
