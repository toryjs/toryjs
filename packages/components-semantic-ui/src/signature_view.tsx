// import * as React from 'react';

// import { observer } from 'mobx-react';

// import { css, SignatureType } from '@toryjs/ui/src/common';
// import { SignedSignature } from '@toryjs/ui/src/semantic/signature/signature_signed';
// import { SignatureRejected } from '@toryjs/ui/src/semantic/signature/signature_rejected';
// import { SignatureRoot } from '@toryjs/ui/src/semantic/signature/signature';
// import { FormComponentProps, FormComponent } from '@toryjs/form';
// import { getValue } from '@toryjs/ui/src/helpers';
// import { Context } from '@toryjs/ui/src/context';

// const signatureStyle = css`
//   border: solid 1px #ededed;
//   border-radius: 5px;

//   .image {
//     width: 32px !important;
//   }

//   .button {
//     margin-top: 6px !important;
//   }

//   .items {
//     margin-top: 6px !important;
//   }

//   .list {
//     margin-top: 6px !important;
//   }

//   img {
//     width: 32px !important;
//     vertical-align: middle;
//     margin-right: 6px;
//     cursor: pointer;
//   }
// `;

// export class Signature extends React.Component<FormComponentProps> {
//   static contextType = Context;

//   state = {
//     modalOpen: false,
//     modalRejectOpen: false,
//     reason: '',
//     password: '',
//     loading: false,
//     error: '',
//     fontReady: typeof window === 'undefined' ? true : false
//   };

//   handleOpen = () => this.setState({ modalOpen: true });
//   handleClose = () => !this.state.loading && this.setState({ modalOpen: false });

//   async componentDidMount() {
//     const value = getValue(this.props, this.context) as SignatureType;
//     if (value.signature) {
//       const state = await this.props.handlers.verifySignature({
//         owner: this.props.owner,
//         props: this.props,
//         context: this.context,
//         args: {
//           uid: value.uid,
//           signature: value.signature
//         }
//       });
//       // console.log(state);
//       value.setValue('verifiedState', state);
//     }
//   }

//   render() {
//     const {
//       formElement,
//       formElement: { props },
//       handlers
//     } = this.props;

//     // check if all handlers are present
//     if (
//       !this.props.readOnly &&
//       (!handlers ||
//         !handlers.verifySignature ||
//         !handlers.sign ||
//         !handlers.signatureFont ||
//         !handlers.validateForm)
//     ) {
//       throw new Error(
//         `You must implement following handlers to use signatures:
//           - validateForm (): boolean
//           - verifySignature(uid: string, signature: string): boolean
//           - sign(source: string, reject: boolean, password: string, reason: string, submit: boolean): string
//           - signatureFont(): string`
//       );
//     }

//     const value = getValue(this.props, this.context) as SignatureType;
//     const { allowComment } = props;
//     const font = handlers.signatureFont ? handlers.signatureFont(null) : 'Menlo, Arial';

//     // load font if needed
//     if (value.signature && typeof window !== undefined) {
//       // use three possible fonts

//       if (typeof window !== 'undefined') {
//         require('webfontloader').load({
//           google: { families: [font] },
//           fontactive: () => !this.state.fontReady && this.setState({ fontReady: true })
//         });
//       }
//     }

//     return (
//       <fieldset className={signatureStyle}>
//         <legend>{formElement.props.label}</legend>
//         {value.signature && this.state.fontReady && (
//           <SignedSignature value={value} font={font} readonly={this.props.readOnly} />
//         )}
//         {value.rejected && <SignatureRejected value={value} />}
//         {!value.date && <SignatureRoot {...this.props} allowComment={allowComment} />}
//       </fieldset>
//     );
//   }
// }

// export const SignatureView: FormComponent = {
//   Component: observer(Signature),
//   toString: () => ''
// };
