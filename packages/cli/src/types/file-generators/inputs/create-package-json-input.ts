import { NodePackagesApi } from '@mrzli/gm-js-libraries-node-packages-api';
import { Options } from 'prettier';

export interface CreatePackageJsonInput {
  readonly nodePackagesApi: NodePackagesApi;
  readonly prettierConfig: Options;
  readonly githubUserName: string;
  readonly githubUserEmail: string;
  readonly githubRepositoryName: string;
  readonly packageName: string;
  readonly description: string;
  readonly hasTests: boolean;
  readonly hasScripts: boolean;
}
