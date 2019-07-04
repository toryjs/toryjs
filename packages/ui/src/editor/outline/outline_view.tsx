import * as React from 'react';

import { css } from 'emotion';
import { observer } from 'mobx-react';
import { ToolBox, PaneContent } from '../editor_styles';
import { EditorContext } from '../editor_context';
import { OutlineFolder } from './outline_folder';
import { Input } from 'semantic-ui-react';
import { Theme } from '../../common';
import { formDatasetToJS, stripUid } from '../../helpers';

const styledOutline = (theme: Theme) => css`
  .outlineOn {
    background-color: ${theme.dragBackground};
    border: 2px dashed ${theme.dragBorder};
  }

  .item {
    margin-top: 2px;
    margin-bottom: 2px;
  }
`;

const searchInput = css`
  position: absolute !important;
  left: 90px;
  right: 12px;
  top: 6px;
  bottom: 6px;

  .button {
    padding: 6px !important;
  }
`;

export const OutlineView = observer(() => {
  const context = React.useContext(EditorContext);
  const [filter, setFilter] = React.useState('');

  const cloneSelected = React.useCallback(() => {
    if (
      context.state.selectedElement &&
      context.state.selectedElement.parent &&
      context.state.selectedElement.parent.elements
    ) {
      const index = context.state.selectedElement.parent.elements.indexOf(
        context.state.selectedElement
      );
      const cloned = stripUid(formDatasetToJS(context.state.selectedElement));
      context.state.selectedElement.parent.insertRow('elements', index + 1, cloned);
    }
  }, [context.state.selectedElement]);

  return (
    <PaneContent>
      <div className="paneHeader">
        <div className="text">Outline</div>

        <Input
          action={{ icon: 'clone', title: 'Clone Selected', onClick: cloneSelected }}
          actionPosition="left"
          icon="search"
          placeholder="Search ..."
          className={searchInput}
          fluid
          size="mini"
          onChange={e => setFilter(e.currentTarget.value)}
        />
      </div>
      <ToolBox className={styledOutline(context.theme)}>
        {context.form && (
          <OutlineFolder
            item={context.project.state.selectedForm}
            filter={filter}
            expanded={true}
          />
        )}
      </ToolBox>
    </PaneContent>
  );
});

OutlineView.displayName = 'FormElements';
