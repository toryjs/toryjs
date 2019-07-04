import React from 'react';
import { observer } from 'mobx-react';
import { FormEditor } from '../components/form_editor';
import { EditorContext } from './editor_context';
import { FormDataSet } from './form_store';
import { addProviders } from '../common';

type Props = {
  form: FormDataSet;
};

export const FormView = ({ form }: Props) => {
  const context = React.useContext(EditorContext);

  const mainForm = context.form;
  const formElement = addProviders(mainForm, form);

  return (
    <FormEditor.Component
      catalogue={context.editorCatalogue}
      owner={context.data}
      formElement={formElement}
      handlers={context.handlers}
      readOnly={false}
    />
  );
};

export const FormComponentView = observer(() => {
  // this will react to ANY changes in the dataset since we are doing
  //   the datasetToJS which accesses all schema elements

  const context = React.useContext(EditorContext);
  const currentForm = context.state.selectedForm;

  context.data;

  return <FormView form={currentForm} />;
});
