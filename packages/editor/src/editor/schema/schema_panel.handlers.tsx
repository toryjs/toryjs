import { Handler, ParseHandler, safeEval, Schema, ValidateHandler, Option } from '@toryjs/form';
import { debounce } from '@tomino/toolbelt';
import { schemaDatasetToJS, ContextType, SchemaDataSet } from '@toryjs/ui';
import { HandlerArgs } from '@toryjs/form';

import { root } from '../editor_common';
import { fakerOptions } from './faker_options';

type SchemaHandler = Handler<SchemaDataSet, ContextType>;
type SchemaParseHandler = ParseHandler<SchemaDataSet, ContextType>;
type SchemaValidateHandler = ValidateHandler<SchemaDataSet, ContextType>;

const typeVisibility = (types: string[]) => ({ owner }: HandlerArgs) => {
  return types.indexOf(owner.type) >= 0;
};

export const objectVisibilityHandler: SchemaHandler = typeVisibility(['object']);

export const stringVisibleHandler: SchemaHandler = typeVisibility(['string']);

export const numberVisibleHandler: SchemaHandler = typeVisibility(['integer', 'number']);

export const arrayVisibleHandler: SchemaHandler = typeVisibility(['array']);

/* =========================================================
    Title
   ======================================================== */

export const titleValueHandler: SchemaHandler = ({ owner, context }) =>
  owner.title == null ? context.editor.project.state.selectedSchemaName : owner.title;

export const titleParseHandler: SchemaParseHandler = ({ context, args }) =>
  context.editor.project.renameSchema(args.current, context.editor.schema);

/* =========================================================
    Type
   ======================================================== */

export const typeValueHandler: Handler = ({ owner }) => {
  return owner.$import || (owner.$ref && owner.$ref.split('/')[2]) || owner.type;
};

export const itemsTypeValueHandler: SchemaHandler = ({ owner }) => {
  return typeValueHandler({ owner: owner.items });
};

export const typeParseHandler: SchemaParseHandler = ({ owner, args }) =>
  owner.changeType(args.current, args.previous);

export const itemsTypeParseHandler: SchemaParseHandler = ({ owner, args }) => {
  owner.getValue('items').changeType(args.current, args.previous);
};

export const typeOptions: SchemaHandler = ({ owner }) => {
  let parent = root(owner);

  if (!parent) {
    return [];
  }

  return [
    { text: 'Array', value: 'array' },
    { text: 'Boolean', value: 'boolean' },
    { text: 'Integer', value: 'integer' },
    { text: 'Number', value: 'number' },
    { text: 'Object', value: 'object' },
    { text: 'String', value: 'string' },
    { text: 'TYPES', value: '_types', disabled: true }
  ].concat(
    Array.from(parent.definitions.keys())
      .map(d => ({
        value: d,
        text: parent.definitions.get(d).title
      }))
      .sort((a, b) => (a.text < b.text ? -1 : 1))
  );
  // .concat([{ text: '── IMPORTS ──', value: '_imports', disabled: true }])
  // .concat(
  //   Array.from(parent.imports.keys()).map(d => ({
  //     value: d,
  //     text: parent.imports.get(d).title
  //   }))
  // );
};

export const atomicTypeVisibility: SchemaHandler = ({ owner }) =>
  owner.getValue('type') === 'integer' ||
  owner.getValue('type') === 'number' ||
  owner.getValue('type') === 'boolean' ||
  owner.getValue('type') === 'string';

export const fakedOptions: SchemaHandler = fakerOptions;

export const expressionValidationHandler: SchemaValidateHandler = debounce(
  ({ owner, context, args: { value, source } }) => {
    try {
      const schemaJson = schemaDatasetToJS(context.editor.schema);
      const schema = new Schema(schemaJson);
      const def = schema.defaultValue();
      safeEval(def, value);
    } catch (ex) {
      owner.setError(source, ex.message);
      return;
    }
    owner.setError(source, null);
  },
  300
);

export const formatOptions: SchemaHandler = () => [
  {
    text: 'None',
    value: ''
  },
  {
    text: 'ISO Date Time',
    value: 'date-time'
  },
  {
    text: 'Date',
    value: 'date'
  },
  {
    text: 'Time',
    value: 'time'
  },
  {
    text: 'Email',
    value: 'email'
  }
];

export const regexValidateHandler: SchemaValidateHandler = ({ owner, args: { value, source } }) => {
  try {
    new RegExp(value);
  } catch (ex) {
    owner.setError(source, ex.message);
  }
  return null;
};

/* =========================================================
    Required
   ======================================================== */

export const requiredValue: SchemaHandler = ({ context }) => {
  return (
    (context.editor.selectedParentSchema &&
      context.editor.selectedParentSchema.required &&
      context.editor.selectedParentSchema.required.indexOf(
        context.editor.project.state.selectedSchemaName
      ) >= 0) ||
    false
  );
};

export const requiredParse: SchemaParseHandler = ({ args, context }) => {
  if (args.current) {
    context.editor.selectedParentSchema.addRow(
      'required',
      context.editor.project.state.selectedSchemaName
    );
  } else {
    context.editor.selectedParentSchema.removeRowData(
      'required',
      context.editor.project.state.selectedSchemaName
    );
  }
};

export const requiredOptionsHandler: SchemaHandler = ({ owner }) => {
  let element = owner;
  while (!element.properties && !element.reference) {
    element = element.parent;
  }
  return Array.from<string>(
    ((element.reference && element.reference.properties) || element.properties).keys()
  ).map(v => ({
    value: v,
    text: v
  }));
};

/* =========================================================
    Error
   ======================================================== */

const validations: { [index: string]: Option[] } = {
  string: [
    { value: 'format', text: 'Format' },
    { value: 'maxLength', text: 'Maximum Length' },
    { value: 'minLength', text: 'Minimum Length' },
    { value: 'pattern', text: 'Regular Expression' }
  ],
  array: [
    { value: 'maxItems', text: 'Maximum Items' },
    { value: 'minItems', text: 'Minimum Items' },
    { value: 'uniqueItems', text: 'Unique Items' }
  ],
  number: [
    { value: 'maximum', text: 'Maximum' },
    { value: 'minimum', text: 'Minimum' },
    { value: 'exclusiveMaximum', text: 'Exclusive Maximum' },
    { value: 'exclusiveMinimum', text: 'Exclusive Minimum' },
    { value: 'multipleOf', text: 'Multiple Of' }
  ],
  object: [{ value: 'required', text: 'Required' }]
};

export const errorMessageVisibleHandler: SchemaHandler = ({ owner }) =>
  typeof owner.errorMessage !== 'object';

export const errorMessageOptions: SchemaHandler = ({ owner }) =>
  validations[owner.getValue('type')] || [];
