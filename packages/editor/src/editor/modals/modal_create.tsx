import React from 'react';
import { Modal, Menu, Button, Input } from 'semantic-ui-react';
import { modalActions, margined } from '../editor_styles';
import { Context } from '@toryjs/ui';

type Props = {
  duplicate?: boolean;
};

export const ModalCreate: React.FC<Props> = () => {
  const context = React.useContext(Context);
  const [open, changeOpen] = React.useState(false);
  const [name, setName] = React.useState('');

  return (
    <Modal
      trigger={
        <Menu.Item
          icon={'file'}
          title="Create a new Form"
          onClick={() => {
            changeOpen(true);
          }}
        />
      }
      open={open}
    >
      <Modal.Header>Do you wish to create a new form?</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Input
            fluid
            label="Name:"
            labelPosition="left"
            value={name}
            onChange={e => setName(e.currentTarget.value)}
          />
          <div className={margined}>If you continue, you will lose all unsaved changes.</div>
          <div className={modalActions}>
            <Button onClick={() => changeOpen(false)}>Close</Button>
            <Button
              onClick={() => {
                context.editor.createProject(name);
                changeOpen(false);
              }}
              icon="file"
              color="green"
              content="Create"
            />
          </div>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};
