import { types, IModelType } from 'mobx-state-tree';
import { UndoManager } from 'mst-middlewares';

import { Schema } from './data_schema_model';
import { FormStore, DataSet } from './form_store';
import { safeEval } from './form_utils';
import { JSONSchema } from './json_schema';

let time = Date.now();
let i = 0;
function shortId() {
  return (time + i++).toString();
}

const PropMap = types.map(
  types.union(types.string, types.number, types.boolean, types.late((): any => PropMap))
);

function mstTypeFactory(desc: Schema, mst: any, definitions: any): any {
  if (desc.$ref) {
    if (desc.$ref === '#') {
      return types.union(types.late(mst), types.undefined, types.null);
    } else {
      let match = desc.$ref.match(/#\/definitions\/(\S+)/);
      if (match) {
        let type = definitions[match[1]];
        if (type) {
          return type;
        } else {
          throw new Error('Could not find definition in your schema: ' + match[1]);
        }
      } else {
        throw new Error('We currently do not support internal references');
      }
    }
  }

  if (desc.expression) {
    return null;
  }

  switch (desc.type) {
    case 'array':
      return types.union(
        types.optional(
          types.array(
            types.optional(mstTypeFactory(desc.items, mst, definitions), desc.items.defaultValue)
          ),
          desc.default || []
        ),
        types.optional(BoundSchema, {})
      );
    case 'string':
      if (desc.format === 'date-time') {
        return types.optional(
          types.union(types.Date, types.string, types.undefined, types.null),
          desc.default || null
        );
      }
      return types.optional(
        types.union(types.string, types.undefined, types.null),
        desc.default || null
      );
    case 'integer':
      return types.optional(
        types.union(types.number, types.string, types.undefined, types.null),
        desc.default || null
      );
    case 'number':
      return types.optional(
        types.union(types.number, types.string, types.undefined, types.null),
        desc.default || null
      );
    case 'boolean':
      return types.optional(
        types.union(types.boolean, types.string, types.undefined, types.null),
        desc.default || null
      );
    case 'object':
      if (!desc.properties) {
        return types.union(
          types.string,
          types.number,
          types.boolean,
          types.null,
          types.undefined,
          types.optional(PropMap, {})
        );
      }
      // if (desc.bound) {
      //   return types.union(types.string, types.number, types.boolean, types.optional(buildTree(desc, definitions), {}));
      // }
      return types.union(
        types.string,
        types.number,
        types.boolean,
        types.null,
        types.undefined,
        types.optional(buildTree(desc, definitions), {})
      );
    case undefined:
      return types.string;
  }
  throw new Error('MST Type not supported: ' + desc.type);
}

function buildTree(schema: Schema, definitions: any, addUndo = false) {
  // prepare model and views

  /* =========================================================
    EXPRESSIONS
    ======================================================== */
  // if (!schema.properties) {
  //   return;
  //   throw new Error('Schema does not contain any properties: ' + JSON.stringify(schema));
  // }

  // extract union types
  // let unionTypes: { [index: string]: any } = {};
  // if (schema.anyOf && schema.anyOf.length > 0) {
  //   for (let option of schema.anyOf) {
  //     if (option.properties) {
  //       for (let property of Object.getOwnPropertyNames(option.properties)) {
  //         if (!unionTypes[property]) {
  //           unionTypes[property] = [];
  //         }

  //         unionTypes[property].push(buildTree(new Schema(option.properties[property])));
  //       }
  //     }
  //   }
  //   // now extract union types
  //   for (let key of Object.getOwnPropertyNames(unionTypes)) {
  //     unionTypes[key] = types.union({ eager: false }, unionTypes[key][0], unionTypes[key][1]);
  //   }
  // }
  const schemaProperties = schema.properties || {};
  const properties = Object.getOwnPropertyNames(schemaProperties);

  const viewDefinition = () => {
    const view = {};

    for (let key of properties) {
      let node = schemaProperties[key];

      // console.log(key + ' ' + node.expression);
      // console.log(node.schema);

      // expressions do not need state tree entry they are evaluated automatically
      if (node.expression) {
        (view as any).__defineGetter__(key, function() {
          // @ts-ignore
          const result = safeEval(this, node.expression);
          if (isNaN(result)) {
            return '#ERROR#';
          }
          return result;
        });
      }
    }

    return view;
  };

  /* =========================================================
      MST Nodes
     ======================================================== */
  const mstDefinition: { [index: string]: any } = {};
  if (addUndo) {
    mstDefinition.history = types.optional(UndoManager, {} as any);
  }

  // build tre

  const mst = FormStore.named('FormStore')
    .props(mstDefinition)
    .props(
      properties.reduce((previous: any, key: string) => {
        let node = schemaProperties[key];
        let definition = mstTypeFactory(node, () => mst, definitions);
        if (definition) {
          previous[key] = types.maybe(definition);
        }
        return previous;
      }, {})
    )
    .views(viewDefinition)
    .actions(self => ({
      getSchema(key: string, throwError = true) {
        let currentSchema = schema;
        let currentProperties = schemaProperties;
        if (!key) {
          return currentSchema;
        }
        if (key && key[0] === '/') {
          key = key.substring(1);
          currentSchema = self.root().getSchema(); // TODO: Possibly this should be set to root
          currentProperties = currentSchema.properties;
        }
        if (key.indexOf('.') >= 0) {
          const parts = key.split('.');
          let property = currentSchema;
          do {
            const first = parts.shift();

            // solve references
            if (property.$ref) {
              let root = schema;
              while (root.parent) {
                root = root.parent;
              }
              const refName = property.$ref.split('/')[2];
              property = root.definitions[refName];
              if (!property) {
                throw new Error('Schema does not contain refrence: ' + refName);
              }
            }
            property = property.items
              ? property.items.properties[first]
              : property.properties
              ? property.properties[first]
              : null;

            if (!property) {
              if (throwError) {
                throw new Error(
                  `Could not find key '${first}' for key '${key}' in schema with properties [${Object.getOwnPropertyNames(
                    schemaProperties
                  ).join(',')}]`
                );
              }
              return null;
            }
          } while (parts.length > 0);
          return property;
        }

        const value = key ? currentProperties[key] : currentSchema;
        if (!value) {
          if (throwError) {
            throw new Error(
              `Could not find key '${key}' in schema with properties [${Object.getOwnPropertyNames(
                currentProperties
              ).join(',')}]`
            );
          }
          return null;
        }
        return value;
      }
    }));

  return mst;
}

const BoundSchema = buildTree(
  new Schema({
    type: 'object',
    properties: {
      value: { type: 'string' },
      handler: { type: 'string' },
      source: { type: 'string' },
      validate: { type: 'string' },
      parse: { type: 'string' }
    }
  }),
  {}
);

type FT = typeof FormStore.Type;

function addDefinitions(external: { [index: string]: any }) {
  let result: { [index: string]: any } = {};
  if (external) {
    let definitionKeys = Object.getOwnPropertyNames(external);
    for (let key of definitionKeys) {
      result[key] = buildTree(external[key] as any, null);
    }
  }
  return result;
}

export function buildStore<T = {}>(
  schema: Schema | JSONSchema,
  mergeDefinitions: { [index: string]: JSONSchema } = {},
  addUndo = true,
  preBuiltDefinitions: { [index: string]: DataSet } = {}
): IModelType<{}, Readonly<T> & FT> {
  if (mergeDefinitions) {
    schema.definitions = { ...(schema.definitions || {}), ...(mergeDefinitions as any) };
  }
  if (!(schema instanceof Schema)) {
    schema = new Schema(schema);
  }
  // prepare internal definitions
  let definitions: { [index: string]: any } = {
    ...addDefinitions(schema.definitions),
    ...preBuiltDefinitions
  };

  // prepare model and views
  return buildTree(schema, definitions, addUndo) as IModelType<{}, Readonly<T> & FT>;
}

export function buildDataSet<T = {}>(
  schema: JSONSchema,
  data: Partial<T> = {},
  addUndo = false
): FT & T {
  let dataSet = buildStore<T>(new Schema(schema)).create(data);
  return dataSet as FT & T;
}
