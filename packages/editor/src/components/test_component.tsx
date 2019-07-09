import React from 'react';

import { Header, Segment } from 'semantic-ui-react';

import { observer } from 'mobx-react';
import { observable } from 'mobx';

import { FormView, ErrorBoundary, Context, ContextType, EditorContext } from '@toryjs/ui';
import {
  FormModel,
  FormComponentCatalogue,
  EditorComponentCatalogue,
  JSONSchema,
  FormElement
} from '@toryjs/form';

import { ToolBox, List } from '../editor/editor_styles';
import { OutlineView } from '../editor/outline/outline_view';
import { PropertyEditor } from '../editor/properties/property_view';
import { createEditorContext } from '../editor/context';
import { themes } from '../editor/themes';

export type Props = {
  form: FormElement;
  schema: JSONSchema;
  showStandard?: boolean;
  showReadonly?: boolean;
  showToolbox?: boolean;
  showEditor?: boolean;
  showProperties?: boolean;
  showOutline?: boolean;
  validate?: boolean;
  handlers?: any;
  data: any;
  catalogue?: FormComponentCatalogue;
  catalogueEditor?: EditorComponentCatalogue;
};

// @DragDropContext(HTML5Backend)
@observer
export class TestComponent extends React.Component<Props> {
  render() {
    const {
      form,
      handlers,
      catalogue,
      catalogueEditor,
      schema,
      validate,
      showProperties,
      showOutline,
      showEditor,
      data
    } = this.props;

    const context = new ContextType();
    const formModel = new FormModel(form, schema, data);
    let editorContext: EditorContext;

    if (showEditor || showOutline || showProperties) {
      editorContext = createEditorContext(
        {
          componentCatalogue: catalogue,
          editorCatalogue: catalogueEditor,
          handlers: handlers,
          storage: null,
          theme: themes.light
        },
        context
      );

      editorContext.load(
        {
          form: formModel.formDefinition,
          schema: schema
        },
        false
      );
    }

    if (validate) {
      formModel.validateWithReport();
    }

    return (
      <ErrorBoundary>
        <Context.Provider
          value={{
            auth: observable({ user: null }),
            providers: {},
            authToken: null,
            editor: editorContext
          }}
        >
          <Segment>
            {this.props.showStandard && (
              <>
                <Header content="Standard" dividing />
                <FormView
                  formElement={formModel}
                  owner={formModel.dataSet}
                  readOnly={false}
                  handlers={handlers}
                  catalogue={catalogue}
                />
              </>
            )}
            {this.props.showReadonly && (
              <>
                <Header content="Readonly" dividing />
                <FormView
                  formElement={formModel}
                  owner={formModel.dataSet}
                  readOnly={true}
                  handlers={handlers}
                  catalogue={catalogue}
                />
              </>
            )}
            {showEditor && context && (
              <Context.Provider value={context}>
                <Header content="Editor" dividing />
                <div style={{ display: 'flex' }}>
                  {this.props.showToolbox && (
                    <div style={{ position: 'relative', flexBasis: '200px', paddingRight: '12px' }}>
                      <ToolBox catalogue={catalogueEditor} />
                    </div>
                  )}

                  {this.props.showOutline && (
                    <div style={{ position: 'relative', flexBasis: '200px', paddingRight: '12px' }}>
                      <List>
                        <OutlineView />
                      </List>
                    </div>
                  )}

                  <div style={{ flex: '1' }}>
                    <FormView
                      formElement={context.editor.form}
                      owner={formModel.dataSet}
                      readOnly={false}
                      handlers={handlers}
                      catalogue={catalogueEditor}
                    />
                  </div>

                  {context && this.props.showProperties && (
                    <div
                      style={{
                        padding: '12px',
                        flexBasis: '350px',
                        minHeight: '600px',
                        position: 'relative'
                      }}
                    >
                      <PropertyEditor />
                    </div>
                  )}
                </div>
              </Context.Provider>
            )}
          </Segment>
        </Context.Provider>
      </ErrorBoundary>
    );
  }
}
