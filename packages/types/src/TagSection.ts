import type { Tag } from "./Tag"

export interface TagSection {
  readonly id: string;
  title: string;
  tags: Tag[];
}
