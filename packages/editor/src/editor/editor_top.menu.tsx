import * as React from 'react';

import { Menu, Divider } from 'semantic-ui-react';
import { css } from 'emotion';
import { Context } from '@toryjs/ui';

// import { ModalPreview } from './modal_preview';
import { ModalCreate } from './modals/modal_create';
// import { ModalCode } from './modal_preview_code';
// import { ModalUpload } from './modal_upload';
import { ModalLoad } from './modals/modal_load';
import { ModalDuplicate } from './modals/modal_duplicate';
import { Theme } from './themes/common';

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
  const context = React.useContext(Context);
  return (
    <Menu className={editorMenu(context.editor.theme)} inverted={context.editor.theme.inverted}>
      {/* <Menu.Item icon="lightbulb outline" content="Formix" /> */}
      {fileOperations && (
        <>
          <ModalCreate />
          <ModalDuplicate />
          <ModalLoad />
        </>
      )}
      {allowSave && (
        <Menu.Item
          icon="save"
          onClick={() => context.editor.manager.saveProject(context.editor.project)}
        />
      )}
      <Divider />
      <Menu.Item icon="undo" onClick={context.editor.undoManager.undo} />
      <Menu.Item icon="redo" onClick={context.editor.undoManager.redo} />

      <Menu.Menu position="right">
        <Menu.Item
          icon="sync alternate"
          content="Restart"
          onClick={() => context.editor.editorVersion++}
        />
        {/* <ModalUpload manager={manager} /> */}
        {/* <ModalPreview /> */}
        {/* <ModalCode /> */}
      </Menu.Menu>
    </Menu>
  );
};
