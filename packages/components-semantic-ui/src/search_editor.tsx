import { EditorComponent } from '@toryjs/form';
import { SearchComponentProps, SearchView } from './search_view';
import { propGroup, prop, handlerProp, boundProp } from '@toryjs/ui';

export const SearchEditor: EditorComponent<SearchComponentProps> = {
  Component: SearchView.Component,
  title: 'Lookup',
  control: 'Lookup',
  icon: 'search',
  bound: true,
  props: {
    ...propGroup('Lookup', {
      searchName: prop({
        documentation:
          'Defines what data to expect from the search handler. This is useful when your search handler can return values for multiple search fields, for example using a generic search function on the server.'
      }),
      search: handlerProp({
        documentation: 'Search handler function that <b>must return Promise</b>.'
      }),
      single: prop({
        type: 'boolean',
        documentation:
          'Renders lookup as a single text field without the possibility to search for other values.'
      }),
      limit: prop({ type: 'number', documentation: 'Limits how many results to display.' }),
      value: boundProp({ documentation: 'Stores the search result selection' })
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
