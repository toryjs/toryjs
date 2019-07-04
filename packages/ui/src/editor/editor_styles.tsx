import React from 'react';

import { css } from 'emotion';
import { Theme, names } from '../common';
import { EditorContext } from './editor_context';
import { styleComponent } from './styled_component';

export const flexed = css`
  flex: auto !important;
  margin-right: 8px !important;
`;

export const compact = css`
  margin-bottom: 0px !important;
`;

export const caret = css`
  margin-right: 3px !important;
  padding-right: 0px !important;
  label: caret;
`;

export const margined = css`
  margin-top: 20px;
`;

export const scrollablePane = `
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  overflow: auto;
`;

export const pad6 = css`
  padding: 6px;
  label: pad6;
`;

export const pad12 = css`
  padding: 12px;
  label: pad6;
`;

export const margin12 = css`
  margin: 12px !important;
  label: margin12;
`;

export const paneContent = (theme: any) => css`
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: ${theme.pane};
  color: ${theme.textColor};
  height: 100%;
  width: 100%;
  position: relative;
  width: 100%;
  label: paneContent;

  .text {
    white-space: nowrap;
  }

  .menu {
    margin-bottom: 0px !important;
  }

  .searchInput {
    margin: 6px !important;
  }

  .paneHeader {
    font-weight: bold;
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    height: 40px;

    padding: 6px 12px 6px 12px;
    background-color: ${theme.headerBackground};
    border-bottom: solid 2px #111;

    .text {
      border-bottom: solid 3px #2185d0;
      flex: 1 1 auto;
      height: 30px;
      position: absolute;
      top: 10px;
      color: ${theme.headerColor};
    }

    .expandable {
      left: 35px;
    }

    span {
      flex: 1 1 100%;
    }
  }
`;

export const PaneContent = styleComponent(paneContent);

export const modalActions = css`
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  align-items: center;

  .button {
    white-space: nowrap;
  }
`;

export const propertyFields = css`
  /* name: properties */
  .menu {
    margin-bottom: 0px !important;
  }
  input {
    padding: 6px !important;
  }
  .fields {
    margin-bottom: 3px !important;
  }
`;

export const editorGrid = css`
  position: relative;
  .Resizer {
    background: #000;
    opacity: 0.2;
    z-index: 1;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -moz-background-clip: padding;
    -webkit-background-clip: padding;
    background-clip: padding-box;
  }

  .Resizer:hover {
    -webkit-transition: all 2s ease;
    transition: all 2s ease;
  }

  .Resizer.horizontal {
    height: 11px;
    margin: -5px 0;
    border-top: 5px solid rgba(255, 255, 255, 0);
    border-bottom: 5px solid rgba(255, 255, 255, 0);
    cursor: row-resize;
    width: 100%;
  }

  .Resizer.horizontal:hover {
    border-top: 5px solid rgba(0, 0, 0, 0.5);
    border-bottom: 5px solid rgba(0, 0, 0, 0.5);
  }

  .Resizer.vertical {
    width: 11px;
    margin: 0 -5px;
    border-left: 5px solid rgba(255, 255, 255, 0);
    border-right: 5px solid rgba(255, 255, 255, 0);
    cursor: col-resize;
  }

  .Resizer.vertical:hover {
    border-left: 5px solid rgba(0, 0, 0, 0.5);
    border-right: 5px solid rgba(0, 0, 0, 0.5);
  }
  .Resizer.disabled {
    cursor: not-allowed;
  }
  .Resizer.disabled:hover {
    border-color: transparent;
  }
`;

export const propertyLabel = css`
  .property {
    text-align: right;
  }

  .property label {
    margin-top: 6px !important;
  }
`;

export const relative = css`
  position: relative;
  height: 100%;
`;

export const white = css`
  background-color: white;
`;

export const sidePane = css`
  ${scrollablePane};
  top: 40px;
  label: sidePane;
`;

export const searchableSidePane = css`
  ${scrollablePane};
  top: 80px;
  label: sidePane;
`;

export const toolBox = (theme: any, hideMenu: boolean) => css`
  ${scrollablePane};

  padding: 6px 12px 6px 12px;
  top: ${hideMenu ? '0px' : '40px'};
  margin: 0px !important;
  overflow: auto;
  label: toolBox;

  .item {
    margin: 0px;
    padding: 3px;
  }

  .header.item {
    color: ${theme.headerText}!important;
    padding: 6px 0px 6px 0px !important;
  }
`;

export const ToolBox = (props: any) => {
  const context = React.useContext(EditorContext);
  return (
    <div className={names(toolBox(context.theme, props.hideMenu), props.className)}>
      {props.children}
    </div>
  );
};

export const noRoundCorners = css`
  border-radius: 0px !important;
`;

export const pointers = css`
  > * > div {
    cursor: pointer;
  }
`;

const common = `
  margin-left: -8px;
  padding-bottom: 5px;
  font-weight: bold;
  font-size: 11px;
  font-family: 'Courier';
`;

const folderCommon = `
  color: black;
  font-weight: bold;
  font-size: 10px;
  font-family: 'Courier';
  margin-left: -10px;
`;

export const list = (theme: Theme) => css`
  label: list;
  width: 100%;
  height: 100%;

  .label {
    float: right;
  }

  .selected {
    background: ${theme.selectedBackground};
    color: ${theme.selectedColor};
    border-radius: 3px;
  }

  .over {
    background: #aaa;
    border-radius: 3px;
    padding-left: 3px;
    margin-right: 6px;
  }

  .array {
    display: flex;
  }

  .import {
    display: flex;
  }

  .reference {
    display: flex;
  }

  .reference::after {
    content: 'T';
    color: white;
    ${folderCommon}
  }

  .import::after {
    content: 'I';
    ${folderCommon}
  }

  .array::after {
    content: 'A';
    ${folderCommon}
  }

  .string::after {
    content: 'S';
    ${common}
  }

  .integer::after {
    content: 'I';
    ${common}
  }

  .number::after {
    content: 'F';
    ${common}
  }

  .boolean::after {
    content: 'B';
    ${common}
  }

  .treeCaret {
    margin-right: 2px !important;
    flex: 1 1 16px;
    cursor: pointer;
  }

  .folder {
    font-weight: bold;
    flex: 1 1 100%;
    padding-left: 3px;
    cursor: pointer;
  }

  .pointer {
    cursor: pointer;
  }

  .item {
    display: flex;
    margin: 0px;
    padding: 1px 3px 1px 3px !important;
    align-items: center;
    justify-content: flex-start;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .item.folder i {
    margin-left: -5px !important;
    margin-right: 5px !important;
  }

  .item i {
    flex: 0 0 16px;
    margin-right: 6px;
    align-self: flex-start;
    width: 16px;
  }

  .item .content {
    flex: 1 1 100%;
    display: flex;
    flex-direction: column;
  }

  .item.single {
    margin-left: 14px !important;
  }

  .item.single i {
    color: ${theme.invalidBackground};
  }

  .itemContent {
    padding-left: 12px;
  }

  .contentSimple {
    padding-left: 6px;
  }

  .link {
    width: 100%;
    cursor: pointer;
    padding: 0px 3px;
  }

  .meta {
    font-size: smaller;
    color: ${theme.meta};
    font-weight: normal;
  }

  a.single {
    color: ${theme.textColor};
  }
`;

export const List = styleComponent(list);
