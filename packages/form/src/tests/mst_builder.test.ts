import { JSONSchema } from '../json_schema';
import { buildStore } from '../mst_builder';

xdescribe('mst builder', () => {
  it('generates union of types when anyOf is specified', () => {
    const schema: JSONSchema = {
      properties: {
        foo: { type: 'string' }
      },
      anyOf: [
        {
          properties: {
            boo: { type: 'object', properties: { moo: { type: 'string' } } }
          }
        },
        {
          properties: {
            boo: { type: 'object', properties: { goo: { type: 'string' } } }
          }
        }
      ]
    };
    const store = buildStore(schema);
    let data1 = store.create({ foo: 'A', boo: { moo: 'moo' } });
    expect(data1.getValue('boo.moo')).to.equal('moo');
    let data2 = store.create({ foo: 'A', boo: { goo: 'goo' } });
    // console.log(data2.boo);

    expect(data2.getValue('boo.goo')).to.equal('goo');
  });
});
