import { GithubApi } from '@mrzli/gm-js-libraries-github-api';
import { NodePackagesApi } from '@mrzli/gm-js-libraries-node-packages-api';

export interface GeneratorContext {
  readonly githubApi: GithubApi;
  readonly nodePackagesApi: NodePackagesApi;
}
