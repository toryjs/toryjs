import { FormElement, JSONSchema, JSONSchema7TypeName, Prop, PropMap } from '@toryjs/form';

function assignControl(control: FormElement, schema: JSONSchema) {
  if (!control.control) {
    if (schema.type === 'boolean') {
      control.control = 'Checkbox';
    } else if (schema.$enum) {
      control.control = 'Select';
    }
  }
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

export const boundSchema = (
  type: JSONSchema7TypeName = 'string',
  properties: any = {}
): JSONSchema => ({
  type: 'object',
  properties: {
    value: { type },
    handler: { type: 'string' },
    source: { type: 'string' },
    validate: { type: 'string' },
    parse: { type: 'string' },
    ...properties
  }
});

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
