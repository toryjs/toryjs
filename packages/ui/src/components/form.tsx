import React from 'react';

import { FormModel, FormComponentCatalogue, Handlers, initUndoManager } from '@toryjs/form';
import { IProject, IStorage } from '../storage/common_storage';
import { FormView } from './form_view';
import { Context, context, ContextType } from '../context';
import { formDatasetToJS, schemaDatasetToJS } from '../helpers';

type Props = {
  project?: IProject;
  storage?: IStorage;
  catalogue: FormComponentCatalogue;
  handlers: Handlers<any, any>;
  context?: ContextType;
};

export const ToryForm: React.FC<Props> = props => {
  const [project, setProject] = React.useState<IProject>(props.project ? props.project : null);
  const formModel = project
    ? new FormModel(formDatasetToJS(project.form), schemaDatasetToJS(project.schema, false), {})
    : null;

  if (!project) {
    if (props.storage) {
      props.storage.loadProject().then(p => setProject(p));
    } else {
      throw new Error('You need to provide either a storage or a form model');
    }
    return <div>Loading ...</div>;
  }

  // init undo manager
  let formContext = props.context || context;
  if (!formContext.editor) {
    formContext.editor = {} as any;
  }
  formContext.editor.undoManager = initUndoManager(formModel.dataSet);

  return (
    <Context.Provider value={formContext}>
      <FormView
        formElement={formModel.formDefinition}
        owner={formModel.dataSet}
        catalogue={props.catalogue}
        handlers={props.handlers}
      />
    </Context.Provider>
  );
};

ToryForm.displayName = 'ToryForm';
