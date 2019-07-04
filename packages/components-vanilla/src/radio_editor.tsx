import { EditorComponent } from '@toryjs/form';
import { RadioView } from './radio_view';
import { propGroup, boundProp, tableProp, dataProp } from '@toryjs/ui';

export const RadioEditor: EditorComponent = {
  Component: RadioView.Component,
  title: 'Radio',
  control: 'Radio',
  icon: 'circle',
  bound: true,
  props: {
    ...propGroup('Radio', {
      value: boundProp(),
      options: tableProp({}, 'Options'),
      schemaSource: dataProp(),
      vertical: boundProp({ type: 'boolean' })
    }),
    options: tableProp({ bound: true }, 'Options')
  }
};
