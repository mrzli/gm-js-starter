export function createGitIgnore(): readonly string[] {
  return ['/.idea/', '/node_modules/', '/dist/'];
}
