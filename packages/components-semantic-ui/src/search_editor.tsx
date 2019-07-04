import { EditorComponent } from '@toryjs/form';
import { SearchComponentProps, SearchComponent } from './search_view';
import { observer } from 'mobx-react';
import { propGroup, prop, handlerProp, boundProp } from '@toryjs/ui';

export const SearchEditor: EditorComponent<SearchComponentProps> = {
  Component: observer(SearchComponent),
  title: 'Lookup',
  control: 'Lookup',
  icon: 'search',
  bound: true,
  props: {
    ...propGroup('Lookup', {
      searchName: prop(),
      search: handlerProp(),
      single: prop({ type: 'boolean' }),
      limit: prop({ type: 'number' }),
      value: boundProp()
    }),
    renderTemplate: prop({
      group: 'Render Template',
      control: 'Code',
      props: {
        language: 'markup'
      }
    })
  }
};
