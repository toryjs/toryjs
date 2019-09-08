import * as React from 'react';

import { observer } from 'mobx-react';
import { Button, Table, TableProps as TablePropsSUI } from 'semantic-ui-react';
import {
  DataSet,
  FormComponentProps,
  FormComponent,
  JSONSchema,
  FormElement,
  JSONSchema7TypeName,
  buildDataSet,
  BoundProp
} from '@toryjs/form';

import { ErrorView } from './error_view';
import {
  css,
  toJS,
  propName,
  getValue,
  getPropValue,
  simpleHandle,
  valueSource,
  Context,
  DynamicComponent,
  getObjectValue
} from '@toryjs/ui';

export function createDataset(items: Column[], parent: any) {
  let schema: JSONSchema = {
    type: 'object',
    properties: {}
  };
  for (let column of items) {
    schema.properties[column.source] = {
      type: column.type || 'string'
    };
  }
  return buildDataSet(schema, toJS(parent));
}

export const tableAddButton = css`
  margin-top: 12px !important;
`;

type Column = {
  title: string;
  source: string;
  type: JSONSchema7TypeName;
};

export type TableProps = TablePropsSUI & {
  propSource: string;
  onCreate: string;
  onAdd: string;
  onSave: string;
  onDelete: string;
  items: Column[];
  allowAdd?: boolean;
  allowEdit?: boolean;
  allowDelete?: boolean;
  customView?: boolean;
  value: BoundProp;
};

function hasControl(template: FormElement, i: number) {
  return template && template.elements && template.elements.length > i && template.elements[i];
}

const tableProps = [
  'attached',
  'basic',
  'inverted',
  'celled',
  'collapsing',
  'compact',
  'padded',
  'fixed',
  'selectable',
  'singleLine',
  'sortable',
  'stackable',
  'striped',
  'structured',
  'textAlign',
  'verticalAlign'
];

