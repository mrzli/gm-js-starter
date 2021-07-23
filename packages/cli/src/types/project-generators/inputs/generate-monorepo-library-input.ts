export interface GenerateMonorepoLibraryInput {
  readonly monorepoParentDirectory: string;
  readonly monorepoProjectName: string;
  readonly subprojectName: string;
  readonly subprojectDescription: string;
  readonly githubAccessTokenEnvKey: string;
  readonly githubPackagesTokenEnvKey: string;
}
