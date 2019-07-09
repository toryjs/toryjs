// import * as jsf from 'json-schema-faker';
import { FormElement } from '@toryjs/form';
import { ContextType, EditorContext } from '@toryjs/ui';

export { Theme } from './themes/common';

export function randomData(_context: ContextType) {
  // const form = formDatasetToJS(context.project.state.selectedForm);
  // let cleaned = schemaDatasetToJS(context.schema, true);

  // const data = jsf.generate(cleaned);
  // return new FormModel(form, cleaned, data);
  return {};
}

export function root(schema: DynamicForm.SchemaDataSet) {
  let parent = schema;
  while (parent.parent != null) {
    parent = parent.parent as DynamicForm.SchemaDataSet;
  }
  return ((parent as unknown) as DynamicForm.ProjectDataSet).schema;
}

let id = 0;
export function generateId() {
  return (id++).toString();
}

export function generateUid() {
  return Date.now().toString();
}

export function createPath(element: FormElement, context: EditorContext) {
  let stringPath = element.props.value ? element.props.value.source : null;

  let parent = element.parent;
  while (parent != null && parent.props) {
    let parentDefinition = context.editorCatalogue.components[parent.control];
    if (
      parentDefinition &&
      parentDefinition.valueProvider &&
      parent.props[parentDefinition.valueProvider] &&
      parent.props[parentDefinition.valueProvider].source != null
    ) {
      stringPath = parent.props.value.source + '.' + stringPath;
    }
    parent = parent.parent;
  }
  return stringPath.split('.');
}

function findSchemaByPath(path: string[], schema: DynamicForm.SchemaDataSet) {
  for (let i = 0; i < path.length; i++) {
    schema =
      schema.type === 'array'
        ? schema.items.reference
          ? schema.items.reference.properties.get(path[i])
          : schema.items.properties.get(path[i])
        : schema.reference
        ? schema.reference.properties.get(path[i])
        : schema.properties
        ? schema.properties.get(path[i])
        : null;
  }
  return schema;
}

const omitProps = ['dataPropData', 'dataPropFirst'];

export function findSchema(
  element: FormElement,
  schema: DynamicForm.SchemaDataSet,
  context: EditorContext
) {
  // build the path to the current element and find the active schema
  if (element && element.props.value && element.props.value.source) {
    if (element.props.value.source[0] === '/') {
      return findSchemaByPath(element.props.value.source.substring(1).split('.'), schema);
    } else {
      const path = createPath(element, context);
      if (omitProps.every(p => path.indexOf(p) === 0)) {
        return findSchemaByPath(path, schema);
      }
    }
  }
  return null;
}

export function findParentSchema(
  element: FormElement,
  schema: DynamicForm.SchemaDataSet,
  context: EditorContext
) {
  // build the path to the current element and find the active schema
  if (element && element.props.value && element.props.value.source) {
    let path = createPath(element, context);
    path.pop();
    if (omitProps.every(p => path.indexOf(p) === 0)) {
      return findSchemaByPath(path, schema);
    }
  }
  return null;
}
