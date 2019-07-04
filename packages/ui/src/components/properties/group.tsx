import * as React from 'react';

import { observer } from 'mobx-react';
import { css } from 'emotion';

import { names, pointer, Theme } from '../../common';
import { FormComponentProps } from '@toryjs/form';
import { renderElements } from './control_factory_helpers';
import { Icon } from 'semantic-ui-react';
import { EditorContext } from '../../editor/editor_context';
import { getPropValue } from '../../helpers';

export const groupLabel = (theme: Theme) => css`
  height: 30px;
  color: ${theme.headerColor};
  background-color: ${theme.headerBackground};
  display: flex;
  align-items: center;
  padding-left: 12px;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  white-space: nowrap;
  label: groupLabel;

  &.h1 {
    .group-label {
      font-size: 16px !important;
    }
  }
  &.h2 {
    padding: 0px !important;
    .group-label {
      font-size: 14px;
      margin-bottom: 3px;
    }
  }
  &.h3 {
    padding: 0px;
    .group-label {
      font-size: 12px;
      margin-bottom: 3px;
    }
  }
  i {
    flex: 0 0 18px;
  }
  span {
    flex: 1 1 100%;
  }
  .group-label.h3 {
    font-size: 12px !important;
  }
`;

const groupContent = css`
  padding: 6px 12px;
`;

type HeaderProps = {
  label: string;
  buttons: any;
  className?: string;
  bare?: boolean;
};

export const PropertyHeader = observer(
  ({ children, label, buttons, bare = false, className }: React.Props<any> & HeaderProps) => {
    const context = React.useContext(EditorContext);
    const groups = JSON.parse(localStorage.getItem('CORPIX_GROUPS') || '{}');
    const [expanded, setExpanded] = React.useState(groups[label] == null ? true : groups[label]);

    return (
      <>
        <div className={groupLabel(context.theme)}>
          <Icon
            className={pointer}
            onClick={() => {
              const groups = JSON.parse(localStorage.getItem('CORPIX_GROUPS') || '{}');
              groups[label] = !expanded;
              localStorage.setItem('CORPIX_GROUPS', JSON.stringify(groups));
              setExpanded(!expanded);
            }}
            name={expanded ? 'caret down' : 'caret right'}
          />
          {label}
          <span />
          {buttons}
        </div>
        {expanded && children && (
          <div className={names({ [groupContent]: !bare }, className)}>{children}</div>
        )}
      </>
    );
  }
);

type Props = {
  text: string;
  bare: boolean;
};

export const Group = observer((controlProps: FormComponentProps<Props> & { filter: string }) => {
  const { formElement, owner, handlers, catalogue } = controlProps;
  const editorState = React.useContext(EditorContext);
  const { elements, props: props = {} as Props } = formElement;
  const text = props.text;
  const label = getPropValue(controlProps, elements[0], editorState, 'label');
  return (
    <PropertyHeader label={text} bare={props.bare || (elements.length === 1 && !label)}>
      {elements &&
        renderElements(
          editorState,
          elements,
          owner,
          handlers,
          catalogue,
          editorState,
          controlProps.uid,
          controlProps.filter
        )}
    </PropertyHeader>
  );
});

Group.displayName = 'Group';
