import { EditorComponent } from '@toryjs/form';
import { propGroup, prop, handlerProp, boundProp } from '@toryjs/ui';
import { observer } from 'mobx-react';

import { DatasetEditor, DatasetEditorProps } from '@toryjs/editor';

export const DatasetEditorComponent: EditorComponent<DatasetEditorProps> = {
  Component: observer(DatasetEditor),
  title: 'Dataset Editor',
  control: 'DatasetEditor',
  icon: 'edit',
  bound: true,
  props: propGroup('Dataset Editor', {
    source: boundProp(),
    theme: prop({
      control: 'Select',
      props: {
        options: [{ value: 'dark', text: 'Dark' }, { value: 'light', text: 'Light' }]
      }
    }),
    height: prop({}),
    parseHandler: handlerProp({}),
    allowCustomTypes: prop({ type: 'boolean', label: 'Custom Types' })
  })
};
