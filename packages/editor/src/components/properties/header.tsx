import * as React from 'react';

import { observer } from 'mobx-react';
import { DataSet } from '@toryjs/form';

type Props = {
  owner: DataSet;
};

export const Header = observer(({ owner }: Props) => {
  return (
    <div className="dynamic-properties-header">
      eerrdddeeeerr
      <div className="label">{owner.getValue('name')}</div>
      <div className="sub-label">{owner.getValue('id')}</div>
    </div>
  );
});
