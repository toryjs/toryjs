import React from 'react';

import { EditorComponent, FormComponentProps } from '@toryjs/form';
import { observer } from 'mobx-react';

import { DynamicComponent } from './dynamic_component';
import { SingleDropCell } from './editor/single_drop_cell';
import { FormView } from './form_view';
import { propGroup, handlerProp, prop } from '../props';

export type FormProps = {
  text: string;
};

export const FormEditorComponent: React.FC<FormComponentProps> = props => {
  if (!props.formElement.props.pageId && props.formElement.elements.length === 0) {
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
    onCreate: handlerProp(),
    pageId: prop({
      control: 'Select',
      label: 'Page',
      documentation: 'Page to display',
      props: {
        options: { handler: 'optionsProjectPages' }
      }
    })
  })
};
