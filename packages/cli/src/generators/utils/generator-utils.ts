export function stringArrayItemsToFileString(
  arrayItems: readonly string[]
): string {
  return arrayItems.join('\n').concat('\n');
}
