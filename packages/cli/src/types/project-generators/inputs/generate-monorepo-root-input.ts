export interface GenerateMonorepoRootInput {
  readonly parentDirectory: string;
  readonly projectName: string;
  readonly setupGit: boolean;
}
