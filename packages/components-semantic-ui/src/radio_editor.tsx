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
      value: boundProp({ documentation: 'Current value' }),
      schemaSource: dataProp({
        documentation: 'Dataset item that holds the enumeration of available values'
      }),
      vertical: boundProp({ type: 'boolean', documentation: 'Renders in a vertical mode' })
    }),
    options: tableProp({ bound: true, documentation: 'List of available options' }, 'Options')
  }
};
