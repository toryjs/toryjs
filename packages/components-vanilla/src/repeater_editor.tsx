import * as React from 'react';

import { FormComponentProps, EditorComponent } from '@toryjs/form';
import { RepeaterView, RepeaterProps } from './repeater_view';
import { observer } from 'mobx-react';
import { prop, propGroup, boundProp, DynamicComponent, TemplateEditor } from '@toryjs/ui';

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

export const RepeaterEditor: EditorComponent = {
  Component: observer(RepeaterComponent),
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
  })
  // handlers: {
  //   onAdd: {}
  // }
};
