import React from 'react';

import { FormModel, FormComponentCatalogue, Handlers } from '@toryjs/form';
import { IProject, IStorage } from '../storage/common_storage';
import { FormView } from './form_view';
import { Context, context } from '../context';
import { formDatasetToJS, schemaDatasetToJS } from '../helpers';

type Props = {
  project?: IProject;
  storage?: IStorage;
  catalogue: FormComponentCatalogue;
  handlers: Handlers<any, any>;
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
  return (
    <Context.Provider value={context}>
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
