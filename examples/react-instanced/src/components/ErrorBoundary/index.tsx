import React from 'react';
import Catch from './functional-error-boundary';
// import { Button } from 'antd-mobile';
/**
 * <ErrorBoundary>
 *    <RError />
 * </ErrorBoundary>
 */
interface IProps {
  children: React.ReactNode;
}

const ErrorBoundary = Catch((props: IProps, error?: Error) => {
  if (error) {
    return (
      <div className="bg-white p-4" style={{ border: '1px solid #ddd' }}>
        <h2 className="text-red-500">页面错误或数据渲染问题</h2>
        <h4 className="">报错信息：{error.message}</h4>
      </div>
    );
  }
  return props.children;
});

export default ErrorBoundary;
