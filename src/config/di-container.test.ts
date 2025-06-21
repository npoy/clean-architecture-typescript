import { describe, it } from 'node:test';
import assert from 'node:assert';
import { DIContainer } from './di-container.js';
import { inject } from './decorators.js';

// Test classes - TestDependency must be defined first
class TestDependency {
  public value = "test";
}

@inject("TestDependency")
class TestClass {
  constructor(public dependency: TestDependency) {}
}

describe('DIContainer', () => {
  it('should register and resolve a class', () => {
    const container = new DIContainer();
    container.register("TestDependency", TestDependency);
    
    const instance = container.resolve<TestDependency>("TestDependency");
    
    assert(instance instanceof TestDependency);
    assert.strictEqual(instance.value, "test");
  });

  it('should resolve dependencies using injection tokens', () => {
    const container = new DIContainer();
    container.register("TestDependency", TestDependency);
    container.register("TestClass", TestClass);
    
    const instance = container.resolve<TestClass>("TestClass");
    
    assert(instance instanceof TestClass);
    assert(instance.dependency instanceof TestDependency);
    assert.strictEqual(instance.dependency.value, "test");
  });

  it('should return singleton instances', () => {
    const container = new DIContainer();
    container.register("TestDependency", TestDependency);
    
    const instance1 = container.resolve<TestDependency>("TestDependency");
    const instance2 = container.resolve<TestDependency>("TestDependency");
    
    assert.strictEqual(instance1, instance2);
  });

  it('should throw error for unregistered token', () => {
    const container = new DIContainer();
    
    assert.throws(
      () => container.resolve("UnregisteredToken"),
      /No registration for token: UnregisteredToken/
    );
  });

  it('should handle factory registration', () => {
    const container = new DIContainer();
    container.registerFactory("TestDependency", () => new TestDependency());
    
    const instance = container.resolve<TestDependency>("TestDependency");
    
    assert(instance instanceof TestDependency);
  });
}); 