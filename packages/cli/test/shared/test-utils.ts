export function removeGitFolderEntries(
  relativeFileSystemEntries: readonly string[]
): readonly string[] {
  return relativeFileSystemEntries.filter((entry) => !entry.includes('.git/'));
}
