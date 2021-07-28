- implement cli
  - basic command is 'gmstarter'
  - for generating default config init
    - 'initconfig'
      - monorepo
        - parentDirectory: current directory
        - projectName: 'monorepo'
        - setupGit: false
      - library
        - monorepoParentDirectory: current directory
        - monorepoProjectName: 'monorepo'
        - subprojectName: 'library'
        - subprojectDescription: 'Library description.'
        - githubPackagesTokenEnvKey: 'GITHUB_PACKAGES_TOKEN',
        - projectType: 'Library'
        - hasTests: true
        - hasScripts: false
  - for monorepo:
    - have option --config (-c) for setting a json config file, and using that
    - have interactive input
      - parentDirectory - set automatically to current directory
      - projectName (default 'monorepo'):
      - setupGit (default 'no'): Yes, yes, Y, y, No, no, N, n
  - for library:
    - have option --config (-c) for setting a json config file, and using that
    - have interactive input
      - monorepoParentDirectory - set automatically to current directory
      - monorepoProjectName (default 'monorepo'):
      - subprojectName (default 'library'):
      - subprojectDescription (default 'Library description.'):
      - githubPackageTokenEnvKey (default 'GITHUB_PACKAGES_TOKEN'):
      - projectType (default 'Library'): case insensitive 'Library' or 'CLI'
      - setupTests (default 'yes'): Yes, yes, Y, y, No, no, N, n
      - setupScripts (default 'no'): Yes, yes, Y, y, No, no, N, n

- implement generator for a cli project (we currently have only for library)
  - should have an additional option
    - this should be handed with a discriminated union on ProjectType
    - option should contain script name
  - will have a src/bin/<script-name>.ts

    ```
    #!/usr/bin/env node

    async function <script-name>(): Promise<void> {
      console.log('Hello!');
    }

    <script-name>().finally();
    ```

  - package.json
    - main in package.json should point to the script file (located between license and bin)
    - add a bin part in package.json (above scripts)
      - `"<script-name>": "./bin/<script-name>.js"`
    - in scripts add `"bin:<script-name>": "ts-node src/bin/<script-name>.ts"` below other scripts to run them in development
    - add `commander` dependency (for handling input parameters)
  - update README:
    - with description on how to start the project
      - https://developer.okta.com/blog/2019/06/18/command-line-app-with-nodejs
      - run locally by building, then going into dist, then 'node .'
      - install from local with same as above, then 'npm install -g .'
    - usage:
      - gmstarter
        - initconfig
        - generate
        - 
      - getting help:
        - `gmstarter help [command]`

- automatic tests for generation:


- options:
  - generate monorepo root
  - generate library
  - generate frontend
  - generate backend

- base implementation:
  - ci
    - implement workflow (in .github under base folder)
  - other
    - README
  
- frontend:
  - later on setup tests:
    - generate new cra
    - see src/App.test.tsx and setupTests.ts
  - public folder:
    - favicons
      - https://favicon.io/favicon-generator/
        - g / Rounded / Roboto / 110 / #FFFFFF / #00AAAA
    - manifest.json
      - need to input project name and display project name
    - robots.txt
      - just use from cra
    - index.html
      - adjust to take into account icons (or rename icons to fit here)
      - set title: display project name
  - src folder:
    - no tests for now
    - index.css
      - rename to 'index.scss' and use verbatim
    - reportWebVitals.ts
      - rename to 'report-web-vitals.ts'
      - use the one from dance site (generate it)
    - react-app-env.d.ts
      - copy verbatim
    - index.ts
      - will need more work
      - see dance site, or other projects
    - .gitignore
      - /.idea/, /build/, /node_modules/
    - package.json
      - look into more details
    - tsconfig.json
      - use default from library, then apply the changes
    - 'components' folder here
      - App.tsx
        - simple component returning display project name in div
        - component function should have a return value
        - should export component explicitly
