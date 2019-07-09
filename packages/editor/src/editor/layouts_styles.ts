import { css } from 'emotion';
import { Theme } from './themes/common';

export const borderHandler = css`
  width: 5px;
  height: 100%;
  flex: 1 5px;
  cursor: ew-resize;
`;

export const cellContent = css`
  flex: 1 100%;
`;

export const cellStyle = css`
  display: flex;
  width: 100%;
`;

export const containerWrapper = css`
  width: 100%;
  position: relative;
  label: containerWrapper;
`;

export const containerLabelBase = css`
  position: absolute;
  font-weight: bold;
  z-index: 10;
  padding: 3px 12px;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  opacity: 0.8;
  display: block;
  white-space: nowrap;
  label: containerLabel;
`;

export const containerLabelRight = css`
  ${containerLabelBase}
  border-radius: 3px;
  right: 3px;
  bottom: 3px;

  label: containerLabelRight;
`;

export const containerLabelLeft = css`
  ${containerLabelBase}
  position: inherit;
  display: block;
  border-radius: 0px;
  margin-bottom: 6px;
  label: containerLabelLeft;
`;

export const containerBorder = (theme: Theme) => css`
  .on {
    outline: dotted 2px ${theme.label};
    outline-offset: -1px;
    border-radius: 3px;
  }
  label: containerBorder;
`;

const hover = css`
  background-color: grey;
  label: hover;
  transition: padding 0.3s;
`;

export const caret = css`
  width: 10px;
  margin-right: 6px;
  opacity: 0.7;
  font-size: 12px;
`;

export const hoverStates: { [index: string]: any } = {
  hoverDataset: css`
    ${hover}
    opacity: 0.5;
  `,
  off: css`
    background-color: transparent;
    label: off;
  `,
  hover,
  error: css`
    background-color: #ff9999;
    label: error;
  `,
  leftHover: css`
    ${hover};
    background-color: white;
    padding-left: 15px;
    label: hoverLeft;
  `,
  rightHover: css`
    ${hover};
    background-color: white;
    padding-right: 15px;
    label: hoverRight;
  `,
  topHover: css`
    ${hover};
    background-color: white;
    padding-top: 10px;
    label: hoverTop;
  `,
  bottomHover: css`
    ${hover};
    background-color: white;
    padding-bottom: 10px;
    label: hoverBottom;
  `
};
