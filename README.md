# sfdx-publish-action

## Usage

1. To use this in a project, create a github/workflows/main.yml in the home directory
2. Copy the below code to the above file
```yaml
name: Publish to NPM

on:
  release:
    types: [published]

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v1
    - name: SFDX Publish Action Step
      id: publish-action
      uses: jag-sfdc/sfdx-publish-action@master
      env:
        NPM_AUTH_TOKEN: ${{ secrets.NPM_AUTH_TOKEN }}
```
3. Go to "Secrets" tab of your project and add "NPM_AUTH_TOKEN" and the secret from your NPM repository.
4. Once the main.yml file is Checked-in, for every release created from github, Actoins would be triggered and uses sfdx-publish-action to publish to NPM repository.
5. At the moment, sfdx-publish-action increases the patch version by one for every run. This can be changed and will be made configurable in future.
