import { GenerateMonorepoRootInput } from '../types/project-generators/inputs/generate-monorepo-root-input';
import {
  resolvePath,
  resolvePathFromCwd,
} from '@mrzli/gm-js-libraries-node-utils/path';
import {
  makeDirectory,
  writeStringToFile,
} from '@mrzli/gm-js-libraries-node-utils/file-system';
import { createMonorepoRootGitIgnore } from '../file-generators/implementation/git-files/monorepot-root-gitignore';

export async function generateMonorepoRoot(
  input: GenerateMonorepoRootInput
): Promise<void> {
  const { parentDirectory, projectName, setupGit } = input;
  const monorepoParentDirectory = resolvePathFromCwd(parentDirectory);
  const monorepoDirectory = resolvePath(monorepoParentDirectory, projectName);
  await makeDirectory(monorepoDirectory);

  const githubWorkspacesDirectory = resolvePath(
    monorepoDirectory,
    '.github/workspaces'
  );
  await makeDirectory(githubWorkspacesDirectory);

  const packagesDirectory = resolvePath(monorepoDirectory, 'packages');
  await makeDirectory(packagesDirectory);

  const gitignorePath = resolvePath(monorepoDirectory, '.gitignore');
  const gitignoreData = createMonorepoRootGitIgnore();
  await writeStringToFile(gitignorePath, gitignoreData);
}
