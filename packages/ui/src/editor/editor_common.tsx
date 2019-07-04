// import * as jsf from 'json-schema-faker';
import { JSONSchema, FormElement, PropMap } from '@toryjs/form';

import { JSONSchema7TypeName } from '@toryjs/form';
import { Processor } from './drag_drop';
import { boundSchema } from './common_schemas';
import { Prop } from '@toryjs/form';

export { Theme } from './themes/common';

export function randomData(_editorState: DynamicForm.EditorContextType) {
  // const form = formDatasetToJS(editorState.project.state.selectedForm);
  // let cleaned = schemaDatasetToJS(editorState.schema, true);

  // const data = jsf.generate(cleaned);
  // return new FormModel(form, cleaned, data);
  return {};
}

function assignControl(control: FormElement, schema: JSONSchema) {
  if (!control.control) {
    if (schema.type === 'boolean') {
      control.control = 'Checkbox';
    } else if (schema.$enum) {
      control.control = 'Select';
    }
  }
}

export function root(schema: DynamicForm.SchemaDataSet) {
  let parent = schema;
  while (parent.parent != null) {
    parent = parent.parent as DynamicForm.SchemaDataSet;
  }
  return ((parent as unknown) as DynamicForm.ProjectDataSet).schema;
}

function makeLabel(key: string) {
  let label = key[0].toUpperCase() + key.substring(1);
  for (let i = label.length - 1; i > 0; i--) {
    if (label[i].match(/[A-Z]/)) {
      label = label.substring(0, i) + ' ' + label.substring(i);
    }
  }
  return label;
}

export function propGroup(groupName: string, props: PropMap) {
  for (let key of Object.keys(props)) {
    props[key].control.group = groupName;

    if (!props[key].control.props) {
      props[key].control.props = {};
    }
    if (props[key].control.props.label == null) {
      props[key].control.props.label = makeLabel(key);
    }
  }
  return props;
}

type PropDefintion = FormElement &
JSONSchema & { label?: string; display?: 'inline' | 'fullWidth' | 'group' };

export function tableProp(props: PropDefintion, text: string, extraColumns: FormElement[] = []) {
  return prop({
    control: 'Table',
    props: { text, label: props.label },
    display: 'group',
    elements: [
      {
        control: 'Input',
        props: { placeholder: 'Value', value: { source: 'value' }, label: 'Value' }
      },
      {
        control: 'Input',
        props: { placeholder: 'Text', value: { source: 'text' }, label: 'Text' }
      },
      ...extraColumns
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        text: { type: 'string' },
        value: { type: 'string' },
        icon: { type: 'string' }
      }
    },
    ...props
  });
}

export function gapProp(propDefinition: PropDefintion) {
  return prop({
    control: 'Select',
    documentation: 'Spacing between cells',
    group: 'Basic',
    props: { label: 'Gap' },
    $enum: [
      {
        text: 'None',
        value: '0px'
      },
      {
        text: 'Tiny',
        value: '3px'
      },
      {
        text: 'Small',
        value: '6px'
      },
      {
        text: 'Normal',
        value: '12px'
      },
      {
        text: 'Big',
        value: '18px'
      },
      {
        text: 'Huge',
        value: '24px'
      }
    ],
    type: 'string',
    ...propDefinition
  });
}

export function boundProp(
  prop: PropDefintion = {},
  bindingType: 'ValueSourceHandler' | 'SourceHandler' | 'Handler' = 'ValueSourceHandler',
  valueType: JSONSchema7TypeName = 'string'
): { control: FormElement; schema: JSONSchema } {
  const { items, properties, $enum, ...control } = prop;

  assignControl(control, prop);

  return {
    control: {
      ...control,
      bound: true,
      control: control.control || 'Input', // type !== 'Handler' ? 'Binding' : 'Select',
      props: {
        label: prop.label,
        ...prop.props,
        type: bindingType,
        options: (prop.props && prop.props.options) || { handler: 'datasetSource' }
      }
    },
    schema: { items, $enum, ...boundSchema(valueType, properties) }
  };
}

