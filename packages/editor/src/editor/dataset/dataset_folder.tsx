import * as React from 'react';

import { Icon } from 'semantic-ui-react';
import { observer } from 'mobx-react';

import { SchemaDataSet } from '../form_store';
import { DataSet } from '@toryjs/form';
import { toJS, pointer, Context } from '@toryjs/ui';
import { DatasetValue } from './dataset_value';
import { initDrag } from './dataset_drag';

export type FolderProps = {
  schema: SchemaDataSet;
  sourcePath: string;
  name?: string;
  BuildLayer: any;
  isOver?: boolean;
  expanded?: boolean;
  owner: DataSet;
  index: number;
};

export const BuildLayerFolder = observer(
  ({ schema, name, sourcePath, BuildLayer, expanded, isOver, owner, index }: FolderProps) => {
    let [opened, toggleOpen] = React.useState(!!expanded);

    const context = React.useContext(Context);

    let item = schema.reference
      ? schema.reference
      : schema.items && schema.items.reference
      ? schema.items.reference
      : schema.items
      ? schema.items
      : schema;

    let properties = item.properties;
    let icon: any = 'folder'; // item.type !== 'object' ? 'folder outline' : 'folder';
    let canOpen = item.type === 'object';

    const state = context.editor.project.state;
    const value = owner && owner.getValue && toJS(owner.getValue(sourcePath));

    const render = (
      <div data-index={index}>
        <div className="item" {...initDrag(context, schema)}>
          <Icon
            name="caret right"
            className="treeCaret"
            onClick={() => canOpen && toggleOpen(!opened)}
          />
          <Icon
            className={
              pointer +
              ' ' +
              (schema.type === 'array'
                ? 'array'
                : schema.$ref
                ? 'reference'
                : schema.$import
                ? 'import'
                : '')
            }
            title={
              schema.items
                ? 'Array'
                : schema.$ref
                ? 'Local Type'
                : schema.$import
                ? 'Imported, shared type'
                : undefined
            }
            name={opened ? `${icon} open` : icon}
            onClick={() => canOpen && toggleOpen(!opened)}
            color={'yellow'} // {schema.items ? 'yellow' : 'orange'}
          />
          <div className="content">
            <a
              className={`folder  ${schema === state.selectedSchema ? 'selected' : ''} ${
                isOver ? 'over' : ''
              }`}
              onClick={() => {
                state.setSchema(schema, name);
                context.editor.selectedSourcePath = sourcePath;
              }}
            >
              {schema.title || name}

              <DatasetValue value={value} />
              {/* <Label content={config.i18n`Import`} size="tiny" color="yellow" /> */}
            </a>
          </div>
        </div>

        {properties && opened && (
          <div className="itemContent">
            <BuildLayer
              schema={schema}
              items={properties}
              sourcePath={sourcePath ? sourcePath + '.' : ''}
              BuildLayerFolder={BuildLayerFolder}
              owner={owner}
            />
          </div>
        )}
      </div>
    );

    return render;
  }
);

BuildLayerFolder.displayName = 'DatasetFolder';
