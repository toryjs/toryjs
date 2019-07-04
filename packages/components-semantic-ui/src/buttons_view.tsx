import * as React from 'react';
import { FormComponentProps, config, FormComponent } from '@toryjs/form';
import { Button } from 'semantic-ui-react';
import { SemanticICONS } from 'semantic-ui-react';
import { DynamicComponent, simpleHandle, Context } from '@toryjs/ui';

// export const Approve: React.FC<FormComponentProps> = ({
//   formElement,
//   handlers,
//   owner,
//   readOnly
// }) => {
//   if (readOnly) {
//     return null;
//   }
//   return (
//     <Button
//       icon="check"
//       primary
//       onClick={() => {
//         if (formElement.source) {
//           owner.setValue(formElement.source, true);
//         }
//         handlers && handlers.approve();
//       }}
//       content={formElement.label || config.i18n`Approve`}
//       labelPosition="left"
//     />
//   );
// };

// export const ApproveButton: FormComponent = {
//   Component: Approve
// };

// export const Delete: React.FC<FormComponentProps> = ({
//   owner,
//   handlers,
//   formElement,
//   readOnly
// }) => {
//   if (readOnly) {
//     return null;
//   }

//   function handleDelete(e: React.MouseEvent<HTMLButtonElement>) {
//     handlers.delete(owner, { e, formElement });
//   }

//   return <Button icon="trash" color="red" onClick={handleDelete} />;
// };

// export const DeleteButton: FormComponent = {
//   Component: Delete
// };

export type ButtonProps = {
  target: string;
  icon: SemanticICONS;
  color: string;
  content: string;
  onClick: any;
};

const buttonProps = ['color', 'src', 'icon', 'content'];

export const ButtonComponent: React.FC<FormComponentProps<ButtonProps>> = props => {
  const context = React.useContext(Context);
  const onClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (props.formElement.props.onClick) {
        simpleHandle(props, props.formElement.props.onClick, context, { e });
      } else {
        console.error('Button does not define a handler');
      }
    },
    [context, props]
  );

  if (props.readOnly) {
    return null;
  }

  return (
    <DynamicComponent
      {...props}
      control={Button}
      controlProps={buttonProps}
      onClick={onClick}
      as={props.formElement.props.target ? config.linkElement : undefined}
      {...config.linkElementTarget(props.formElement.props.target)}
    />
  );
};

ButtonComponent.displayName = 'Button';

export const ButtonView: FormComponent = {
  Component: ButtonComponent
};

// export const Reject: React.FC<FormComponentProps> = ({
//   formElement,
//   handlers,
//   owner,
//   readOnly
// }) => {
//   const onClick = React.useCallback(() => {
//     if (formElement.source) {
//       owner.setValue(formElement.source, true);
//     }
//     handlers && handlers.reject();
//   }, [formElement.source, handlers, owner]);

//   if (readOnly) {
//     return null;
//   }

//   return (
//     <Button
//       icon="ban"
//       color="red"
//       onClick={onClick}
//       content={formElement.label || config.i18n`Reject`}
//       labelPosition="left"
//     />
//   );
// };

// export const RejectButton: FormComponent = {
//   Component: Reject
// };

// export const Submit: React.FC<FormComponentProps> = ({
//   formElement,
//   handlers,
//   owner,
//   readOnly
// }) => {
//   if (readOnly) {
//     return null;
//   }
//   return (
//     <Button
//       icon="check"
//       primary
//       onClick={() => handlers.submit(owner)}
//       content={formElement.label || config.i18n`Submit`}
//       labelPosition="left"
//     />
//   );
// };

// export const SubmitButton: FormComponent = {
//   Component: Submit
// };
