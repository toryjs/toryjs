import * as styles from '../editor_styles';

import { debounce } from '@tomino/toolbelt';
import { JSONSchema, FormComponentProps } from '@toryjs/form';

import React from 'react';
import names from 'classnames';
import { SplitPane } from 'react-multi-split-pane';
import { onSnapshot } from 'mobx-state-tree';

import { List } from '../editor_styles';
import { PaneContent } from '../editor_styles';
import { PropertyEditor } from '../properties/property_view';
import { EditorContext } from '../editor_context';
import { EditorState } from '../editor_state';
import { DatasetElements } from '../dataset/dataset_elements';
import { DatasetTypes } from '../dataset/dataset_types';
import { schemaDatasetToJS, setValue, getValue } from '../../helpers';
import { DynamicComponent } from '../../components/dynamic_component';

export type Props = {
  theme: any;
  height: string;
  parseHandler: string;
  allowCustomTypes: boolean;
  source: string;
};

const emptySchema = JSON.stringify({ type: 'object', properties: {} });

function getSize(key: string, def: number[]) {
  try {
    return JSON.parse(localStorage.getItem(key)) || def;
  } catch {}
  return def;
}

export const DatasetEditor: React.FC<FormComponentProps<Props>> = controlProps => {
  const context = new EditorState();
  const props = controlProps.formElement.props || ({} as Props);
  let schema: JSONSchema;

  // debounced callback will always remember our value
  const saveSchema = React.useCallback(
    debounce((snap: JSONSchema) => {
      setValue(controlProps, context, JSON.stringify(schemaDatasetToJS(snap, false)), 'source');
    }, 1000),
    [controlProps.owner, controlProps.formElement]
  );

  try {
    schema = JSON.parse(getValue(controlProps, context, 'source', emptySchema));

    // load into context
    context.load(
      {
        schema
      },
      false
    );
  } catch (ex) {
    return <div>Error parsing schema: {ex.message}</div>;
  }

  // listen to snapshot and save when needed
  onSnapshot(context.schema as any, saveSchema);

  return (
    <DynamicComponent
      {...controlProps}
      style={{
        minHeight: props.height || '400px',
        resize: 'vertical',
        position: 'relative',
        border: '1px solid',
        overflowY: 'scroll'
      }}
    >
      <EditorContext.Provider value={context}>
        <SplitPane
          className={names(styles.editorGrid)}
          split="vertical"
          minSize={100}
          defaultSize={getSize('CORPIX.s-split', [280])}
          onDragFinished={size => localStorage.setItem('CORPIX.s-split', JSON.stringify(size))}
        >
          <PaneContent>
            <List>
              {props.allowCustomTypes ? (
                <SplitPane
                  className="dataPanes"
                  split="horizontal"
                  minSize={100}
                  defaultSize={getSize('CORPIX.s1-split-tools', [280])}
                  onDragFinished={size =>
                    localStorage.setItem('CORPIX.s1-split-tools', JSON.stringify(size))
                  }
                >
                  <DatasetElements
                    schema={context.schema}
                    types={context.types}
                    owner={context.data}
                  />
                  <DatasetTypes schema={context.schema} types={context.types} />
                </SplitPane>
              ) : (
                <DatasetElements
                  schema={context.schema}
                  types={context.types}
                  owner={context.data}
                />
              )}
            </List>
          </PaneContent>
          <PropertyEditor />
        </SplitPane>
      </EditorContext.Provider>
    </DynamicComponent>
  );
};
