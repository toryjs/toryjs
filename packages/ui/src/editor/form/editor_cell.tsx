import * as React from 'react';
import { observer } from 'mobx-react';
import names from 'classnames';

import { css } from 'emotion';
import { FormDataSet, SchemaDataSet } from '../form_store';
import { EditorContextType, EditorContext } from '../editor_context';
import { calculateHorizontalPosition } from '../editor_common';
import { clearAll } from '../drag_drop';
import { FormComponentProps, DataSet, FormComponentCatalogue } from '@toryjs/form';

const cell = css`
  &.empty {
    border: dotted 2px #dfdfdf;
    min-width: 50px;
    min-height: 20px;
    height: 100%;
  }
  label: cell;
`;

export function bind(formElement: FormDataSet, item: any) {
  // we can either drop on existing control
  // or on an empty cell

  if (formElement.parent) {
    // find the parent path
    let parent = formElement.parent;
    let parentPath = '';
    while (parent) {
      if (parent.props.value && parent.props.value.source) {
        parentPath = parentPath + parent.props.value + '.';
      }
      parent = parent.parent;
    }
    let path = item.name.replace(parentPath, '');
    formElement.setValue('source', path);
    return;
  }

  // if it is an empty cell, we will guess the control

  const schema: SchemaDataSet = item.schema;
  item.label = item.name;
  item.source = item.name;

  if (schema.type === 'boolean') {
    item.name = 'Checkbox';
  } else if (schema.type === 'array') {
    item.name = 'Table';
  } else if (schema.type === 'number' || schema.type === 'integer') {
    item.name = 'Input';
    item.controlProps = { type: 'number' };
  } else if (schema.type === 'string') {
    item.name = 'Input';
  }
}

export interface DropCellProps {
  className?: string;
  formElement: FormDataSet;
  parentFormElement?: FormDataSet;
  editorState: EditorContextType;
  owner: DataSet;
  catalogue: FormComponentCatalogue;
  style?: any;
  children: any;
  mouseOver?: (e: React.MouseEvent, props: FormComponentProps, context: EditorContextType) => void;
  mouseOut?: () => void;
  id: string;
  hover?: (e: React.DragEvent, props: DropCellProps, context?: EditorContextType) => void;
  drop: (e: React.DragEvent, props: DropCellProps, context?: EditorContextType) => boolean;
}

export const DropCell = observer((props: DropCellProps) => {
  const context = React.useContext(EditorContext);
  const ref = React.useRef<HTMLDivElement>();

  const onDrag = React.useCallback(
    (ev: React.DragEvent<HTMLDivElement>) => {
      context.dragItem = {
        name: props.formElement.control,
        row: props.formElement.props.row,
        column: props.formElement.props.column,
        element: props.formElement,
        id: props.id,
        position: calculateHorizontalPosition(ev)
      };
    },
    [context.dragItem, props.formElement, props.id]
  );

  const dragEnter = React.useCallback(() => clearAll(), []);

  const dragOver = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const item = context.dragItem;
      if (!item) {
        return;
      }

      // dataset binding highlight
      // dragging over the dataset binding

      if (item.dataset) {
        props.editorState.hoverParent = props.formElement.parent;
      } else if (props.hover) {
        props.hover(e, props, context);
      }
      ref.current.style.background = '#999';
    },
    [context, props]
  );

  const dragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    ref.current.style.background = 'inherit';
  }, []);

  const drop = React.useCallback(
    e => {
      const item = context.dragItem;
      if (!item) {
        return;
      }

      // dataset binding highlight
      // dragging over the dataset binding
      if (item.dataset) {
        bind(props.formElement, item);
      }

      if (props.drop(e, props, context)) {
        context.project.state.setElement(item.element, props.editorState.schema);
        context.selectedParent = props.parentFormElement;
      }

      ref.current.style.background = 'inherit';
    },
    [context, props]
  );

  const mouseOver = React.useCallback(
    e => {
      if (props.mouseOver) {
        props.mouseOver(e, props, context);
      }
    },
    [context, props]
  );

  let control = props.formElement.control;
  return (
    <div
      ref={ref}
      draggable={control !== 'EditorCell'}
      onMouseOver={mouseOver}
      onMouseOut={props.mouseOut}
      onDragStart={onDrag}
      onDragOver={dragOver}
      onDragLeave={dragLeave}
      onDragEnter={dragEnter}
      onDrop={drop}
      style={props.style}
      className={names(
        cell,
        'cellContent',
        control === 'EditorCell' ? 'empty' : '',
        props.className
      )}
      // onClick={this.toggleActive}
      data-id={props.id}
    >
      {props.children || '\xa0'}
    </div>
  );
});
