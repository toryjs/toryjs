// import { JSONSchema, FormElement, config } from '@toryjs/form';

// import { create } from '@toryjs/ui';
// import { prepareComponent } from './common';

// const date = new Date('2018-10-15T00:05:32.000Z');
// const signatureSchema: JSONSchema = {
//   type: 'object',
//   properties: {
//     comment: {},
//     signature: {},
//     verifiedState: {},
//     rejected: {
//       type: 'boolean'
//     },
//     uid: {},
//     name: {},
//     date: {
//       type: 'string',
//       format: 'date-time'
//     }
//   }
// };
// const schema: JSONSchema = {
//   type: 'object',
//   properties: {
//     deanSignature: signatureSchema,
//     supervisorSignature: signatureSchema,
//     supervisorSignature2: signatureSchema,
//     supervisorSignature3: signatureSchema,
//     studentSignature: signatureSchema
//   }
// };

// const signature =
//   'oiuoiu3o4uoi34u43o34kbkjh43jhbiu3y498734h34ln34oiu349873948u3ol4n3l4n3oi4j3o4u394879384yo3hj4oij34o3u94873984739843iou4hk3j4hio3uh4iu3y497834987349873984ho34ihj';
// const formData = {
//   deanSignature: {
//     comment: 'All wrong',
//     date,
//     rejected: true,
//     name: 'Simeon Simoff'
//   },
//   supervisorSignature: {
//     date,
//     signature,
//     name: 'Alladin Hasan'
//   },
//   supervisorSignature2: {
//     date,
//     signature,
//     name: 'Alladin Hasan'
//   },
//   supervisorSignature3: {
//     date,
//     signature,
//     name: 'Alladin Hasan'
//   },
//   studentSignature: {}
// };

// const formDefinition: FormElement = create.grid({
//   props: { rows: 4, columns: 3, gap: '24px' },
//   elements: [
//     {
//       control: 'Signature',
//       props: {
//         row: 1,
//         column: 1,
//         width: 1,
//         font: 'Pacifico',
//         allowComment: false,
//         label: 'Dean Signature',
//         value: { source: 'deanSignature' }
//       }
//     },
//     {
//       control: 'Signature',
//       props: {
//         row: 1,
//         column: 2,
//         width: 1,
//         font: 'Indie Flower',
//         allowComment: false,
//         label: 'Supervisor Signature',
//         value: { source: 'supervisorSignature' }
//       }
//     },
//     {
//       control: 'Signature',
//       props: {
//         row: 1,
//         column: 3,
//         width: 1,
//         font: 'Charm',
//         allowComment: false,
//         label: 'Student Signature',
//         value: { source: 'studentSignature' }
//       }
//     },
//     {
//       control: 'Signature',
//       props: {
//         row: 2,
//         column: 3,
//         width: 1,
//         font: 'Charm',
//         allowComment: true,
//         submit: true,
//         label: 'Student Signature',
//         value: { source: 'studentSignature' }
//       }
//     },
//     {
//       control: 'Signature',
//       props: {
//         row: 2,
//         column: 2,
//         width: 1,
//         font: 'Indie Flower',
//         allowComment: false,
//         label: 'Supervisor Signature',
//         value: { source: 'supervisorSignature2' }
//       }
//     },
//     {
//       control: 'Signature',
//       props: {
//         row: 3,
//         column: 2,
//         width: 1,
//         font: 'Indie Flower',
//         allowComment: false,
//         label: 'Supervisor Signature',
//         value: { source: 'supervisorSignature3' }
//       }
//     },
//     {
//       control: 'Signature',
//       props: {
//         row: 3,
//         column: 3,
//         width: 1,
//         font: 'Charm',
//         allowComment: false,
//         allowReject: true,
//         label: 'Student Signature',
//         value: { source: 'studentSignature' }
//       }
//     },
//     {
//       control: 'Signature',
//       props: {
//         row: 4,
//         column: 3,
//         width: 1,
//         font: 'Charm',
//         allowComment: true,
//         allowReject: true,
//         label: 'Student Signature',
//         value: { source: 'studentSignature' }
//       }
//     }
//   ]
// });

// const results = ['Pending', 'Verified', 'Rejected'];
// let ci = 0;

// describe('Signature', function() {
//   before(() => {
//     config.setDirty = mock.fake();
//   });

//   return {
//     component: prepareComponent(formDefinition, schema, formData, {
//       addEditor: true,
//       handlers: {
//         sign: () => {
//           return new Promise(resolve =>
//             setTimeout(() => {
//               resolve({
//                 date,
//                 signature,
//                 name: 'Alladin Hasan',
//                 verifiedState: 'Verified'
//               } as any);
//             }, 1000)
//           );
//         },
//         verifySignature: () => Promise.resolve(results[ci++ % 3]),
//         signatureFont: () => 'Pacifico',
//         validateForm: () => true
//       }
//     })
//   };
// });
