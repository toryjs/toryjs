import * as validations from './validation';

// @ts-ignore
import initCustomErrors from 'ajv-errors';
import Ajv from 'ajv';

import { getRoot, getPath, IAnyStateTreeNode } from 'mobx-state-tree';

import { JSONSchema, JSONSchemaBase } from './json_schema';
import { safeEval } from './form_utils';
import { DataSet } from './form_store';

const defaultAjv = new Ajv({ allErrors: true, useDefaults: true, jsonPointers: true });
initCustomErrors(defaultAjv);

defaultAjv.addKeyword('validationExpression', {
  // type: 'string',]
  errors: true,
  validate: function v(
    this: any,
    schema: any,
    data: any,
    elementSchema: JSONSchema,
    elementPath: string,
    parentData: any
  ) {
    // console.log(arguments);
    // console.log(parentData);
    // console.log(schema);
    // console.log(data);
    // console.log(safeEval(parentData, schema, data));
    // console.log(elementPath);

    const result = safeEval(parentData, schema, data);
    if (!result) {
      // console.log(`Validation Error "${elementSchema.validationMessage}" at: ` + elementPath);

      (v as any).errors = [];
      (v as any).errors.push({
        keyword: 'validationExpression',
        dataPath: elementPath,
        message: elementSchema.errorMessage ? elementSchema.errorMessage : 'Value is invalid',
        params: {
          keyword: 'validationExpression'
        }
      });
    }
    return result;
  }
});

export type ListItem = {
  text: string;
  value: string;
};

type SchemaOptions = {
  parent?: Schema;
  required?: boolean;
  key?: string;
  ajv?: Ajv.Ajv;
  definitions?: any;
};

export class Schema extends JSONSchemaBase {
  // store: typeof FormStore.Type;
  originalSchema: JSONSchema;
  parent: Schema;
  properties: { [index: string]: Schema };
  definitions: { [index: string]: Schema };
  items: Schema;
  required: boolean;
  readOnly: boolean;
  enum: ListItem[];
  key: string;
  default: any;
  anyOf: JSONSchema[];

  validator: Ajv.ValidateFunction;

  constructor(
    input: JSONSchema,
    { parent = null, required = false, key = null, definitions = null }: SchemaOptions = {}
  ) {
    super();

    Object.assign(this, input);

    this.originalSchema = input;
    this.parent = parent;
    this.expression = input.expression;
    this.key = key;

    let schema = { ...input };

    if (definitions) {
      schema.definitions = { ...(schema.definitions || {}), ...definitions };
    }

    // we do not need validator for end nodes
    // these are always validated from the parent
    if (schema.properties) {
      this.validator = defaultAjv.compile(schema);
    }

    if (required) {
      this.required = required;
    }

    if (schema.type === 'object') {
      if (schema.properties) {
        this.properties = {};
        for (let key of Object.getOwnPropertyNames(schema.properties)) {
          this.properties[key] = new Schema(schema.properties[key] as JSONSchema, {
            parent: this,
            required: schema.required && schema.required.includes(key),
            key,
            definitions: schema.definitions
          });
        }
      }
    }

    if (schema.definitions) {
      this.definitions = {};
      for (let key of Object.getOwnPropertyNames(schema.definitions)) {
        this.definitions[key] = new Schema(schema.definitions[key] as JSONSchema, {
          parent: this,
          key
        });
      }
    }

    if (schema.type === 'array') {
      this.items = new Schema(schema.items as JSONSchema, {
        parent: this.parent,
        key: this.key,
        required: this.required,
        definitions: schema.definitions
      });
    }
  }

  rootSchema() {
    let s: Schema = this;
    while (s.parent != null) {
      s = s.parent;
    }
    return s;
  }

  // randomValue() {
  //   switch (this.type) {
  //     case 'string':
  //       return random.words(2);
  //     case 'boolean':
  //       return random.boolean();
  //     case 'id':
  //       return '1';
  //     case 'integer':
  //       return random.int();
  //     case 'number':
  //       return random.float();
  //   }
  //   return undefined;
  // }

  init<T>(schema: T, keys: Array<keyof Schema>) {
    for (let key of keys) {
      if ((schema as any)[key] != null) {
        this[key] = (schema as any)[key];
      }
    }
  }

