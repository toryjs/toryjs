import * as React from 'react';
import { List } from 'semantic-ui-react';

import { SignatureType } from '../../common';

type Props = {
  value: SignatureType;
};

export const SignatureRejected: React.FC<Props> = ({ value }) => (
  <List>
    <List.Item
      icon="ban"
      content={`${value.name} rejected to sign on ${new Date(value.date).toLocaleDateString()}`}
    />
    {value.comment && <List.Item icon="comment" content={value.comment} />}
  </List>
);
