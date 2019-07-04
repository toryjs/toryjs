import { autorun } from 'mobx';

import merge from 'deepmerge';
import { fake } from 'sinon';

import { Schema } from '../data_schema_model';
import { buildStore } from '../mst_builder';
import { create } from './data';
import { JSONSchema } from '../json_schema';

import { config } from '../config';

describe('Dataset', () => {
  let jsonSchema = (): JSONSchema => ({
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      age: {
        type: 'integer',
        minimum: 0,
        maximum: 130,
        default: 0
      },
      salary: {
        type: 'number',
        minimum: 0,
        default: 300
      },
      married: {
        type: 'boolean',
        default: false
      },
      dateMarried: {
        type: 'string',
        format: 'date-time'
      },
      fatherAge: {
        type: 'integer',
        validationExpression: 'value > this.age + 18',
        errorMessage: 'Father age must be at least 18 years more then your age'
      },
      accounts: {
        type: 'array',
        uniqueItems: true,
        items: {
          type: 'object',
          properties: {
            number: {
              type: 'string',
              pattern: '\\d\\d\\d-\\d\\d\\d'
            },
            money: {
              type: 'number',
              validationExpression: 'this.money % 2 === 0', // allow only to add higher value,
              errorMessage: 'You can only put even value of money!'
            }
          },
          required: ['number']
        },

        minItems: 1,
        maxItems: 3
      },
      accountTotal: {
        type: 'number',
        expression: 'this.accounts.reduce((p, n) => n.money + p, 0)'
      },
      address: {
        type: 'object',
        properties: {
          street: {
            type: 'string',
            minLength: 5,
            maxLength: 30
          },
          number: {
            type: 'number',
            exclusiveMinimum: 0,
            exclusiveMaximum: 1000
          }
        }
      }
    },
    required: ['name']
  });

  let schema = new Schema(jsonSchema());

  it('creates a default value', () => {
    expect(schema.defaultValue()).toMatchSnapshot();

    expect(schema.properties.accounts.items.defaultValue()).toMatchSnapshot();
  });

  it('creates a new mst and validates values', () => {
    config.setDirty = fake();

    const mst = buildStore(schema);
    const data = mst.create({});
    let error = '';
    // check conversion

    /* =========================================================
        Integer / Number
       ======================================================== */

    // ok

    data.setValue('age', '30');
    expect(data.getValue('age')).to.equal(30);

    data.setValue('salary', '30.15');
    expect(data.getValue('salary')).to.equal(30.15);

    data.setValue('salary', '30');
    expect(data.getValue('salary')).to.equal(30);

    // // format

    data.setValue('age', '30.15');
    expect(data.getValue('age')).to.equal('30.15');
    expect(data.validateField('age')).to.equal('should be integer');

    data.setValue('age', 'Momo');
    expect(data.getValue('age')).to.equal('Momo');
    expect(data.validateField('age')).to.equal('should be integer');

    data.setValue('salary', '30.aa');
    expect(data.getValue('salary')).to.equal('30.aa');
    expect(data.validateField('salary')).to.equal('should be number');

    // minimum

    data.setValue('age', '0');
    expect(data.getValue('age')).to.equal(0);

    data.setValue('age', '-1');
    expect(data.getValue('age')).to.equal(-1);
    expect(data.validateField('age')).to.equal('should be >= 0');

    // // maximum

    data.setValue('age', '130');
    expect(data.getValue('age')).to.equal(130);

    data.setValue('age', '131');
    expect(data.getValue('age')).to.equal(131);
    expect(data.validateField('age')).to.equal('should be <= 130');

    // subselection ok 'a.b.c'

    data.setValue('address.number', '20');
    expect(data.getValue('address.number')).to.equal(20);

    // exclusive minimum

    data.setValue('address.number', '0');
    expect(data.getValue('address.number')).to.equal(0);
    expect(data.getValue('address').validateField('number')).to.equal('should be > 0');

    data.setValue('address.number', '1');
    expect(data.getValue('address.number')).to.equal(1);

    // exclusive maximum

    data.setValue('address.number', '1000');
    expect(data.getValue('address.number')).to.equal(1000);
    expect(data.getValue('address').validateField('number', '1000')).to.equal('should be < 1000');

    data.setValue('address.number', '999');
    expect(data.getValue('address.number')).to.equal(999);

    /* =========================================================
        String
       ======================================================== */

    // ok

    data.setValue('name', 'Bobo');
    expect(data.getValue('name')).to.equal('Bobo');

    // format ok

    data.addRow('accounts');
    data.getValue('accounts')[0].setValue('number', '234-234');

    // console.log(3);
    // console.log(data.getValue('accounts')[0]);

    expect(data.getValue('accounts')[0].number).to.equal('234-234');

    error = data.getValue('accounts')[0].validateField('number', '123-123');
    expect(error).to.be.undefined;

    // format error

    data.getValue('accounts')[0].setValue('number', '123d');
    expect(data.getValue('accounts')[0].number).to.equal('123d');
    error = data.getValue('accounts')[0].validateField('number');
    expect(error).to.equal('should match pattern "\\d\\d\\d-\\d\\d\\d"');

    data.getValue('accounts')[0].setValue('number', '');
    error = data.getValue('accounts')[0].validateField('number', '');
    expect(error).to.equal('Value is required');

    // minLength

    data.getValue('address').setValue('street', '123456');
    error = data.getValue('address').validateField('street', '123456');
    expect(error).to.be.undefined;

    data.getValue('address').setValue('street', '123');
    error = data.getValue('address').validateField('street');
    expect(error).to.equal('should NOT be shorter than 5 characters');

    // maxLength

    data.getValue('address').setValue('street', '1234567890123456789012345678901234567890');
    error = data.getValue('address').validateField('street');
    expect(error).to.equal('should NOT be longer than 30 characters');

    /* =========================================================
        Array
       ======================================================== */

    // min intems

    data.removeRow('accounts', 0);
    error = data.validateField('accounts');
    expect(error).to.equal('should NOT have fewer than 1 items');

    // max items

    data.addRow('accounts');
    data.addRow('accounts');
    data.addRow('accounts');
    data.addRow('accounts');

    error = data.validateField('accounts');
    expect(error).to.equal('should NOT have more than 3 items');

    data.removeRow('accounts', 3);

    // unique items

    // console.log(toJS(data.getValue('accounts')));
    // console.log(data.getValue('accounts'))

    error = data.validateField('accounts');
    expect(error).to.equal('should NOT have duplicate items (items ## 1 and 2 are identical)');

    data.getValue('accounts')[1].setValue('number', '123-234');

    error = data.validateField('accounts');
    expect(error).to.equal('should NOT have duplicate items (items ## 0 and 2 are identical)');

    // all is well

    data.getValue('accounts')[0].setValue('number', '123-456');
    data.getValue('accounts')[2].setValue('number', '456-789');

    error = data.validateField('accounts');
    expect(error).to.be.undefined;

    // unique items

    /* =========================================================
        Expression
       ======================================================== */

    data.setValue('age', '10');
    data.setValue('fatherAge', '40');
    expect(data.getValue('fatherAge')).to.equal(40);

    // failing expression

    data.setValue('fatherAge', '20');
    expect(data.getValue('fatherAge')).to.equal(20);

    // console.log('WILL VALIDATE FATHER AGE');
    // console.log(data.fatherAge);

    error = data.validateField('fatherAge');
    expect(error).to.equal('Father age must be at least 18 years more then your age');

    data.setValue('fatherAge', '80');
    expect(data.getValue('fatherAge')).to.equal(80);
    error = data.validateField('fatherAge');
    expect(error).to.be.undefined;

    data.getValue('accounts')[0].setValue('money', 10);
    data.getValue('accounts')[0].setValue('money', 5);
    error = data.getValue('accounts')[0].validateField('money');
    expect(error).to.equal('You can only put even value of money!');
    expect(data.getValue('accounts')[0].errors.get('money')).to.equal(
      'You can only put even value of money!'
    );

    data.getSchema('fatherAge').errorMessage = null;
  });

  it('creates mst with values', () => {
    const mst = buildStore(schema);
    const data = mst.create({
      age: 15,
      name: 'Tomas',
      fatherAge: 50,
      married: true,
      dateMarried: create.date(),
      salary: 2300.34,
      address: {
        street: 'Elm street',
        number: 4
      },
      accounts: [{ number: '111-222', money: 200 }]
    });

    const errors = data.validateDataset();
    expect(errors).to.be.false;

    expect(data.toJS({ replaceDates: false })).toMatchSnapshot();
  });

  it('creates mst with default values', () => {
    const mst = buildStore(schema);
    const defaultData = mst.create({});
    expect(defaultData.toJS({ replaceDates: false, replaceEmpty: false })).toMatchSnapshot();
  });

  it('creates mst with external schemas', () => {
    const n = buildStore(
      {
        type: 'object',
        properties: {
          moo: { $ref: '#/definitions/moo' }
        }
      },
      {
        moo: {
          type: 'object',
          properties: {
            pip: { type: 'string' }
          }
        }
      }
    );
    const data = n.create({ moo: { pip: '1' } });
  });

  it('simulates polymorphism via merging', () => {
    const BaseElement = {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        documentation: { type: 'string' }
      }
    };

    // Flow has nothing, but sequence flow has

    const SequenceFlow = merge(BaseElement, {
      type: 'object',
      properties: {
        conditionExpression: { type: 'string' },
        id: { type: 'string' }
      }
    });

    console.log(SequenceFlow);
    expect(SequenceFlow.properties.id.type).to.equal('string');
    expect(SequenceFlow.properties.conditionExpression.type).to.equal('string');
  });

  it('creates mst with recursive definitions values', () => {
    const recursiveSchema: JSONSchema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        father: { $ref: '#' },
        friends: {
          type: 'array',
          items: { $ref: '#' }
        }
      }
    };
    const mst = buildStore(new Schema(recursiveSchema));
    const defaultData = mst.create({
      name: 'Tomas',
      father: { name: 'Michal Jr', father: { name: 'Michal Sr' } },
      friends: [{ name: 'Tomas' }, { name: 'Harry' }]
    });
    expect(defaultData.toJS({ replaceDates: false, replaceEmpty: false })).to.deep.equal({
      father: {
        father: { father: undefined, friends: [], name: 'Michal Sr' },
        friends: [],
        name: 'Michal Jr'
      },
      friends: [
        { father: undefined, friends: [], name: 'Tomas' },
        { father: undefined, friends: [], name: 'Harry' }
      ],
      name: 'Tomas'
    });
  });

  it('creates mst with referenced definitions values', () => {
    const recursiveSchema: JSONSchema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        car: { $ref: '#/definitions/car' },
        father: { $ref: '#' }
      },
      definitions: {
        car: {
          type: 'object',
          properties: {
            brand: { type: 'string' }
          }
        }
      }
    };
    const mst = buildStore(new Schema(recursiveSchema));
    const defaultData = mst.create({
      name: 'Tomas',
      father: { name: 'Michal Jr' },
      car: { brand: 'Honda' }
    });
    expect(defaultData.toJS()).to.deep.equal({
      car: { brand: 'Honda' },
      father: { car: undefined, father: undefined, name: 'Michal Jr' },
      name: 'Tomas'
    });
  });

  it('validates the root dataset', () => {
    const jSchema = jsonSchema();
    jSchema.oneOf = [{ required: ['name'] }, { required: ['age'] }];
    const rSchema = new Schema(jSchema);

    const store = buildStore(rSchema);
    const d1 = store.create({ name: 'Tomas', age: 39 });
    const errors = d1.validateDataset(); /*?*/
    expect(d1.errors.get('ROOT')).to.equal('should match exactly one schema in oneOf');
  });

  it('correctly removes "possible" invalid values on successful validation of the whole dataset', () => {
    config.setDirty = fake();
    const jSchema: JSONSchema = {
      type: 'object',
      properties: { foo: { type: 'string' }, bar: { type: 'string' } }
    };
    jSchema.anyOf = [{ required: ['foo'] }, { required: ['bar'] }];
    const rSchema = new Schema(jSchema);
    const store = buildStore(rSchema);
    let d1 = store.create({});
    d1.validateDataset(); /*?*/

    expect(d1.errors.get('foo')).to.equal('Value is required');
    expect(d1.errors.get('bar')).to.equal('Value is required');

    d1.setValue('foo', 'foo');
    d1.validateDataset(); /*?*/

    expect(d1.errors.get('foo')).to.be.undefined;
    expect(d1.errors.get('bar')).to.be.undefined;

    d1.setValue('foo', '');
    d1.setValue('bar', 'bar');
    d1.validateDataset(); /*?*/

    expect(d1.errors.get('foo')).to.be.undefined;
    expect(d1.errors.get('bar')).to.be.undefined;
  });

  it('respects validationGroup and correctly removes "possible" invalid values on successful validation', () => {
    config.setDirty = fake();

    const jSchema: JSONSchema = {
      type: 'object',
      properties: {
        foo: { type: 'string', validationGroup: '1' },
        bar: { type: 'string', validationGroup: '1' },
        dar: { type: 'string' }
      }
    };
    jSchema.anyOf = [{ required: ['foo'] }, { required: ['bar'] }];
    const rSchema = new Schema(jSchema);
    const store = buildStore(rSchema);
    let d1 = store.create({});

    d1.validateDataset();
    expect(d1.errors.get('foo')).to.equal('Value is required');
    expect(d1.errors.get('bar')).to.equal('Value is required');

    d1.setValue('foo', 'foo');

    expect(d1.errors.get('foo')).to.equal('');
    expect(d1.errors.get('bar')).to.equal('');

    d1.setValue('foo', '');

    expect(d1.errors.get('foo')).to.equal('Value is required');
    expect(d1.errors.get('bar')).to.equal('Value is required');
  });

  it('allows to use expressions', () => {
    const mst = buildStore(schema);
    const defaultData = mst.create({
      accounts: [{ number: '1', money: 1 }, { number: '2', money: 2 }, { number: '3', money: 3 }]
    });

    expect(defaultData.getValue('accountTotal')).to.equal(6);

    let finalAccount = 0;
    autorun(() => {
      finalAccount = defaultData.getValue('accountTotal');
    });

    // check computed fields
    defaultData.getValue('accounts')[0].setValue('money', 10);
    expect(finalAccount).to.equal(15);
  });
});
