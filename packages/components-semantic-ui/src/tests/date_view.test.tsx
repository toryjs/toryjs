// import { create } from './form_query_data';
// import { JSONSchema } from '@toryjs/form';
// import { testStandard, testEditor, prepareComponent } from './common';

// const schema: JSONSchema = {
//   type: 'object',
//   properties: {
//     date: {
//       type: 'string',
//       format: 'date'
//     },
//     range: {
//       type: 'string'
//     }
//   }
// };

// const formDefinition = create.stack({
//   elements: [
//     {
//       props: { type: 'Date', label: 'Date', value: { source: 'date' } },
//       control: 'Date'
//     },
//     // {
//     //   props: { type: 'Time', label: 'Time', value: { source: 'date' } },
//     //   control: 'Date'
//     // },
//     {
//       props: { type: 'DateTime', label: 'Date Time', value: { source: 'date' } },
//       control: 'Date'
//     },
//     {
//       props: { type: 'DateRange', label: 'Date Range', value: { source: 'range' } },
//       control: 'Date'
//     }
//   ]
// });

// const data = {
//   date: '23/2/1980 11:11'
// };

// describe('DateView', () => {
//   it('renders standard', () => {
//     testStandard(formDefinition, schema, data);
//   });

//   it('renders editor', () => {
//     testEditor(formDefinition, schema, data);
//   });

//   return {
//     component: prepareComponent(formDefinition, schema, data, {
//       addEditor: false,
//       showToolBox: false,
//       showStandard: true,
//       validate: true
//     })
//   };
// });
