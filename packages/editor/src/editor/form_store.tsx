import {
  JSONSchema,
  buildStore,
  initUndoManager,
  EditorComponentCatalogue,
  Schema,
  PropMap
} from '@toryjs/form';
import { UndoManager } from 'mst-middlewares';
import { types, IAnyModelType } from 'mobx-state-tree';

import { SchemaRecord } from './editor_types';
import { root, findParentSchema } from './editor_common';
import { elementSchema, schemaSchema } from './common_schemas';
import { toJS } from 'mobx';
import { schemaDatasetToJS, ls, IProject, boundSchema, EditorContext } from '@toryjs/ui';

import { FormDataSet, SchemaDataSet, LeftPane, ProjectDataSet, StateDataSet } from '@toryjs/ui';

let undoSet = false;

// add advanced properties
// till i will be able to add a multiple properties
// TODO: once I will enable type unions in schema this will go

/* =========================================================
    Utility methods
   ======================================================== */

function mergeProp(
  schema: JSONSchema,
  localTypes: { [index: string]: JSONSchema },
  sharedTypes: SchemaRecord[]
) {
  let item = { ...schema };
  if (item.properties) {
    item.properties = mergeProperties(item, localTypes, sharedTypes);
  }
  if (item.$import) {
    item.reference = sharedTypes.find(t => t.id === item.$import).id;
  }
  if (item.$ref) {
    item.reference = item.$ref.split('/')[2];
  }
  return item;
}

function mergeProperties(
  schema: JSONSchema,
  localTypes: { [index: string]: JSONSchema },
  sharedTypes: SchemaRecord[]
) {
  let keys = Object.getOwnPropertyNames(schema.properties);
  let newProperties: { [index: string]: JSONSchema } = {};

  for (let key of keys) {
    let prop = mergeProp(schema.properties[key], localTypes, sharedTypes);
    newProperties[key] = mergeSchema(prop, localTypes, sharedTypes);
  }
  return newProperties;
}

function mergeSchema(
  schema: JSONSchema,
  localTypes: { [index: string]: JSONSchema },
  sharedTypes: SchemaRecord[]
): JSONSchema {
  let newSchema = { ...schema };

  if (schema.properties) {
    newSchema.properties = mergeProperties(schema, localTypes, sharedTypes);
  }
  if (schema.items) {
    newSchema.items = mergeProp(newSchema.items, localTypes, sharedTypes);
  }

  return newSchema;
}

export function searchJsonSchema(func: (item: JSONSchema) => any, schema: JSONSchema) {
  let queue = [schema];
  while (queue.length) {
    let current = queue.pop();
    if (!current.properties) {
      continue;
    }
    for (let key of Object.getOwnPropertyNames(current.properties)) {
      let property = current.properties[key];
      if (property.properties) {
        queue.push(property);
      }
      let result = func(property);
      if (result) {
        return result;
      }
    }
  }
}

export function searchSchema(schema: SchemaDataSet, func: (item: SchemaDataSet) => any) {
  let queue = [schema];
  while (queue.length) {
    let current = queue.pop();
    if (!current.properties) {
      continue;
    }
    for (let key of Array.from(current.properties.keys())) {
      let property = current.properties.get(key);
      if (property.properties) {
        queue.push(property);
      }
      let result = func(property);
      if (result) {
        return result;
      }
    }
  }
}

export function searchForm(form: FormDataSet, func: (item: FormDataSet) => any) {
  let queue = [form];
  while (queue.length) {
    let current = queue.pop();
    for (let element of current.elements) {
      if (element && element.elements) {
        queue.push(element);
      }
      let result = func(element);
      if (result) {
        return result;
      }
    }
  }
}

function assignArrayIds(schema: JSONSchema, schemas: SchemaRecord[]) {
  let s: any = schema;
  s.imports = {};

  // import all used schemas
  // do not import unused schemas
  searchJsonSchema(property => {
    if (property.$import) {
      let item = schemas.find(s => s.id === property.$import);
      s.imports[item.id] = item.schema;
    }
  }, schema);
}

/* =========================================================
    Stores
   ======================================================== */

function assignSource(props: any) {
  Object.getOwnPropertyNames(props).forEach(key => {
    // 'checked'
    props[key].control.props = {
      [props[key].schema.type === 'boolean' ? 'value' : 'value']: { source: key },
      ...props[key].control.props
    };
  });
}

