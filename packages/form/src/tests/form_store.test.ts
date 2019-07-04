import { fake } from 'sinon';

import { Schema } from '../data_schema_model';
import { buildStore } from '../mst_builder';
import { JSONSchema } from '../json_schema';
import { config } from '../config';

config.setDirty = fake();

describe('FormStore', () => {
  describe('setValue', () => {
    let jsonSchema: JSONSchema = {
      type: 'object',
      properties: {
        simple: { type: 'number' },
        person: {
          type: 'object',
          properties: {
            address: {
              type: 'object',
              properties: {
                street: {
                  type: 'string'
                }
              },
              required: ['street']
            }
          }
        }
      }
    };

    function initDataset(data: any = {}) {
      const schema = new Schema(jsonSchema);
      return buildStore(schema).create(data);
    }

    it('sets flat value', () => {
      let dataset = initDataset();
      dataset.setValue('simple', 4);
      expect(dataset.getValue('simple')).to.equal(4);
    });

    it('sets complex value', () => {
      let dataset = initDataset();
      dataset.setValue('person.address.street', 'Elm');
      expect(dataset.getValue('person.address.street')).to.equal('Elm');

      dataset.setValue('person.address.street', '');
      expect(dataset.getError('person.address.street')).to.equal('Value is required');
    });
  });
});
