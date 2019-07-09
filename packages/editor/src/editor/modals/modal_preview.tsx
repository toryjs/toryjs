import * as React from 'react';

import { addProviders, FormView } from '@toryjs/ui';

import { randomData } from '../editor_common';
import { Modal, Menu } from 'semantic-ui-react';
import { Context } from '@toryjs/ui';

export const Preview = () => {
  const context = React.useContext(Context);
  const formModel: any = randomData(context);

  const mainForm = context.editor.form;
  const formElement = addProviders(mainForm, formModel);

  return (
    <FormView
      formElement={formElement}
      owner={formModel.dataSet}
      readOnly={false}
      handlers={context.editor.handlers}
      catalogue={context.editor.componentCatalogue}
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
