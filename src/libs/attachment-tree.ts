export class AttachmentNode {
  constructor(
    public name: string,
    public type: 'folder' | 'file',
    public extension?: string,
  ) {}

  children: Map<string, AttachmentNode> = new Map();

  insert(pathParts: string[]): void {
    if (pathParts.length === 0) return;
    const [current, ...rest] = pathParts;
    if (!this.children.has(current)) {
      const nodeType = rest.length === 0 ? 'file' : 'folder';
      const ext = nodeType === 'file' ? current.split('.').pop() : undefined;
      this.children.set(current, new AttachmentNode(current, nodeType, ext));
    }
    this.children.get(current)!.insert(rest);
  }

  toJSON(): Record<string, any> {
    const obj: Record<string, any> = {};
    this.children.forEach((node) => {
      obj[node.name] = node.type === 'file' ? {} : node.toJSON();
    });
    return obj;
  }
}
