import { DOMSerializer, Node } from "../model";

export class Renderer {
  constructor(
    private readonly dom: HTMLElement,
    private readonly serializer: DOMSerializer
  ) {}

  render(doc: Node): void {
    for (let i = this.dom.childNodes.length - 1; i >= 0; i--) {
      const child = this.dom.childNodes[i];
      this.dom.removeChild(child);
    }
    const dom = this.serializer.serialize(doc);
    this.dom.appendChild(dom);
    this.serializer.ensureTrailingHack(doc, this.dom);
  }
}
