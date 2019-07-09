import { EditorComponent } from '@toryjs/form';

import { FormulaView } from './formula_view';
import { propGroup, boundProp } from '@toryjs/ui';

export const FormulaEditor: EditorComponent = {
  Component: FormulaView.Component,
  title: 'Formula',
  control: 'Formula',
  icon: 'code',
  props: propGroup('Formula', {
    value: boundProp({
      documentation: `
Formula to evaluate. 
You can access the dataset values by <i>this.parameterName</i> or <i>value.parameterName</i> notation, whichever you prefer.
When you write a formula either write it with a return statement (e.g. return this.value * 1.18), or as a single expression without semicolons (e.g. this.value * 1.18).
`,
      props: { label: '', display: 'padded', editorLabel: 'Formula' },
      control: 'Textarea'
    })
  })
};
