import React from 'react';
import { Modal, Menu, Button, Input } from 'semantic-ui-react';
import { modalActions } from '../editor_styles';
import { config } from '@toryjs/form';
import { Context } from '@toryjs/ui';

export const ModalDuplicate: React.FC = () => {
  const context = React.useContext(Context);
  const [open, changeOpen] = React.useState(false);
  const [name, setName] = React.useState(
    context.editor.project ? context.editor.project.form.props.label + ' (clone)' : ''
  );

  return (
    <Modal
      trigger={
        <Menu.Item
          icon={'clone'}
          title={config.i18n`Duplicate current form`}
          onClick={() => {
            context.editor.project && changeOpen(true);
          }}
        />
      }
      open={open}
    >
      <Modal.Header>{config.i18n`Duplicate Current Form`}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Input
            fluid
            label="Name:"
            labelPosition="left"
            value={name}
            onChange={e => setName(e.currentTarget.value)}
          />
          <div className={modalActions}>
            <Button onClick={() => changeOpen(false)}>Close</Button>
            <Button
              onClick={() => {
                context.editor.duplicateProject(name);
                changeOpen(false);
              }}
              icon="file"
              color="green"
              content="Duplicate"
            />
          </div>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};
