/* eslint-disable react-hooks/rules-of-hooks */

import { css } from 'emotion';

export type Processor<T> = {
  children: (owner: T) => T[];
  name: (owner: T) => string;
  id: (owner: T) => string;
  disableDrop?: (owner: T, schema: any) => boolean;
};

const dropZone = `
  opacity: 0.3;
  min-width: 100px;
  display: block;
  position: absolute;
  overflow: hidden;
  white-space: nowrap;
  text-wrap: ellipsis;
  font-size: 10px;
`;

const horizontalDropZone = `
  ${dropZone}
  display: flex !important;
  align-items: center !important;
  height: 100%;
  top: 0px;
  
`;

const placeholder = (size: number, dropStyle: any) => css`
  transition: margin 0.2s cubic-bezier(0.215, 0.61, 0.355, 1) !important;
  position: relative;
  /* padding-top: 5px; */
  /* padding-bottom: 5px; */

  &.onMiddle {
    outline: dashed 2px #ccc;
  }

  &.onBottom {
    margin-bottom: ${size}px !important;
    ::after {
      ${dropZone}
      ${dropStyle}
      content: attr(data-after);
      bottom: -${size - (size - 20) / 2}px;
    }
  }

  &.onTop {
    margin-top: ${size}px !important;
    ::before {
      ${dropZone}
      ${dropStyle}
      content: attr(data-before);
      top: -${size - (size - 20) / 2}px;
    }
  }

  &.onRight {
    margin-right: 110px !important;
    ::after {
      ${horizontalDropZone}
      ${dropStyle}
      content: attr(data-after);
      right: -105px;
    }
  }

  &.onLeft {
    margin-left: 110px !important;
    ::before {
      ${horizontalDropZone}
      ${dropStyle}
      content: attr(data-before);
      left: -105px;
    }
  }
  label: placeholder;
`;

function findVerticalIndex(e: React.DragEvent, rects: HTMLDivElement[], i: number) {
  return (
    rects[i].getBoundingClientRect().top + window.scrollY < e.pageY &&
    (!rects[i + 1] || rects[i + 1].getBoundingClientRect().top + window.scrollY > e.pageY)
  );
}

function findHorizontalIndex(e: React.DragEvent, rects: HTMLDivElement[], i: number) {
  let rect = rects[i].getBoundingClientRect();

  return (
    rect.top + window.scrollY < e.pageY &&
    rect.top + rect.height + window.scrollY > e.pageY &&
    rect.left + window.scrollX < e.pageX &&
    (!rects[i + 1] ||
      rect.left + rect.width + window.scrollX > e.pageX ||
      rects[i + 1].getBoundingClientRect().left + window.scrollX > e.pageX)
  );
}

function findVerticalPosition(e: React.DragEvent, rect: ClientRect, previousEnd: number) {
  let offset = 8; // rect.height > 40 ? 20 : rect.height / 2;
  // return rect.top + window.scrollY + offset > e.pageY
  //   ? 'top'
  //   : rect.top + window.scrollY + rect.height - offset < e.pageY
  //     ? 'bottom'
  //     : 'middle';

  return rect.bottom + window.scrollY < e.pageY
    ? 'bottom'
    : previousEnd + offset > e.pageY
      ? 'top'
      : 'middle';
}

function findHorizontalPosition(e: React.DragEvent, rect: ClientRect) {
  let offset = rect.width > 100 ? 20 : rect.width / 2;
  return rect.left + window.scrollX + offset > e.pageX
    ? 'top'
    : rect.left + window.scrollX + rect.width - offset < e.pageX
      ? 'bottom'
      : 'middle';
}

// function getRandomColor() {
//   var letters = '0123456789ABCDEF';
//   var color = '#';
//   for (var i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }

let config: {
  [index: string]: {
    currentStacks: string[];
    active: HTMLDivElement[];
    padMap: HTMLDivElement[];
    drops: { position: string; index: number };
  };
} = {};

function clear(id: string) {
  for (let el of config[id].active) {
    el.classList.remove('onBottom', 'onTop', 'onLeft', 'onRight', 'onMiddle');
  }
  config[id].active = [];
}

