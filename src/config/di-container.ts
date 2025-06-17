type Constructor<T = any> = new (...args: any[]) => T;

export interface IDIContainer {
  resolve<T>(token: string): T;
}

class DIContainer implements IDIContainer {
  private registry = new Map<string, Constructor | (() => any)>();
  private singletons = new Map<string, any>();

  register(token: string, clazz: Constructor) {
    this.registry.set(token, clazz);
  }

  registerFactory(token: string, factory: () => any) {
    this.registry.set(token, factory);
  }

  resolve<T>(token: string): T {
    if (this.singletons.has(token)) {
      return this.singletons.get(token);
    }

    const target = this.registry.get(token);
    if (!target) throw new Error(`No registration for token: ${token}`);

    if (typeof target === "function" && 'prototype' in target === false) {
      const instance = (target as () => any)();
      this.singletons.set(token, instance);
      return instance;
    }

    const paramTypes: Constructor[] = Reflect.getMetadata("design:paramtypes", target) || [];
    const dependencies = paramTypes.map(dep => this.resolve(dep.name));
    const instance = new (target as Constructor)(...dependencies);
    this.singletons.set(token, instance);
    return instance;
  }
}

export const container = new DIContainer();
