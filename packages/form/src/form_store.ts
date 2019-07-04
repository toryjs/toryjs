import { observable, toJS } from 'mobx';
import { types, getRoot, getParent, detach, applySnapshot, Instance } from 'mobx-state-tree';
import Ajv from 'ajv';

import { Schema } from './data_schema_model';
import { config } from './config';

export type IValidator = (input: string) => string;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IFormStore extends Instance<typeof FormStore> {}

export type DataSet<T = {}> = IFormStore &
Readonly<T> & {
  parent: DataSet<T>;
};

export type ValidationResult = {
  required: number;
  requiredValid: number;
  valid: number;
  invalid: number;
  total: number;
};

function strip(obj: any, options: ToJsOptions) {
  // console.log(options);

  if (obj && typeof obj === 'object') {
    if (obj.errors) {
      delete obj.errors;
      delete obj.inversePatches;
      delete obj.history;
    }

    for (let key of Object.getOwnPropertyNames(obj)) {
      let item = obj[key];
      if (options.replaceDates && item instanceof Date) {
        obj[key] = item.toISOString();
      }
      if (item === '' || item === null) {
        if (options.replaceEmpty) {
          obj[key] = undefined;
        }
      } else if (typeof item === 'object') {
        strip(item, options);
      } else if (Array.isArray(item)) {
        for (let a of item) {
          strip(a, options);
        }
      }
    }
  }

  // if (Array.isArray(obj)) {
  //   for (let item of obj) {
  //     strip(item);
  //   }
  // }
  return obj;
}

// function clone(obj: any) {
//   if (obj === null || typeof obj !== 'object' || 'isActiveClone' in obj) {
//     return obj;
//   }

//   // @ts-ignore
//   let temp = obj instanceof Date ? new obj.constructor() : obj.constructor();

//   for (let key in obj) {
//     if (Object.prototype.hasOwnProperty.call(obj, key)) {
//       // tslint:disable-next-line:no-string-literal
//       obj.isActiveClone = null;
//       temp[key] = clone(obj[key]);
//       delete obj.isActiveClone;
//     }
//   }
//   return temp;
// }

export interface ListValue {
  [index: string]: string;
  text: string;
  value: string;
}

type ToJsOptions = { replaceEmpty?: boolean; replaceDates?: boolean };

// const errors = observable.map({});

// function getValue(item: any, key: string) {
//   if (!item) {
//     return null;
//   }
//   if (item.get) {
//     return item.get(key);
//   }
//   return item.getValue(key);
// }

// function setValue(item: any, key: string, value: any) {
//   if (item.set) {
//     return item.set(key, value);
//   }
//   return item.setValue(key, value);
// }

function processPath(item: string, s: any): any {
  if (item && item[0] === '/') {
    item = item.substring(1);
    s = s.root(); // TODO: Possibly this should be set to root
  }
  if (item.indexOf('.') > 0) {
    let [first, ...rest] = item.split('.');
    if (Array.isArray(s[first])) {
      if (rest.length > 1) {
        return processPath(rest.slice(1).join('.'), s[first][parseInt(rest[0])]);
      } else {
        return { owner: s[first], name: parseInt(rest[0]) };
      }
    }
    return processPath(rest.join('.'), s[first]);
  }
  return { owner: s, name: item };
}

