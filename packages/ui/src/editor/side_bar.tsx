import React from 'react';
import { Sidebar, Menu, Icon } from 'semantic-ui-react';
import { css } from 'emotion';

import { EditorContext } from './editor_context';
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
  const state = React.useContext(EditorContext);

  const isVisible = React.useCallback((value: LeftPane) => hideViews.indexOf(value) === -1, [
    hideViews
  ]);

  const isActive = React.useCallback(
    (value: LeftPane) => state.project.state.selectedLeftPane === value,
    [state.project.state.selectedLeftPane]
  );

  return (
    <Sidebar
      as={Menu}
      icon
      inverted
      color={state.theme.sideMenuColor}
      vertical
      visible={true}
      width="very thin"
      className={style}
    >
      {isVisible('pages') && (
        <Menu.Item
          active={isActive('pages')}
          as="a"
          onClick={() => state.project.state.changeLeftPane('pages')}
        >
          <Icon name="copy outline" title="Forms and Pages" />
        </Menu.Item>
      )}
      {isVisible('data') && (
        <Menu.Item
          as="a"
          active={isActive('data')}
          onClick={() => state.project.state.changeLeftPane('data')}
        >
          <Icon name="database" title="Application Data" />
        </Menu.Item>
      )}
      {isVisible('components') && (
        <Menu.Item
          as="a"
          active={isActive('components')}
          onClick={() => state.project.state.changeLeftPane('components')}
        >
          <Icon name="puzzle" title="Components" />
        </Menu.Item>
      )}
      {isVisible('outline') && (
        <Menu.Item
          as="a"
          active={isActive('outline')}
          onClick={() => state.project.state.changeLeftPane('outline')}
        >
          <Icon name="list" title="Components" />
        </Menu.Item>
      )}
      {isVisible('all') && (
        <Menu.Item
          as="a"
          active={isActive('all')}
          onClick={() => state.project.state.changeLeftPane('all')}
        >
          <Icon name="globe" title="All" />
        </Menu.Item>
      )}
    </Sidebar>
  );
});
