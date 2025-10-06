import { HashMap } from './hashmap';

describe('HashMap (custom)', () => {
  let map: HashMap<string, number>;

  beforeEach(() => {
    map = new HashMap<string, number>(10);
  });

  it('should set and get values correctly', () => {
    map.set('alpha', 100);
    map.set('beta', 200);

    expect(map.get('alpha')).toBe(100);
    expect(map.get('beta')).toBe(200);
  });

  it('should overwrite an existing key', () => {
    map.set('alpha', 100);
    map.set('alpha', 300);

    expect(map.get('alpha')).toBe(300);
  });

  it('should return undefined for unknown keys', () => {
    expect(map.get('nonexistent')).toBeUndefined();
  });

  it('should delete keys', () => {
    map.set('alpha', 100);
    map.delete('alpha');

    expect(map.get('alpha')).toBeUndefined();
  });

  it('should handle collisions without losing data', () => {
    // force collisions by overriding the hash function
    const smallMap = new HashMap<string, number>(1);
    smallMap.set('A', 1);
    smallMap.set('B', 2);
    expect([smallMap.get('A'), smallMap.get('B')]).toContain(1);
    expect([smallMap.get('A'), smallMap.get('B')]).toContain(2);
  });
});