function buildProps(props: PropMap, extraProps = {}) {
  // assign the default source
  assignSource(props);

  // build schema
  let schema = new Schema({
    type: 'object',
    properties: { ...buildPropSchema(props), ...extraProps }
  });
  return buildStore(schema, {}, false);
}

function buildPropSchema(props: PropMap) {
  let result: { [index: string]: JSONSchema } = {};
  for (let key of Object.getOwnPropertyNames(props)) {
    result[key] = props[key].schema;
  }
  return result;
}

type IState = {
  editorCatalogue: EditorComponentCatalogue;
  selectedParentSchema: SchemaDataSet;
  selectedSourcePath: string;
  recomputeDataBounce(): void;
  types: SchemaRecord[];
  schema: SchemaDataSet;
  form: FormDataSet;
  project: ProjectDataSet;
  state: StateDataSet;
  undoManager: {
    undo(): void;
    redo(): void;
  };
};

export function prepareStores(context: IState) {
  let id = 0;
  let date = Date.now();

  function generateId() {
    if (process.env.NODE_ENV === 'test') {
      return (id++).toString();
    }
    return (date + id++).toString();
  }

  let objectMap: { [index: string]: any } = {};

  const mapModifiers = (self: any) => ({
    afterCreate() {
      objectMap[self.uid] = self;
    },
    beforeDestroy() {
      delete objectMap[self.uid];
    }
  });

  const referenceHandlers = {
    get(identifier: string) {
      return objectMap[identifier] || null;
    },
    // given a user, produce the identifier that should be stored
    set(value: any /* User */) {
      return value.uid;
    }
  };

  const props: { [index: string]: any } = {};
  const propNames: { [index: string]: string[] } = {};
  let childProps: JSONSchema = {
    properties: {
      control: { type: 'string' },
      label: boundSchema(),
      css: boundSchema(),
      className: boundSchema(),
      hidden: boundSchema(),
      editorLabel: { type: 'string' },
      locked: { type: 'boolean' }
    }
  };

  // find all child props
  let childPropStore = buildStore(new Schema({ type: 'object', properties: {} }), {}, false);
  // const emptyStore = buildStore(new Schema({ type: 'object', properties: {} }), {}, false);

  if (context.editorCatalogue) {
    for (let key of Object.getOwnPropertyNames(context.editorCatalogue.components)) {
      let c = context.editorCatalogue.components[key];
      if (c.childProps) {
        // assign default source
        assignSource(c.childProps);

        // build schems
        childProps = { properties: { ...childProps.properties, ...buildPropSchema(c.childProps) } };
      }
    }

    // this is a generic store for all element
    // if element does not define its own prop, it defines at least these props
    childPropStore = buildStore(
      new Schema({ type: 'object', properties: childProps.properties }),
      {},
      false
    );

    // build control prop stores
    for (let key of Object.getOwnPropertyNames(context.editorCatalogue.components)) {
      let c = context.editorCatalogue.components[key];
      if (c.props) {
        props[key] = buildProps(c.props, childProps.properties);
        propNames[key] = Object.keys(c.props).concat(Object.keys(childProps.properties));
      }
    }
  }

  const elementStore = buildStore(elementSchema, {}, false)
    .props({
      uid: types.optional(types.string, generateId),
      props: types.optional(
        types.union({
          dispatcher: snapshot => {
            if (!snapshot || !snapshot.control) {
              // console.warn('No control props detected ...');
              return childPropStore;
            }
            return props[snapshot.control] || childPropStore;
          }
        }),
        {}
      ),
      // sourceRef: types.maybe(types.reference(types.late((): IAnyModelType => elementStore), referenceHandlers)),
      elements: types.optional(
        types.array(
          types.maybe(types.union(types.late((): IAnyModelType => elementStore), types.null))
        ),
        []
      ),
      pages: types.optional(
        types.array(
          types.maybe(types.union(types.late((): IAnyModelType => elementStore), types.null))
        ),
        []
      ),
      isSelected: types.optional(types.boolean, false)
    })
    .actions(mapModifiers)
    .actions(() => ({
      moveElement(from: FormDataSet, to: FormDataSet, index: number) {
        from.parent.detach(from);
        // from.detach(from);
        if (index != null && index >= 0) {
          to.insertRow('elements', index, toJS(from));
        } else {
          to.addRow('elements', toJS(from));
        }
      }
    }));

  // const formStore = buildStore(elementSchema, {}, false, {
  //   formElement: elementStore as any
  // });
  const schemaStore = buildStore(schemaSchema, {}, false)
    .actions(mapModifiers)
    .props({
      uid: types.optional(types.string, generateId),
      properties: types.maybe(types.map(types.late((): IAnyModelType => schemaStore))),
      items: types.maybe(types.late((): IAnyModelType => schemaStore)),
      reference: types.maybe(
        types.reference(types.late((): IAnyModelType => schemaStore), {
          get(identifier: string, parent: SchemaDataSet) {
            let root: SchemaDataSet = (parent.root() as any).schema;
            if (!root) {
              return {};
            }
            // find in types
            let key = Array.from(root.definitions.keys()).find(f => f === identifier);
            if (key) {
              return root.definitions.get(key);
            }
            // find in imports
            key = Array.from(root.imports.keys()).find(f => f === identifier);
            if (key) {
              return root.imports.get(key);
            }
            throw new Error('Could not find reference to: ' + identifier);
          },
          // given a user, produce the identifier that should be stored
          set(value: SchemaDataSet /* User */) {
            let root: SchemaDataSet = (value.root() as any).schema;
            if (!root) {
              return '';
            }

            let key = Array.from(root.definitions.keys()).find(
              f => root.definitions.get(f) === value
            );
            if (key) {
              return key;
            }
            // find in imports
            key = Array.from(root.imports.keys()).find(f => root.imports.get(f) === value);
            if (key) {
              return key;
            }
            throw new Error('WTF');
          }
        })
      ),
      definitions: types.optional(types.map(types.late((): IAnyModelType => schemaStore)), {}),
      imports: types.optional(types.map(types.late((): IAnyModelType => schemaStore)), {}),
      anyOf: types.optional(types.array(types.late((): IAnyModelType => schemaStore)), []),
      allOf: types.optional(types.array(types.late((): IAnyModelType => schemaStore)), []),
      oneOf: types.optional(types.array(types.late((): IAnyModelType => schemaStore)), []),
      errorMessage: types.maybe(
        types.union(types.string, types.map(types.union(types.string, types.map(types.string))))
      )
    })
    .volatile(self => ({
      name() {
        let parent: SchemaDataSet = self.parent as any;
        let key = Array.from(parent.properties.keys()).find(
          k => parent.properties.get(k) === (self as any)
        );
        if (key) {
          return key;
        }
        return 'unknownArgMessage';
      }
    }))
    .actions(self => ({
      changeType: (value: string, prev: string) => {
        const owner = (self as unknown) as SchemaDataSet;

        owner.setValue('$ref', null);
        owner.setValue('$import', null);
        owner.setValue('reference', undefined);
        owner.setValue('type', value);

        // atomic types do not need to be handled
        if (['string', 'number', 'integer', 'boolean'].indexOf(value) >= 0) {
          owner.setValue('properties', undefined);
          owner.setValue('items', undefined);
          return;
        }

        if (value === 'array' && prev !== 'array') {
          owner.setValue('items', { type: 'object', properties: {} });
          return;
        }

        if (value === 'object') {
          if (!owner.getValue('properties')) {
            owner.setValue('properties', {});
          }
          return;
        }

        let elementRoot = root(owner);

        let localTypes = Array.from(elementRoot.definitions.keys());
        if (localTypes.indexOf(value) >= 0) {
          owner.setValue('reference', value);
          owner.setValue('$ref', `#/definitions/${value}`);
          owner.setValue('type', 'object');
          return;
        }

        let imports = Array.from(elementRoot.imports.keys());
        if (imports.indexOf(value) >= 0) {
          owner.setValue('reference', value);
          owner.setValue('$import', value);
          owner.setValue('type', 'object');
          return;
        }
      }
    }));

  const stateStore = types
    .model({
      selectedForm: types.maybe(types.reference(elementStore, referenceHandlers)),
      selectedSchema: types.maybe(types.reference(schemaStore, referenceHandlers)),
      selectedSchemaName: types.maybe(types.string),
      selectedElement: types.maybe(types.reference(elementStore, referenceHandlers)),
      selectedLeftPane: types.optional(types.string, ls.getItem('CORPIX_LEFT') || 'pages')
    })
    .actions(self => ({
      setForm(element: FormDataSet) {
        self.selectedSchema = undefined;
        self.selectedElement = element as any;
        self.selectedForm = element as any;
      },
      setSchema(schema: any, name: string = '') {
        self.selectedSchema = schema;
        self.selectedSchemaName = name;
        self.selectedElement = undefined;
      },
      setElement(element: FormDataSet, schema: SchemaDataSet) {
        self.selectedSchema = undefined;
        if (self.selectedElement) {
          self.selectedElement.setValue('isSelected', false);
        }
        self.selectedElement = element as any;
        self.selectedElement.setValue('isSelected', true);
        context.selectedParentSchema = findParentSchema(element, schema, context as EditorContext);
      },
      changeLeftPane(view: LeftPane) {
        ls.setItem('CORPIX_LEFT', view);
        self.selectedLeftPane = view;
      }
    }))
    .actions(self => ({
      deleteActiveSchema() {
        self.selectedSchema.parent.detach(self.selectedSchema);
        self.setSchema(undefined, undefined);
      },
      deleteActiveElement() {
        if (
          self.selectedElement.parent &&
          self.selectedElement.parent.parent &&
          self.selectedElement.parent.parent.getValue('control') === 'Table'
        ) {
          self.selectedElement.parent.replaceRow(
            'elements',
            self.selectedElement.parent.getValue('elements').indexOf(self.selectedElement),
            null
          );
        } else {
          self.selectedElement.parent.detach(self.selectedElement);
        }

        self.selectedElement = undefined;
      }
    }));

  const projectStore = types
    .model({
      // id: types.string,
      uid: types.optional(types.string, generateId),
      form: elementStore,
      schema: schemaStore,
      state: stateStore,
      history: types.optional(UndoManager, {} as any)
    })
    .actions(self => ({
      renameSchema: (name: string, rootSchema: SchemaDataSet) => {
        // TODO: Represnt schema elements as array
        let selected = self.state.selectedSchema;
        let owner = selected.reference ? selected.reference : selected;
        let parent: SchemaDataSet = owner.parent as any;
        let sourcePath = context.selectedSourcePath;
        let titleOnly =
          !sourcePath || (parent.definitions.has(sourcePath) && rootSchema === parent);

        let current = self.state.selectedSchema;

        // we are modifying a data type name
        // this is only a title change, not a map
        if (titleOnly) {
          current.setValue('title', name);
          return;
        }

        if (parent.properties.has(name)) {
          current.setError('title', 'Element with this name already exists!');
          return;
        }

        // rename all references in the form

        let newSourcePathParts = sourcePath.split('.');
        newSourcePathParts.pop();
        let newSourcePath = newSourcePathParts.concat(name).join('.');

        context.selectedSourcePath = newSourcePath;

        searchForm(self.form as any, item => {
          // change props
          for (let prop of propNames[item.control]) {
            let p = item.props[prop];
            if (p && p.source && p.source.indexOf(sourcePath) >= 0) {
              p.setValue('source', p.source.replace(sourcePath, newSourcePath));
            }
          }
        });

        const data: any = schemaDatasetToJS(current);
        parent.properties.set(name, data);

        let newValue = parent.properties.get(name);
        newValue.setValue('title', name);
        self.state.setSchema(newValue, name);

        parent.detach(current);
      }
    }));

  return function buildFormEditorDataset(project: IProject): ProjectDataSet {
    // add globals to schema
    let { schema = {}, form = {}, uid } = project;

    assignArrayIds(schema, context.types);
    // prepare schemas

    if (schema) {
      schema = mergeSchema(schema, schema.definitions, context.types);
    } else {
      schema = {};
    }

    let s = projectStore.create({ form, schema, state: {}, uid } as any);

    // select the main form by default

    if (form) {
      const currentForm = ls.getItem('CORPIX_SELECTED_FORM');
      if (currentForm && s.form.pages.some(p => p.uid === currentForm)) {
        s.state.setForm(s.form.pages.find(p => p.uid === currentForm));
      } else {
        s.state.setForm(s.form as any);
      }
    }

    context.form = s.form as any;
    context.schema = s.schema as any;
    context.project = s as any;
    context.state = s.state as any;

    if (!undoSet) {
      context.undoManager = initUndoManager(s as any);

      (global as any).__state = s;
      undoSet = true;
    }

    return (s as unknown) as ProjectDataSet;
  };
}
