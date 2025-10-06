/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { AttachmentNode } from './attachment-tree';

describe('AttachmentNode', () => {
  it('should insert single-level path', () => {
    const root = new AttachmentNode('root', 'folder');
    root.insert(['img.png']);

    const asJson = root.toJSON();
    expect(asJson).toEqual({ 'img.png': {} });
  });

  it('should insert nested paths', () => {
    const root = new AttachmentNode('root', 'folder');
    root.insert(['images', 'screenshots', 'ui.png']);

    const json = root.toJSON();
    expect(json).toEqual({
      images: {
        screenshots: {
          'ui.png': {},
        },
      },
    });
  });

  it('should not break on duplicate inserts', () => {
    const root = new AttachmentNode('root', 'folder');
    const path = ['videos', 'demo.mp4'];

    root.insert(path);
    root.insert(path);

    const json = root.toJSON();
    expect(json).toEqual({
      videos: {
        'demo.mp4': {},
      },
    });
  });
});
