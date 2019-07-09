import React from 'react';

export function calculatePosition(layout: string, e: React.DragEvent) {
  return layout === 'row' ? calculateVerticalPosition(e) : calculateHorizontalPosition(e);
}

export function calculateHorizontalPosition(e: React.DragEvent) {
  let element = e.currentTarget;
  let elementLeft = window.scrollX + element.getBoundingClientRect().left;
  let elementWidth = element.clientWidth;

  return e.pageX - elementLeft < elementWidth / 2 ? 'left' : 'right';
}

export function calculateVerticalPosition(e: React.DragEvent) {
  let element = e.currentTarget;
  let elementTop = window.scrollX + element.getBoundingClientRect().top;
  let elementHeight = element.clientHeight;
  let dragStart = e.pageY;

  // console.log(`${id} ${dragStart} - ${elementTop} < ${elementHeight} | ${dragStart - elementTop}`);

  return dragStart - elementTop < elementHeight / 2 ? 'top' : 'bottom';
}
