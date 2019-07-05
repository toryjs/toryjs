import { TextArea } from 'semantic-ui-react';
import { FormComponent } from '@toryjs/form';
import { getValue } from '@toryjs/ui';
import { createTextAreaComponent } from '@toryjs/components-vanilla';

export const TextAreaComponent = createTextAreaComponent(TextArea);

export const TextAreaView: FormComponent = {
  Component: TextAreaComponent,
  toString: (_owner, props, context) => getValue(props, context)
};
