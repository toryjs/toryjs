import * as React from 'react';

import { Icon } from 'semantic-ui-react';
import { FormComponentProps } from '@toryjs/form';
import { SemanticICONS } from 'semantic-ui-react';

export type IconProps = {
  name: SemanticICONS;
};

export const IconView: React.FC<FormComponentProps<IconProps>> = props => (
  <Icon name={props.formElement.props.name || 'ban'} />
);

IconView.displayName = 'Icon';
