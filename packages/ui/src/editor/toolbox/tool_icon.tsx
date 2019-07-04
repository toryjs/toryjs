import React from 'react';
import { Icon } from 'semantic-ui-react';

import { css } from 'emotion';
import { EditorContext } from '../editor_context';

const image = css`
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin-right: 6px;
`;

type Props = {
  icon: string;
  thumbnail: { dark?: string; light?: string };
  title?: string;
  theme: any;
};

export const ToolIcon = ({ icon, thumbnail, title }: Props) => {
  const context = React.useContext(EditorContext);
  return (
    <>
      {icon && <Icon name={icon as any} title={title} />}
      {thumbnail && (
        <img
          src={context.theme.dark ? thumbnail.dark : thumbnail.light}
          alt="icon"
          className={image}
          title={title}
        />
      )}
    </>
  );
};
