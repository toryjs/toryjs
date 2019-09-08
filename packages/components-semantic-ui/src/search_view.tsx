import * as React from 'react';

import { observer } from 'mobx-react';
import { SearchResultData, SearchProps, Search } from 'semantic-ui-react';
import { FormComponentProps, BoundProp } from '@toryjs/form';
import { debounce } from '@tomino/toolbelt';
import {
  handle,
  css,
  Context,
  ContextType,
  getValue,
  setValue,
  valueSource,
  DynamicComponent
} from '@toryjs/ui';
import { parseProps } from '@toryjs/ui/dist/cjs/helpers';

type DropdownOption = {
  title: string;
  titles: string[];
  description?: string;
  image?: string;
  price?: string;
  value: string;
};

type State = {
  isLoading: boolean;
  value: string;
  options: DropdownOption[];
};

export type SearchComponentProps = {
  searchName: string;
  renderTemplate: string;
  search: string;
  single: number;
  limit: number;
  value: BoundProp;
};

const style = css`
  .input {
    display: block !important;
  }
`;

// const SearchComponent: React.FC<FormComponentProps<SearchComponentProps>> = props => {
//   const ctx = React.useContext(Context); // the react component freezes when used with context
//   return <SearchWithContext {...props} context={ctx} />;
// };

const controlProps = ['fluid'];

@observer
export class SearchWithContext extends React.Component<
  FormComponentProps<SearchComponentProps>,
  State
> {
  static contextType = Context;
  context: ContextType;

  state = { isLoading: false, options: [] as any[], value: '' };

  async componentDidMount() {
    this.resetComponent();

    let props = this.props.formElement.props;
    let value = getValue(this.props, this.context);

    if (!value) {
      return;
    }

    // we need to preload our value
    if (value != null) {
      this.setState({ isLoading: true });
      handle(
        this.props.handlers,
        props.search || 'lookup',
        this.props.owner,
        this.props,
        this.props.formElement,
        this.context,
        {
          lookup: props.searchName,
          single: props.single,
          limit: props.limit,
          value,
          context: this.context,
          searchByValue: true
        }
      ).then((options: DropdownOption[]) => {
        // handle titles, make sure they are defined
        this.createTitles(options);
        this.setState({
          isLoading: false,
          value: options && options.length ? options[options.length - 1].title : ''
        });
      });
    }
  }

  resetComponent = () => this.setState({ isLoading: false, options: [], value: '' });

  handleResultSelect = (_event: React.MouseEvent<HTMLDivElement>, { result }: SearchResultData) => {
    if (result.key === '-1') {
      return false;
    }

    this.setState({ value: result.title });
    setValue(this.props, this.context, result.value);
  };

  handleSearchChange = (_event: React.MouseEvent<HTMLElement>, { value }: SearchProps) => {
    this.setState({ isLoading: true, value });
    if (value.length < 1) return this.resetComponent();

    this.getResults(value);
  };

  createTitles(options: DropdownOption[]) {
    for (let option of options) {
      if (!option.title) {
        if (option.titles) {
          option.title = option.titles.join(' - ');
        } else {
          console.error('You need to provide title!');
        }
      }
    }
  }

  resultRenderer = (option: any) => {
    let control = this.props.formElement.props.renderTemplate;
    let titles: string[] = option.titles || [option.title];

    if (control[0] && control[0].match(/\d/)) {
      control = control
        .split('\n')
        .map((s, i) => `<div style="width: ${s};display: inline-block" onclick="">{${i}}</div>`)
        .join('\n');
    }

    titles.forEach((t, i) => (control = control.replace(`{${i}}`, t)));

    return <div dangerouslySetInnerHTML={{ __html: control }} />;
  };

  getResults = debounce((value: string) => {
    if (!value) {
      return [];
    }
    // if (!this.props.formElement.props.searchName) {
    //   throw new Error('You need to define a search name!');
    // }
    let props = this.props.formElement.props;
    handle(
      this.props.handlers,
      props.search || 'lookup',
      this.props.owner,
      this.props,
      this.props.formElement,
      this.context,
      {
        lookup: props.searchName,
        single: props.single,
        limit: props.limit,
        value,
        context: this.context
      }
    ).then((options: DropdownOption[]) => {
      // handle titles, make sure they are defined
      this.createTitles(options);

      this.setState({
        isLoading: false,
        options
      });
    });
  }, 500);

  render() {
    const { isLoading, value, options } = this.state;
    const { readOnly } = parseProps(this.props, this.context);

    if (!valueSource(this.props.formElement)) {
      return <DynamicComponent {...this.props}>Component not bound ;(</DynamicComponent>;
    }

    if (readOnly || this.props.formElement.props.single) {
      // return <Input disabled value={value} />;
      return value;
    }

    return (
      <DynamicComponent
        {...this.props}
        control={Search}
        controlProps={controlProps}
        className={style}
        loading={isLoading}
        fluid={true}
        showNoResults={this.state.isLoading ? false : true}
        showError={true}
        onResultSelect={this.handleResultSelect}
        onSearchChange={this.handleSearchChange}
        resultRenderer={
          this.props.formElement.props.renderTemplate ? this.resultRenderer : undefined
        }
        results={options}
        value={value}
      />
    );
  }
}

export const SearchView = {
  Component: SearchWithContext,
  toString: () => ''
};
