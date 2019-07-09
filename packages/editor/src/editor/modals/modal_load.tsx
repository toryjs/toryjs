import React from 'react';

import names from 'classnames';

import { Modal, Menu, Button } from 'semantic-ui-react';
import { css } from 'emotion';
import { config } from '@toryjs/form';
import { IProject, Context } from '@toryjs/ui';

const itemStyle = css`
  padding: 3px;
  cursor: pointer;
  label: item;
`;

const selectedStyle = css`
  ${itemStyle}
  background-color: #dedede;
  label: selected;
`;

const row = css`
  display: flex;
  .name {
    flex: 2;
  }
  .size {
    flex: 1;
  }
  .date {
    flex: 1;
  }
`;

const header = css`
  font-weight: bolder;
`;

export const ModalLoad: React.FC = () => {
  const context = React.useContext(Context);
  const [open, changeOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const [projects, setProjects] = React.useState<IProject[]>(null);

  function loadForm() {
    context.editor.load(selected);
    changeOpen(false);
  }

  function deleteForm() {
    if (confirm(config.i18n`Are you sure you want to delete this form?`)) {
      changeOpen(false);
      context.editor.manager.deleteProject(selected.id);
    }
  }

  if (!projects) {
    context.editor.manager.listProjects().then(projects => setProjects(projects));
    return <div>Loading Projects ...</div>;
  }

  return (
    <Modal
      trigger={
        <Menu.Item
          icon="folder open"
          title="Open project from storage"
          onClick={() => {
            changeOpen(true);
          }}
        />
      }
      open={open}
    >
      <Modal.Header>Load project from storage</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          {projects.length === 0 && <div>There are no projects in your storage</div>}
          <div className={names(row, header)}>
            <div className="name">{config.i18n`Form Name`}</div>
            <div className="size">{config.i18n`Size (B)`}</div>
            <div className="date">{config.i18n`Created`}</div>
            <div className="date">{config.i18n`Modified`}</div>
          </div>
          {projects.map(p => (
            <div
              key={p.uid}
              onClick={() => setSelected(p)}
              className={names(row, selected && p.uid === selected.id ? selectedStyle : itemStyle)}
            >
              <div className="name">{p.form.props.label}</div>
              <div className="size">{JSON.stringify(p).length}</div>
              <div className="date">{p.created ? new Date(p.created).toLocaleString() : '--'}</div>
              <div className="date">
                {p.modified ? new Date(p.modified).toLocaleString() : '--'}
              </div>
            </div>
          ))}
          <br />
          <br />
          <div>
            <Button onClick={() => changeOpen(false)}>Close</Button>
            {selected && (
              <>
                <Button
                  floated="right"
                  onClick={loadForm}
                  icon="folder open"
                  primary
                  content="Load"
                />
                <Button
                  floated="right"
                  onClick={deleteForm}
                  icon="trash"
                  color="red"
                  content="Delete"
                />
              </>
            )}
          </div>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};
