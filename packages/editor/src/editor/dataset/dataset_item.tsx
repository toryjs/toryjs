import * as React from 'react';

import { SemanticCOLORS, Icon } from 'semantic-ui-react';

import { SchemaDataSet } from '../form_store';
import { JSONSchema7Type } from '@toryjs/form';
import { observer } from 'mobx-react';
import { DatasetValue } from './dataset_value';
import { dragStart, dragEnd } from './dataset_drag';
import { Context } from '@toryjs/ui';

type LayerProps = {
  schema: SchemaDataSet;
  name?: string;
  sourcePath: string;
  isDragging?: boolean;
  parentSchema: SchemaDataSet;
  owner?: any;
  index: number;
};

function typeToColor(type: JSONSchema7Type): SemanticCOLORS {
  switch (type) {
    case 'string':
      return 'green';
    case 'integer':
      return 'orange';
    case 'number':
      return 'red';
    case 'boolean':
      return 'blue';
    case 'array':
      return 'yellow';
    default:
      return 'grey';
  }
}

export const BuildLayerItem: React.FC<LayerProps> = observer(
  ({ schema, name, sourcePath, parentSchema, owner, index }) => {
    const context = React.useContext(Context);
    const onDragStart = dragStart(context, schema);
    const onDragEnd = dragEnd(context);
    const state = context.editor.project.state;
    const value = owner && owner.getValue && owner.getValue(name);
    return (
      <div
        className="item single"
        data-index={index}
        draggable={true}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <Icon
          name={schema.type === 'array' ? 'folder' : 'file outline'}
          className={schema.type}
          color={typeToColor(schema.type)}
        />
        <div
          className={'link ' + (schema === state.selectedSchema ? 'selected' : '')}
          onMouseDown={() => {
            state.setSchema(schema, name);
            context.editor.selectedParentSchema = parentSchema;
            context.editor.selectedSourcePath = sourcePath;
          }}
        >
          {schema.title || name} <DatasetValue value={value} />
        </div>
      </div>
    );
  }
);
