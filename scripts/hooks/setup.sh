#!/usr/bin/env bash

# Quit on error
set -e

setup_hooks() {
  ln -s \
     ../../scripts/check_format.sh \
    .git/hooks/pre-commit \
    1>&2 2>/dev/null || return 1

  echo "Hook has been installed to remove run ./scripts/hooks/remove.sh"
}

show_help() {
  echo 2>&1 "Could not setup hook!"
  echo 2>&1 "It might allready exist or you might not be at the project root"
}

setup_hooks || show_help
