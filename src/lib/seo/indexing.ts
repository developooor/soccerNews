import { hasDemoContent } from "../api";
// Environment flags alone must never make fictional content indexable.
export const isIndexable =
  import.meta.env.ENABLE_INDEXING === "true" &&
  import.meta.env.CONTENT_MODE === "verified" &&
  !hasDemoContent;
