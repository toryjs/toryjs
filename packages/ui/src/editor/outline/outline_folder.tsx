import * as React from 'react';

import { Icon } from 'semantic-ui-react';
import { observer } from 'mobx-react';

import { FormDataSet } from '../form_store';
import { EditorContext } from '../editor_context';
import { ToolIcon } from '../toolbox/tool_icon';
import { names, pointer } from '../../common';

import { DragDrop } from '../drag_drop';
import { processor } from '../editor_common';
import { dragDropHandler, dragEndHandler } from '../drag_drop_form_control';

export type OutlineFolderProps = {
  item: FormDataSet;
  expanded?: boolean;
  folder?: string;
  indent?: boolean;
  className?: string;
  isOver?: boolean;
  canDrop?: boolean;
  index?: number;
  filter?: string;
  parentDragStart?: any;
};

export const OutlineItem = observer(
  ({ item, folder, indent, className, isOver, canDrop }: OutlineFolderProps) => {
    const state = React.useContext(EditorContext);
    const catalogue = state.editorCatalogue;
    const element = catalogue.components[item.control] || {
      icon: 'folder',
      thumbnail: undefined as any
    };
    const ref = React.useRef(null);

    const onSelect = React.useCallback(() => {
      state.project.state.setElement(item, state.schema);
    }, [item, state.project.state, state.schema]);

    return (
      <div
        className={names(indent ? 'contentSimple' : 'content', className, {
          outlineOn: isOver && canDrop
        })}
        ref={ref}
      >
        <a
          className={names(
            folder,
            item.isSelected ? 'selected' : '',
            pointer
          )}
          onClick={onSelect}
        >
          <ToolIcon icon={element.icon} thumbnail={element.thumbnail} title={item.control} />
          <span>
            {item.props.editorLabel ||
              (typeof item.props.label === 'string' && item.props.label) ||
              item.props.text}{' '}
            &nbsp;
            <span className="meta">{item.control || 'Container'}</span>
          </span>
        </a>
      </div>
    );
  }
);

function filterStyle(filter: string, item: FormDataSet) {
  if (!filter) {
    return null;
  }
  if (item.control.toLowerCase().indexOf(filter.toLowerCase()) >= 0) {
    return null;
  }
  return { style: { opacity: 0.1 } };
}

export const OutlineFolder = observer(
  ({ item, expanded, isOver, canDrop, filter, index, parentDragStart }: OutlineFolderProps) => {
    let context = React.useContext(EditorContext);
    let [opened, toggleOpen] = React.useState(!!expanded);

    const indent = (item.control || '').indexOf('Provider') === -1;

    const dropHandler = React.useCallback(dragDropHandler(context, item), [context, item]);
    const endDragHandler = React.useCallback(dragEndHandler(context), [context.dragItem]);

    const drag = React.useMemo(
      () =>
        new DragDrop(
          'column',
          item,
          processor,
          `color: ${context.theme.textColor}!important;`,
          'outline',
          dropHandler,
          endDragHandler,
          true,
          20,
          context
        ),
      [context, dropHandler, endDragHandler, item]
    );

    const onDragStart = React.useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        if (!context.dragItem) {
          // console.log('Dragging: ' + parseInt(e.currentTarget.getAttribute('data-index')));
          context.dragItem = {
            name: item.control,
            element: item,
            node: e.currentTarget,
            id: item.uid,
            drag,
            from: parseInt(e.currentTarget.getAttribute('data-index')),
            type: 'outline'
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
      [context.dragItem, drag, item]
    );

    return (
      <div
        draggable={true}
        onDragStart={parentDragStart}
        onDragEnd={endDragHandler}
        data-index={index}
      >
        <div className={'item folder'} {...filterStyle(filter, item)}>
          {indent && (
            <Icon
              name={opened ? 'caret down' : 'caret right'}
              className="treeCaret"
              onClick={() => toggleOpen(!opened)}
            />
          )}
          <OutlineItem
            item={item}
            folder="folder"
            indent={!indent}
            filter={filter}
            className={isOver && canDrop ? 'on' : undefined}
          />
        </div>

        <div
          style={{ display: opened ? '' : 'none' }}
          className={indent ? 'itemContent' : undefined}
          {...drag.props()}
        >
          {item.elements
            .filter(e => e && (e.control || (e.elements && e.elements.length)))
            .map((child, index) => {
              // if (!child) {
              //   child = {
              //     elements: [],
              //     control: 'Container',
              //     props: {}
              //   } as any;
              // }
              if (
                child.elements &&
                child.elements.filter(e => e && (e.control || (e.elements && e.elements.length)))
                  .length
              ) {
                return (
                  <React.Fragment key={child.uid}>
                    <OutlineFolder
                      key={index + child.uid}
                      filter={filter}
                      item={child}
                      index={index}
                      parentDragStart={onDragStart}
                      expanded={true}
                    />
                  </React.Fragment>
                );
              }
              return (
                <React.Fragment key={child.uid}>
                  <div
                    className="item single"
                    data-index={index}
                    key={index + child.uid}
                    draggable={true}
                    onDragStart={onDragStart}
                    onDragEnd={endDragHandler}
                    {...filterStyle(filter, child)}
                  >
                    <OutlineItem item={child} folder="single" filter={filter} />
                  </div>
                </React.Fragment>
              );
            })}
        </div>
      </div>
    );
  }
);
