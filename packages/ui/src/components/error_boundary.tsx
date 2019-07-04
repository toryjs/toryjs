import React from 'react';
import { Segment } from 'semantic-ui-react';

import { css } from 'emotion';

const segment = css`
  margin: 12px !important;
`;

const error = css`
  overflow: auto;
`;

export type State = { hasError: boolean; error?: Error; info?: React.ErrorInfo };

export class ErrorBoundary extends React.Component<any, State> {
  static displayName = 'ErrorBoundary';

  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Display fallback UI
    this.setState({ hasError: true, error, info });

    console.group('REACT ERROR');
    console.error(error);
    console.error(info);
    console.groupEnd();
    // You can also log the error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className={segment}>
          <Segment inverted attached="top" color="red">
            😢 {this.state.error.message}
          </Segment>
          <Segment attached="bottom" className={error}>
            <pre>{this.state.error.stack}</pre>
            <pre>{this.state.info.componentStack}</pre>
          </Segment>
        </div>
      );
    }
    return this.props.children;
  }
}
