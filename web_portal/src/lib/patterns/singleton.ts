export class Singleton<T> {
  private static instances: Map<string, any> = new Map();

  protected constructor() {}

  static getInstance<T>(this: new () => T, id: string = "default"): T {
    const className = this.name;
    const instanceId = `${className}_${id}`;

    if (!this.instances.has(instanceId)) {
      this.instances.set(instanceId, new this());
    }

    return this.instances.get(instanceId);
  }
}
