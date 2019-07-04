import * as React from 'react';

import { SignatureType, css } from '../../common';
import { Modal, Header, Button, Icon, Input, Label, Message } from 'semantic-ui-react';
import { FormComponentProps } from '@toryjs/form';
import { setValue, valueSource } from '../../helpers';

type Props = {
  allowComment: boolean;
  reason: string;
};

const margined = css`
  margin-top: 12px;
`;

const centered = css`
  text-align: center;
`;

const errorLabel = css`
  margin-left: 12px !important;
`;

export const SignatureReject: React.FC<FormComponentProps & Props> = props => {
  const { allowComment, handlers, formElement, owner, reason } = props;
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [rejectModalOpen, setRejectModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  return (
    <Modal
      open={rejectModalOpen}
      trigger={
        <Button
          icon="ban"
          content="Reject"
          labelPosition="left"
          onClick={() => handlers.validateForm(null) && setRejectModalOpen(true)}
          color="red"
          floated={allowComment ? 'right' : null}
        />
      }
      size="small"
    >
      <Header icon="ban" content="Reject Signature" />
      <Modal.Content>
        <div>
          <p>
            {formElement.props.submit
              ? `Do you wish to reject this form? Upon rejecting, you will no longer be able to
                  make any changes, the form will be automatically submitted and process will
                  advance to a next state.`
              : `Do you wish to reject this form? Upon rejecting, you will no longer be able to
                  make any changes. To make further changes to the form, you will need to withdraw your rejection.`}
          </p>
          {reason && (
            <Message icon="comment outline" header="You left a comment" content={reason} />
          )}

          <form className={centered}>
            <label htmlFor="password">
              <b>Please provide your password to reject this form:</b>
            </label>{' '}
            <br />
            <Input
              className={margined}
              type="password"
              icon="lock"
              autoComplete="password"
              value={password}
              onChange={e => setPassword(e.currentTarget.value)}
            />
            {error && <Label color="red" content={error} className={errorLabel} />}
          </form>
        </div>
      </Modal.Content>

      <Modal.Actions>
        {!loading && (
          <Button onClick={() => setRejectModalOpen(false)} loading={loading}>
            <Icon name="remove" /> Cancel
          </Button>
        )}
        <Button
          color="red"
          loading={loading}
          onClick={async () => {
            if (loading) {
              return;
            }
            if (password) {
              setLoading(true);
              setError('');
              const rejection = (await handlers.sign({
                owner,
                props,
                context,
                args: {
                  source: valueSource(formElement),
                  reject: true,
                  password,
                  reason,
                  submit: formElement.props && !!formElement.props.submit
                }
              })) as SignatureType;
              setValue(props, context, rejection);

              // setLoading(false);
              // setPassword('');
              // setRejectModalOpen(false);
            } else {
              setError('Please provide password');
            }
          }}
        >
          <Icon name="ban" />{' '}
          {formElement.props && formElement.props.submit ? 'Reject and Submit' : 'Reject'}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

SignatureReject.displayName = 'RejectSignature';
