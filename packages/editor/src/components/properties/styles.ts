import { css } from '@toryjs/ui';

export const select = css`
  .react-select__control {
    border: 0px;
    border-radius: 0 !important;
    min-height: 23px;
  }

  .react-select__indicators {
    height: 23px;
  }

  .react-select__indicator {
    padding: 2px;
  }

  .react-select__value-container {
    height: 23px;

    > div {
      /* position: absolute; */
      margin: 0px;
      padding: 0px;
    }
  }

  .react-select__single-value {
    margin-top: 0px;
  }

  .react-select__menu {
    border-radius: 0px;
    margin-top: 2px;
  }

  label: select;
`;
