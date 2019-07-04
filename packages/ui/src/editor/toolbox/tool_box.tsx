import * as React from 'react';
import { ToolBox as StyledToolBox } from '../editor_styles';

import { Menu, Input } from 'semantic-ui-react';
import { EditorComponentCatalogue } from '@toryjs/form';
import { groupByArray } from '@tomino/toolbelt';

import { PaneContent } from '../editor_styles';
import { generateId } from '../editor_common';
import { EditorContext } from '../editor_context';
import { ToolItem } from './tool_item';
import { css } from 'emotion';

type Props = {
  catalogue: EditorComponentCatalogue;
};

const searchInput = css`
  position: absolute !important;
  left: 90px;
  right: 12px;
  top: 6px;
  bottom: 6px;
`;

export const ToolBox: React.FC<Props> = ({ catalogue }) => {
  const editorState = React.useContext(EditorContext);
  const [filter, setFilter] = React.useState('');
  const items = Object.getOwnPropertyNames(catalogue.components)
    .map(key => catalogue.components[key])
    .sort((a, b) => (a.title < b.title ? -1 : 1));

  let filtered = filter
    ? items.filter(s => s.title.toLowerCase().indexOf(filter.toLowerCase()) >= 0)
    : items;

  let grouped = groupByArray(filtered, 'group').sort((a, b) => (a.key < b.key ? -1 : 1));

  return (
    <PaneContent>
      <div className="paneHeader">
        <div className="text">Controls</div>
        <Input
          icon="search"
          placeholder="Search ..."
          className={searchInput}
          fluid
          size="mini"
          onChange={e => setFilter(e.currentTarget.value)}
        />
      </div>
      {/* <div className="paneHeader">
        <div className="text">Controls</div>
      </div> */}

      <StyledToolBox>
        <Menu text inverted={editorState.theme.inverted} vertical compact fluid>
          {grouped.map(g => (
            <React.Fragment key={g.key || 'General'}>
              <Menu.Item header>{g.key || 'Common'}</Menu.Item>
              {g.values.map((s, i) => (
                <Menu.Item key={s.title + i}>
                  <ToolItem {...s as any} id={generateId()} editorState={editorState} />
                </Menu.Item>
              ))}
            </React.Fragment>
          ))}
        </Menu>
      </StyledToolBox>
    </PaneContent>
  );
};

ToolBox.displayName = 'ToolBox';
