import React from 'react';
import renderer from 'react-test-renderer';

import { expect } from 'chai';

import {
  FormElement,
  JSONSchema,
  FormComponentCatalogue,
  EditorComponentCatalogue
} from '@toryjs/form';

import { create } from './form_query_data';

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

export type TestProps = {
  formDefinition: FormElement;
  schema: JSONSchema;
  data: any;
  catalogue: FormComponentCatalogue;
  catalogueEditor: EditorComponentCatalogue;
};

export type TestComponentProps = {
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

let TestComponent: React.ComponentType<TestComponentProps>;

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
  catalogueEditor: EditorComponentCatalogue,
  Test: React.ComponentType<TestComponentProps>
) {
  TestComponent = Test;
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
    // just another notation
    return (
      <TestComponent
        data={props.data}
        form={props.formDefinition}
        schema={props.schema}
        handlers={handlers}
        showEditor={addEditor}
        showToolbox={showToolBox}
        showOutline={showOutline}
        showStandard={showStandard}
        showReadonly={showReadOnly}
        showProperties={showProperties}
        validate={validate}
      />
    );
  };
}

// export function prepareComponent() {
//   return () => <div>werwerwer</div>;
// }
