import * as React from 'react';

import { FormComponentProps, EditorComponent } from '@toryjs/form';
import { DynamicComponent, prop, propGroup, boundProp, TemplateEditor } from '@toryjs/ui';

import { observer } from 'mobx-react';

import { IfView, IfProps } from './if_view';

const templates = [
  { text: 'Component View', value: '' },
  { text: 'True Template', value: 'true' },
  { text: 'False Template', value: 'false' }
];

const IfEditorComponent = (props: FormComponentProps<IfProps>) => {
  return (
    <DynamicComponent {...props}>
      <TemplateEditor {...props} extra={props.extra} Component={IfView} options={templates} />
    </DynamicComponent>
  );
};

export const IfEditor: EditorComponent = {
  Component: observer(IfEditorComponent),
  title: 'If',
  control: 'If',
  icon: 'question',
  bound: false,
  props: {
    ...propGroup('Condition', {
      template: prop({
        control: 'Select',
        default: 'view',
        props: {
          options: templates
        }
      }),
      value: boundProp({}),
      exists: prop({ type: 'boolean' }),
      notExists: prop({ type: 'boolean' }),
      equal: prop({ type: 'string' }),
      notEqual: prop({ type: 'string' }),
      biggerThan: prop({ type: 'number' }),
      biggerOrEqualThan: prop({ type: 'number' }),
      smallerThan: prop({ type: 'number' }),
      smallerOrEqualThan: prop({ type: 'number' }),
      expression: prop({
        control: 'Textarea',
        props: { text: 'Expression' }
      })
    })
  }
};
