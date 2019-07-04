import React from 'react';

import {
  FormElement,
  DataSet,
  Handlers,
  FormComponentCatalogue,
  FormComponentProps
} from '@toryjs/form';
import names from 'classnames';

import { renderControl } from './control_factory';
import { groupByArray } from '@tomino/toolbelt';
import { EditorContextType } from '../../editor/editor_context';
import { getValue, getPropValue } from '../../helpers';
import { prop } from '../../common';
import { ErrorView } from './error_view';

export function renderElements<T>(
  context: EditorContextType,
  elements: FormElement[],
  owner: DataSet<T>,
  handlers: Handlers<DataSet, EditorContextType>,
  catalogue: FormComponentCatalogue,
  editorState: EditorContextType,
  uid: string,
  filter: string
) {
  const filtered = elements.filter(
    e =>
      (!filter ||
        (e.props.label || '').toLowerCase().indexOf(filter.toLowerCase()) >= 0 ||
        (e.elements &&
          e.elements.some(
            child => (child.props.label || '').toLowerCase().indexOf(filter.toLowerCase()) >= 0
          ))) &&
      getValue({ formElement: e, owner, handlers, catalogue }, editorState, 'visible', true)
  );
  const props: FormComponentProps = {
    owner,
    catalogue,
    handlers,
    formElement: null
  };
  let group = groupByArray(filtered, e => e.tuple || getPropValue(props, e, context, 'label'));

  return group.map((group, i) => {
    let display = group.values[0].props.display;
    return (
      <div
        key={i}
        className={names('property-table-row', { flexed: !display || display === 'inlineLabel' })}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          editorState.help = group.values.map(g => g.documentation).join('<br />');
        }}
      >
        {group.key && (
          <label className="first" htmlFor={`corpix-${group.key}`}>
            {group.key}
          </label>
        )}

        {display === 'topLabel' && <br />}

        {group.values.map((formElement, i) => {
          display = formElement.props.display;

          return (
            <div
              key={i}
              className={names({
                full: display === 'topLabel',
                second: group.key,
                only: !group.key,
                padded: display === 'padded'
              })}
            >
              {renderControl({ formElement, owner, handlers, catalogue, uid }, filter)}
              {prop(formElement) && (
                <ErrorView control={formElement} owner={owner} source={prop(formElement)} />
              )}
            </div>
          );
        })}
      </div>
    );
  });
}
