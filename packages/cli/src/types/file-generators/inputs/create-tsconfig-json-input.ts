import { ProjectType } from '../../base/project-type';
import { Options } from 'prettier';

export interface CreateTsconfigJsonInput {
  readonly prettierConfig: Options;
  readonly projectType: ProjectType;
}