const TableComponent: React.FC<FormComponentProps<TableProps>> = props => {
  const [editingRow, editRow] = React.useState(-1);
  const context = React.useContext(Context);
  const controlProps = props.formElement.props || ({} as TableProps);
  const {
    formElement,
    owner
  }: { formElement: FormElement<TableProps>; owner: DataSet } = controlProps.onCreate
    ? simpleHandle(props, controlProps.onCreate, context)
    : { formElement: props.formElement, owner: props.owner };
  const readOnly = props.readOnly;

  if (!formElement) {
    return <div>Error creating table. Table has no form element.</div>;
  }

  const list: DataSet[] = controlProps.propSource
    ? props.dataProps
      ? props.dataProps[controlProps.propSource]
      : []
    : getValue(props, context) || [];

  const { items, allowAdd, allowDelete, allowEdit, customView } =
    formElement.props || ({} as TableProps);

  const edit = React.useCallback((e: React.MouseEvent) => {
    editRow(parseInt(e.currentTarget.getAttribute('data-index')));
  }, []);

  const source = propName(props.formElement);

  const viewTemplate =
    formElement.elements && formElement.elements.length > 0 && formElement.elements[0];
  const editTemplate =
    formElement.elements && formElement.elements.length > 1 && formElement.elements[1];
  const addTemplate =
    formElement.elements && formElement.elements.length > 2 && formElement.elements[2];

  let filteredItems = (items || []).filter(i => i && i.title && i.type && i.source);

  // build add dataset
  const addDataset = React.useMemo(() => {
    return createDataset(filteredItems, owner);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const addRow = React.useCallback(() => {
    const data: any = toJS(addDataset);
    if (formElement.props.onAdd) {
      simpleHandle(props, formElement.props.onAdd, context, { data });
    } else if (data.__item) {
      owner.addRow(source, data.__item);
    } else {
      owner.addRow(source, data);
    }
  }, [addDataset, context, formElement.props.onAdd, owner, props, source]);

  let rowDataset = editingRow >= 0 ? createDataset(items, list[editingRow]) : null;
  const cancelEdit = React.useCallback(() => {
    editRow(-1);
  }, []);
  const editRowHandler = React.useCallback(() => {
    const data: any = toJS(rowDataset);
    if (formElement.props.onSave) {
      simpleHandle(props, formElement.props.onSave, context, { data });
    } else if (owner && owner.replaceRow) {
      const source = valueSource(props.formElement);
      owner.replaceRow(source, editingRow, data);
    } else {
      alert('You need to define an on save handler');
    }
    editRow(-1);
  }, [context, editingRow, formElement.props.onSave, owner, props, rowDataset]);

  const deleteRow = React.useCallback(
    (e: React.MouseEvent) => {
      if (formElement.props.onDelete) {
        simpleHandle(props, formElement.props.onDelete, context, {
          index: parseInt(e.currentTarget.getAttribute('data-index')),
          data: list
        });
      } else {
        owner.removeRowIndex(source, parseInt(e.currentTarget.getAttribute('data-index')));
      }
    },
    [context, formElement.props.onDelete, list, owner, props, source]
  );

  if (!filteredItems || !filteredItems.length) {
    return <div>You need to define table columns</div>;
  }

  let simpleArray = filteredItems.length === 1 && filteredItems[0].source === '__item';

  if (!list) {
    return <div>Collection contains no items ...</div>;
  }

  const catalogue = controlProps.onCreate
    ? context.editor.componentCatalogue
    : context.editor.editorCatalogue;
  const { extra, ...cleanProps } = props;
  const childProps = controlProps.onCreate ? cleanProps : props;

  return (
    <DynamicComponent control={Table} controlProps={tableProps} {...props}>
      <Table.Header>
        <Table.Row>
          {filteredItems.map((m, i) => (
            <Table.HeaderCell key={m.title + i}>{m.title}</Table.HeaderCell>
          ))}
          {!readOnly && (allowEdit || allowDelete || allowAdd) ? <Table.HeaderCell /> : null}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {list.map((row, i) => (
          <Table.Row key={i}>
            {editingRow === i
              ? filteredItems.map((e, i) => {
                  // If this is a simple array
                  if (simpleArray) {
                    const r = row;
                    row = {
                      setValue(_s: any, value: any) {
                        owner.replaceRow(source, i, value);
                      },
                      getValue() {
                        return r;
                      },
                      getSchema() {
                        return owner.getSchema().items;
                      },
                      isRequired() {
                        return false;
                      }
                    } as any;
                  } else {
                    row = rowDataset;
                  }
                  return (
                    <Table.Cell key={i}>
                      {catalogue.createComponent(
                        { ...(childProps as any), owner: row, dataProps: owner },
                        hasControl(editTemplate, i)
                          ? editTemplate.elements[i]
                          : {
                              control: 'Input',
                              props: { value: { source: e.source } }
                            },
                        context
                      )}
                    </Table.Cell>
                  );
                })
              : filteredItems.map((m, j) => {
                  const value = m.source === '__item' ? row : getObjectValue(row, m.source);
                  return (
                    <Table.Cell key={m.title + j}>
                      {customView && hasControl(viewTemplate, j)
                        ? catalogue.createComponent(
                            {
                              ...(childProps as any),
                              owner: row,
                              dataProps: owner
                            },
                            viewTemplate.elements[j],
                            context
                          )
                        : value && typeof value == 'object'
                        ? '[object]'
                        : value}
                    </Table.Cell>
                  );
                })}
            {!readOnly && (allowEdit || allowDelete || allowAdd) ? (
              <Table.Cell collapsing>
                {allowEdit && editingRow === i && (
                  <>
                    <Button icon="close" color="orange" data-index={i} onClick={cancelEdit} />
                    <Button icon="check" color="green" data-index={i} onClick={editRowHandler} />
                  </>
                )}
                {allowEdit && editingRow !== i && (
                  <Button icon="edit" color="blue" data-index={i} onClick={edit} />
                )}
                {allowDelete && editingRow !== i && (
                  <Button icon="trash" color="red" data-index={i} onClick={deleteRow} />
                )}
              </Table.Cell>
            ) : null}
          </Table.Row>
        ))}
        {!readOnly && allowAdd ? (
          <Table.Row>
            {filteredItems.map((m, i) => (
              <Table.Cell key={m.title + i}>
                {catalogue.createComponent(
                  { ...(childProps as any), owner: addDataset, dataProps: owner },
                  hasControl(addTemplate, i)
                    ? addTemplate.elements[i]
                    : {
                        control: 'Input',
                        props: {
                          value: { source: m.source },
                          placeholder: m.title
                        }
                      },
                  context
                )}
              </Table.Cell>
            ))}
            <Table.Cell>
              <Button icon="plus" color="blue" onClick={addRow} />
            </Table.Cell>
          </Table.Row>
        ) : null}
      </Table.Body>

      <ErrorView owner={props.owner} source={propName(formElement)} pointing="left" />
    </DynamicComponent>
  );
};

export const TableView: FormComponent = {
  Component: observer(TableComponent),
  toString: (_owner, props, context) => {
    const tableList: DataSet[] = getValue(props, context);
    return tableList
      .map(
        (_, i) =>
          `[${i + 1}] ${props.formElement.elements
            .map(
              e => `${getPropValue(props, e, context, 'label')}: ${getPropValue(props, e, context)}`
            )
            .join('\n    ')}`
      )
      .join('\n\n');
  }
};
