// import { useRef, useCallback } from "react";

// export default function useDebounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null);

//   return useCallback((...args: Parameters<T>) => {
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current);
//     }
//     timeoutRef.current = setTimeout(() => {
//       fn(...args);
//     }, delay);
//   }, [fn, delay]);
// } 