import * as React from 'react';

import { Menu, Divider } from 'semantic-ui-react';
import { css } from 'emotion';

// import { ModalPreview } from './modal_preview';
import { ModalCreate } from './modals/modal_create';
// import { ModalCode } from './modal_preview_code';
// import { ModalUpload } from './modal_upload';
import { ModalLoad } from './modals/modal_load';
import { ModalDuplicate } from './modals/modal_duplicate';
import { EditorContext } from './editor_context';

import { Theme } from '../common';

type Props = {
  fileOperations: boolean;
  allowSave: boolean;
  theme: any;
};

const editorMenu = (theme: Theme) => css`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  border-radius: 0px !important;
  background-color: ${theme.menuColor}!important;
  margin-left: -1px !important;
`;

export const TopMenu = ({ fileOperations, allowSave }: Props) => {
  const context = React.useContext(EditorContext);
  return (
    <Menu className={editorMenu(context.theme)} inverted={context.theme.inverted}>
      {/* <Menu.Item icon="lightbulb outline" content="Formix" /> */}
      {fileOperations && (
        <>
          <ModalCreate />
          <ModalDuplicate />
          <ModalLoad />
        </>
      )}
      {allowSave && (
        <Menu.Item icon="save" onClick={() => context.manager.saveProject(context.project)} />
      )}
      <Divider />
      <Menu.Item icon="undo" onClick={context.undoManager.undo} />
      <Menu.Item icon="redo" onClick={context.undoManager.redo} />

      <Menu.Menu position="right">
        <Menu.Item icon="ban" content="Reset" onClick={() => context.editorVersion++} />
        {/* <ModalUpload manager={manager} /> */}
        {/* <ModalPreview /> */}
        {/* <ModalCode /> */}
      </Menu.Menu>
    </Menu>
  );
};
