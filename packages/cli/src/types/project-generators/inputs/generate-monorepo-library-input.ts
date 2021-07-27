import { ProjectType } from '../../base/project-type';
import { GithubApi } from '@mrzli/gm-js-libraries-github-api';
import { NodePackagesApi } from '@mrzli/gm-js-libraries-node-packages-api';

export interface GenerateMonorepoLibraryInput {
  readonly githubApi: GithubApi;
  readonly nodePackagesApi: NodePackagesApi;
  readonly monorepoParentDirectory: string;
  readonly monorepoProjectName: string;
  readonly subprojectName: string;
  readonly subprojectDescription: string;
  readonly githubPackagesTokenEnvKey: string;
  readonly projectType: ProjectType;
  readonly hasTests: boolean;
  readonly hasScripts: boolean;
}
