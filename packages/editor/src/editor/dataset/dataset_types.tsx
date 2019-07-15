import * as React from 'react';
import { SchemaDataSet } from '@toryjs/ui';
import { observer } from 'mobx-react';
import { BuildLayer } from './dataset_layer';
import { BuildLayerFolder } from './dataset_folder';
import { AddSchema, ImportSchema } from './dataset_modals';
import { SchemaRecord } from '../editor_types';
import { ToolBox, PaneContent } from '../editor_styles';
type Props = {
  schema: SchemaDataSet;
  types: SchemaRecord[];
};

export const DatasetTypes = observer(({ schema, types }: Props) => {
  return (
    <PaneContent>
      <div className="paneHeader">
        {/* <PanelExpander
          panelClass=".dataPanes"
          storedName="CORPIX.h-split-tools"
          panelConfig={context.leftPanelConfig}
          panelIndex={2}
        />
        <div className="text expandable">Custom Types</div> */}
        <div className="text">Custom Types</div>
        <span />

        <ImportSchema schema={schema} types={types} />
        <AddSchema schema={schema} property="definitions" />
      </div>
      <ToolBox className={'paneBody'}>
        <BuildLayer
          schema={schema}
          items={schema.definitions}
          sourcePath=""
          BuildLayerFolder={BuildLayerFolder}
          ignoreConditions={true}
        />
      </ToolBox>

      {/* <div className={'header secondary'}>
        <span>SHARED</span>
        <ImportSchema schema={schema} types={types} />
      </div>

      <BuildLayer
        schema={schema}
        items={schema.imports}
        sourcePath=""
        BuildLayerFolder={BuildLayerFolder}
        ignoreConditions={true}
      /> */}
    </PaneContent>
  );
});

DatasetTypes.displayName = 'DatasetTypes';
