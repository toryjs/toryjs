/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { EditorContextType } from '../editor_context';
import { SchemaDataSet } from '../form_store';
import { schemaDatasetToJS } from '../../helpers';

let currentStack: HTMLDivElement[] = [];

function clearStyles(context: EditorContextType) {
  let item = context.dragItem;
  if (item && item.node) {
    item.node.style.visibility = 'visible';
    item.node.style.height = 'inherit';
  }
  context.dragItem = null;
}

function clearStack() {
  for (let elem of currentStack) {
    elem.style.outline = '';
  }
}

export function dragStart(context: EditorContextType, owner: SchemaDataSet) {
  return React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (!context.dragItem) {
        // console.log('Dragging: ' + parseInt(e.currentTarget.getAttribute('data-index')));
        context.dragItem = {
          name: owner.title,
          schema: owner,
          node: e.currentTarget,
          id: owner.id,
          from: parseInt(e.currentTarget.getAttribute('data-index')),
          type: 'dataset',
          target: e.currentTarget
        };
        let target = e.currentTarget;

        setTimeout(() => {
          // target.style.visibility = 'hidden';
          target.style.height = '0px';
          target.style.visibility = 'hidden';
          // drag.initialised = false;
        }, 1);
      }
    },
    [context.dragItem, owner]
  );
}

export function dragEnd(context: EditorContextType) {
  return React.useCallback(() => {
    clearStyles(context);
  }, [context]);
}

export function initDrag(context: EditorContextType, owner: SchemaDataSet) {
  const add = React.useRef(true);

  const onDragOver = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (add.current) {
      currentStack.push(e.currentTarget);
      add.current = false;
    }

    let index = currentStack.indexOf(e.currentTarget);
    if (index != 0) {
      return;
    }

    e.currentTarget.style.outline = 'dashed 2px #DDD';
  }, []);

  const onDragEnd = React.useCallback(() => {
    // console.log('Drag end ...');
    clearStack();
    clearStyles(context);
  }, [context]);

  const onDragLeave = React.useCallback(() => {
    clearStack();
    currentStack = [];
    add.current = true;
  }, []);

  const onDrop = React.useCallback(() => {
    const item = context.dragItem;
    if (item === null) {
      return;
    }

    // we either move existing element
    // or we drag element from toolbox
    if (item.type === 'dataset') {
      const schema: SchemaDataSet = item.schema;
      const parent = schema.parent;
      // const paths = item.name.split('.');
      // const path = paths[paths.length - 1];
      const path = item.name;

      const source = parent.reference ? parent.reference : parent;
      let target = owner.reference ? owner.reference : owner;
      target =
        target.type === 'array'
          ? target.items.reference
            ? target.items.reference
            : target.items
          : target;

      // remove from original
      const dataset = schemaDatasetToJS(schema, false);

      target.setMapValue('properties', path, dataset);
      context.project.state.setSchema(
        target.properties.get(path),
        context.project.state.selectedSchemaName
      );
      source.mapRemove('properties', path);
    }
    context.dragItem = null;

    clearStack();
    clearStyles(context);
  }, [context, owner]);

  return {
    onDragOver: onDragOver,
    onDragEnd: onDragEnd,
    onDrop: onDrop,
    onDragLeave: onDragLeave
  };
}
