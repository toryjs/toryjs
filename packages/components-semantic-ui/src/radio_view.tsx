import { observer } from 'mobx-react';
import { Radio } from 'semantic-ui-react';
import { FormComponent } from '@toryjs/form';

import { getValue } from '@toryjs/ui';
import { createRadioComponent } from '@toryjs/components-vanilla';

export const RadioComponent = createRadioComponent(Radio);

export const RadioView: FormComponent = {
  Component: observer(RadioComponent),
  toString: (_, props, context) => {
    const value = getValue(props, context);
    // let radioList = props.formElement.props.list;
    // const radioOptions = owner.getSchema(radioList).$enum;
    // const radioText = radioOptions.find(o => o.value === value).text;
    return value;
  }
};
