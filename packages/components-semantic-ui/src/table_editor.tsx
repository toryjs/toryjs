import * as React from 'react';

import { FormComponentProps, EditorComponent } from '@toryjs/form';
import { TableView, TableProps, createDataset } from './table_view';
import { observer } from 'mobx-react';
import {
  prop,
  propGroup,
  handlerProp,
  boundProp,
  EditorContext,
  DynamicComponent,
  TemplateEditor,
  EditorControl,
  SingleDropCell,
  FormDataSet
} from '@toryjs/ui';
import { Table } from 'semantic-ui-react';

import { align, verticalAlign } from './enums';
import { toJS } from 'mobx';

const templates = [
  { text: 'Component View', value: 'component' },
  { text: 'View Template', value: 'view' },
  { text: 'Edit Template', value: 'edit' },
  { text: 'Add Template', value: 'add' }
];

const Template = observer((props: FormComponentProps<TableProps> & { templateIndex: number }) => {
  const editorState = React.useContext(EditorContext);
  let addDataset = createDataset(props.formElement.props.items, toJS(props.owner));
  let formElement = props.formElement;
  let template = formElement.elements[props.templateIndex];
  let elements = template.elements;
  let items = props.formElement.props.items;

  editorState.project.state.selectedElement;

  if (formElement.elements.length <= props.templateIndex) {
    (formElement as FormDataSet).insertRow('elements', props.templateIndex, {
      elements: []
    });
    // setTimeout(() => (formElement as FormDataSet).insertRow('elements', props.templateIndex, []), 1);
    return;
  }

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          {items.map((m, i) => (
            <Table.HeaderCell key={m.title + i}>{m.title}</Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          {items.map((m, i) => (
            <Table.Cell key={m.title + i}>
              {elements.length > i && elements[i] ? (
                <EditorControl
                  props={{ ...(props as any), owner: addDataset }}
                  formElement={elements[i]}
                />
              ) : (
                <SingleDropCell
                  {...props}
                  formElement={template}
                  className=""
                  id={i.toString()}
                  elementIndex={i}
                />
              )}
            </Table.Cell>
          ))}
        </Table.Row>
      </Table.Body>
      <Table.Body />
    </Table>
  );
});

const TableComponent = (props: FormComponentProps<TableProps>) => {
  return (
    <DynamicComponent {...props} hideLabel={true}>
      <TemplateEditor
        {...props}
        extra={props.extra}
        Component={TableView.Component}
        Template={Template}
        options={templates}
      />
    </DynamicComponent>
  );
};

export const TableEditor: EditorComponent = {
  Component: observer(TableComponent),
  title: 'Table',
  control: 'Table',
  icon: 'code',
  bound: true,
  valueProvider: 'value',
  defaultChildren: [
    {
      elements: []
    },
    {
      elements: []
    },
    {
      elements: []
    }
  ],
  props: {
    ...propGroup('Templates', {
      allowAdd: prop({ type: 'boolean' }),
      allowEdit: prop({ type: 'boolean' }),
      allowDelete: prop({ type: 'boolean' }),
      customView: prop({ type: 'boolean' })
    }),
    ...propGroup('Table', {
      value: boundProp(),
      template: prop({
        control: 'Select',
        props: {
          options: templates,
          default: 'component'
        }
      }),
      propSource: prop({}),
      attached: boundProp({
        type: 'boolean',
        control: 'Select',
        props: {
          options: [
            { text: '', value: '--' },
            { text: 'Top', value: 'top' },
            { text: 'Bottom', value: 'bottom' },
            { text: 'Both', value: true }
          ]
        }
      }),
      basic: boundProp({
        type: 'boolean',
        control: 'Select',
        props: {
          options: [
            { text: '', value: '--' },
            { text: 'Very', value: 'very' },
            { text: 'Normal', value: true }
          ]
        }
      }),
      inverted: boundProp({ type: 'boolean', control: 'Checkbox' }),
      celled: boundProp({ type: 'boolean' }),
      collapsing: boundProp({ type: 'boolean' }),
      compact: boundProp({
        type: 'boolean',
        control: 'Select',
        props: {
          options: [
            { text: '', value: '--' },
            { text: 'Very', value: 'very' },
            { text: 'Normal', value: true }
          ]
        }
      }),
      padded: boundProp({
        type: 'boolean',
        control: 'Select',
        props: {
          options: [
            { text: '', value: '--' },
            { text: 'Very', value: 'very' },
            { text: 'Normal', value: true }
          ]
        }
      }),
      fixed: boundProp({ type: 'boolean' }),
      selectable: boundProp({ type: 'boolean' }),
      singleLine: boundProp({ type: 'boolean' }),
      sortable: boundProp({ type: 'boolean' }),
      stackable: boundProp({ type: 'boolean' }),
      striped: boundProp({ type: 'boolean' }),
      structured: boundProp({ type: 'boolean' }),
      textAlign: boundProp({ control: 'Select', props: { options: align } }),
      verticalAlign: boundProp({ control: 'Select', props: { options: verticalAlign } })
    }),
    ...propGroup('Handlers', {
      onCreate: handlerProp(),
      onAdd: handlerProp(),
      onSave: handlerProp(),
      onDelete: handlerProp()
    }),
    items: prop({
      control: 'Table',
      props: { text: 'Columns' },
      elements: [
        {
          props: { placeholder: 'Title', value: { source: 'title' } }
        },
        {
          props: {
            value: { source: 'source' },
            text: 'Source',
            options: { handler: 'datasetSource' }
          },
          control: 'Select'
        },
        {
          control: 'Select',
          props: {
            text: 'Type',
            value: { source: 'type' },
            options: [
              {
                value: 'string',
                text: 'String'
              },
              {
                value: 'number',
                text: 'Number'
              },
              {
                value: 'boolean',
                text: 'Boolean'
              }
            ]
          }
        }
      ],
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          source: { type: 'string' },
          type: { type: 'string' }
        }
      }
    })
  }
};
