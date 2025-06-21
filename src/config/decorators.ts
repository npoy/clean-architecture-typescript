type Constructor<T = any> = new (...args: any[]) => T;

const injectionMetadata = new Map<Constructor, string[]>();

export function inject(...tokens: string[]) {
  return function (target: Constructor) {
    injectionMetadata.set(target, tokens);
  };
}

export function getInjectionTokens(target: Constructor): string[] {
  return injectionMetadata.get(target) || [];
}