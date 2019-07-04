import * as React from 'react';

import { randomData } from '../editor_common';
import { Modal, Menu } from 'semantic-ui-react';
import { FormView } from '../../components/form_view';
import { EditorContext } from '../editor_context';
import { addProviders } from '../../common';

export const Preview = () => {
  const state = React.useContext(EditorContext);
  const editorState = React.useContext(EditorContext);
  const formModel: any = randomData(state);

  const mainForm = state.form;
  const formElement = addProviders(mainForm, formModel);

  return (
    <FormView
      formElement={formElement}
      owner={formModel.dataSet}
      readOnly={false}
      handlers={editorState.handlers}
      catalogue={editorState.componentCatalogue}
    />
  );
};

export const ModalPreview = () => {
  return (
    <Modal trigger={<Menu.Item icon="search" title="Preview Form" />}>
      <Modal.Header>Form Preview</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Preview />
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};
