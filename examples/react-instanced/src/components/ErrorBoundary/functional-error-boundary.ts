/* eslint-disable @typescript-eslint/member-ordering */
import React from 'react';

type ErrorHandler = (error: Error, info: React.ErrorInfo) => void;
type ErrorHandlingComponent<Props> = (props: Props, error?: Error) => React.ReactNode;

interface ErrorState {
  error?: Error;
}

export default function Catch<Props extends {}>(
  component: ErrorHandlingComponent<Props>,
  errorHandler?: ErrorHandler
): React.ComponentType<Props> {
  return class extends React.Component<Props, ErrorState> {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    state: ErrorState = {
      error: undefined
    };

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    static getDerivedStateFromError(error: Error) {
      return { error };
    }

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    componentDidCatch(error: Error, info: React.ErrorInfo) {
      if (errorHandler) {
        errorHandler(error, info);
      }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    render() {
      // eslint-disable-next-line react/destructuring-assignment
      return component(this.props, this.state.error);
    }
  };
}
