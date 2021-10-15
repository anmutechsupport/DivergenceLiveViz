import { useEffect, useRef } from 'react';

export default function useInterval(callback, delay) {
  const callbacRef = useRef();

  useEffect(() => {
    callbacRef.current = callback;
  });

  useEffect(() => {
    if (!delay) {
      return () => {};
    }

    const interval = setInterval(() => {
      if (callbacRef.current) callbacRef.current();
    }, delay);
    return () => clearInterval(interval);
  }, [delay]);
}
