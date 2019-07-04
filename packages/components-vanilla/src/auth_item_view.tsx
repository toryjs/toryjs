import * as React from 'react';

import { createComponents, Context, ContextType } from '@toryjs/ui';
import { FormComponentProps } from '@toryjs/form';
import { observer } from 'mobx-react';

export type AuthItemProps = {
  roles: string[];
  disable: boolean;
};

export const AuthItem: React.FC<FormComponentProps<AuthItemProps>> = observer(props => {
  const ctx: ContextType = React.useContext(Context);
  const { roles } = props.formElement.props;
  if (
    !ctx.auth.user ||
    !ctx.auth.user.id ||
    !ctx.auth.user.roles ||
    (roles && roles.length && roles.every((r: string) => !ctx.auth.user.roles.some(u => u === r)))
  ) {
    return null;
  }
  return <>{createComponents(props)}</>;
  // return (
  //   <DynamicComponent {...props} control={React.Fragment}>
  //     {createComponents(props)}
  //   </DynamicComponent>
  // );
});
