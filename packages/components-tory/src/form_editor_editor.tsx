import React from 'react';

import { debounce } from '@tomino/toolbelt';
import { onSnapshot } from 'mobx-state-tree';

import { EditorComponent, FormComponentProps, JSONSchema, FormElement } from '@toryjs/form';
import {
  EditorState,
  EditorContext,
  propGroup,
  boundProp,
  prop,
  handlerProp,
  handle,
  sourceValue,
  schemaDatasetToJS,
  formDatasetToJS,
  setValue,
  getValue,
  simpleHandle,
  DynamicComponent,
  themes,
  ToryEditor
} from '@toryjs/ui';

export type FormEditorProps = {
  showTopMenu: boolean;
  theme: string;
  editorHeight: string;
  formSource: string;
  formSaveHandler: string;
  schemaSource: string;
  schemaSaveHandler: string;
  dataSource: string;
  maximiseHandler: string;
};

const FormEditorComponent = (props: FormComponentProps<FormEditorProps>) => {
  const context = React.useContext(EditorContext);
  const controlProps = props.formElement.props;
  const ref = React.useRef(null);

  // SAVE

  const saveSchema = React.useCallback(
    debounce((snap: JSONSchema) => {
      const serialised = JSON.stringify(schemaDatasetToJS(snap, false));

      if (controlProps.schemaSaveHandler) {
        simpleHandle(props, controlProps.schemaSaveHandler, context, { schema: serialised });
      } else if (sourceValue(controlProps.schemaSource)) {
        setValue(props, context, serialised, 'schemaSource');
      }
    }, 1000),
    [controlProps.schemaSaveHandler, controlProps.schemaSource, props.handlers, props.owner]
  );

  const saveForm = React.useCallback(
    debounce((snap: FormElement) => {
      const serialised = JSON.stringify(formDatasetToJS(snap));

      if (controlProps.formSaveHandler) {
        handle(
          props.handlers,
          controlProps.formSaveHandler,
          props.owner,
          props,
          props.formElement,
          context,
          { form: serialised }
        );
      } else if (controlProps.formSource) {
        setValue(props, context, serialised, 'formSource');
      }
    }, 1000),
    [controlProps.formSaveHandler, controlProps.formSource, props.handlers, props.owner]
  );

  if (!controlProps.schemaSource || !controlProps.formSource) {
    return (
      <DynamicComponent {...props}>
        Please bind the editor to form and schema sources or implement their handlers.
      </DynamicComponent>
    );
  }

  if (controlProps.maximiseHandler) {
    (window as any)[controlProps.maximiseHandler] = function() {
      const style = ref.current.style;
      if (style.position === 'fixed') {
        style.position = 'relative';
      } else {
        style.position = 'fixed';
        style.top = '0px';
        style.left = '0px';
        style.right = '0px';
        style.bottom = '0px';
        style.zIndex = 10000;
      }
    };
  }

  // LOAD

  const newContext = new EditorState(
    context.componentCatalogue,
    context.editorCatalogue,
    context.handlers,
    context.types,
    context.manager.storage
  );
  const schemaString = getValue(props, context, 'schemaSource');
  const formString = getValue(props, context, 'formSource');

  const schema = schemaString ? JSON.parse(schemaString) : { type: 'object', properties: {} };
  const form = formString ? JSON.parse(formString) : { control: 'Form', elements: [] };

  newContext.theme = controlProps.theme === 'light' ? themes.white : themes.black;
  newContext.load(
    {
      schema,
      form
    },
    false
  );

  // listen to snapshot and save when needed
  onSnapshot(newContext.schema as any, saveSchema);
  onSnapshot(newContext.form as any, saveForm);

  return (
    <DynamicComponent {...props}>
      <div
        ref={ref}
        style={{
          minHeight: controlProps.editorHeight || '600px',
          resize: 'vertical',
          position: 'relative',
          border: '1px solid',
          overflowY: 'scroll'
        }}
      >
        <ToryEditor
          {...props}
          context={newContext}
          storage={null}
          project={newContext.project}
          componentCatalogue={newContext.componentCatalogue}
          editorCatalogue={newContext.editorCatalogue}
          handlers={newContext.handlers}
          showTopMenu={controlProps.showTopMenu}
        />
      </div>
    </DynamicComponent>
  );
};

export const FormEditorEditor: EditorComponent<FormEditorProps> = {
  Component: FormEditorComponent,
  title: 'Form Editor',
  control: 'FormEditor',
  icon: 'wpforms',
  props: propGroup('Form Editor', {
    formSource: boundProp({}),
    formSaveHandler: handlerProp({}),
    schemaSource: boundProp({}),
    schemaSaveHandler: handlerProp({}),
    maximiseHandler: prop({}),
    // dataSource: string;
    showTopMenu: prop({ type: 'boolean' }),
    editorHeight: prop({ type: 'string' }),
    theme: prop({
      control: 'Select',
      props: {
        options: [{ text: 'Light', value: 'light' }, { text: 'Dark', value: 'dark' }]
      }
    })
  })
};

export default FormEditorComponent;
