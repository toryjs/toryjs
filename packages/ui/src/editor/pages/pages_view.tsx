import * as React from 'react';
import { observer } from 'mobx-react';
import { ToolBox, PaneContent } from '../editor_styles';
import { names, pointer } from '../../common';
import { EditorContext } from '../editor_context';
import { Icon, Button } from 'semantic-ui-react';
import { FormDataSet } from '../form_store';
import { FormElement } from '@toryjs/form';
import { clone, getPropValue } from '../../helpers';

type Props = {
  element: FormDataSet;
};

export const PageFolder: React.FC<Props> = observer(({ element }) => {
  const state = React.useContext(EditorContext);

  const onSelect = React.useCallback(() => {
    localStorage.setItem('CORPIX_SELECTED_FORM', element.uid);
    state.project.state.setForm(element);
  }, [element, state.project.state]);

  const label = getPropValue(null, element, state, 'label');
  const editorLabel = getPropValue(null, element, state, 'editorLabel');

  return (
    <div className="item">
      <a className={names(element.isSelected ? 'selected' : '', pointer)} onClick={onSelect}>
        <Icon name="file" />
        {label || editorLabel} <span className="meta">Form</span>
      </a>
    </div>
  );
});

export const PagesView = observer(() => {
  const state = React.useContext(EditorContext);

  const onClick = React.useCallback(() => {
    state.form.addRow('pages', {
      control: 'Form',
      label: 'New Form',
      uid: 'P-' + Date.now().toString(),
      elements: []
    } as any);
  }, [state.form]);

  const onDuplicate = React.useCallback(() => {
    const page: FormElement = clone(state.project.state.selectedForm);
    page.props.label = page.props.label + ' Clone';

    state.form.addRow('pages', page);
  }, [state.form, state.project.state.selectedForm]);

  return (
    <PaneContent>
      <div className="paneHeader">
        <div className="text">Pages</div>
        <span />
        <Button
          compact
          size="tiny"
          color="blue"
          icon="clone"
          title="Duplicate"
          onClick={onDuplicate}
        />
        <Button compact size="tiny" color="blue" icon="plus" onClick={onClick} />
      </div>
      <ToolBox>
        {state.form && <PageFolder element={state.form} />}
        {state.form &&
          state.form.pages.map((page, index) => (
            <PageFolder element={page} key={page.uid + index} />
          ))}
      </ToolBox>
    </PaneContent>
  );
});

PagesView.displayName = 'FormElements';
