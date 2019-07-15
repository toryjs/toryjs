import React from 'react';
import { observer } from 'mobx-react';

import { Context, FormEditor } from '@toryjs/ui';
import { addProviders, FormDataSet } from '@toryjs/ui';

type Props = {
  form: FormDataSet;
};

export const FormView = ({ form }: Props) => {
  const context = React.useContext(Context);

  const mainForm = context.editor.form;
  const formElement = addProviders(mainForm, form);

  return (
    <FormEditor.Component
      catalogue={context.editor.editorCatalogue}
      owner={context.editor.data}
      formElement={formElement}
      handlers={context.editor.handlers}
      readOnly={false}
    />
  );
};

export const FormComponentView = observer(() => {
  // this will react to ANY changes in the dataset since we are doing
  //   the datasetToJS which accesses all schema elements

  const context = React.useContext(Context);
  const currentForm = context.editor.state.selectedForm;

  context.editor.data;

  return <FormView form={currentForm} />;
});
