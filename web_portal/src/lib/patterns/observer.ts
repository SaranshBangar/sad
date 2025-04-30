export interface Observer {
  update(data: any): void;
}

export class Subject {
  private observers: Observer[] = [];

  addObserver(observer: Observer): void {
    const isExist = this.observers.includes(observer);
    if (!isExist) {
      this.observers.push(observer);
    }
  }

  removeObserver(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex !== -1) {
      this.observers.splice(observerIndex, 1);
    }
  }

  notify(data: any): void {
    this.observers.forEach((observer) => observer.update(data));
  }
}
