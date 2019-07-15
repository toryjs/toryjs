import * as React from 'react';

import { Icon } from 'semantic-ui-react';
import { observer } from 'mobx-react';

import {
  Context,
  names,
  pointer,
  DragDrop,
  dragDropHandler,
  dragEndHandler,
  dragItemProcessor,
  FormDataSet
} from '@toryjs/ui';

import { ToolIcon } from '../toolbox/tool_icon';

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
    const state = React.useContext(Context);
    const catalogue = state.editor.editorCatalogue;
    const element = catalogue.components[item.control] || {
      icon: 'folder',
      thumbnail: undefined as any
    };
    const ref = React.useRef(null);

    const onSelect = React.useCallback(() => {
      state.editor.project.state.setElement(item, state.editor.schema);
    }, [item, state.editor.project.state, state.editor.schema]);

    return (
      <div
        className={names(indent ? 'contentSimple' : 'content', className, {
          outlineOn: isOver && canDrop
        })}
        ref={ref}
      >
        <a className={names(folder, item.isSelected ? 'selected' : '', pointer)} onClick={onSelect}>
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
    let context = React.useContext(Context);
    let [opened, toggleOpen] = React.useState(!!expanded);

    const indent = (item.control || '').indexOf('Provider') === -1;

    const dropHandler = React.useCallback(dragDropHandler(context, item), [context, item]);
    const endDragHandler = React.useCallback(dragEndHandler(context), [context.editor.dragItem]);

    const drag = React.useMemo(
      () =>
        new DragDrop(
          'column',
          item,
          dragItemProcessor,
          `color: ${context.editor.theme.textColor}!important;`,
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
        if (!context.editor.dragItem) {
          // console.log('Dragging: ' + parseInt(e.currentTarget.getAttribute('data-index')));
          context.editor.dragItem = {
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
      [context.editor.dragItem, drag, item]
    );

    return (
      <div
        draggable={!!item.control}
        onDragStart={parentDragStart}
        onDragEnd={endDragHandler}
        data-index={index}
      >
        <div className={'item folder'} {...filterStyle(filter, item)}>
          {indent && (
            <Icon
              name={opened ? 'caret down' : 'caret right'}
              className={`treeCaret`}
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
            .filter(e => !!e)
            .map((child, index) => {
              // if (!child) {
              //   child = {
              //     elements: [],
              //     control: 'Container',
              //     props: {}
              //   } as any;
              // }
              if (child.elements && child.elements.length) {
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
                    draggable={!!child.control}
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
