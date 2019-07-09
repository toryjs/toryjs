import * as React from 'react';

import { FormComponentProps, EditorComponent } from '@toryjs/form';
import { RepeaterView, RepeaterProps } from './repeater_view';
import { observer } from 'mobx-react';
import {
  prop,
  propGroup,
  boundProp,
  DynamicComponent,
  TemplateEditor,
  createEditorContainer
} from '@toryjs/ui';

const templates = [
  { text: 'Component View', value: 'component' },
  { text: 'View Template', value: 'view' },
  { text: 'Edit Template', value: 'edit' },
  { text: 'Add Template', value: 'add' }
];
const RepeaterComponent = (props: FormComponentProps<RepeaterProps>) => {
  return (
    <DynamicComponent {...props}>
      <TemplateEditor
        {...props}
        extra={props.extra}
        Component={RepeaterView.Component}
        options={templates}
      />
    </DynamicComponent>
  );
};

const RepeaterEditorWrapper = observer(RepeaterComponent);
RepeaterEditorWrapper.displayName = 'RepeaterEditor';

const RepeaterEditorView = createEditorContainer(RepeaterEditorWrapper);

export const RepeaterEditor: EditorComponent = {
  Component: RepeaterEditorView,
  title: 'Repeater',
  control: 'Repeater',
  icon: 'code',
  bound: true,
  valueProvider: 'value',
  props: propGroup('Repeater', {
    allowAdd: prop({ type: 'boolean' }),
    allowEdit: prop({ type: 'boolean' }),
    value: boundProp(),
    template: prop({
      control: 'Select',
      default: 'component',
      props: {
        options: templates
      }
    })
  }),
  defaultChildren: [
    { elements: [], props: { editorLabel: 'View Template' } },
    { elements: [], props: { editorLabel: 'Edit Template' } },
    { elements: [], props: { editorLabel: 'Add Template' } }
  ]
  // handlers: {
  //   onAdd: {}
  // }
};
