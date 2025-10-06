export class HashMap<K, V> {
  private buckets: Array<[K, V][]> = [];
  private capacity: number;

  constructor(capacity = 100) {
    this.capacity = capacity;
    this.buckets = new Array(capacity).fill(null).map(() => []);
  }

  // FNV-1a hash function
  private hash(key: K): number {
    const str = String(key);
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = (hash * 16777619) >>> 0;
    }
    return hash % this.capacity;
  }

  set(key: K, value: V): void {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    const existing = bucket.find(([k]) => k === key);
    if (existing) existing[1] = value;
    else bucket.push([key, value]);
  }

  get(key: K): V | undefined {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    const entry = bucket.find(([k]) => k === key);
    return entry ? entry[1] : undefined;
  }

  delete(key: K): void {
    const index = this.hash(key);
    this.buckets[index] = this.buckets[index].filter(([k]) => k !== key);
  }
}
