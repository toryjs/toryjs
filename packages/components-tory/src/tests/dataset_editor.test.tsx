// import * as React from 'react';

// import { JSONSchema, FormElement } from '@toryjs/form';
// import { prepareComponent } from '@toryjs/ui';
// import { catalogue } from '../catalogue';
// import { catalogueEditor } from '../catalogue_editor';

// const schema: JSONSchema = {
//   type: 'object',
//   properties: {
//     schema: {
//       type: 'string'
//     }
//   }
// };

// const formDefinition: FormElement = {
//   control: 'Stack',
//   props: {
//     gap: '12px'
//   },
//   elements: [
//     {
//       control: 'DatasetEditor',
//       props: {
//         source: { source: 'schema' },
//         theme: 'light',
//         height: '400px'
//       }
//     }
//   ]
// };

// describe('Dataset Editor', () => {
//   // it('renders correctly', () => {
//   //   const comp = renderer.create(component());
//   //   expect(comp).toMatchSnapshot();
//   // });

//   const Component = prepareComponent(
//     {
//       formDefinition,
//       schema,
//       data: {
//         schema: JSON.stringify({
//           type: 'object',
//           properties: {
//             name: { type: 'string', title: 'name' },
//             age: { type: 'number', title: 'age' },
//             car: {
//               type: 'object',
//               title: 'car',
//               properties: {
//                 model: { type: 'string', title: 'model' },
//                 year: { type: 'number', title: 'year' }
//               }
//             },
//             relatives: {
//               type: 'array',
//               items: {
//                 type: 'object',
//                 properties: {
//                   father: { type: 'string', title: 'father' },
//                   mother: { type: 'string', title: 'mother' }
//                 }
//               }
//             }
//           }
//         })
//       },
//       catalogue,
//       catalogueEditor
//     },
//     {
//       addEditor: true,
//       showReadOnly: false
//     }
//   );

//   const Wrapper = () => (
//     <div style={{ height: '600px' }}>
//       <Component />
//     </div>
//   );

//   return {
//     component: Wrapper
//   };
// });
