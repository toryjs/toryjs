import * as React from 'react';

import { FormComponentProps, FormComponent } from '@toryjs/form';
import { createComponents, Context, ContextType, simpleHandle } from '@toryjs/ui';

import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { ApolloError } from 'apollo-client';
import { observer } from 'mobx-react';
import { Loader } from 'semantic-ui-react';

export type ApolloQueryProps = {
  query: string;
  target: string;
  propTarget: string;
  loadingText: string;
  variables: { name: string; value: string; type: string }[];
  boundVariables: { name: string; source: string }[];
  onResult: string;
  onError: string;
  onSubmit: string;
  fakeData: string;
  aggregate: boolean;
};

export function parseParameter(value: string, type: string) {
  switch (type) {
    case 'number':
      return parseFloat(value);
    case 'boolean':
      return value === 'true' ? true : false;
  }
  return value;
}

type ParsableProps = {
  variables: { name: string; value: string; type: string }[];
  boundVariables: { name: string; source: string }[];
  onSubmit: string;
};

export function parseVariables(props: FormComponentProps<ParsableProps>, context: ContextType) {
  const {
    owner,
    formElement: {
      props: { variables, boundVariables, onSubmit }
    }
  } = props;
  let currentVariables: any = onSubmit ? simpleHandle(props, onSubmit, owner, context) : {};
  if (variables) {
    for (let v of variables) {
      currentVariables[v.name] = parseParameter(v.value, v.type);
    }
  }
  if (boundVariables) {
    for (let v of boundVariables) {
      currentVariables[v.name] = owner.getValue(v.source);
    }
  }
  return currentVariables;
}

export const ApolloQuery: React.FC<FormComponentProps<ApolloQueryProps>> = props => {
  const [error, setError] = React.useState(null);
  const [currentData, setData] = React.useState(null);

  const context = React.useContext(Context);
  const {
    owner,
    formElement: {
      props: { query, loadingText, target, onError, onResult, aggregate }
    }
  } = props;

  if (!query) {
    return <div>Please specify the query</div>;
  }

  let parsedQuery: any;
  try {
    parsedQuery = gql([query]);
  } catch (ex) {
    return <pre>Query Error: {ex.message}</pre>;
  }

  let currentVariables = parseVariables(props, context);

  return (
    <Query
      query={parsedQuery}
      variables={currentVariables}
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
        const result =
          (data && Object.keys(data).length > 0 && data[Object.getOwnPropertyNames(data)[0]]) || [];
        setData(aggregate ? (currentData || []).concat(result) : result);
      }}
      onError={(data: ApolloError) => {
        console.log(data);
        try {
          if (onError) {
            simpleHandle(props, onError, context, data);
          }
          if (error) {
            setError(null);
          }
          setError(data.message);
        } catch (ex) {
          setError(ex);
        }
      }}
    >
      {({ loading, error, data }: any) => {
        if (error) {
          return <pre>Query Error: {JSON.stringify(error, null, 2)}</pre>;
        }
        if (loading && !currentData) return loadingText || 'Loading ...';
        if (error) return `Error! ${error.message}`;

        let dataProps = { ...props };
        if (target === 'dataPropFirst') {
          dataProps.dataProps = {
            first: currentData
          };
        } else if (target === 'dataPropData') {
          dataProps.dataProps = { data };
        }
        return (
          <>
            {createComponents(dataProps)}
            {loading && currentData && <Loader inline content="Loading" active={true} />}
          </>
        );
      }}
    </Query>
  );
};

export const ApolloQueryView: FormComponent = {
  Component: observer(ApolloQuery)
};
