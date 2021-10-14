export class Heap<T> {
  heap: T[];
  constructor(
    private compare: (arg1: T, arg2: T) => boolean = (e1: T, e2: T) => e1 < e2,
  ) {
    this.heap = [];
  }

  protected getLeftChildIndex(parentIndex: number) {
    return parentIndex * 2 + 1;
  }

  protected getRightChildIndex(parentIndex: number) {
    return parentIndex * 2 + 2;
  }

  protected getParentIndex(childIndex: number) {
    return Math.trunc((childIndex - 1) / 2);
  }

  peek() {
    return this.heap[0];
  }

  push(value: T) {
    this.heap.push(value);
    this.heapifyUp();
  }

  pop() {
    const count = this.heap.length;
    const rootNode = this.heap[0];

    if (count <= 0) return undefined;
    if (count === 1) this.heap = [];
    else {
      this.heap[0] = this.heap.pop();
      this.heapifyDown();
    }

    return rootNode;
  }

  remove(value: T) {
    const position = this.heap.indexOf(value);
    if (position == 0) this.pop();
    if (position > 0) {
      this.heap[position] = this.heap.pop();
      this.heapifyDown(position);
    }
  }

  protected heapifyUp() {
    let index = this.heap.length - 1;
    const lastInsertedValue = this.heap[index];

    while (index > 0) {
      const parentIndex = this.getParentIndex(index);

      if (this.compare(lastInsertedValue, this.heap[parentIndex])) {
        this.heap[index] = this.heap[parentIndex];
        index = parentIndex;
      } else break;
    }
    this.heap[index] = lastInsertedValue;
  }

  protected heapifyDown(start: number = 0) {
    let index = start;
    const count = this.heap.length;
    const rootNode = this.heap[index];

    while (this.getLeftChildIndex(index) < count) {
      const leftChildIndex = this.getLeftChildIndex(index);
      const rightChildIndex = this.getRightChildIndex(index);

      const smallerChildIndex =
        rightChildIndex < count &&
        this.compare(this.heap[rightChildIndex], this.heap[leftChildIndex])
          ? rightChildIndex
          : leftChildIndex;

      if (this.compare(this.heap[smallerChildIndex], rootNode)) {
        this.heap[index] = this.heap[smallerChildIndex];
        index = smallerChildIndex;
      } else break;
    }

    this.heap[index] = rootNode;
  }
}
