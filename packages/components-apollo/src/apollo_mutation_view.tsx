import * as React from 'react';

import { createComponents, Context, simpleHandle } from '@toryjs/ui';
import { FormComponentProps, FormComponent } from '@toryjs/form';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { observer, Observer } from 'mobx-react';
import { ApolloError } from 'apollo-client';
import { Message } from 'semantic-ui-react';

import { parseVariables } from './apollo_query_view';

export type ApolloMutationProps = {
  mutation: string;
  target: string;
  variables: { name: string; value: string; type: string }[];
  boundVariables: { name: string; source: string }[];
  onResult: string;
  onError: string;
  clickHandler: string;
  onSubmit: string;
  successAlert: string;
  errorAlert: string;
  fakeData: string;
  loadingText: string;
};

export const ApolloMutation = observer((props: FormComponentProps<ApolloMutationProps>) => {
  const [error, setError] = React.useState(null);

  const {
    owner,
    formElement: {
      props: {
        mutation,
        target,
        onError,
        onResult,
        clickHandler,
        successAlert,
        errorAlert,
        loadingText
      }
    }
  } = props;

  const context = React.useContext(Context);

  if (!mutation) {
    return <div>Please specify the mutation</div>;
  }

  let parsedMutation: any;
  try {
    parsedMutation = React.useMemo(() => gql([mutation]), [mutation]);
  } catch (ex) {
    return <pre>Mutation Error: {ex.message}</pre>;
  }

  return (
    <Mutation
      mutation={parsedMutation}
      onCompleted={(data: any) => {
        if (target && target !== 'dataPropFirst' && target !== 'dataPropData') {
          owner.setValue(
            target,
            data && Object.keys(data).length > 0 && data[Object.getOwnPropertyNames(data)[0]]
          );
        }
        if (onResult) {
          simpleHandle(props, onResult, context, data);
        }
        if (successAlert) {
          if (!context.providers.alert) {
            throw new Error('You need to add AlertProvider');
          }
          context.providers.alert.success(successAlert);
        }
        if (error) {
          setError(null);
        }
      }}
      onError={(data: ApolloError) => {
        try {
          if (onError) {
            simpleHandle(props, onError, context, data);
          }
          if (errorAlert) {
            if (!context.providers.alert) {
              throw new Error('You need to add AlertProvider');
            }
            context.providers.alert.error(errorAlert);
          }

          setError(data.message);
        } catch (ex) {
          setError(ex);
        }
      }}
    >
      {(mutate: any, { loading, error, data }: any) => {
        return (
          <Observer>
            {() => {
              let handlers = props.handlers;
              if (clickHandler) {
                const newClickHandler = () => {
                  let currentVariables: any = parseVariables(props, context);
                  mutate({
                    variables: currentVariables
                  });
                };
                handlers = { ...handlers, [clickHandler]: newClickHandler };
              }
              if (loading) return <span> {loadingText || 'Loading ...'}</span>;

              let dataProps = { ...props };
              if (target === 'dataPropFirst') {
                dataProps.dataProps = {
                  first:
                    data &&
                    Object.keys(data).length > 0 &&
                    data[Object.getOwnPropertyNames(data)[0]]
                };
              } else if (target === 'dataPropData') {
                dataProps.dataProps = { data };
              }

              const components = createComponents({
                ...dataProps,
                handlers,
                extra: { loading, error, data }
              });
              if (error) {
                return (
                  <>
                    <Message
                      color="red"
                      header="Query Error"
                      icon="ban"
                      content={error.message ? error.message : JSON.stringify(error, null, 2)}
                    />
                    <br />
                    {components}
                  </>
                );
              }
              return <>{components}</>;
            }}
          </Observer>
        );
      }}
    </Mutation>
  );
});

export const ApolloMutationView: FormComponent = {
  Component: ApolloMutation,
  toString: () => {
    throw new Error('Not Implemented');
  }
};
