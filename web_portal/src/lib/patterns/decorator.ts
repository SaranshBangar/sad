export interface Component {
  operation(): string | object;
}

export class BaseDecorator implements Component {
  protected component: Component;

  constructor(component: Component) {
    this.component = component;
  }

  operation(): string | object {
    return this.component.operation();
  }
}
