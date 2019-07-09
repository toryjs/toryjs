import * as React from 'react';

import { Icon } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { DataSet } from '@toryjs/form';
import { Message } from 'semantic-ui-react';
import { css } from 'emotion';
import { Context } from '@toryjs/ui';

type Props = {
  owner: DataSet;
};

const help = css`
  margin: 6px !important;
`;

export const Help = observer(({  }: Props) => {
  const context = React.useContext(Context);
  let HelpView = context.editor.help;
  if (!HelpView) {
    return null;
  }
  return (
    <Message className={help}>
      <Message.Header>
        <Icon name={'help circle'} /> Help
      </Message.Header>
      <div>
        {typeof HelpView === 'string' ? (
          <div dangerouslySetInnerHTML={{ __html: HelpView }} />
        ) : (
          { HelpView }
        )}
      </div>
    </Message>
  );
});
