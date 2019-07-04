import React from 'react';
import { Modal, Menu, Button } from 'semantic-ui-react';
import { modalActions } from '../editor_styles';
import { tableRowFull } from '../../components/properties/properties_common';
import { EditorContext } from '../editor_context';
import { formDatasetToJS, schemaDatasetToJS } from '../../helpers';

function copyStringToClipboard(str: string) {
  // Create new element
  var el: HTMLTextAreaElement = document.createElement('textarea');
  // Set value (string to be copied)
  el.value = str || '';
  // Set non-editable to avoid focus and move outside of view
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  // Select text inside element
  el.select();
  // Copy text to clipboard
  document.execCommand('copy');
  // Remove temporary element
  document.body.removeChild(el);
}

// Function to download data to a file
function download(data: string, filename: string, type = 'text/plain') {
  var file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    // Others
    var a = document.createElement('a'),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

export const ModalCode: React.FC = () => {
  const [open, changeOpen] = React.useState(false);
  const editorState = React.useContext(EditorContext);

  const schema = editorState.schema ? schemaDatasetToJS(editorState.schema) : null;
  const form = editorState.form ? formDatasetToJS(editorState.form) : null;

  const text = JSON.stringify(
    {
      form,
      schema
    },
    null,
    2
  );

  //   const text = `/** THIS IS AUTO GENERATED FILE, PLEASE DO NOT MODIFY IT **/

  // import React from 'react';
  // import { FormDefinition, FormModel, JSONSchema } from '@toryjs/form';

  // /** SCHEMA **/
  // export const schema: JSONSchema = ${JSON.stringify(schema, null, 2)};

  // /** FORM **/
  // export const form: FormDefinition = ${JSON.stringify(form, null, 2)};

  // /** COMPONENT **/
  // export const Form = (data: any) => {
  //   const { FormView } = require('dynamic-form-semantic-ui');
  //   const formModel = new FormModel(form, schema, data);
  //   <FormView owner={formModel.dataSet} formElement={formModel} readOnly={false} />
  // }
  // Form.displayName = 'FormView';

  // export default Form;
  // `;

  function buttons(text: string = '') {
    return (
      <div className={modalActions}>
        {text && <div className={tableRowFull}>{text}</div>}
        <Button onClick={() => changeOpen(false)}>Close</Button>
        <Button
          primary
          onClick={() => {
            download(text, 'form.ts');
            changeOpen(false);
          }}
          icon="download"
          color="green"
          content="Download"
        />
        <Button
          onClick={() => {
            copyStringToClipboard(text);
            changeOpen(false);
          }}
          icon="copy"
          color="green"
          content="Copy to Clipboard"
        />
      </div>
    );
  }

  return (
    <Modal
      trigger={
        <Menu.Item
          icon="code"
          title="Source code of the form"
          onClick={() => {
            changeOpen(true);
          }}
        />
      }
      open={open}
    >
      <Modal.Header>{buttons('Form Source')}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <pre>{text}</pre>
          {buttons()}
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};
