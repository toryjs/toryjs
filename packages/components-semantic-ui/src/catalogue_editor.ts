import { EditorComponentCatalogue } from '@toryjs/form';
import { createEditorComponent } from '@toryjs/ui';

import { CheckboxEditor } from './checkbox_editor';
import { InputEditor } from './input_editor';
import { RadioEditor } from './radio_editor';
import { TableEditor } from './table_editor';
// import { SignatureEditor } from './signature_editor';
import { TextAreaEditor } from './textarea_editor';
import { CommentEditor } from './comment_editor';
import { DropdownEditor } from './dropdown_editor';
// import { DateEditor } from './date_time_editor';
import { ButtonEditor } from './buttons_editor';
import { MenuEditor, MenuItemEditor } from './menu_editor';
import { IconEditor } from './icon_editor';
import { SegmentEditor } from './segment_editor';
import { TabsEditor } from './tab_editor';
import { HeaderEditor } from './header_editor';
import { SearchEditor } from './search_editor';

export const catalogueEditor: EditorComponentCatalogue = {
  createComponent: createEditorComponent,
  cssClass: 'ui form',
  components: {
    Button: ButtonEditor,
    Checkbox: CheckboxEditor,
    Comment: CommentEditor,
    // Date: DateEditor,
    Dropdown: DropdownEditor,
    // Form: FormEditor,
    Header: HeaderEditor,
    Icon: IconEditor,
    Input: InputEditor,
    Lookup: SearchEditor,
    MenuItem: MenuItemEditor,
    Menu: MenuEditor,
    Radio: RadioEditor,
    // Search: SearchEditor,
    Segment: SegmentEditor,
    // Signature: SignatureEditor,
    Table: TableEditor,
    Tabs: TabsEditor,
    Textarea: TextAreaEditor
  }
};
