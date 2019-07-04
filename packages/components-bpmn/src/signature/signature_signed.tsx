import * as React from 'react';

import { verified, rejected, pending } from './images';

import { SignatureType, css } from '../../common';
import { Item, Modal, Header, Button, Icon } from 'semantic-ui-react';
import { Observer } from 'mobx-react';

const signedStyle = css`
  font-size: 18px !important;
`;

const signedDate = css`
  font-size: 12px !important;
  color: #333;
`;

type Props = {
  value: SignatureType;
  font: string;
  readonly: boolean;
};
export const SignedSignature: React.FC<Props> = ({ value, font, readonly }) => {
  const [modalOpen, toggleOpen] = React.useState(false);

  if (readonly) {
    return (
      <Item.Group>
        <Item>
          <Item.Image size="tiny">
            <img
              src={value.verifiedState === 'Verified' ? verified : rejected}
              title={
                value.verifiedState === 'Verified'
                  ? 'Verified Signature'
                  : 'Invalid Signature. Document data do not match the signed document data.'
              }
            />
          </Item.Image>
          <Item.Content>
            <span className={signedStyle} style={{ fontFamily: font }}>
              {value.name}
            </span>
            <br />
            <span className={signedDate}>{new Date(value.date).toLocaleDateString()}</span>
          </Item.Content>
        </Item>
      </Item.Group>
    );
  }

  return (
    <Observer>
      {() => (
        <Item.Group>
          <Item>
            <Item.Image size="tiny">
              {value.verifiedState === 'Pending' && (
                <Modal
                  trigger={
                    <img
                      src={pending}
                      title="Pending Signature Verification"
                      onClick={() => toggleOpen(true)}
                    />
                  }
                  basic
                  size="small"
                  open={modalOpen}
                >
                  <Header icon="question" content="Pending Verification" />
                  <Modal.Content>
                    <p>Please wait while we verify the signature.</p>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button basic inverted onClick={() => toggleOpen(false)}>
                      <Icon name="remove" /> Close
                    </Button>
                  </Modal.Actions>
                </Modal>
              )}
              {value.verifiedState === 'Verified' && (
                <Modal
                  trigger={
                    <img src={verified} title="Valid Signature" onClick={() => toggleOpen(true)} />
                  }
                  basic
                  size="small"
                  open={modalOpen}
                >
                  <Header icon="check" content="The Signature is Valid" />
                  <Modal.Content>
                    <p>
                      The signature was verified. User {value.name} has signed this document and
                      since the document has been signed it has not been modified or tampered with.
                    </p>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button basic inverted onClick={() => toggleOpen(false)}>
                      <Icon name="remove" /> Close
                    </Button>
                  </Modal.Actions>
                </Modal>
              )}
              {value.verifiedState === 'Rejected' && (
                <Modal
                  trigger={
                    <img
                      src={rejected}
                      title="Invalid Signature"
                      onClick={() => toggleOpen(true)}
                    />
                  }
                  basic
                  size="small"
                  open={modalOpen}
                >
                  <Header icon="times circle" content="The Signature is Invalid" />
                  <Modal.Content>
                    <p>
                      It is possible that the content of the form has been modified after user
                      signed the document. Please contact the process owner and the signatory.
                    </p>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button basic inverted onClick={() => toggleOpen(false)}>
                      <Icon name="remove" /> Close
                    </Button>
                  </Modal.Actions>
                </Modal>
              )}
            </Item.Image>
            <Item.Content>
              <span className={signedStyle} style={{ fontFamily: font }}>
                {value.name}
              </span>
              <br />
              <span className={signedDate}>{new Date(value.date).toLocaleDateString()}</span>
            </Item.Content>
          </Item>
        </Item.Group>
      )}
    </Observer>
  );
};
