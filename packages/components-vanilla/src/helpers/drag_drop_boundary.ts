import { action } from 'mobx';
import { findConflict } from './grid';
import { FormDataSet, css, getPropValue, setPropValue, EditorContextType } from '@toryjs/ui';
import { GridChildProps } from '../grid_view';
import { FormComponentProps, DataSet } from '@toryjs/form';

const handle = css`
  width: 8px;
  height: 8px;
  position: absolute;
  left: -100px;
  top: -100px;
  background-color: #aaa;
  border: solid 1px #222;
  cursor: ew-resize;
  label: handle;
`;

let leftHandle: HTMLDivElement;
let rightHandle: HTMLDivElement;
let hideTimeout: any;
let hiding = false;

export function timeHideHandles() {
  // console.log(' wait hiding');
  hideTimeout = setTimeout(hideHandles, 10);
}

function createHandle() {
  const resizeHandle = document.createElement('div');
  resizeHandle.draggable = true;
  resizeHandle.className = handle;
  resizeHandle.onmouseover = () => clearTimeout(hideTimeout);
  resizeHandle.onmouseout = timeHideHandles;
  document.body.appendChild(resizeHandle);
  return resizeHandle;
}

export function showHandles(
  e: React.MouseEvent,
  props: FormComponentProps,
  context: EditorContextType
) {
  e.preventDefault();
  console.log('Handles ...');

  if (!leftHandle) {
    leftHandle = createHandle();
    rightHandle = createHandle();
  }
  if (hiding) {
    return;
  }
  if (props.formElement.control !== 'EditorCell') {
    clearTimeout(hideTimeout);

    let rect = (e.currentTarget.childNodes[0] as HTMLDivElement).getBoundingClientRect();
    leftHandle.style.left = rect.left - 4 + window.scrollX + 'px';
    leftHandle.style.top = rect.top + rect.height / 2 + window.scrollY - 4 + 'px';
    rightHandle.style.left = rect.left + rect.width - 4 + window.scrollX + 'px';
    rightHandle.style.top = rect.top + rect.height / 2 + window.scrollY - 4 + 'px';

    const target = e.currentTarget as HTMLDivElement;

    leftHandle.ondragstart = ev =>
      dragElement(ev, props, context, target, props.formElement as any, 'left');
    leftHandle.setAttribute('data-row', props.formElement.props.row);
    leftHandle.setAttribute('data-column', props.formElement.props.column);

    rightHandle.ondragstart = ev =>
      dragElement(ev, props, context, target, props.formElement as any, 'right');
    rightHandle.setAttribute('data-row', props.formElement.props.row);
    rightHandle.setAttribute('data-column', props.formElement.props.column);
  }
}

function hideHandles() {
  // console.log('hiding');
  if (leftHandle) {
    rightHandle.style.left = '-100px';
    leftHandle.style.top = '-100px';
  }
  return true;
}

export function dragElement(
  e: DragEvent,
  props: FormComponentProps,
  context: EditorContextType,
  target: HTMLDivElement,
  element: FormDataSet<GridChildProps, GridChildProps>,
  direction: 'left' | 'right'
) {
  // let widthPx = 0;
  e.preventDefault();
  e.stopPropagation();

  hiding = true;
  hideHandles();

  let formWidth = getPropValue(props, element, context, 'width');

  // create a clone of the currentTarget element
  // const form = document.querySelector('#editorForm');
  // const sibling = (direction === 'left'
  //   ? e.currentTarget.nextSibling
  //   : e.currentTarget.previousSibling) as HTMLDivElement;

  const clone = target.cloneNode(true) as HTMLDivElement;

  // console.log(clone.className);

  target.classList.remove('content');
  target.style.opacity = '0.1';

  const rect = target.getBoundingClientRect();
  //const parentRect = sibling.parentElement.parentElement.getBoundingClientRect();

  let originalX = direction === 'left' ? rect.left : rect.right;
  let clientWidth = rect.width;
  let widthDivision = clientWidth / formWidth;
  let newWidth = Math.floor(clientWidth / widthDivision);

  // used in validation
  let cells = element.parent.elements.filter(
    e => e.props.row === element.props.row && e !== element
  );

  // insert the clone to the page
  // TODO: position the clone appropriately
  document.body.appendChild(clone);

  clone.style.outline = 'dotted 3px blue';
  clone.style.outlineOffset = '-1px';
  clone.style.backgroundColor = 'white';
  clone.style.position = 'absolute';
  clone.style.top = rect.top + window.scrollY + 'px';
  clone.style.left = rect.left + window.scrollX + 'px';
  clone.style.width = rect.width + 'px';
  clone.style.height = rect.height + 'px';

  const closeDragElement = action(() => {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;

    if (validateDrag() && newFormWidth() > 0) {
      setPropValue(props, element.props as DataSet, context, newColumn(), 'column');
      setPropValue(props, element.props as DataSet, context, newFormWidth(), 'width');
    }

    //sibling.classList.add('content');
    target.style.opacity = '1';
    document.body.removeChild(clone);
    hiding = false;
  });

  e = e || (window.event as any);
  // get the mouse cursor position at startup:
  document.onmouseup = closeDragElement;
  // call a function whenever the cursor moves:
  document.onmousemove = elementDrag;

  function newFormWidth() {
    return Math.ceil(newWidth / widthDivision);
  }

  function newColumn() {
    const col = getPropValue(props, element, context, 'column');
    const width = getPropValue(props, element, context, 'width');
    return direction === 'left' ? col - (newFormWidth() - width) : col;
  }

  function validateDrag() {
    // try one adjustment moving the item left or right from the conflict cell
    // console.log(`${newColumn()}`);

    return !findConflict(props, context, cells, newColumn(), newColumn() + newFormWidth() - 1);
  }

  function elementDrag(e: MouseEvent) {
    e = e || (window.event as any);
    e.preventDefault();

    if (direction === 'left') {
      // set the element's new position:
      newWidth = originalX - e.clientX + clientWidth;
      if (validateDrag()) {
        clone.style.width = newWidth + 'px';
        clone.style.left = e.clientX - 2 + 'px'; // clone.offsetLeft - pos1 + 'px';
      }
    } else {
      newWidth = e.clientX - originalX + clientWidth;
      if (validateDrag()) {
        clone.style.width = newWidth + 'px';
      }
    }
  }
}
