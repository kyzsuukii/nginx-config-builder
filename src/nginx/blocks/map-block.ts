import { Block } from "./block";

interface MapItem {
  key: string;
  value: string;
}

/**
 * Represents a map block in an NGINX configuration.
 * Map blocks allow you to create key-value mappings.
 */
export class MapBlock extends Block {
  private items: MapItem[] = [];

  /**
   * Creates a new map block.
   * @param variable - Source variable to map
   * @param outputVar - Target variable to
   */
  constructor(
    private variable: string,
    private outputVar: string
  ) {
    super();
  }

  /**
   * Sets a mapping rule.
   * @param key - Source value to match
   * @param value - Target value to set when key matches
   */
  set(key: string, value: string): this {
    this.items.push({ key, value });
    return this;
  }

  build(indent = "    "): string {
    const items = this.items
      .map((i) => indent + i.key + " " + i.value + ";")
      .join("\n");
    return `${indent}map ${this.variable} ${this.outputVar} {\n${items}\n${indent}}`;
  }
}
