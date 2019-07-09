import * as React from 'react';
import * as styles from './properties_common';

import { observer } from 'mobx-react';
import { FormElement, DataSet, Option, FormComponentProps, Handlers } from '@toryjs/form';

import { propName, getValue, Context, ContextType, Processor, DragDrop } from '@toryjs/ui';

import { Dropdown, SelectProps, Input, Icon } from 'semantic-ui-react';
import { css } from 'emotion';

import { styledTableRow, addButton, celled } from './properties_common';
import { ErrorView } from './error_view';
import { PropertyHeader } from './group';
import { Select } from './select';
import { renderControl } from './control_factory';

import { dot } from './binding';
import { select } from './styles';

type RowProps = FormComponentProps<TableProps, TableChildProps> & {
  data: DataSet;
  index: number;
  list?: any[];
  handlers: Handlers<any, ContextType>;
  dragHandleProps: any;
  uid: string;
};

type TableProps = {
  value: any;
  bound: boolean;
  changeBound: any;
};

type TableChildProps = {
  width: number;
  type: string;
};

const handle = css`
  padding-left: 3px;
  opacity: 0.5;
  cursor: grab;
`;

const Handle = (props: any) => {
  return (
    <div {...props} className={handle}>
      <Icon name="content" />
    </div>
  );
};

function dragStart(index: number, context: ContextType) {
  return function(e: React.DragEvent) {
    const target = e.currentTarget as HTMLDivElement;

    context.editor.dragItem = {
      from: index,
      type: 'table',
      node: e.currentTarget
    };

    setTimeout(() => {
      target.style.visibility = 'hidden';
      target.style.height = '0px';
      target.style.margin = '0px';
    }, 1);
  };
}

const TableRow: React.FC<RowProps> = props => {
  const context = React.useContext(Context);

  const deleteRow = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      props.data.removeRowIndex(propName(props.formElement), parseInt(e.currentTarget.value));
    },
    [props.data, props.formElement]
  );

  const onDragStart = React.useCallback(dragStart(props.index, context), [props.index]);

  return (
    <div className={styledTableRow(context.editor.theme)} onDragStart={onDragStart}>
      <Handle {...props.dragHandleProps} index={props.index} />
      {props.formElement.elements.map((e, i) => (
        <div
          className={styles.tableRowFull}
          key={i}
          style={{
            flex: `1 1 ${(e.props && e.props.width) || '100%'}`
          }}
        >
          {renderControl({ ...props, formElement: e })}
        </div>
      ))}
      {!props.readOnly && (
        <div className={styles.tableRowAuto}>
          <button
            className={addButton(context.editor.theme)}
            onClick={deleteRow}
            value={props.index}
          >
            x
          </button>
        </div>
      )}
    </div>
  );
};

const SimpleTableRow: React.FC<RowProps> = props => {
  const context = React.useContext(Context);

  const onDragStart = React.useCallback(dragStart(props.index, context), [props.index]);

  const onChange: any = React.useCallback(
    (_e: any, ps: SelectProps) =>
      props.data.setArrayValue(props.formElement.props.value.source, props.index, ps.value),
    [props.data, props.formElement.props.value.source, props.index]
  );

  const deleteRow = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      props.data.removeRowIndex(
        props.formElement.props.value.source,
        parseInt(e.currentTarget.value)
      );
    },
    [props.data, props.formElement.props.value.source]
  );

  function renderControl() {
    if (!props.formElement.elements || props.formElement.elements.length === 0) {
      throw new Error(
        'You need to define the type of the control for the table row. For example: { elements: [{control: "Input"}] }'
      );
    }
    const formElement = props.formElement.elements[0];
    const value = props.list[props.index];
    const type = (formElement.props && formElement.props.type) || 'text';

    switch (formElement.control) {
      case 'Input':
        return <Input type={type} onChange={onChange} value={value} />;
      case 'Select':
        const options: Option[] = getValue({ ...props, formElement }, context, 'options');

        return (
          <Dropdown
            value={value}
            data-value={value}
            search
            selection
            fluid
            allowAdditions
            name="type"
            onChange={onChange}
            className={`property-search ${select}`}
            options={options}
          />
        );
    }
  }

  return (
    <div className={styledTableRow(context.editor.theme)} onDragStart={onDragStart}>
      <Handle {...props.dragHandleProps} index={props.index} />
      <div className={styles.tableRowFull}>{renderControl()}</div>

      {!props.readOnly && (
        <div className={styles.tableRowAuto}>
          <button
            className={addButton(context.editor.theme)}
            onClick={deleteRow}
            value={props.index}
          >
            x
          </button>
        </div>
      )}
    </div>
  );
};

