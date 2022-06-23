export default {
  createNode(
    tag: string = 'div',
    root: HTMLElement = document.body
  ): HTMLElement {
    const node = document.createElement(tag);
    root.appendChild(node);
    return node;
  },

  removeNode(node: HTMLElement): void {
    if (node && node.parentElement) {
      node.parentElement.removeChild(node);
    }
  },
};