function cleanup(
  id: string,
  context: DynamicForm.EditorContextType,
  e?: any,
  endDragHandler?: any
) {
  config[id].currentStacks = [];

  for (let pad of config[id].padMap) {
    pad.style.paddingBottom = null;
    pad.style.paddingTop = null;
  }
  config[id].padMap = [];

  if (endDragHandler) {
    endDragHandler(e);
  }

  if (context) {
    context.dragItem = null;
  }
}

export function clearAll(context?: DynamicForm.EditorContextType) {
  for (let key of Object.keys(config)) {
    clear(key);
    cleanup(key, context);
  }
}

export class DragDrop<T> {
  startClass: string;
  endClass: string;
  findIndex: (e: React.DragEvent, rects: HTMLDivElement[], i: number) => boolean;
  findPosition: (
    e: React.DragEvent,
    rect: ClientRect,
    previousEnd: number,
    nextStart: number
  ) => string;
  placeholderClass: string;
  paddingElement: 'paddingBottom' | 'paddingRight';
  allowParenting: boolean;

  context: DynamicForm.EditorContextType;
  owner: T;
  processor: Processor<T>;
  uid: string;
  dropHandler: (to: number, position?: string) => void;
  endDragHandler: (e?: React.DragEvent) => void;

  add = true;
  initialised = false;

  constructor(
    layout: 'row' | 'column',
    owner: T,
    processor: Processor<T>,
    dropStyle: string,
    uid = 'global',
    dropHandler: (to: number, position?: string) => void,
    endDragHandler: (e?: React.DragEvent) => void,
    allowParenting: boolean,
    height = 40,
    context: DynamicForm.EditorContextType = null
  ) {
    this.startClass = layout === 'row' ? 'onLeft' : 'onTop';
    this.endClass = layout === 'row' ? 'onRight' : 'onBottom';
    this.findIndex = layout === 'row' ? findHorizontalIndex : findVerticalIndex;
    this.findPosition = layout === 'row' ? findHorizontalPosition : findVerticalPosition;
    this.paddingElement = layout === 'row' ? 'paddingRight' : 'paddingBottom';
    this.processor = processor;
    this.owner = owner;
    this.uid = uid;
    this.dropHandler = dropHandler;
    this.endDragHandler = endDragHandler;
    this.context = context;
    this.allowParenting = allowParenting;

    this.placeholderClass = placeholder(height, dropStyle);

    if (!config[this.uid]) {
      config[this.uid] = {
        currentStacks: [],
        active: [],
        drops: null,
        padMap: []
      };
    }
  }

  get config() {
    return config[this.uid];
  }

  init = (container: HTMLDivElement) => {
    let items = this.processor.children(this.owner);
    let nodes = Array.from(container.childNodes) as HTMLDivElement[];
    let id = this.processor.id(this.owner);

    container.setAttribute('data-drag', id);

    //container.style.backgroundColor = getRandomColor();

    for (let i = 0; i < items.length; i++) {
      let element = nodes[i];
      let item = items[i];

      if (!item || !element) {
        continue;
      }

      let id = this.processor.id(item);

      element.setAttribute('data-drag', id);
      //element.style.backgroundColor = getRandomColor();
      if (!element.classList.contains(this.placeholderClass)) {
        element.classList.add(this.placeholderClass);
      }

      let name = this.processor.name(item);
      element.setAttribute('data-after', '🔰 After ' + name);
      element.setAttribute('data-before', '🔰 Before ' + name);
    }
  };

  findRect(e: React.DragEvent, elements: HTMLDivElement[]) {
    for (let i = 0; i < elements.length; i++) {
      // all other element
      if (this.findIndex(e, elements, i)) {
        return i;
      }
    }
    return -1;
  }

  clear() {
    // console.log('Cleaning: ' + this.uid);
    clear(this.uid);
  }

  dragEnd(e: React.DragEvent) {
    // console.log(`Leave: ${index}: ${position}`);
    this.add = true;
    this.clear();
    cleanup(this.uid, this.context, e, this.endDragHandler);
  }

  onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (this.processor.disableDrop && this.processor.disableDrop(this.owner, this.context)) {
      return;
    }

