import { EditorComponent } from '@toryjs/form';

import { FormulaComponent } from './formula_view';

export const FormulaEditor: EditorComponent = {
  Component: FormulaComponent,
  title: 'Formula',
  control: 'Formula',
  icon: 'code'
};
