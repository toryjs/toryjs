// import React from 'react';

import { FormComponentProps } from '@toryjs/form';

// import { css } from '../common';
// import { Icon } from 'semantic-ui-react';
// import { observer } from 'mobx-react';

export function processControls(props: FormComponentProps) {
  // filter out what we do not need
  let controls = props.readOnly
    ? props.formElement.elements.filter(e => e.control.indexOf('Button') === -1)
    : props.formElement.elements;

  // generate empty cells if requires
  return controls;
}

// const handle = css`
//   padding-left: 1px;
//   opacity: 0.8;
//   width: 20px;
//   position: absolute;
//   color: #777;
//   border: 1px solid #777;
//   border-radius: 3px;
//   left: -10px;
//   background: #ddd;
//   display: none;
//   label: handle;
// `;

// export const Handle = observer((props: any) => (
//   <div
//     {...props}
//     className={handle}
//     style={{
//       display: props.item.isSelected ? 'block' : 'none'
//     }}
//   >
//     <Icon name="content" />
//   </div>
// ));

// Handle.displayName = 'Handle';