export const FormStore = types
  .model()
  .volatile(() => ({
    errors: observable.map({})
  }))
  .views(self => ({
    /** Return an object parent */
    get parent(): DataSet {
      try {
        let level = 1;
        let parent = null;
        do {
          parent = getParent<DataSet>(self, level++);
          if (
            parent &&
            parent.constructor &&
            (parent.constructor.name === 'object' || parent.constructor.name === 'Object')
          ) {
            return parent;
          }
        } while (parent != null);
      } catch {}
      return null;
    },
    /** Return immediate parent (getParent(1)) */
    get immediateParent(): DataSet {
      try {
        return getParent<DataSet>(self, 1);
      } catch {}
      return null;
    },
    reset() {
      applySnapshot(self, {});
    },
    getValue(item: string): any {
      if (!item) {
        return null;
      }
      const { name, owner } = processPath(item, self);
      // perform extra checks for arrays
      if (Array.isArray(owner)) {
        if (owner.length > name) {
          return owner[name];
        }
        return null;
      }
      if (owner) {
        return owner[name];
      }
      return null;
    },
    getError(item: string): string {
      const { name, owner } = processPath(item, self);
      if (owner) {
        return owner.errors.get(name);
      }
      return null;
    },
    setError(item: string, error: string): void {
      if (item.match(/(\.|\/)/)) {
        const { name, owner } = processPath(item, self);
        owner.setError(name, error);
      } else {
        self.errors.set(item, error);
      }
    }
  }))
  .actions(() => ({
    getSchema(_key: string = null, _throwError = true): Schema {
      throw new Error('Not implemented');
    }
  }))
  .actions(function(self) {
    const store: any = self;

    // const { defaultValue, validators, arrays, objects, descriptors } = self.privateHelpers();
    // function setValue(key: string, value: any) {
    //   if (store[key] !== value) {
    //     store[key] = value;
    //     if (config.setDirty) {
    //       config.setDirty(true);
    //     }
    //   }
    // }

    function findOwner(key: string) {
      let owner = self.getValue(key);
      if (!owner) {
        throw new Error(`Could not find value "${key}" in the store.`);
      }
      return owner;
    }

    return {
      addRow(key: string, data?: any) {
        data = data || self.getSchema(key).items.defaultValue();

        findOwner(key).push(data);

        this.validateField(key);
      },
      mapRemove(key: string, mapKey: string) {
        findOwner(key).delete(mapKey);
      },
      detach(node: any) {
        detach(node);
      },
      isRequired(key: string) {
        return self.getSchema(key).required;
      },
      parseValue(key: string, value: any) {
        let schema = self.getSchema(key);
        if (
          schema.type === 'object' &&
          schema.properties &&
          schema.properties.value &&
          schema.properties.handler
        ) {
          schema = schema.properties.value;
        }
        return schema.tryParse(value);
      },
      insertRow<T>(key: string, index: number, data: T) {
        findOwner(key).splice(index, 0, data);
        return store[key][index];
      },
      replaceRow<T>(key: string, index: number, data: T) {
        let owner = findOwner(key);
        if (owner.length <= index) {
          for (let i = owner.length; i <= index; i++) {
            owner.push(undefined);
          }
        }
        owner[index] = data;
        return owner[index];
      },
      moveRow(key: string, from: number, to: number) {
        let owner = findOwner(key);
        let data: any;
        let s = self as any;
        let toItem: any;

        if (to != null) {
          toItem = s[key][to];
        }

        if (from != null) {
          data = toJS(owner[from]);
          owner.splice(from, 1);
        }

        if (to != null) {
          to = s[key].indexOf(toItem);
          to = to == -1 ? s[key].length : to;
          owner.splice(to, 0, data);
        }
      },
      removeRow(key: string, index: number) {
        findOwner(key).splice(index, 1);
      },
      removeRowData<T>(key: string, data: T) {
        findOwner(key).remove(data);
      },
      removeRowIndex(key: string, index: number) {
        findOwner(key).splice(index, 1);
      },
      executeAction<T>(action: (owner?: T) => any): any {
        action(self as any);
      },
      dataSetAction<T>(action: (owner?: T) => any) {
        return () => action(self as any);
      },
      setValue<T>(
        key: string,
        value: any,
        validate: (owner: T, args: { value: any; source: string }) => undefined | any = null
      ): void {
        if (key.match(/(\.|\/)/)) {
          const { name, owner } = processPath(key, self);
          owner.setValue(name, value);
        } else {
          value = this.parseValue(key, value);
          if ((self as any)[key] !== value) {
            (self as any)[key] = value;
            if (config.setDirty) {
              config.setDirty(true);
            }
          }

          if (validate) {
            let error = validate(self as any, { value, source: key });
            if (error) {
              self.setError(key, error);
            } else if (error !== undefined) {
              this.validateField(key);
            }
          } else {
            this.validateField(key);
          }
        }
      },
      setMapValue(key: string, mapKey: string, value: any) {
        self.getValue(key).set(mapKey, value);

        this.validateField(key);
      },
      setArrayValue(key: string, index: number, value: any) {
        self.getValue(key)[index] = value;

        this.validateField(key);
      },
      // clear all errors from the previous validation
      clearErrors() {
        self.errors.clear();
        const schema = self.getSchema();

        for (let key of Object.getOwnPropertyNames(schema.properties)) {
          let elem = schema.properties[key];
          if (elem.type === 'object') {
            self.getValue(key).clearErrors();
          }
          if (elem.type === 'array' && elem.items.type === 'object') {
            for (let row of self.getValue(key)) {
              row.clearErrors();
            }
          }
        }
      },
      toJS({ replaceDates = false, replaceEmpty = true }: ToJsOptions = {}) {
        return strip(toJS(self), { replaceDates, replaceEmpty });
      },
      toJSString() {
        return JSON.stringify(this.toJS(), null, 2);
      },
      root() {
        return getRoot<DataSet>(self);
        // if (getRoot(self) == self) {
        //   return self;
        // }
        // let parent = getParent(self) as any;
        // if (parent && parent.clearErrors) {
        //   return parent.root();
        // }
        // return self;
      },
      validateDataset(assign = true): false | Ajv.ErrorObject[] {
        const rootSchema = self.getSchema().rootSchema();

        // clear previous errors
        this.root().clearErrors();

        if (assign) {
          return rootSchema.validateAndAssignErrors(self as DataSet);
        } else {
          return rootSchema.validate(self as DataSet);
        }
      },
      validateField(key: string) {
        let ownSchema = self.getSchema();

        if (key.indexOf('.') > 0) {
          let [first, ...rest] = key.split('.');
          return store[first].validateField(rest.join('.'));
        }
        // find current schema
        let keys = [key];
        let field = ownSchema.properties[key];

        if (!field) {
          throw new Error('Trying to modify dataset path that does not exist: ' + key);
        }

        if (field.validationGroup) {
          // currently we support validation groups only on the same level
          for (let property of Object.getOwnPropertyNames(ownSchema.properties)) {
            if (
              key !== property &&
              ownSchema.properties[property].validationGroup === field.validationGroup
            ) {
              keys.push(property);
            }
          }
        }

        // remove error
        for (let k of keys) {
          self.errors.set(k, '');
        }

        // get root and validate root
        const schema = self.getSchema().rootSchema();

        // const value = (self as any)[key];
        return schema.validateFields(self, keys, true);
      }
    };
  });
