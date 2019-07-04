import { Theme } from '../../common';
import { css } from 'emotion';

export const styledPropertyView = (theme: Theme) => css`
  font-family: Lato, 'Helvetica Neue', Arial, Helvetica, sans-serif;
  label: propertyStyles;

  label {
    font-family: Lato, 'Helvetica Neue', Arial, Helvetica, sans-serif;
  }

  .input {
    font-family: Lato, 'Helvetica Neue', Arial, Helvetica, sans-serif;
    padding-left: 3px;
    height: 25px;
  }

  .headerButton {
    background: ${theme.buttonBackground};
    padding: 3px 6px;
    color: ${theme.inputColor};
    border: 0px solid ${theme.borderColor};
    border-radius: 3px;
  }

  .headerButton:last-of-type {
    margin-right: 12px;
  }

  input {
    font-family: Lato, 'Helvetica Neue', Arial, Helvetica, sans-serif;
    padding-left: 6px !important;
    height: 25px;
    min-width: 30px;
  }

  textarea {
    font-family: Lato, 'Helvetica Neue', Arial, Helvetica, sans-serif;
    min-height: 100px;
    resize: vertical;
    background-color: ${theme.inputBackground}!important;
    color: ${theme.inputColor}!important;
    width: 100%;
    border-radius: 3px;
    padding: 6px;
  }

  .propertyInput {
    display: flex;
    flex: 1;
    align-items: center;
    label: propertyInput;
  }

  .propertyLabel {
    margin: 0px 6px;
    label: propertyLabel;
    color: ${theme.inputLabel};
  }

  .ui.dropdown {
    border: 0px !important;
    border-radius: 3px;
    background-color: ${theme.inputBackground}!important;
    color: ${theme.inputColor}!important;

    input,
    .selected .text,
    .selected .text,
    &.visible .text {
      color: ${theme.textColor}!important;
    }

    .header,
    .header:hover {
      margin: 0px !important;
      background-color: ${theme.headerBackground}!important;
      color: ${theme.headerColor}!important;
      opacity: 1 !important;
    }

    .text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: calc(100% - 15px);
    }

    .selected {
      background: ${theme.selectedBackground}!important;
    }

    .menu.active,
    .menu.visible:hover,
    .menu.visible {
      border: solid 1px !important;
      border-color: ${theme.borderColor}!important;
    }

    .menu .item {
      background-color: ${theme.menuColor};
      color: ${theme.inputColor}!important;
      /* border-top: solid 1px ${theme.borderColor} !important; */
      border-top: 0px!important;
      padding: 6px 10px !important;
    }

    .menu .item:hover {
      background-color: ${theme.selectedBackground};
    }

    .menu .item:hover .text,
    .menu .item.selected .text {
      color: ${theme.textColor} !important;
    }
  }
  .label {
    width: 100%;
    margin: 3px 0px 6px 0px;
  }
  .menu {
    border-radius: 0px !important;
  }
  .dynamic-active {
    display: block;
  }
  .dynamic-hidden {
    display: none;
  }

  label {
    font-weight: bolder;
    display: inline-block;
    vertical-align: middle;
    color: #666;
    margin-bottom: 3px;
  }

  .invalid {
    background-color: ${theme.invalidBackground} !important;
    color: ${theme.invalidColor}!important;
  }

  .property-table-row-single {
    width: 100%;
    background: #f8f8f9;
    border: solid 1px #ccc;

    textarea {
      width: 100%;
      background: white;
      border: 0px;
      min-height: 60px;
      resize: vertical;
      margin-bottom: -3px;
    }
  }

  .property-search {
    border-radius: 0px !important;
    height: 25px !important;
    padding: 5px 6px 3px 6px !important;
    min-height: 24px !important;
  }

  .property-search i {
    padding: 5px 6px 3px 3px !important;
    min-height: 25px !important;
  }

  .property-search input {
    padding: 5px 6px 3px 3px !important;
  }

  .property-table-row {
    width: 100%;
    padding-bottom: 4px;

    &.flexed {
      display: flex;
    }

    > .only {
      flex: 1 1 100%;
    }

    .padded {
      margin: 3px 12px 3px;
      background-color: ${theme.inputBackground} !important;
      color: ${theme.inputColor} !important;
      border: 1px solid ${theme.inputBorder} !important;
    }

    > .first {
      flex: 0 0 100px;
      display: inline-block;
      border: 0px;
      padding: 2px 6px 0px 2px;
      color: ${theme.textColor};
    }

    .second:not(:first-of-type) {
      margin-left: 2px;
    }

    > .full {
      width: 100%;
    }

    > .second {
      flex: 1 1 100%;
      display: inline-block;
      background-color: ${theme.inputBackground} !important;
      color: ${theme.inputColor} !important;
      border: 1px solid ${theme.inputBorder} !important;
      border-radius: 3px;
      padding: 0px;
    }

    input {
      border: 0px !important;
      border-radius: 3px;
      color: ${theme.inputColor} !important;
      background-color: ${theme.inputBackground} !important;
    }

    label {
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
      white-space: nowrap;
      vertical-align: top;
      margin: 0px;

      min-height: 24px;
    }

    > .holder {
      display: inline-block;
      padding-left: 6px;
    }

    textarea {
      border: 0px;
      min-height: 25px;
    }

    .dynamic-error-message {
      text-align: right;
      width: 100%;
      margin: 0px;
      padding: 3px 6px 4px 0px;
    }
  }
`;
