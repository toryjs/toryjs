import React from 'react';
import { css } from '@toryjs/ui';

const style = css`
  margin: 8px 0px 12px 0px;
`;

export const ControlTextView: React.FC<any> = props => {
  return <span className={style}>{props.value}</span>;
};
