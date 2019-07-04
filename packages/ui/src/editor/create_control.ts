/* eslint-disable react-hooks/rules-of-hooks */

import React from 'react';

import { css } from 'emotion';
import { FormComponentProps } from '@toryjs/form';

import { EditorContext } from './editor_context';
import { FormDataSet } from './form_store';

const label = css`
  position: absolute;
  z-index: 100;
  background: salmon;
  padding: 3px;
  border-radius: 3px;
  white-space: nowrap;
  overflow: hidden;
  color: white;
  transition: width 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);

  span {
    padding: 0px 3px;
    cursor: pointer;
  }

  label: label;
`;

const overStyle = css`
  outline: dotted 2px;
  outline-color: transparent;
  transition: outline-color 0.3s;
  .on {
    outline: dotted 2px;
    outline-color: #aaa !important;
  }

  /* outline-offset: -3px; */
  /* background-color: pink !important; */
  label: over;
`;

let controls: any[] = [];
let elem: HTMLDivElement;
let timer: any = null;
let out = true;

function startTimer() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    if (!elem) {
      return;
    }
    elem.style.left = '-1000px';
    elem.style.top = '-1000px';
  }, 1000);
}

function showLabel(currentTarget: HTMLElement) {
  // console.log(index + ' over: ' + element.control);
  clearTimeout(timer);
  if (!elem) {
    elem = document.createElement('div');
    elem.className = label;
    document.body.appendChild(elem);
  }
  let bb = currentTarget.getBoundingClientRect();
  elem.onmouseover = () => {
    clearTimeout(timer);
  };
  elem.onmouseout = () => startTimer();

  let left = bb.left + window.scrollX;
  let top = bb.top + bb.height + window.scrollY;

  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }

  elem.style.left = left + 'px';
  elem.style.top = top + 'px';
}

export function editorProps(element: FormDataSet, props: FormComponentProps) {
  const context = React.useContext(EditorContext);
  const ele = element;
  // const [over, setOver] = React.useState(false);
  const onClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      context.state.setElement(element, context.schema);
    },
    [context.schema, context.state, element]
  );

  const onMouseOver = React.useCallback(
    (e: React.ChangeEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.preventDefault();

      let el = ele;
      // if (!e.target.getAttribute('data-editor-id')) {
      //   return;
      // }
      // console.log('Over: ' + (ele && ele.control) + e.currentTarget.getAttribute('data-control'));

      if (controls.length > 0) {
        return;
      }

      // we detect "invisible" or "provider" elements
      // TODO: revisit
      while (el.elements && el.elements.length && el.elements[0]) {
        let control = context.editorCatalogue.components[el.elements[0].control];
        if (control && control.provider) {
          el = el.elements[0];
        } else {
          break;
        }
      }

      while (el != null && el.control) {
        let current = el;
        controls.push(element);

        // let index = e.handled || 0;
        // e.handled = index + 1;
        if (out) {
          showLabel(e.currentTarget);
          if (!e.currentTarget.classList.contains(overStyle)) {
            e.currentTarget.classList.add(overStyle);
          }
          e.currentTarget.classList.add('on');
          out = false;
        }

        // console.log(
        //   `${e.currentTarget === e.target} C: ${e.currentTarget.getAttribute(
        //     'data-editor-id'
        //   )} T: ${e.target.getAttribute('data-editor-id')}`
        // );

        let child = document.createElement('span');
        child.onclick = ((e: React.MouseEvent<HTMLDivElement>) => {
          e.stopPropagation();
          context.state.setElement(current, context.schema);
        }) as any;
        child.innerHTML = el.control;

        if (elem && elem.childNodes.length === 1) {
          let expand = document.createElement('span');
          expand.onclick = () => {
            elem.style.width = elem.getAttribute('data-full-width') + 'px';
          };
          expand.style.padding = '0px 6px 0px 3px';
          expand.innerHTML = ' \u276F ';
          elem.appendChild(expand);
        } else if (elem && elem.childNodes.length > 1) {
          elem.appendChild(document.createTextNode(' \u276F '));
        }
        if (elem) {
          elem.appendChild(child);

          // calculate hide
          elem.style.width = null;
          if (elem.childNodes.length === 1) {
            elem.setAttribute('data-start-width', elem.getBoundingClientRect().width.toString());
          } else {
            elem.setAttribute('data-full-width', elem.getBoundingClientRect().width.toString());
            elem.style.width = parseInt(elem.getAttribute('data-start-width')) + 16 + 'px';
          }
        }
        el = el.parent;
      }
    },
    [context.editorCatalogue.components, context.schema, context.state, ele, element]
  );

  const onMouseOut = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    out = true;
    controls = [];
    e.currentTarget.classList.remove('on');
    // e.currentTarget.classList.remove(overStyle);
    startTimer();
  }, []);

  const newProps = React.useMemo(
    () => ({
      ...props.extra,
      onClick,
      onMouseOver,
      onMouseOut
    }),
    [onClick, onMouseOut, onMouseOver, props.extra]
  );

  if (!element || element.uid == null) {
    return undefined;
  }

  return newProps;
}
