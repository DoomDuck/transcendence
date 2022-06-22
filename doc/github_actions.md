# Github actions

## Goal
*Automate* tasks on Github (tests, auto-format, etc..)

## Description
Actions are components of *Workflows* which are collection of
*responses to events*.
They are composed to *triggers* and *jobs* in response to them.

## Events
There are events for
[*many interactions*](https://docs.github.com/en/actions/reference/events-that-trigger-workflows)
with Github.

## Job
Sequence of steps(action or script) that require the success of the previous.
Jobs are by default independant of each other and run in parallel.

## Reusing actions
Actions from others can be referenced workflows (as a library).
They can be searched for in
[Github Marketplace](https://github.com/marketplace?type=actions)

## Runners
Actions run in machines provided by Github or ourselves.
They can be running either Linux(Ubuntu), Windows or MacOS

## Workflow Structure
Workflow are written in [YAML](https://en.wikipedia.org/wiki/YAML)

Example:
```yaml
name: learn-github-actions # Workflow name
on: [push] # Triggers
jobs:
  check-bats-version: # Action/job name
    runs-on: ubuntu-latest # Runner type
    steps:
     # Reused action from github
      - uses: actions/checkout@v3   # Fetch project
      - uses: actions/setup-node@v3 # owner/repo@ref
        with:
          node-version: '14'
      # Run commands
      - run: npm install -g bats
      - run: bats -v
```

## UI
Actions of a project can be inspected in the *Action* tab in a repository
