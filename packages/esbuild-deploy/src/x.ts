export function x<T>(action: () => T): T {
   return action();
}
