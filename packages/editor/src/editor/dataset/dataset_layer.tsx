import * as React from 'react';

import { BuildLayerItem } from './dataset_item';
import { IMSTMap, ISimpleType } from 'mobx-state-tree';
import { observer } from 'mobx-react';
import { BuildLayerFolder } from './dataset_folder';
import { List } from 'semantic-ui-react';
import { config, DataSet } from '@toryjs/form';
import { Context, SchemaDataSet, pointer } from '@toryjs/ui';

export type LayerProps = {
  schema: SchemaDataSet;
  items: IMSTMap<ISimpleType<SchemaDataSet>>;
  sourcePath: string;
  name?: string;
  BuildLayerFolder?: any;
  ignoreConditions?: boolean;
  owner?: DataSet;
};

type ConditionProps = {
  name: string;
  conditions: SchemaDataSet[];
  sourcePath: string;
};

type ConditionParams = {
  condition: SchemaDataSet;
  index: number;
  sourcePath: string;
};

export const Condition: React.FC<ConditionParams> = observer(
  ({ condition: c, index: i, sourcePath }) => {
    const context = React.useContext(Context);
    return (
      <List.Item>
        <List.Icon name={c.properties ? 'folder' : 'folder outline'} color="yellow" />
        <List.Content>
          <List.Description
            as="a"
            className={
              pointer + ' ' + (c === context.editor.project.state.selectedSchema ? 'selected' : '')
            }
            onClick={() => context.editor.project.state.setSchema(c, '')}
          >
            {c.title || config.i18n`condition ${i + 1}`}
          </List.Description>
          {c.type === 'object' && (
            <List.List>
              <BuildLayer
                schema={c}
                items={c.properties}
                sourcePath={sourcePath}
                BuildLayerFolder={BuildLayerFolder}
                owner={null}
              />
            </List.List>
          )}
        </List.Content>
      </List.Item>
    );
  }
);

const BuildCondition = observer(({ name, conditions, sourcePath }: ConditionProps) => {
  let [opened, toggleOpen] = React.useState(false);

  if (!conditions || conditions.length == 0) {
    return null;
  }
  return (
    <List.Item>
      <List.Icon name="code branch" className={pointer} onClick={() => toggleOpen(!opened)} />
      <List.Content>
        <List.Header className={pointer} onClick={() => toggleOpen(!opened)}>
          {name}
        </List.Header>
        {opened && (
          <List.List>
            {conditions.map((c, i) => (
              <Condition key={i} index={i} condition={c} sourcePath={sourcePath} />
            ))}
          </List.List>
        )}
      </List.Content>
    </List.Item>
  );
});

export const BuildLayer: React.FC<LayerProps> = observer(
  ({ schema, items, sourcePath, BuildLayerFolder, ignoreConditions, owner }) => {
    let controls: JSX.Element[] = [];
    let keys: string[] = [];

    for (let key of Array.from(items.keys())) {
      keys.push(key as string);
    }

    keys = keys.sort((a, b) => {
      let vA: SchemaDataSet = items.get(a);
      let vB: SchemaDataSet = items.get(b);

      return (vA.type === 'object' || vA.type === 'array') &&
        (vB.type !== 'array' && vB.type !== 'object')
        ? -1
        : (vB.type === 'object' || vB.type === 'array') &&
          (vA.type !== 'array' && vA.type !== 'object')
        ? 1
        : a.localeCompare(b, 'en-US', { numeric: true });
    });

    // let sortedOwner = { ...schema, properties: {} as any };
    // keys.forEach(key => (sortedOwner.properties[key] = items.get(key)));

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      let value: SchemaDataSet = items.get(key);
      controls.push(
        value.type === 'object' || (value.items && value.items.type === 'object') ? (
          <BuildLayerFolder
            BuildLayer={BuildLayer}
            key={key}
            schema={value}
            name={key}
            sourcePath={sourcePath + key}
            owner={owner}
            index={i}
          />
        ) : (
          <BuildLayerItem
            key={key}
            schema={value}
            name={key}
            sourcePath={sourcePath + key}
            parentSchema={schema}
            owner={owner}
            index={i}
          />
        )
      );
    }
    return (
      <div>
        {controls}

        {!ignoreConditions && (
          <>
            <BuildCondition name={'oneOf'} conditions={schema.oneOf} sourcePath={sourcePath} />
            <BuildCondition name={'allOf'} conditions={schema.allOf} sourcePath={sourcePath} />
            <BuildCondition name={'anyOf'} conditions={schema.anyOf} sourcePath={sourcePath} />
          </>
        )}
      </div>
    );
  }
);

BuildLayer.displayName = 'DatasetLayer';
