#!/usr/bin/env bash

# Quit on error
set -e

HOOK_PATH=.git/hooks/pre-commit

check_hook_is_link() {
  [[ ! -f $HOOK_PATH ]] && return 0
  echo 1>&2 "Error: Hook script is not a link" && exit 1
}

remove_hook() {
  rm 2>&1 >/dev/null $HOOK_PATH
}

success() {
  echo "Hook has been remove to install again run ./scripts/hooks/remove.sh"
}

show_help() {
  echo 2>&1 "Error: Could not remove hook!"
  echo 2>&1 "It might not exist or you might not be at the project root"
}

check_hook_is_link && remove_hook && success || show_help
