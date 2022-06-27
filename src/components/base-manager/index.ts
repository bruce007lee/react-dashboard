/**
 * 通用的管理器模型
 */
export default abstract class BaseManager<P, T extends { [key: string]: any }> {
  protected store: T[] = [];

  constructor(props?: P) {}

  protected abstract getNameKey(): string;

  getAll(): T[] {
    return this.store;
  }

  getIndex(item: T): number {
    let index = -1;
    this.store.find((it, idx) => {
      if (it === item) {
        index = idx;
        return true;
      }
      return false;
    });
    return index;
  }

  get(index: number): T {
    return this.store[index];
  }

  add(item: T, index?: number) {
    if (index == null) {
      this.store.push(item);
    } else {
      if (index < 0) {
        index = 0;
      } else if (index > this.store.length) {
        index = this.store.length;
      }
      this.store.splice(index, 0, item);
    }
  }

  remove(item: string | number | T): boolean {
    if (item != null) {
      const newItems = [];
      const items = this.store;
      items.forEach((it, idx) => {
        if (!(it[this.getNameKey()] === item || it === item || idx === item)) {
          newItems.push(it);
        }
      });
      this.store = newItems;
      return items.length !== newItems.length;
    }
    return false;
  }

  removeAll() {
    this.store.splice(0, this.store.length);
  }

  map = (fn: (item: T, index: number) => any) => this.store.map(fn);

  forEach = (fn: (item: T, index: number) => void) => this.store.forEach(fn);

  find = (fn: (item: T, index: number) => boolean) => this.store.find(fn);

  findByName = (name: string) => this.find((com) => !!name && com[this.getNameKey()] === name);
}
