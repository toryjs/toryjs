import React from 'react';

import { EditorComponent, FormComponentProps } from '@toryjs/form';
import {
  prop,
  propGroup,
  handlerProp,
  boundProp,
  dataProp,
  getValue,
  Context,
  createEditorContainer,
  simpleHandle,
  createComponents
} from '@toryjs/ui';

import { observer } from 'mobx-react';
import { FetchProps, FetchView } from './fetch_view';

export const handlerProps = propGroup('Handlers', {
  onResult: handlerProp({
    label: 'onResult',
    documentation:
      '<i>(data: any) => any: </i> executes when data is returned from data endpoint. It must return the final shape of the data. This is useful to map the data result to a desired shape.'
  }),
  onError: handlerProp({
    label: 'onError',
    documentation: '<i>(error: Error) => void: </i> executes when error occurs'
  }),
  onSubmit: handlerProp({
    label: 'onQuery',
    documentation:
      '<i>Handler:</i> executes before the query. It <b>must returns</b> the url of the fetch query.'
  })
});

const FetchEditorComponent = observer((props: FormComponentProps<FetchProps>) => {
  const controlProps = props.formElement.props;
  const context = React.useContext(Context);
  controlProps.url;

  let fakeData = getValue(props, context, 'fakeData');
  if (fakeData) {
    let data: any;
    try {
      data = eval(`(${fakeData.trim()})`);
    } catch (ex) {
      return <div>Error parsing json: {ex.message}</div>;
    }

    if (controlProps.onResult) {
      data = simpleHandle(props, controlProps.onResult, context, { data });
    }
    if (
      controlProps.target &&
      controlProps.target !== 'dataPropData' &&
      controlProps.target !== 'dataPropFirst'
    ) {
      props.owner.setValue(controlProps.target, data);
    }

    let dataProps = { ...props };
    if (controlProps.target === 'dataPropFirst') {
      dataProps.dataProps = {
        first: data && Object.keys(data).length > 0 && data[Object.getOwnPropertyNames(data)[0]]
      };
    } else if (controlProps.target === 'dataPropData') {
      dataProps.dataProps = { data };
    }
    return <>{createComponents(dataProps)}</>;
  }
  return <FetchView.Component {...props} />;
});

export const FetchEditor: EditorComponent = {
  Component: createEditorContainer(FetchEditorComponent),
  title: 'Fetch API',
  control: 'Fetch',
  icon: 'download',
  provider: true,
  group: 'Data',
  props: {
    ...propGroup('Fetch', {
      url: prop({
        documentation: 'Url of the json data source'
      }),
      resultRoot: prop({
        documentation:
          'You can map the result to a different root. For example, if fetch query returns object <pre>{ info, data }</pre>, you can map your result root to <i>data</i>'
      }),
      options: prop({
        documentation: `Options of the fetch request, e.g. 
<pre>
{
  method: 'POST', // *GET, POST, PUT, DELETE, etc.
  mode: 'cors', // no-cors, cors, *same-origin
  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  credentials: 'same-origin', // include, *same-origin, omit
  headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
  },
  redirect: 'follow', // manual, *follow, error
  referrer: 'no-referrer', // no-referrer, *client
  body: JSON.stringify(data), // body data type must match "Content-Type" header
}
</pre>`,
        control: 'Code',
        props: {
          display: 'topLabel',
          language: 'javascript'
        },
        type: 'string'
      }),
      target: dataProp({
        documentation:
          'Target dataset field, where you can (but do not have to) store the query result',
        label: 'Target'
      }),
      loadingText: prop({
        props: { value: { source: 'loadingText' } },
        type: 'string',
        documentation: 'Display this text during query load'
      })
    }),
    ...handlerProps,
    ...propGroup('Editor', {
      fakeData: boundProp({
        control: 'Code',
        props: { language: 'javascript', display: 'topLabel' },
        documentation: `Fake data to return. e.g.
<pre>
{
  people: [
    { name: 'Tomas', sex: 'Male' },
    { name: 'Vittoria', sex: 'Female }
  ]
}
</pre>
`
      })
    })
  },
  defaultProps: {
    loadingText: 'Loading ...'
  }
};
