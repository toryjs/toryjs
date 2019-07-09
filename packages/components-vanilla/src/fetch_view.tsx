import * as React from 'react';

import { FormComponentProps, FormComponent } from '@toryjs/form';
import {
  createComponents,
  Context,
  simpleHandle,
  DynamicComponent,
  tryInterpolate
} from '@toryjs/ui';

import { observer } from 'mobx-react';

export type FetchProps = {
  url: string;
  resultRoot: string;
  target: string;
  propTarget: string;
  loadingText: string;
  onResult: string;
  onError: string;
  onSubmit: string;
  fakeData: string;
  options: string;
};

const FetchComponent: React.FC<FormComponentProps<FetchProps>> = props => {
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState(null);

  const context = React.useContext(Context);
  const {
    owner,
    formElement: {
      props: { url, loadingText, target, onError, onResult, onSubmit, options, resultRoot }
    }
  } = props;

  let parsedUrl = onSubmit ? simpleHandle(props, onSubmit, context) : '';
  try {
    parsedUrl = tryInterpolate(url, props.owner);
  } catch (ex) {
    setError(`Error parsing url: ${ex.message}`);
  }

  React.useEffect(() => {
    let fetchOptions: any = {};
    if (options) {
      try {
        fetchOptions = JSON.parse(options);
      } catch (ex) {
        setError(`Error parsing options: ${ex.message}`);
        return;
      }
    }
    fetch(parsedUrl, fetchOptions)
      .then(response => {
        response.json().then(rawData => {
          let data = resultRoot ? rawData[resultRoot] : rawData;
          if (onResult) {
            data = simpleHandle(props, onResult, context, { data });
          }
          if (target && target !== 'dataPropData' && target !== 'dataPropFirst') {
            owner.setValue(target, data);
          }
          setData(data);
        });
      })
      .catch(error => {
        if (onError) {
          simpleHandle(props, onError, context, { error });
          setError(error);
        }
      });
  }, [parsedUrl]);

  if (error) {
    return (
      <DynamicComponent {...props}>
        {typeof error === 'object' ? JSON.stringify(error) : error}
      </DynamicComponent>
    );
  }

  if (!data) {
    return <DynamicComponent {...props}>{loadingText || 'Loading ...'}</DynamicComponent>;
  }

  let dataProps = { ...props };
  if (target === 'dataPropFirst') {
    dataProps.dataProps = {
      first: data && Object.keys(data).length > 0 && data[Object.getOwnPropertyNames(data)[0]]
    };
  } else if (target === 'dataPropData') {
    dataProps.dataProps = { data };
  }
  return <>{createComponents(dataProps)}</>;
};

export const FetchView: FormComponent = {
  Component: observer(FetchComponent)
};
