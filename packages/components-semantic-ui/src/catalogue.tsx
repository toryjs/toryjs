import { FormComponentCatalogue } from '@toryjs/form';
import { createComponent } from '@toryjs/ui';

import { CheckboxView } from './checkbox_view';
import { InputView } from './input_view';
import { RadioView } from './radio_view';
import { TableView } from './table_view';
// import { SignatureView } from './signature_view';
import { TextAreaView } from './textarea_view';
import { CommentView } from './comment_view';
import { SearchView } from './search_view';
// import { DateView } from './date_time_view';
import { MenuView, MenuItem } from './menu_view';
import { TabView } from './tab_view';
import { ButtonView } from './buttons_view';
import { DropdownView } from './dropdown_view';
import { IconView } from './icon_view';
import { SegmentView } from './segment_view';
import { HeaderView } from './header_view';

export const catalogue: FormComponentCatalogue = {
  createComponent: createComponent,
  cssClass: 'ui form',
  components: {
    // ApproveButton: ApproveButton,
    Button: ButtonView,
    Checkbox: CheckboxView,
    Comment: CommentView,
    // Date: DateView,
    // DeleteButton: DeleteButton,
    Dropdown: DropdownView,
    EditorCell: null,
    Header: HeaderView,
    Icon: IconView,
    Input: InputView,
    Lookup: SearchView,
    Menu: MenuView,
    MenuItem: MenuItem,
    Radio: RadioView,
    // RejectButton: RejectButton,
    Segment: SegmentView,
    // Search: SearchView,
    // Signature: SignatureView,
    // SubmitButton: SubmitButton,
    Tabs: TabView,
    Table: TableView,
    Textarea: TextAreaView
    // Time: DateView
  }
};
