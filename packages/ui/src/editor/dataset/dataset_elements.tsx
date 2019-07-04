import * as React from 'react';
import { observer } from 'mobx-react';

import { SchemaDataSet } from '../form_store';
import { BuildLayer } from './dataset_layer';
import { BuildLayerFolder } from './dataset_folder';
import { PaneContent, ToolBox } from '../editor_styles';
import { AddSchema } from './dataset_modals';
import { Dropdown, Modal, Header, Button, Table } from 'semantic-ui-react';
import { DataSet } from '@toryjs/form';
import { EditorContext, EditorContextType } from '../editor_context';
import { toJS } from '../../common';

type Props = {
  schema: SchemaDataSet;
  selectedSchema?: SchemaDataSet;
  owner: DataSet;
};

function addCondition(schema: SchemaDataSet, collection: string, editorState: EditorContextType) {
  (schema || editorState.project.state.selectedSchema).addRow(collection, { type: 'object' });
}

export const RootElement: React.FC<Props> = ({ schema }) => {
  const editorState = React.useContext(EditorContext);

  return (
    <a
      onClick={() => editorState.project.state.setSchema(schema, '')}
      className={`${schema === editorState.project.state.selectedSchema ? 'selected' : ''}`}
    >
      ROOT
    </a>
  );
};

function keys(obj: any) {
  if (obj == null) {
    return [];
  }
  return Object.keys(obj).filter(k => k !== 'errors');
}

function previewValue(value: any) {
  if (Array.isArray(value)) {
    if (value.length > 0) {
      return <ArrayPreview value={value} />;
    }
    return null;
  }
  if (typeof value === 'object') {
    return <ObjectPreview value={value} />;
  }
  return value;
}

const ObjectPreview = ({ value }: any) => (
  <Table striped>
    <Table.Header>
      {keys(value).map((k, i) => (
        <Table.HeaderCell key={k + i}>{k}</Table.HeaderCell>
      ))}
    </Table.Header>
    <Table.Body>
      <Table.Row>
        {keys(value).map((k, i) => (
          <Table.Cell key={k + i}>{previewValue(k)}</Table.Cell>
        ))}
      </Table.Row>
    </Table.Body>
  </Table>
);

const ArrayPreview = ({ value }: any) => (
  <Table striped>
    <Table.Header>
      {keys(value[0]).map((k, i) => (
        <Table.HeaderCell key={k + i}>{k}</Table.HeaderCell>
      ))}
    </Table.Header>
    <Table.Body>
      {value.map((v: any, j: any) => (
        <Table.Row key={j}>
          {keys(v).map((k, i) => (
            <Table.Cell key={k + i}>{previewValue(v[k])}</Table.Cell>
          ))}
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
);

const DataPrevieModal = observer(() => {
  const state = React.useContext(EditorContext);
  const close = React.useCallback(() => (state.previewOpen = false), [state.previewOpen]);
  return (
    <Modal open={state.previewOpen} onClose={close}>
      <Header icon="browser" content="Data Preview" />
      <Modal.Content>{previewValue(toJS(state.dataPreview))}</Modal.Content>
      <Modal.Actions>
        <Button color="green" onClick={close} inverted>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
});

export const DatasetElements = observer(({ schema, owner }: Props) => {
  const editorState = React.useContext(EditorContext);

  if (!owner || !owner.getValue) {
    return <div>Loading ...</div>;
  }
  return (
    <PaneContent>
      <DataPrevieModal />
      <div className="paneHeader">
        {/* <PanelExpander
          panelClass=".dataPanes"
          storedName="CORPIX.h-split-tools"
          panelConfig={editorState.leftPanelConfig}
          panelIndex={1}
        />
        <div className="text expandable">Data</div> */}
        <div className="text">Data</div>
        <span />
        <Dropdown
          button
          className="icon tiny"
          icon="code branch"
          compact
          size="tiny"
          pointing="top right"
        >
          <Dropdown.Menu>
            <Dropdown.Item
              content="All Of"
              onClick={() => addCondition(schema, 'allOf', editorState)}
            />
            <Dropdown.Item
              content="Any Of"
              onClick={() => addCondition(schema, 'anyOf', editorState)}
            />
            <Dropdown.Item
              content="One Of"
              onClick={() => addCondition(schema, 'oneOf', editorState)}
            />
          </Dropdown.Menu>
        </Dropdown>

        <AddSchema schema={schema} property="properties" />
      </div>
      <ToolBox>
        <BuildLayerFolder
          expanded={true}
          BuildLayer={BuildLayer}
          schema={schema}
          name={'root'}
          sourcePath={''}
          owner={owner}
          index={0}
        />
        {/* <BuildLayer
          schema={schema}
          items={schema.properties}
          sourcePath=""
          BuildLayerFolder={BuildLayerFolder}
          ignoreConditions={false}
        /> */}
      </ToolBox>
    </PaneContent>
  );
});

DatasetElements.displayName = 'DatasetElements';
