import { Command, Argument } from 'commander';
import process from 'process';

export async function gmstarter(): Promise<void> {
  const program = new Command();

  // works only in development, need some other way of getting version
  // const version: string = getEnv('npm_package_version') ?? 'unknown version';
  // program.version(version, '-v, --version', 'output the current version');

  const generatorTypes: string[] = ['monorepo', 'library'];

  program
    .command('initconfig')
    .description(
      'create a default configuration (json file) for the specified generator type'
    )
    .addArgument(
      new Argument('<type>', 'type of generator').choices(generatorTypes)
    );

  program
    .command('generate')
    .description('generate starter project of the specified type')
    .addArgument(
      new Argument('<type>', 'type of generator').choices(generatorTypes)
    );

  program.parse(process.argv);
}
