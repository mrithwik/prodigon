// ---------------------------------------------------------------------------
// Workshop API — fetch markdown content from the backend workshop route
// ---------------------------------------------------------------------------

import { client } from './client';

/**
 * Fetch the raw markdown content for a workshop file.
 *
 * @param path - Relative path within workshop/ e.g.
 *   "part1_design_patterns/task01_rest_vs_grpc/README.md"
 */
export async function fetchWorkshopContent(path: string): Promise<string> {
  const data = await client.get<{ content: string; path: string }>(
    `/api/v1/workshop/content?path=${encodeURIComponent(path)}`,
  );
  return data.content;
}
