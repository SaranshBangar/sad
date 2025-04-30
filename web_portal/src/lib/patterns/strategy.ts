export interface Strategy<T> {
  execute(...args: any[]): T;
}

export class Context<T> {
  private strategy: Strategy<T>;

  constructor(strategy: Strategy<T>) {
    this.strategy = strategy;
  }

  setStrategy(strategy: Strategy<T>) {
    this.strategy = strategy;
  }

  executeStrategy(...args: any[]): T {
    return this.strategy.execute(...args);
  }
}
