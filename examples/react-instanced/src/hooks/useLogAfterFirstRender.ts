import { useEffect, useRef } from 'react';

export function useLogAfterFirstRender(componentName: string) {
  const firstRender = useRef(true);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  if (!firstRender.current) {
    console.log(`${componentName} render`);
  }
}
