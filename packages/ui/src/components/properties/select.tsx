import * as React from 'react';

import { observer } from 'mobx-react';
import { parseProps, onChangeHandler } from './properties_common';
import { Dropdown } from 'semantic-ui-react';
import { prop } from '../../common';
import { FormComponentProps } from '@toryjs/form';
import { EditorContext } from '../../editor/editor_context';
import { getValue } from '../../helpers';

export const Select: React.FC<FormComponentProps> = observer(props => {
  const editorState = React.useContext(EditorContext);
  const onChange = React.useMemo(() => onChangeHandler.bind({ props, editorState }), [
    editorState,
    props
  ]);

  const { formElement } = props;
  const source = prop(formElement);

  let def = getValue(props, editorState, 'default');

  const opts = React.useMemo(() => {
    let options = getValue(props, editorState, 'options');
    if (!options) {
      options = [];
    }
    let schema = props.owner.getSchema(source, false);
    if (schema && schema.$enum) {
      options = options.concat(schema.$enum);
    }
    return options;
  }, [editorState, props, source]);

  const { value, error } = parseProps(props, editorState, true);

  return (
    <Dropdown
      value={value || def}
      data-value={value || def}
      id={source}
      search={formElement.props.search}
      selection
      fluid
      text={value ? undefined : formElement.props && formElement.props.text}
      name="type"
      onChange={onChange}
      className={`property-search ${error ? 'invalid' : ''}`}
      options={opts}
    />
  );
});
