import { EditorComponentCatalogue } from '@toryjs/form';
import { createEditorComponent, FormEditor } from '@toryjs/ui';

import { FormulaEditor } from './formula_editor';
import { RepeaterEditor } from './repeater_editor';
import { TextEditor, ImageEditor, LinkSelectorEditor, LinkEditor } from './text_editor';
import { GridEditor } from './grid_editor';
import { StackEditor } from './stack_editor';
import { AuthItemEditor } from './auth_item_editor';
import { FlexEditor } from './flex_editor';
import { MarkdownEditor } from './markdown_editor';
import { ContextEditor } from './context_editor';
import { DateEditor } from './date_editor';
import { MaskedEditor } from './masked_editor';
import { InputEditor } from './input_editor';
import { TextAreaEditor } from './textarea_editor';
import { CheckboxEditor } from './checkbox_editor';
import { RadioEditor } from './radio_editor';
import { DropdownEditor } from './dropdown_editor';
import { HtmlFormEditor } from './html_form_editor';
import { ButtonEditor } from './buttons_editor';

export const catalogueEditor: EditorComponentCatalogue = {
  isEditor: true,
  createComponent: createEditorComponent,
  cssClass: '',
  components: {
    AuthItem: AuthItemEditor,
    Checkbox: CheckboxEditor,
    Context: ContextEditor,
    Button: ButtonEditor,
    Dropdown: DropdownEditor,
    Date: DateEditor,
    Flex: FlexEditor,
    Form: FormEditor,
    Formula: FormulaEditor,
    Grid: GridEditor,
    HtmlForm: HtmlFormEditor,
    Image: ImageEditor,
    Input: InputEditor,
    Repeater: RepeaterEditor,
    Link: LinkEditor,
    LinkSelector: LinkSelectorEditor,
    MaskedInput: MaskedEditor,
    Markdown: MarkdownEditor,
    Radio: RadioEditor,
    Stack: StackEditor,
    Text: TextEditor,
    Textarea: TextAreaEditor
  }
};
