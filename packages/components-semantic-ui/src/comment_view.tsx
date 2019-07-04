import * as React from 'react';

import { Message } from 'semantic-ui-react';
import { FormComponentProps, FormComponent } from '@toryjs/form';
import { getValue } from '@toryjs/ui';
import { DynamicComponent } from '@toryjs/ui';

type CommentProps = {
  text: string;
  header: string;
  color: string;
};
const controlProps = ['header', 'icon', 'color', 'content'];

export const Comment: React.FC<FormComponentProps<CommentProps>> = props => {
  return <DynamicComponent {...props} control={Message} controlProps={controlProps} />;
};

export const CommentView: FormComponent = {
  Component: Comment,
  toString: (_, props, context) => getValue(props, context, 'text')
};
