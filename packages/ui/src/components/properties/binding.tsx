import * as React from 'react';

import { observer } from 'mobx-react';

import { FormComponentProps } from '@toryjs/form';
import { css } from 'emotion';

import { EditorContext } from '../../editor/editor_context';
import { Select } from './select';
import { setValue } from '../../helpers';
import { parseProps } from './properties_common';
import { renderControl } from './control_factory';

export const dot = (view: string) => css`
  min-width: 7px;
  max-width: 7px;
  width: 7px;
  height: 7px;
  background-color: ${view === 'value' ? 'green' : view === 'handler' ? 'red' : 'yellow'};
  margin: 0px 6px;
  cursor: pointer;
  label: dot;
`;

export const Binding = observer((componentProps: FormComponentProps & { uid: string }) => {
  const context = React.useContext(EditorContext);
  const { formElement } = componentProps;
  const { value } = parseProps(componentProps, context);

  const [view, setView] = React.useState(
    value && value.handler ? 'handler' : value && value.source ? 'source' : 'value'
  );
  // const source = valueSource(componentProps.formElement);
  // const schema = componentProps.owner.getSchema(source);
  // debugger;

  const changeView = React.useCallback(() => {
    if (view === 'value') {
      formElement.props.options = { handler: 'datasetSource' };
      // formElement.props.text = 'Binding';
      setValue(componentProps, context, '', 'value', '.handler');
      setView('source');
    } else if (view === 'source') {
      formElement.props.options = { handler: 'optionsHandlers' };
      // formElement.props.text = 'Handler';
      setValue(componentProps, context, '', 'value', '.value');
      setView('handler');
    } else if (view === 'handler') {
      // formElement.props.text = 'Options';
      setValue(componentProps, context, undefined, 'value');
      setView('value');
    }
  }, [componentProps, context, formElement.props.options, view]);

  const modifiedFormElement = React.useMemo(
    () => ({
      ...formElement,
      bound: false,
      props: {
        ...formElement.props,
        bound: true,
        search: true,
        changeBound: changeView,
        view,
        options: { handler: view === 'source' ? 'datasetSource' : 'optionsHandlers' }
      }
    }),
    [changeView, formElement, view]
  );

  if (formElement.control === 'Table') {
    return renderControl({
      ...componentProps,
      formElement: modifiedFormElement
    });
  }

  return (
    <div className="propertyInput">
      {view === 'value' ? (
        renderControl({
          ...componentProps,
          formElement: { ...formElement, bound: false }
        })
      ) : (
        <Select extra={view} {...componentProps} formElement={modifiedFormElement} />
      )}
      <div
        className={dot(view)}
        onClick={changeView}
        title={`Green - Value
Yellow - Bound to data
Red - Handled by a function`}
      />
    </div>
  );
});

Binding.displayName = 'Binding';
