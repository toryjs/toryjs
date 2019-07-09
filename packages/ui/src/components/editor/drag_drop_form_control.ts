import { ContextType } from '../../context';
import { FormDataSet } from './definitions';
import { toJS } from '../../common';

export function dragEndHandler(context: ContextType) {
  return function() {
    let item = context.editor.dragItem;
    if (item && item.node) {
      item.node.style.visibility = 'visible';
      item.node.style.height = 'inherit';
    }
    context.editor.dragItem = null;
  };
}

export function dragDropHandler(context: ContextType, item: FormDataSet) {
  return function(to: number, position: string) {
    const dragItem = context.editor.dragItem;
    if (dragItem === null) {
      return;
    }

    // we either move existing element
    // or we drag element from toolbox
    if (dragItem.type === 'outline') {
      const fromItem = dragItem.element as FormDataSet;
      const toItem = item.elements[to];
      const fromRow = toJS(fromItem.elements[dragItem.from]);

      fromItem.removeRow('elements', dragItem.from);
      to = item.elements.indexOf(toItem);
      to = to == -1 ? item.elements.length : to;

      if (position === 'middle') {
        toItem.addRow('elements', fromRow);
        dragItem.drag.initialised = false;
      } else {
        console.log('Inserting to: ' + to);
        item.insertRow('elements', to, fromRow);
        dragItem.drag.initialised = false;
      }
    } else {
      let control = dragItem.name;
      let value = undefined;
      let label = undefined;

      if (dragItem.type === 'dataset') {
        control = dragItem.schema.type === 'boolean' ? 'Checkbox' : 'Input';
        value = {
          source: dragItem.name
        };
        label = dragItem.name;

        dragItem.target.style.visibility = 'visible';
        dragItem.target.style.height = 'inherit';
      }
      const newItem = {
        label: dragItem.label || '',
        props: {
          ...dragItem.controlProps,
          control: control,
          value,
          label
        },
        control: control,
        elements: dragItem.defaultChildren
      };
      if (position === 'middle') {
        const toItem = item.elements[to];
        toItem.addRow('elements', newItem);
      } else {
        item.insertRow('elements', to, newItem);
      }
    }
  };
}