  defaultValue<T>(dataset: T = {} as T): T {
    // validator is set to assign default values
    if (this.validator) {
      this.validator(dataset);
      return dataset;
    }
    return '' as any;
  }

  /* =========================================================
      Validations
     ======================================================== */

  static convertPath(path: string) {
    path = path.replace(/\/(\d+)/g, '[$1]');
    path = path.replace(/\//g, '.');

    return path;
  }

  static reassignErrors(errors: any[]) {
    if (!Array.isArray(errors)) {
      return errors;
    }

    for (let i = errors.length - 1; i >= 0; i--) {
      let error = errors[i];

      // remove string warnings where we use DateTime
      // this is a very dirty solution but allows me to store dates
      // in the dataset and ignore validations errors over them

      // if (error.message === 'should be string') {
      //   let path = error.schemaPath.split('/').slice(1, -1);
      //   let s: any = schema;
      //   while (path.length) {
      //     s = s[path.shift()];
      //   }
      //   if (s.format === 'date-time') {
      //     errors.splice(i, 1);
      //   }
      // }

      // missing properties are propagated into properties themselves
      // rendering as "value is required"
      if (error.params && error.params.missingProperty) {
        error.dataPath += '/' + error.params.missingProperty;
        error.message = 'Value is required';
      } else if (error.keyword === 'errorMessage') {
        let required = error.params.errors.find((p: Ajv.ErrorObject) => p.keyword === 'required');
        if (required) {
          error.dataPath += '/' + required.params.missingProperty;
        }
      }
    }
    return errors.length ? errors : undefined;
  }

  static parseParent(dataPath: string) {
    dataPath = Schema.convertPath(dataPath);

    if (dataPath.indexOf('.') >= 0) {
      return {
        dataPath: dataPath.substring(0, dataPath.lastIndexOf('.')),
        property: dataPath.substring(dataPath.lastIndexOf('.') + 1)
      };
    }
    return { property: dataPath, dataPath: '' };
  }

  tryParse(value: any) {
    if (!value) {
      return value;
    }
    if (this.format === 'date-time') {
      let date = Date.parse(value);
      return isNaN(date) ? value : new Date(date);
    }
    switch (this.type) {
      case 'integer':
        return validations.IntValidator(value) ? value : parseInt(value, 10);
      case 'number':
        return validations.FloatValidator(value) ? value : parseFloat(value);
      case 'boolean':
        return value === true || value === 'true' || value === 'True'
          ? true
          : !value || value === false || value === 'false' || value === 'False'
            ? false
            : value;
      default:
        return value;
    }
  }

  assignErrors(dataset: DataSet, error: Ajv.ErrorObject) {
    let { property, dataPath } = Schema.parseParent(error.dataPath);
    const node = eval(`dataset${dataPath}`);

    if (!property) {
      property = 'ROOT';
    }

    if (!node.errors.get(property)) {
      node.errors.set(property, error.message);
    }
  }

  validate(dataset: DataSet) {
    const cleanData = dataset.toJS ? dataset.toJS({ replaceDates: true }) : dataset;

    // we use this when executing expressions
    // (this.ajv as any).currentData = cleanData;

    let validator = this.validator;

    if (!validator(cleanData) as any) {
      return Schema.reassignErrors(validator.errors);
    }
    return false;
  }

  validateAndAssignErrors(dataset: DataSet) {
    const cleanData = dataset.toJS({ replaceDates: true });
    const errors = this.validate(cleanData);
    if (errors && errors.length) {
      for (let error of errors) {
        this.assignErrors(dataset, error);
      }
    }
    return errors;
  }

  validateFields(value: IAnyStateTreeNode, keys: string[], assignErrors = false) {
    // validate the whole dataset from its root
    const root: DataSet = getRoot(value) as any;
    const errors = this.validate(root as DataSet);

    let result = undefined;
    for (let key of keys) {
      // mobx's 'getPath' generates path such as /prop/path/0
      // we need to convert it to the json schema type path such as.prop.path[0]
      // const path = Schema.convertPath(getPath(value)) + (key ? '.' + key : '');
      const path = getPath(value) + (key ? '/' + key : '');

      // locate the error in the resulting errors by its path
      if (errors && errors.length) {
        const error = errors.find(e => e.dataPath === path);
        if (error) {
          if (assignErrors) {
            this.assignErrors(root, error);
          }
          result = error.message;
        }
      }
    }
    return result;
  }
}
