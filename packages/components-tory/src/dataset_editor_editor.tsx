import React from 'react';

import { EditorComponent, FormComponentProps } from '@toryjs/form';
import { propGroup, prop, handlerProp, boundProp, css, DynamicComponent } from '@toryjs/ui';
import { DatasetEditorProps } from '@toryjs/editor';

const editor = css`
  padding: 12px;
  border: solid 1px #efefef;
  border-radius: 6px;
  background: #dedede;
`;

const DataSetEditor: React.FC<FormComponentProps> = props => (
  <DynamicComponent {...props} className={editor}>
    Dataset Editor
  </DynamicComponent>
);

export const DatasetEditorComponent: EditorComponent<DatasetEditorProps> = {
  Component: DataSetEditor,
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
