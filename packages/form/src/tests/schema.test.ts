import { fake } from 'sinon';

import { JSONSchema } from '../json_schema';
import { Schema } from '../data_schema_model';
import { buildStore } from '../mst_builder';
import { config } from '../config';
import { DataSet } from '../form_store';

describe('Schema', () => {
  function createBaseSchema(): JSONSchema {
    return {
      type: 'object',
      properties: {
        first: {
          type: 'boolean'
        },
        second: {
          type: 'boolean',
          default: false
        },
        requiredString: {
          type: 'string'
        },
        notRequiredString: {
          type: 'string'
        },
        integer: {
          type: 'integer'
        },
        complex: {
          type: 'object',
          properties: {
            max5: {
              type: 'number'
            }
          }
        }
      }
    };
  }

  describe('convertPath', () => {
    it('converts paths from mobx-state-tree to json schema style', () => {
      expect(Schema.convertPath('/tomi/other/0/now/1')).to.equal('.tomi.other[0].now[1]');
    });
  });

  describe('parseParent', () => {
    it('creates a parent path and a property', () => {
      expect(Schema.parseParent('')).to.deep.equal({ property: '', dataPath: '' });
      expect(Schema.parseParent('foo')).to.deep.equal({ property: 'foo', dataPath: '' });
      expect(Schema.parseParent('foo.boo')).to.deep.equal({ property: 'boo', dataPath: 'foo' });
      expect(Schema.parseParent('foo[0].boo')).to.deep.equal({
        property: 'boo',
        dataPath: 'foo[0]'
      });
    });
  });

  describe('reassignErrors', () => {
    it('assigns required field errors as specific errors', () => {
      expect(
        Schema.reassignErrors([
          {
            keyword: 'required',
            dataPath: '',
            schemaPath: '#/required',
            params: {
              missingProperty: 'name'
            },
            message: "should have required property 'name'"
          },
          {
            keyword: 'required',
            dataPath: '/accounts/0',
            schemaPath: '#/properties/accounts/items/required',
            params: {
              missingProperty: 'money'
            },
            message: "should have required property 'money'"
          }
        ])
      ).to.deep.equal([
        {
          keyword: 'required',
          dataPath: '/name',
          schemaPath: '#/required',
          params: {
            missingProperty: 'name'
          },
          message: 'Value is required'
        },
        {
          keyword: 'required',
          dataPath: '/accounts/0/money',
          schemaPath: '#/properties/accounts/items/required',
          params: {
            missingProperty: 'money'
          },
          message: 'Value is required'
        }
      ]);
    });
  });

  describe('contstructor', () => {
    it('allows definition values', () => {
      const jsonSchema: JSONSchema = {
        type: 'object',
        properties: {
          root: {
            $ref: '#/definitions/referenced'
          },
          array: {
            type: 'array',
            items: { $ref: '#/definitions/referenced' }
          },
          child: {
            type: 'object',
            properties: {
              foo: { $ref: '#/definitions/referenced' },
              array: {
                type: 'array',
                items: { $ref: '#/definitions/referenced' }
              }
            }
          }
        },
        definitions: {
          referenced: {
            properties: {
              foo: { type: 'object' }
            }
          }
        }
      };
      const schema = new Schema(jsonSchema);
      expect(schema).to.exist;
    });
  });

  describe('validate', () => {
    it('validates required value', () => {
      const schemaDef = createBaseSchema();
      schemaDef.required = ['first'];

      const schema = new Schema(schemaDef);
      const obj: any = {};
      const result = schema.validate(obj);

      expect(result).to.deep.equal([
        {
          dataPath: '/first',
          keyword: 'required',
          message: 'Value is required',
          params: { missingProperty: 'first' },
          schemaPath: '#/required'
        }
      ]);
    });

    it('valid schema returns undefined', () => {
      const schemaDef = createBaseSchema();
      const schema = new Schema(schemaDef);
      const result = schema.validate({} as DataSet);
      expect(result).to.be.false;
    });

    it('assigns errors to dataset', () => {
      config.setDirty = fake();
      const schemaDef = createBaseSchema();
      schemaDef.required = ['first'];
      const schema = new Schema(schemaDef);

      const dataset = buildStore(schema).create({ integer: '2.3' });

      const r = schema.validate(dataset);
      expect(r).to.deep.equal([
        {
          dataPath: '/first',
          keyword: 'required',
          message: 'Value is required',
          params: { missingProperty: 'first' },
          schemaPath: '#/required'
        },
        {
          dataPath: '/integer',
          keyword: 'type',
          message: 'should be integer',
          params: { type: 'integer' },
          schemaPath: '#/properties/integer/type'
        }
      ]);

      let result = schema.validateAndAssignErrors(dataset);

      expect(result).to.deep.equal([
        {
          dataPath: '/first',
          keyword: 'required',
          message: 'Value is required',
          params: { missingProperty: 'first' },
          schemaPath: '#/required'
        },
        {
          dataPath: '/integer',
          keyword: 'type',
          message: 'should be integer',
          params: { type: 'integer' },
          schemaPath: '#/properties/integer/type'
        }
      ]);
      expect(dataset.errors.get('integer')).to.equal('should be integer');
      expect(dataset.errors.get('first')).to.equal('Value is required');

      dataset.setValue('first', true);

      result = schema.validateAndAssignErrors(dataset);

      expect(result).to.deep.equal([
        {
          dataPath: '/integer',
          keyword: 'type',
          message: 'should be integer',
          params: { type: 'integer' },
          schemaPath: '#/properties/integer/type'
        }
      ]);
      expect(dataset.errors.get('integer')).to.equal('should be integer');
      expect(dataset.errors.get('first')).to.equal('');
    });

    it('assigns custom errors to dataset', () => {
      config.setDirty = fake();
      const schemaDef = createBaseSchema();
      schemaDef.required = ['first'];
      schemaDef.errorMessage = { required: { first: 'First must be specified!' } };
      schemaDef.properties.integer.errorMessage = 'Must be int, buddy!';
      const schema = new Schema(schemaDef);

      const dataset = buildStore(schema).create({ integer: '2.3' });

      const r = schema.validate(dataset);
      const validationResult = [
        {
          keyword: 'errorMessage',
          dataPath: '/integer',
          schemaPath: '#/properties/integer/errorMessage',
          params: {
            errors: [
              {
                keyword: 'type',
                dataPath: '/integer',
                schemaPath: '#/properties/integer/type',
                params: { type: 'integer' },
                message: 'should be integer'
              }
            ]
          },
          message: 'Must be int, buddy!'
        },
        {
          keyword: 'errorMessage',
          dataPath: '/first',
          schemaPath: '#/errorMessage',
          params: {
            errors: [
              {
                keyword: 'required',
                dataPath: '',
                schemaPath: '#/required',
                params: { missingProperty: 'first' },
                message: "should have required property 'first'"
              }
            ]
          },
          message: 'First must be specified!'
        }
      ];

      expect(r).to.deep.equal(validationResult);

      let result = schema.validateAndAssignErrors(dataset);

      expect(result).to.deep.equal(validationResult);
      expect(dataset.errors.get('integer')).to.equal('Must be int, buddy!');
      expect(dataset.errors.get('first')).to.equal('First must be specified!');

      dataset.setValue('first', true);

      result = schema.validateAndAssignErrors(dataset);

      expect(result).to.deep.equal([
        {
          keyword: 'errorMessage',
          dataPath: '/integer',
          schemaPath: '#/properties/integer/errorMessage',
          params: {
            errors: [
              {
                keyword: 'type',
                dataPath: '/integer',
                schemaPath: '#/properties/integer/type',
                params: { type: 'integer' },
                message: 'should be integer'
              }
            ]
          },
          message: 'Must be int, buddy!'
        }
      ]);
      expect(dataset.errors.get('integer')).to.equal('Must be int, buddy!');
      expect(dataset.errors.get('first')).to.equal('');
    });

    it('validates combined value', () => {
      // ====================================
      // if all are false it is an error
      // one value

      let schemaDef = createBaseSchema();

      schemaDef.allOf = [
        { required: ['integer'] },
        { anyOf: [{ required: ['first'] }, { required: ['second'] }] }
      ];

      let schema = new Schema(schemaDef);
      expect(schema.validate({ first: true } as any)).to.deep.equal([
        {
          dataPath: '/integer',
          keyword: 'required',
          message: 'Value is required',
          params: { missingProperty: 'integer' },
          schemaPath: '#/allOf/0/required'
        }
      ]);
    });
  });
});
