import { Heap } from './Heap';

export class PriorityQueue<T> extends Heap<T> {
  enqueue(value: T) {
    this.push(value);
  }

  dequeue() {
    this.pop();
  }

  isEmpty() {
    return this.heap.length <= 0;
  }
}
