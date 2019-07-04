import { FormComponentCatalogue } from '@toryjs/form';

import { FormulaView } from './formula_view';
import { RepeaterView } from './repeater_view';
import { TextView, ImageView, LinkView, LinkSelectorView } from './text_view';
import { GridView } from './grid_view';
import { StackView } from './stack_view';
import { AuthItem } from './auth_item_view';
import { FlexView } from './flex_view';
import { DateView } from './date_view';
import { MaskedView } from './masked_view';

import { createComponent, FormView } from '@toryjs/ui';
import { MarkdownComponent } from './markdown_view';
import { ContextComponent } from './context_view';
import { InputView } from './input_view';
import { TextAreaView } from './textarea_view';
import { CheckboxView } from './checkbox_view';
import { RadioView } from './radio_view';
import { DropdownView } from './dropdown_view';
import { HtmlFormComponent } from './html_form_view';
import { ButtonView } from './buttons_view';

export const catalogue: FormComponentCatalogue = {
  createComponent: createComponent,
  cssClass: '',
  components: {
    AuthItem: AuthItem,
    Button: ButtonView,
    Checkbox: CheckboxView,
    Context: ContextComponent,
    Date: DateView,
    Dropdown: DropdownView,
    EditorCell: null,
    Flex: FlexView,
    Form: FormView,
    Formula: FormulaView,
    Grid: GridView,
    HtmlForm: HtmlFormComponent,
    Image: ImageView,
    Input: InputView,
    Link: LinkView,
    LinkSelector: LinkSelectorView,
    MaskedInput: MaskedView,
    Markdown: MarkdownComponent,
    Radio: RadioView,
    Repeater: RepeaterView,
    Stack: StackView,
    Text: TextView,
    Textarea: TextAreaView
  }
};
