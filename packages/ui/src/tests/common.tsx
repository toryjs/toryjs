import React from 'react';
import renderer from 'react-test-renderer';

import { Header, Segment } from 'semantic-ui-react';
import {
  FormModel,
  DataSet,
  FormElement,
  JSONSchema,
  FormComponentCatalogue,
  EditorComponentCatalogue
} from '@toryjs/form';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

import 'prismjs/themes/prism.css';
import 'prismjs/themes/prism-dark.css';

import { FormView } from '../components/form_view';
import { ToolBox } from '../editor/toolbox/tool_box';
import { PropertyEditor } from '../editor/properties/property_view';
import { ErrorBoundary } from '../components/error_boundary';
import { Context } from '../context';
import { EditorContext, EditorContextType } from '../editor/editor_context';
import { EditorState } from '../editor/editor_state';

import { OutlineView } from '../editor/outline/outline_view';
import { List } from '../editor/editor_styles';
import { create } from './form_query_data';

type Props = {
  form: FormModel;
  editComponent?: DataSet;
  context?: EditorContextType;
  showStandard?: boolean;
  showReadonly?: boolean;
  showToolbox?: boolean;
  showProperties?: boolean;
  showOutline?: boolean;
  validate?: boolean;
  handlers?: any;
  catalogue?: FormComponentCatalogue;
  catalogueEditor?: EditorComponentCatalogue;
};

export type Options = {
  addEditor?: boolean;
  showToolBox?: boolean;
  showReadOnly?: boolean;
  showStandard?: boolean;
  showProperties?: boolean;
  showOutline?: boolean;
  validate?: boolean;
  handlers?: any;
};

export const d = 2;

export type TestProps = {
  formDefinition: FormElement;
  schema: JSONSchema;
  data: any;
  catalogue: FormComponentCatalogue;
  catalogueEditor: EditorComponentCatalogue;
};

export function testStandard(testProps: TestProps) {
  const component = prepareComponent(testProps, {
    addEditor: false,
    showReadOnly: false
  });
  const wrapper = renderer.create(component());
  expect(wrapper).toMatchSnapshot();
}
export function testReadonly(props: TestProps) {
  const component = prepareComponent(props, {
    addEditor: false,
    showReadOnly: true,
    showStandard: false
  });
  const wrapper = renderer.create(component());
  expect(wrapper).toMatchSnapshot();
}
export function testEditor(props: TestProps) {
  const component = prepareComponent(props, {
    addEditor: true,
    showReadOnly: false,
    showStandard: false,
    showProperties: false,
    showToolBox: false
  });
  const wrapper = renderer.create(component());
  expect(wrapper).toMatchSnapshot();
}

export function bindCatalogues(
  catalogue: FormComponentCatalogue,
  catalogueEditor?: EditorComponentCatalogue
) {
  return {
    prepareComponent(formDefinition: FormElement, schema: JSONSchema, data: any, options: Options) {
      return prepareComponent(
        { formDefinition, schema, data, catalogue, catalogueEditor },
        options
      );
    },
    testEditor(formDefinition: FormElement, schema: JSONSchema, data: any) {
      testEditor({ formDefinition, schema, data, catalogue, catalogueEditor });
    },
    testReadonly(formDefinition: FormElement, schema: JSONSchema, data: any) {
      testReadonly({ formDefinition, schema, data, catalogue, catalogueEditor });
    },
    testStandard(formDefinition: FormElement, schema: JSONSchema, data: any) {
      testStandard({ formDefinition, schema, data, catalogue, catalogueEditor });
    },
    create
  };
}

export function prepareComponent(
  props: TestProps,
  {
    addEditor = false,
    showToolBox = true,
    showReadOnly = false,
    showStandard = true,
    showProperties = true,
    showOutline = false,
    validate = false,
    handlers = {}
  }: Options = {}
) {
  return function component() {
    const form = new FormModel(props.formDefinition, props.schema, props.data);
    let context: EditorContextType = null;
    if (addEditor) {
      context = new EditorState(props.catalogue, props.catalogueEditor, handlers);
      context.load(
        {
          form: form.formDefinition,
          schema: props.schema
        },
        false
      );

      if (validate) {
        form.validateWithReport();
      }
    }

    // just another notation
    return (
      <TestComponent
        form={form}
        context={context}
        handlers={handlers}
        showToolbox={showToolBox}
        showOutline={showOutline}
        showStandard={showStandard}
        showReadonly={showReadOnly}
        showProperties={showProperties}
      />
    );
  };
}

// @DragDropContext(HTML5Backend)
@observer
export class TestComponent extends React.Component<Props> {
  render() {
    const { form, context, handlers, catalogue, catalogueEditor } = this.props;

    return (
      <ErrorBoundary>
        <Context.Provider
          value={{
            auth: observable({ user: null }),
            providers: {},
            authToken: null
          }}
        >
          <Segment>
            {this.props.showStandard && (
              <>
                <Header content="Standard" dividing />
                <FormView
                  formElement={form}
                  owner={form.dataSet}
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
                  formElement={form}
                  owner={form.dataSet}
                  readOnly={true}
                  handlers={handlers}
                  catalogue={catalogue}
                />
              </>
            )}
            {context && (
              <EditorContext.Provider value={context}>
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
                      formElement={context.form}
                      owner={form.dataSet}
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
              </EditorContext.Provider>
            )}
          </Segment>
        </Context.Provider>
      </ErrorBoundary>
    );
  }
}

// export function prepareComponent() {
//   return () => <div>werwerwer</div>;
// }
