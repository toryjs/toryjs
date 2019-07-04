import * as Gql from './gql';

import React from 'react';
import { Segment, Form, Button, Message } from 'semantic-ui-react';
import useReactRouter from 'use-react-router';

import { useMergeState, css } from '../../common';
import { Context, ContextType } from '../../context';

const loginSegment = css`
  margin: 16px !important;
`;

const buttonRow = css`
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Login = () => {
  const [state, changeState] = useMergeState({
    login: true, // switch between Login and SignUp
    email: '',
    password: '',
    name: '',
    error: false
  });
  const ctx = React.useContext(Context);

  const { login, email, password, name } = state;
  const { history } = useReactRouter();

  const saveUserData = (ctx: ContextType, token: string) => {
    localStorage.setItem(ctx.authToken, token);
  };

  const confirm = async (ctx: ContextType, data: any) => {
    const login = state.login ? data.login : data.signup;
    ctx.auth.user = login.user;
    saveUserData(ctx, login.token);
    history.push(`/`);
    changeState({ error: false });
  };

  console.log(state.error);

  return (
    <Segment className={'ui form ' + loginSegment}>
      <Form>
        <h4 className="mv3">{login ? 'Login' : 'Sign Up'}</h4>
        {state.error && <Message color="red" content="Incorrect user name or password!" />}
        <div className="flex flex-column">
          {!login && (
            <Form.Input
              label="Full Name"
              value={name}
              onChange={e => changeState({ name: e.target.value })}
              type="text"
              placeholder="Your name"
            />
          )}
          <Form.Input
            label="Email"
            value={email}
            onChange={e => changeState({ email: e.target.value })}
            type="text"
            placeholder="Your email address"
          />
          <Form.Input
            label="Password"
            value={password}
            onChange={e => changeState({ password: e.target.value })}
            type="password"
            placeholder="Choose a safe password"
          />
        </div>
        <div className={buttonRow}>
          {login ? (
            <Gql.LoginMutationComponent
              variables={{ email, password }}
              onCompleted={data => confirm(ctx, data)}
              onError={() => changeState({ error: true })}
            >
              {mutation => (
                <Button primary className="pointer mr2 button" onClick={mutation as any}>
                  {login ? 'Login' : 'create account'}
                </Button>
              )}
            </Gql.LoginMutationComponent>
          ) : (
            <Gql.SignupMutationComponent
              variables={{ email, password, name }}
              onCompleted={data => confirm(ctx, data)}
            >
              {mutation => (
                <Button primary className="pointer mr2 button" onClick={mutation as any}>
                  {login ? 'Login' : 'create account'}
                </Button>
              )}
            </Gql.SignupMutationComponent>
          )}

          <div className="pointer button" onClick={() => changeState({ login: !login })}>
            {login ? 'need to create an account?' : 'already have an account?'}
          </div>
        </div>
      </Form>
    </Segment>
  );
};

export default Login;
