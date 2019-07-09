// import React from 'react';
// import { Modal, Menu, Button } from 'semantic-ui-react';
// import { modalActions } from './editor_styles';
// import { ProjectManager } from '../storage';
// import { JSONSchema, FormDefinition } from '@toryjs/form';

// type Props = {
//   manager: ProjectManager;
// };

// export const ModalUpload: React.FC<Props> = () => {
//   const [open, changeOpen] = React.useState(false);

//   let schema: JSONSchema;
//   let form: FormDefinition;

//   function loadFile(e: React.ChangeEvent<HTMLInputElement>) {
//     if (e.currentTarget.files && e.currentTarget.files[0]) {
//       var myFile = e.currentTarget.files[0];
//       var reader = new FileReader();

//       reader.addEventListener('load', function(f: any) {
//         let text = f.target.result;
//         if (!text) {
//           alert('Failed loading form file');
//         }
//         let schemaIndex = text.indexOf('/** SCHEMA **/');
//         let formIndex = text.indexOf('/** FORM **/');
//         let componentIndex = text.indexOf('/** COMPONENT **/');

//         if (schemaIndex === -1 || formIndex === -1 || componentIndex === -1) {
//           alert('Failed loading form file. Please do not modify the form source');
//         }

//         try {
//           let schemaText = text.substring(schemaIndex + 15, formIndex - 3);
//           schemaText = schemaText.replace(/export const schema(: JSONSchema)? = /, '');
//           schema = JSON.parse(schemaText);

//           let formText = text.substring(formIndex + 13, componentIndex - 3);
//           formText = formText.replace(/export const form(: FormDefinition)? = /, '');
//           form = JSON.parse(formText);
//         } catch (ex) {
//           alert('Failed to load the project file: ' + ex.message);
//         }
//       });
//       reader.readAsText(myFile);
//     }
//   }

//   function loadForm() {
//     // changeProject(form, schema);
//     throw new Error('Not implements ..');
//     changeOpen(false);
//   }

//   return (
//     <Modal
//       trigger={
//         <Menu.Item
//           icon="upload"
//           title="Upload file from disk"
//           onClick={() => {
//             changeOpen(true);
//           }}
//         />
//       }
//       open={open}
//     >
//       <Modal.Header>Load an existing form</Modal.Header>
//       <Modal.Content>
//         <Modal.Description>
//           If you continue, you will lose all unsaved changes.
//           <br />
//           <br />
//           <input type="file" id="myFile" onChange={loadFile} />
//           <div className={modalActions}>
//             <Button onClick={() => changeOpen(false)}>Close</Button>
//             <Button onClick={loadForm} icon="folder open" primary content="Load" />
//           </div>
//         </Modal.Description>
//       </Modal.Content>
//     </Modal>
//   );
// };