export function handlerProp(
  prop: PropDefintion = {}
): { control: FormElement; schema: JSONSchema } {
  const { type = 'string', items, properties, $enum, ...control } = prop;
  return {
    control: {
      ...control,
      control: 'Select',
      props: { ...control.props, options: { handler: 'optionsHandlers' } }
    },
    schema: { type, items, properties, $enum }
  };
}

export function dataProp(prop: PropDefintion = {}): { control: FormElement; schema: JSONSchema } {
  const { type = 'string', items, properties, $enum, ...control } = prop;
  return {
    control: {
      ...control,
      control: 'Select',
      props: { ...control.props, options: { handler: 'datasetSource' } }
    },
    schema: { type, items, properties, $enum }
  };
}

export function prop(prop: PropDefintion = {}): Prop {
  const { type = 'string', items, properties, $enum, ...control } = prop;

  assignControl(control, prop);

  if (prop.label) {
    control.props = { ...control.props, label: prop.label };
  }

  return {
    control,
    schema: { type, items, properties, $enum }
  };
}

export function arrayProp(
  label: string,
  properties: { [index: string]: any } = null,
  itemType: JSONSchema7TypeName = null
): { control: FormElement; schema: JSONSchema } {
  let elements = [];
  for (let key of Object.keys(properties)) {
    properties[key] = { type: properties[key] };
    elements.push({
      control: 'Input',
      props: { placeholder: makeLabel(key), value: { source: key }, label: makeLabel(key) }
    });
  }
  return {
    control: { control: 'Table', elements, props: { text: label, label: '' } },
    schema: { type: 'array', items: itemType ? { type: itemType } : { type: 'object', properties } }
  };
}

let id = 0;
export function generateId() {
  return (id++).toString();
}

export function generateUid() {
  return Date.now().toString();
}

export const processor: Processor<DynamicForm.FormDataSet> = {
  children: owner => owner.elements,
  name: owner => {
    return (owner.props.label && owner.props.label.value) || owner.control;
  },
  id: owner => (owner ? owner.uid : '')
};

export function calculatePosition(layout: string, e: React.DragEvent) {
  return layout === 'row' ? calculateVerticalPosition(e) : calculateHorizontalPosition(e);
}

export function calculateHorizontalPosition(e: React.DragEvent) {
  let element = e.currentTarget;
  let elementLeft = window.scrollX + element.getBoundingClientRect().left;
  let elementWidth = element.clientWidth;

  return e.pageX - elementLeft < elementWidth / 2 ? 'left' : 'right';
}

export function calculateVerticalPosition(e: React.DragEvent) {
  let element = e.currentTarget;
  let elementTop = window.scrollX + element.getBoundingClientRect().top;
  let elementHeight = element.clientHeight;
  let dragStart = e.pageY;

  // console.log(`${id} ${dragStart} - ${elementTop} < ${elementHeight} | ${dragStart - elementTop}`);

  return dragStart - elementTop < elementHeight / 2 ? 'top' : 'bottom';
}

export function createPath(element: FormElement, context: DynamicForm.EditorContextType) {
  let stringPath = element.props.value ? element.props.value.source : null;
  let control = context.editorCatalogue.components[element.control];
  let parent = element.parent;
  while (parent != null && parent.props) {
    if (
      control &&
      control.valueProvider &&
      parent.props.value &&
      parent.props.value.source != null
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

export function findSchema(
  element: FormElement,
  schema: DynamicForm.SchemaDataSet,
  context: DynamicForm.EditorContextType
) {
  // build the path to the current element and find the active schema
  if (element && element.props.value && element.props.value.source) {
    if (element.props.value.source[0] === '/') {
      return findSchemaByPath(element.props.value.source.substring(1).split('.'), schema);
    }
    return findSchemaByPath(createPath(element, context), schema);
  }
  return null;
}

export function findParentSchema(
  element: FormElement,
  schema: DynamicForm.SchemaDataSet,
  context: DynamicForm.EditorContextType
) {
  // build the path to the current element and find the active schema
  if (element && element.props.value && element.props.value.source) {
    let path = createPath(element, context);
    path.pop();
    return findSchemaByPath(path, schema);
  }
  return null;
}
