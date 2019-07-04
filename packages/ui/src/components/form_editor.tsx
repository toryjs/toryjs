import React from 'react';

import { EditorComponent, FormComponentProps } from '@toryjs/form';

import { FormView } from './form_view';
import { propGroup, handlerProp } from '../editor/editor_common';
import { SingleDropCell } from '../editor/layouts_common_editor';
import { DynamicComponent } from './dynamic_component';
import { observer } from 'mobx-react';

export type FormProps = {
  text: string;
};

export const FormEditorComponent: React.FC<FormComponentProps> = props => {
  if (props.formElement.elements.length === 0) {
    return (
      <DynamicComponent {...props}>
        <SingleDropCell {...props} />
      </DynamicComponent>
    );
  } else return <FormView {...props} />;
};

export const FormEditor: EditorComponent = {
  Component: observer(FormEditorComponent),
  title: 'Form',
  control: 'Form',
  icon: 'file outline',
  valueProvider: 'value',
  props: propGroup('Form Editor', {
    onCreate: handlerProp()
  })
};
