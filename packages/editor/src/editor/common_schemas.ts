import { JSONSchema } from '@toryjs/form';

export const elementSchema: JSONSchema = {
  type: 'object',
  properties: {
    control: { type: 'string' },
    // css: boundSchema(),
    // className: boundSchema(),
    documentation: { type: 'string' },
    elements: { type: 'array', items: { $ref: '#' } },
    pages: { type: 'array', items: { $ref: '#' } },
    forms: { type: 'array', items: { $ref: '#' } },
    isSelected: { type: 'boolean' },
    // info: { type: 'string' },
    // inline: { type: 'boolean' },
    // label: boundSchema(),
    props: { type: 'object' },
    // readOnly: boundSchema(),
    // renderer: { type: 'string' },
    // source: { type: 'string' },
    sourceRef: { type: 'string' }
    // target: { type: 'string' },
    // text: { type: 'string' },
    // type: { type: 'string' },
    // vertical: { type: 'boolean' },

    // validateHandler: { type: 'string' },
    // visibleHandler: { type: 'string' },
    // parseHandler: { type: 'string' },
    // valueHandler: { type: 'string' },
    // optionsHandler: { type: 'string' }
  }
};

export const schemaSchema: JSONSchema = {
  type: 'object',
  properties: {
    reference: { type: 'string' },
    required: { type: 'array', items: { type: 'string' } },
    expression: { type: 'string' },
    validationExpression: { type: 'string' },
    validationGroup: { type: 'string' },
    share: { type: 'boolean' },
    type: { type: 'string' },
    const: { type: 'object' },
    enum: {
      type: 'array',
      items: { type: 'string' }
    },
    $id: { type: 'string' },
    $ref: { type: 'string' },
    // $schema: { type: 'string'},
    // $comment: { type: 'string' },
    $import: { type: 'string' },
    $enum: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          text: { type: 'string' },
          value: { type: 'string' },
          icon: { type: 'string' }
        }
      }
    },
    faker: { type: 'string' },
    multipleOf: { type: 'number' },
    maximum: { type: 'number' },
    exclusiveMaximum: { type: 'number' },
    minimum: { type: 'number' },
    exclusiveMinimum: { type: 'number' },
    maxLength: { type: 'integer' },
    minLength: { type: 'integer' },
    pattern: { type: 'string' },
    // additionalItems: JSONSchema;
    items: { type: 'object' },
    maxItems: { type: 'integer' },
    minItems: { type: 'integer' },
    uniqueItems: { type: 'boolean' },
    // contains: JSONSchema;
    maxProperties: { type: 'integer' },
    minProperties: { type: 'integer' },
    patternProperties: { type: 'string' },
    properties: { type: 'object' },
    additionalProperties: { type: 'boolean' },
    // dependencies: {
    //     [key: string]: JSONSchema | string[];
    // };
    // propertyNames: JSONSchema;
    errorMessage: { type: 'object' },
    // if: JSONSchema;
    // then: JSONSchema;
    // else: JSONSchema;

    allOf: {
      type: 'array',
      items: { $ref: '#' }
    },
    anyOf: {
      type: 'array',
      items: { $ref: '#' }
    },
    oneOf: {
      type: 'array',
      items: { $ref: '#' }
    },
    not: { $ref: '#' },
    format: { type: 'string' },
    // contentMediaType: { type: 'string' },
    // contentEncoding: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string' },
    default: { type: 'string' },
    readOnly: { type: 'boolean' },
    writeOnly: { type: 'boolean' },
    definitions: { type: 'object' },
    imports: { type: 'object' }
    //examples: JSONSchema7Type;
  }
};
