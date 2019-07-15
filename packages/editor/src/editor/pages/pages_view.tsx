import * as React from 'react';
import { observer } from 'mobx-react';
import { names, pointer, Context, clone, getPropValue, FormDataSet } from '@toryjs/ui';
import { FormElement } from '@toryjs/form';
import { Icon, Button } from 'semantic-ui-react';

import { ToolBox, PaneContent } from '../editor_styles';

type Props = {
  element: FormDataSet;
};

export const PageFolder: React.FC<Props> = observer(({ element }) => {
  const context = React.useContext(Context);

  const onSelect = React.useCallback(() => {
    localStorage.setItem('CORPIX_SELECTED_FORM', element.uid);
    context.editor.project.state.setForm(element);
  }, [element, context.editor.project.state]);

  const label = getPropValue(null, element, context, 'label');
  const editorLabel = getPropValue(null, element, context, 'editorLabel');

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
  const context = React.useContext(Context);

  const onClick = React.useCallback(() => {
    context.editor.form.addRow('pages', {
      control: 'Form',
      label: 'New Form',
      uid: 'P-' + Date.now().toString(),
      elements: []
    } as any);
  }, [context.editor.form]);

  const onDuplicate = React.useCallback(() => {
    const page: FormElement = clone(context.editor.project.state.selectedForm);
    page.props.label = page.props.label + ' Clone';

    context.editor.form.addRow('pages', page);
  }, [context.editor.form, context.editor.project.state.selectedForm]);

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
        {context.editor.form && <PageFolder element={context.editor.form} />}
        {context.editor.form &&
          context.editor.form.pages.map((page, index) => (
            <PageFolder element={page} key={page.uid + index} />
          ))}
      </ToolBox>
    </PaneContent>
  );
});

PagesView.displayName = 'FormElements';
