import React from 'react';
import { EditorComponent, FormComponentProps } from '@toryjs/form';

import { propGroup, prop, gapProp, DropComponentEditor, createEditorContainer } from '@toryjs/ui';
import { StackView, StackProps } from './stack_view';

const StackEditorComponent: React.FC<FormComponentProps<StackProps>> = props => (
  <DropComponentEditor
    {...props}
    Component={StackView.Component as any}
    layout={props.formElement.props.layout}
  />
);

StackEditorComponent.displayName = 'StackEditor';

const StackEditorWrapper = createEditorContainer(StackEditorComponent);
StackEditorWrapper.displayName = 'StackEditorWrapper';

export const StackEditor: EditorComponent = {
  Component: StackEditorWrapper,
  control: 'Stack',
  icon: 'align justify',
  title: 'Stack Layout',
  group: 'Layout',
  defaultProps: {
    layout: 'column'
  },
  props: propGroup('Stack', {
    layout: prop({
      documentation: 'Items can either be stacked in rows or columns',
      label: 'Layout',
      control: 'Select',
      type: 'string',
      $enum: [{ text: 'Rows', value: 'row' }, { text: 'Columns', value: 'column' }]
    }),
    final: prop({
      type: 'boolean',
      documentation:
        'Prohibits adding new elements to the stack. This is used mostly in editor for visual appeal.'
    }),
    gap: gapProp({
      documentation: 'Spacing between cells'
    }),
    padding: gapProp({
      documentation: 'Cell padding',
      label: 'Padding'
    })
  })
};
