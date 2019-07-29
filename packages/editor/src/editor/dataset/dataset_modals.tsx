import * as React from 'react';
import { Button, Modal, Icon, Message, Input, Form } from 'semantic-ui-react';

import { css } from 'emotion';
import { action } from 'mobx';
import { config } from '@toryjs/form';
import { clone } from '@tomino/toolbelt';
import { Context, SchemaDataSet } from '@toryjs/ui';

import { SchemaRecord } from '../editor_types';
import { modalActions } from '../editor_styles';
import { searchSchema, searchForm } from '../form_store';

type Props = {
  schema: SchemaDataSet;
  selectedSchema?: SchemaDataSet;
  types?: SchemaRecord[];
  property?: string;
};

const modalLabel = css`
  font-weight: bold;
  padding-bottom: 6px;
  display: block;
`;

function useMergeState<T>(initialState: T): [T, (t: Partial<T>) => void] {
  const [state, setState] = React.useState(initialState);
  const setMergedState = (newState: any) =>
    setState((prevState: any) => Object.assign({}, prevState, newState));
  return [state, setMergedState];
}

export const AddSchema: React.FC<Props> = ({ schema, property }) => {
  const context = React.useContext(Context);
  const [state, changeState] = useMergeState({
    open: false,
    error: '',
    name: ''
  });

  const addSchema = action(() => {
    let selected = context.editor.project.state.selectedSchema || schema;
    if (selected.type === 'array') {
      selected = selected.reference ? selected.reference.items : selected.items;
    }
    while (!selected.reference && selected.type !== 'object') {
      selected = selected.parent as any;
    }

    let owner = selected.reference ? selected.reference : selected;
    let p = property === 'definitions' && schema === selected ? 'definitions' : 'properties';

    let name = state.name;

    // create name
    // local types do not have names so that they are not suspectible to rename problems
    if (owner.getValue(p) == null) {
      owner.setValue(p, {});
    }

    if (p === 'definitions') {
      // we need to check names
      let definitions = owner.getValue(p);
      if (Array.from(definitions.keys()).some(key => definitions.get(key).title === state.name)) {
        changeState({ error: 'Element with this name already exists!' });
        return;
      }
      let index = 1;
      do {
        name = 'Type_' + index++;
      } while (owner.getValue(p).has(name));
    } else if (owner.getValue(p).has(state.name)) {
      changeState({ error: 'Element with this name already exists!' });
      return;
    }
    // selected.properties
    owner.setMapValue(p, name, { title: state.name, type: 'string' });
    changeState({ open: false, error: '', name: '' });
  });

  return (
    <Modal
      open={state.open}
      trigger={
        <Button
          primary
          title="Add a new element"
          floated="right"
          icon="plus"
          size="tiny"
          compact
          onClick={() => changeState({ open: true })}
        />
      }
    >
      <Modal.Header>
        <Icon name="database" />
        Add Schema Element
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <label className={modalLabel}>Element Name</label>
          <Input
            fluid
            value={state.name}
            onChange={(_e, v) => changeState({ name: v.value })}
            placeholder="Please specify name of the new element"
          />
          {state.error && <Message error content={state.error} />}

          <div className={modalActions}>
            <Button onClick={() => changeState({ open: false })}>Close</Button>
            <Button onClick={addSchema} icon="plus" color="green" content="Add" />
          </div>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};

export const DeleteSchema: React.FC<Props> = ({ schema }) => {
  const context = React.useContext(Context);
  const [isOpen, setOpen] = React.useState(false);
  let error = '';

  function deleteSchema() {
    context.editor.project.state.deleteActiveSchema();
  }

  let formElement = searchForm(context.editor.form, e => {
    return (
      e &&
      Object.keys(e.props).find(
        key =>
          e.props[key] &&
          e.props[key].source &&
          e.props[key].source.indexOf(context.editor.selectedSourcePath) >= 0
      )
    );
  });

  if (formElement) {
    error = `Cannot delete this schema element since it is used in your form by element with label <b>${formElement}</b>`;
  }
  let dependentSchema = searchSchema(context.editor.schema, s =>
    s.$import === context.editor.project.state.selectedSchemaName ||
    s.$ref === '#/definitions/' + context.editor.project.state.selectedSchemaName
      ? s
      : false
  );
  if (dependentSchema) {
    error = `Cannot delete this type since it is used your schema by element <b>${dependentSchema.name()}</b>. Please remove all references and try again`;
  }

  return (
    <Modal
      open={isOpen}
      trigger={
        <Button
          default
          title="Delete Element"
          floated="right"
          icon="trash"
          content={config.i18n`Delete`}
          onClick={() => {
            if (!error) {
              deleteSchema();
            } else {
              setOpen(true);
            }
          }}
        />
      }
    >
      <Modal.Header>
        <Icon name="trash" />
        Deleting Schema Element &quot;
        {schema.title || context.editor.project.state.selectedSchemaName}
        &quot;
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          {error ? (
            <div dangerouslySetInnerHTML={{ __html: error }} />
          ) : (
            <span>Do you wish to delete the selected element?</span>
          )}
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        {!error && <Button onClick={deleteSchema} icon="trash" color="red" content="Delete" />}
      </Modal.Actions>
    </Modal>
  );
};

export const ImportSchema: React.FC<Props> = ({ schema, types }) => {
  const [isOpen, setOpen] = React.useState(false);
  const imported = Array.from(schema.imports.keys());
  const [toggled, setToggled] = React.useState(imported);

  function importSchemas() {
    for (let name of toggled) {
      let item = types.find(t => t.id === name);
      let cloned = clone(item.schema);
      cloned.$import = item.id;
      schema.setMapValue('definitions', item.id, cloned);
    }
    setOpen(false);
  }

  function toggle(id: string, isToggled: boolean) {
    let newState = [...toggled];
    if (!isToggled) {
      newState.splice(newState.indexOf(id), 1);
    } else {
      newState.push(id);
    }
    setToggled(newState);
  }

  return (
    <Modal
      open={isOpen}
      trigger={
        <Button
          default
          title="Import shared schema"
          floated="right"
          icon="download"
          size="tiny"
          color="green"
          compact
          onClick={() => setOpen(true)}
        />
      }
    >
      <Modal.Header>
        <Icon name="download" />
        Import globally defined schema
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>Please select one or more schemas to import</p>
          <Form>
            {types.map(t => (
              <Form.Checkbox
                key={t.name}
                disabled={imported.indexOf(t.id) >= 0}
                checked={toggled.indexOf(t.id) >= 0}
                label={t.name}
                onChange={(_e, v) => toggle(t.id, v.checked)}
              />
            ))}
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={importSchemas} icon="download" color="green" content="Import" />
      </Modal.Actions>
    </Modal>
  );
};