    // we will incrementally be expanding elements for a better dragover experience
    if (this.config.padMap.indexOf(e.currentTarget) === -1) {
      e.currentTarget.style[this.paddingElement] = '5px';
      this.config.padMap.push(e.currentTarget);
    }

    if (!this.initialised) {
      this.init(e.currentTarget as HTMLDivElement);
      this.initialised = true;
    }

    let id = e.currentTarget.getAttribute('data-drag');

    // we start adding to the stack when signalled
    // stack is cleared when a DragLeave event is detected
    // in this moment it wil repopulate with current elements
    if (this.add) {
      this.config.currentStacks.push(id);
      this.add = false;
    }

    let elements = ((e.currentTarget.childNodes as any) || []) as HTMLDivElement[];
    if (!elements || elements.length === 0) {
      return;
    }

    // we only process current element, if event bubbles up we will avoid it
    // we use stack for this purpose where the current control is on the very bottom
    const currentIndex = this.config.currentStacks.findIndex(s => s === id);
    if (currentIndex != 0) {
      return;
    }

    // find the index of the current item
    const index = this.findRect(e, elements);
    if (index === -1) {
      return;
    }

    let element = elements[index];
    // we may skip all elements that dave no-drop attribute
    if (!element || element.getAttribute('data-no-drop')) {
      return;
    }

    // decide behaviour based on position
    // position is either the top | bottom | middle part of the drag over element
    let previous = element.previousSibling as HTMLDivElement;
    let next = element.nextSibling as HTMLDivElement;
    let previousEnd =
      (previous
        ? previous.getBoundingClientRect().bottom
        : element.parentElement.getBoundingClientRect().top) + window.scrollY;
    let nextStart =
      (next
        ? next.getBoundingClientRect().top
        : element.parentElement.getBoundingClientRect().bottom) + window.scrollY;

    let pos = this.findPosition(e, element.getBoundingClientRect(), previousEnd, nextStart);

    // console.log(
    //   `${e.pageY} -- Prev ${previousEnd} -- Rect [${element.getBoundingClientRect().top +
    //     window.scrollY} - ${element.getBoundingClientRect().bottom + window.scrollY}]`
    // );

    // when we are in the middle of the element we remove classes
    // if (pos === 'middle') {
    //   console.log('Clearing middle...');

    //   this.clear();
    //   return;
    // }

    console.log(index + ':' + pos);

    let className: string;
    if (index === 0 && pos === 'top') {
      className = this.startClass;
    } else if (pos === 'bottom') {
      className = this.endClass;
    } else if (index > 0 && pos === 'top') {
      className = this.endClass;
      element = element.previousSibling as HTMLDivElement;
    } else if (this.allowParenting && pos === 'middle') {
      className = 'onMiddle';
    }

    if (element.classList.contains(className)) {
      return;
    }

    // console.log('Showing: ' + id + ' - ' + index + ':' + pos);
    this.config.drops = { index, position: pos };

    // the current element changed so we need to clear all previous
    this.clear();

    element.classList.add(className);
    this.config.active.push(element);
  };

  onDragEnd = (e: React.DragEvent) => {
    // console.log('Drag end ...');
    this.dragEnd(e);
  };

  onDragLeave = () => {
    this.config.currentStacks = [];
    this.add = true;
  };

  onDrop = (e: React.DragEvent) => {
    let id = e.currentTarget.getAttribute('data-drag');
    let currentIndex = this.config.currentStacks.findIndex(s => s === id);
    if (currentIndex === 0) {
      // console.log(
      //   `Drop ${currentIndex} - ${this.config.drops.index} - ${this.config.drops.position}`
      // );

      if (this.dropHandler) {
        this.initialised = false;
        this.dropHandler(
          this.config.drops.index + (this.config.drops.position === 'bottom' ? 1 : 0),
          this.config.drops.position
        );
      }
      this.dragEnd(e);
    }
  };

  props() {
    return {
      onDragOver: this.onDragOver,
      onDragEnd: this.onDragEnd,
      onDrop: this.onDrop,
      onDragLeave: this.onDragLeave
    };
  }
}