let id = 1;
const processor: Processor<any> = {
  children: props => {
    const source = propName(props.formElement);
    return props.owner.getValue(source) || [];
  },
  id: props => {
    if (props.value) {
      return props.value;
    }
    if (props.formElement) {
      if (!props.formElement.uid) {
        props.formElement.uid = id++;
      }
      return props.formElement.uid;
    }
    if (props.uid) {
      return props.uid;
    }
    return id++;
    throw new Error('Could not determine ID');
  },
  name: () => ''
};

export const TableComponent: React.FC<FormComponentProps & { uid: string }> = props => {
  const context = React.useContext(Context);

  const addRow = React.useCallback(() => {
    const { formElement, owner } = props;
    owner.addRow(propName(formElement));
  }, [props]);

  const onDrop = React.useCallback(
    (to: number) => {
      if (!context.editor.dragItem || context.editor.dragItem.type !== 'table') {
        return;
      }
      let { formElement, owner } = props;

      owner.moveRow(propName(formElement), context.editor.dragItem.from, to);
    },
    [context.editor.dragItem, props]
  );

  const dragHandleProps = React.useMemo(
    () => ({
      onMouseDown(e: any) {
        e.currentTarget.parentNode.setAttribute('draggable', 'true');
      },
      onMouseUp(e: any) {
        e.currentTarget.parentNode.setAttribute('draggable', 'false');
      }
    }),
    []
  );

  const onEndDrag = React.useCallback(
    e => {
      let item = context.editor.dragItem;
      if (item && item.node) {
        item.node.style.visibility = 'visible';
        item.node.style.height = '';
        item.node.style.margin = '';
      }
      e.target.draggable = false;
      context.editor.dragItem = null;
    },
    [context.editor.dragItem]
  );

  const drag = React.useMemo(
    () =>
      new DragDrop(
        'column',
        props,
        processor,
        `color: ${context.editor.theme.textColor}!important;`,
        'outline',
        onDrop,
        onEndDrag,
        false,
        20,
        context
      ),
    [context, onDrop, onEndDrag, props]
  );

  const owner = props.owner;
  const formElement = props.formElement as FormElement;
  const controlProps = formElement.props;
  const source = propName(formElement);
  const list: DataSet[] = owner.getValue(source) || [];

  return (
    <PropertyHeader
      label={formElement.props && formElement.props.text}
      buttons={
        <>
          {(!controlProps.view || controlProps.view === 'value') && (
            <button className="headerButton" onClick={addRow}>
              +
            </button>
          )}
          {formElement.props.bound && (
            <div
              className={dot(controlProps.view)}
              onClick={formElement.props.changeBound}
              style={{ marginRight: '20px' }}
              title={`Green - Value
Yellow - Bound to data
Red - Handled by a function`}
            />
          )}
        </>
      }
      bound={formElement.props.bound}
      changeBound={formElement.props.changeBound}
    >
      {controlProps.view && controlProps.view !== 'value' && (
        <Select extra={controlProps.view} {...props} />
      )}
      {!controlProps.view || (controlProps.view === 'value' && list.length > 0) ? (
        <>
          <div className={celled(context.editor.theme)} {...drag.props()}>
            {list.map((row, i) =>
              typeof list[0] === 'object' ? (
                <TableRow
                  key={i}
                  index={i}
                  formElement={formElement}
                  owner={row}
                  data={owner}
                  readOnly={props.readOnly}
                  catalogue={props.catalogue}
                  handlers={props.handlers}
                  dragHandleProps={dragHandleProps}
                  uid={props.uid}
                />
              ) : (
                <SimpleTableRow
                  key={i}
                  index={i}
                  formElement={formElement}
                  list={list}
                  owner={owner}
                  data={owner}
                  readOnly={props.readOnly}
                  catalogue={props.catalogue}
                  handlers={props.handlers}
                  dragHandleProps={dragHandleProps}
                  uid={props.uid}
                />
              )
            )}
          </div>

          <ErrorView owner={props.owner} source={propName(formElement)} pointing="left" />
        </>
      ) : (
        undefined
      )}
    </PropertyHeader>
  );
};

export const TableView = observer(TableComponent);
