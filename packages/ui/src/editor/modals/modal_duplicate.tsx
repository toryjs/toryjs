import React from 'react';
import { Modal, Menu, Button, Input } from 'semantic-ui-react';
import { modalActions } from '../editor_styles';
import { config } from '@toryjs/form';
import { EditorContext } from '../editor_context';

export const ModalDuplicate: React.FC = () => {
  const editorState = React.useContext(EditorContext);
  const [open, changeOpen] = React.useState(false);
  const [name, setName] = React.useState(
    editorState.project ? editorState.project.form.props.label + ' (clone)' : ''
  );

  return (
    <Modal
      trigger={
        <Menu.Item
          icon={'clone'}
          title={config.i18n`Duplicate current form`}
          onClick={() => {
            editorState.project && changeOpen(true);
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
                editorState.duplicateProject(name);
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
