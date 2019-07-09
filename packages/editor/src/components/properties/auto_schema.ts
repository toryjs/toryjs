import { FormElement, JSONSchemaBase } from '@toryjs/form';

export interface AutoSchema extends JSONSchemaBase {
  properties?: {
    [key: string]: AutoSchema;
  };
  items?: AutoSchema;
  required?: string[];
  label?: string;
  control?: string;
  options?: string;
  validate?: string;
  visible?: string;
  parse?: string;
}

function addElements(properties: { [index: string]: AutoSchema }): FormElement[] {
  let elements: FormElement[] = [];
  for (let key of Object.getOwnPropertyNames(properties)) {
    let schema = properties[key];

    if (schema.properties) {
      elements.push(createGroup(schema));
    } else {
      elements.push(createElement(schema, key));
    }
  }

  return elements;
}

function createElement(schema: AutoSchema, key: string): FormElement {
  return {
    control: schema.control,
    props: { value: { source: key, label: schema.label } }
  };
}

function createGroup(schema: AutoSchema): FormElement {
  return {
    control: 'Group',
    props: { visible: { value: schema.visible }, label: schema.label },
    elements: addElements(schema.properties)
  };
}

export function convertSchemaToForm(schema: AutoSchema): FormElement {
  const definition: FormElement = {
    props: { label: schema.label },
    elements: addElements(schema.properties)
  };

  return definition;
}
