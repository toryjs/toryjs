import { generateSchema } from '../schema_generator';

xit('generates schema from resources', () => {
  const schema = {
    type: 'object',
    default: ['foo'],
    properties: {
      external: {
        $id: 'sid'
      },
      foo: {
        type: 'number',
        min: 0
      },
      boo: {},
      moo: {
        type: 'number'
      },
      obj: {
        type: 'object',
        properties: {
          tom: {
            type: 'string'
          },
          gon: {
            max: 2
          },
          mon: {
            properties: {
              bon: {},
              leaf: {},
              finish: {
                min: 2
              }
            }
          }
        }
      }
    }
  };

  const resources = [
    {
      type: 'Form',
      readRoles: ['Role 33', 'Role 38'],
      content: JSON.stringify({
        elements: [
          { source: 'foo' },
          { source: 'obj.mon.finish' },
          {
            source: 'obj',
            elements: [{ source: 'mon.bon' }]
          }
        ]
      })
    },
    { type: 'Document', ref: 'refId' },
    { type: 'Url', link: 'http://link' },
    {
      type: 'Form',
      content: JSON.stringify({
        elements: [{ source: 'obj.gon' }]
      })
    }
  ];

  const newSchema = generateSchema(schema, resources as any);

  expect(newSchema).to.deep.equal({
    type: 'object',
    default: ['foo'],
    properties: {
      foo: {
        type: 'number',
        min: 0
      },
      obj: {
        type: 'object',
        properties: {
          mon: {
            properties: {
              finish: {
                min: 2
              },
              bon: {}
            }
          },
          gon: {
            max: 2
          }
        }
      }
    }
  });
});
