// import * as React from 'react';

// import { observer } from 'mobx-react';

// import { DateInput, TimeInput, DateTimeInput, DatesRangeInput } from 'semantic-ui-calendar-react';
// import { FormComponentProps, FormComponent } from '@toryjs/form';
// import { processControl, getValue } from '../helpers';
// import { DynamicComponent } from '../wrapper';

// export type DateComponentProps = {
//   type: string;
// };

// const controlProps = ['value', 'iconPosition', 'clearable'];

// const DateComponent: React.FC<FormComponentProps<DateComponentProps>> = props => {
//   const { source, formElement, disabled, handleChange } = processControl(props);
//   const type = formElement.props.type;
//   let Component: any =
//     type === 'Date'
//       ? DateInput
//       : type === 'Time'
//         ? TimeInput
//         : type === 'DateTime'
//           ? DateTimeInput
//           : DatesRangeInput;

//   return (
//     <>
//       <DynamicComponent
//         {...props}
//         control={Component}
//         controlProps={controlProps}
//         disabled={disabled}
//         name={source}
//         duration={0}
//         animation="none"
//         onChange={handleChange}
//       />
//     </>
//   );
// };

// export const DateView: FormComponent = {
//   Component: observer(DateComponent),
//   toString: (_, props, context) => getValue(props, context)
// };
