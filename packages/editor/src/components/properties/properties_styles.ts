import { css } from '@toryjs/ui';
import { Theme } from '../../editor/themes/common';

export const addButton = (theme: Theme) => css`
  border: 0px;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  height: 25px;
  width: 25px;
  background: ${theme.buttonBackground};
  color: ${theme.inputColor};
  label: addButton;
`;

export const controlMargin = css`
  padding: 0px 6px;
  width: 100% !important;
`;

export const styledTableRow = (theme: Theme) => css`
  display: flex;
  align-items: center;
  height: 27px;
  margin-bottom: 4px;

  input {
    border: 0px !important;
    color: ${theme.inputColor} !important;
    background-color: ${theme.inputBackground} !important;
    border-left: solid 1px ${theme.borderColor} !important;
    padding-left: 6px;
  }
`;

export const celled = (theme: Theme) => css`
  > div {
    border: 1px solid ${theme.borderColor};
    border-radius: 3px;
  }
  label: celled;
`;

export const tableRowWithDelete = css`
  display: flex;
  align-items: center;
  height: 26px;
  border: solid 1px #ccc;
  margin-top: -1px;

  > .only {
    flex: 1 1 100%;
    width: 100%;
  }

  > .first {
    flex: 1 1 40%;
    width: 100%;
  }

  > .second {
    flex: 1 1 calc(60% - 20px);
    width: 100%;
    border-left: 1px solid #ccc !important;
    min-width: 20px;
  }

  > button {
    border: 0px !important;
    border-left: 1px solid #ccc !important;
    background-color: #eee !important;
    flex: 1 1 20px;
    height: 24px !important;
  }

  button {
    height: 24px;
  }
`;

export const tableRowFull = css`
  flex: 1 1 100%;
  border-right: solid 1px #111;

  > * {
    width: 100%;
  }
`;

export const tableRowAuto = css`
  flex: 1 1 auto;
`;

export const tableRowFlex = css`
  flex: 1;
`;

export const tableHeader = css`
  font-weight: bold;
  font-style: italic;
  color: #666;
  margin-bottom: 6px;
  margin-top: 6px;
`;
