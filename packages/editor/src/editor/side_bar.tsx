import React from 'react';
import { Sidebar, Menu, Icon } from 'semantic-ui-react';
import { css } from 'emotion';

import { Context } from '@toryjs/ui';
import { LeftPane } from './form_store';
import { observer } from 'mobx-react';

const style = css`
  border-right: solid 1px black !important;
  position: absolute !important;
  z-index: 0 !important;
`;

type Props = {
  hideViews: LeftPane[];
};

export const SideBar: React.FC<Props> = observer(({ hideViews = [] }) => {
  const context = React.useContext(Context);

  const isVisible = React.useCallback((value: LeftPane) => hideViews.indexOf(value) === -1, [
    hideViews
  ]);

  const isActive = React.useCallback(
    (value: LeftPane) => context.editor.project.state.selectedLeftPane === value,
    [context.editor.project.state.selectedLeftPane]
  );

  return (
    <Sidebar
      as={Menu}
      icon
      inverted
      color={context.editor.theme.sideMenuColor}
      vertical
      visible={true}
      width="very thin"
      className={style}
    >
      {isVisible('pages') && (
        <Menu.Item
          active={isActive('pages')}
          as="a"
          onClick={() => context.editor.project.state.changeLeftPane('pages')}
        >
          <Icon name="copy outline" title="Forms and Pages" />
        </Menu.Item>
      )}
      {isVisible('data') && (
        <Menu.Item
          as="a"
          active={isActive('data')}
          onClick={() => context.editor.project.state.changeLeftPane('data')}
        >
          <Icon name="database" title="Application Data" />
        </Menu.Item>
      )}
      {isVisible('components') && (
        <Menu.Item
          as="a"
          active={isActive('components')}
          onClick={() => context.editor.project.state.changeLeftPane('components')}
        >
          <Icon name="puzzle" title="Components" />
        </Menu.Item>
      )}
      {isVisible('outline') && (
        <Menu.Item
          as="a"
          active={isActive('outline')}
          onClick={() => context.editor.project.state.changeLeftPane('outline')}
        >
          <Icon name="list" title="Components" />
        </Menu.Item>
      )}
      {isVisible('all') && (
        <Menu.Item
          as="a"
          active={isActive('all')}
          onClick={() => context.editor.project.state.changeLeftPane('all')}
        >
          <Icon name="globe" title="All" />
        </Menu.Item>
      )}
    </Sidebar>
  );
});
