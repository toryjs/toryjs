import React from 'react';

import { DynamicControl, simpleHandle, Context } from '@toryjs/ui';
import { FormComponentProps } from '@toryjs/form';
import { debounce } from '@tomino/toolbelt';

export type Props = {
  scrollTop: string;
  scrollBottom: string;
  resize: string;
  init: string;
};

export const WindowView: React.FC<FormComponentProps<Props>> = props => {
  const { scrollBottom, resize, scrollTop, init } = props.formElement.props;

  const context = React.useContext(Context);

  React.useEffect(() => {
    const bottom = debounce((e: any) => {
      if (window.innerHeight + window.pageYOffset >= document.body.scrollHeight - 10) {
        simpleHandle(props, scrollBottom, context, { e });
      }
    }, 500);

    const top = debounce((e: any) => {
      if (window.pageYOffset <= document.body.offsetHeight - 10) {
        simpleHandle(props, scrollTop, context, { e });
      }
    }, 500);
    function resizeWindow(e: any) {
      simpleHandle(props, resize, context, { e });
    }
    if (scrollBottom) {
      window.addEventListener('scroll', bottom);
    }
    if (scrollTop) {
      window.addEventListener('scroll', top);
    }
    if (resize) {
      window.addEventListener('resize', resizeWindow);
    }
    if (init) {
      simpleHandle(props, init, context);
    }

    return function cleanup() {
      if (scrollBottom) {
        window.removeEventListener('scroll', bottom);
      }
      if (scrollTop) {
        window.removeEventListener('scroll', top);
      }
      if (resize) {
        window.removeEventListener('resize', resizeWindow);
      }
    };
  });

  return <DynamicControl {...props} />;
};
