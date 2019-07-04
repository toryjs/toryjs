import React from 'react';

import { EditorComponent, FormComponentProps } from '@toryjs/form';
import { observer } from 'mobx-react';
import { TextProps, MarkdownComponent } from './markdown_view';
import { Context, getValue, DynamicComponent, propGroup, boundProp } from '@toryjs/ui';

const MarkdownEditorComponent: React.FC<FormComponentProps<TextProps>> = props => {
  const context = React.useContext(Context);
  if (!getValue(props, context)) {
    return <DynamicComponent {...props}>[Markdown]</DynamicComponent>;
  }
  return <MarkdownComponent {...props} />;
};

export const MarkdownEditor: EditorComponent = {
  Component: observer(MarkdownEditorComponent),
  title: 'Markdown',
  control: 'Markdown',
  icon: 'font',
  props: propGroup('Text', {
    value: boundProp({
      props: { label: '', language: 'markdown', display: 'padded' },
      control: 'Code'
    })
  })
};
