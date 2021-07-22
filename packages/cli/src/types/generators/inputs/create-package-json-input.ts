import { NodePackagesApi } from '@mrzli/gm-js-libraries-node-packages-api';

export interface CreatePackageJsonInput {
  readonly nodePackagesApi: NodePackagesApi;
  readonly githubUserName: string;
  readonly githubUserEmail: string;
  readonly githubRepositoryName: string;
  readonly packageName: string;
  readonly description: string;
}
