import { ProjectType } from '../../base/project-type';

export interface GenerateMonorepoLibraryInput {
  readonly monorepoParentDirectory: string;
  readonly monorepoProjectName: string;
  readonly subprojectName: string;
  readonly subprojectDescription: string;
  readonly githubPackagesTokenEnvKey: string;
  readonly projectType: ProjectType;
  readonly setupTests: boolean;
  readonly setupScripts: boolean;
}
