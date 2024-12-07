import { Block } from "./block";

/**
 * Represents an if block in an NGINX configuration.
 * If blocks allow you to execute directives conditionally.
 */
export class IfBlock extends Block {
  constructor(private condition: string) {
    super();
  }

  build(indent = "    "): string {
    const inner = this.directives.map((d) => indent + "    " + d).join("\n");
    return `${indent}if (${this.condition}) {\n${inner}\n${indent}}`;
  }
}
