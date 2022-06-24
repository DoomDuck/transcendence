#!/usr/bin/env bash

# Quit on error
set -e

remove_hook() {
  rm  1>&2 2>/dev/null .git/hooks/pre-commit || return 1
  echo "Hook has been remove to install again run ./scripts/hooks/remove.sh"
}

show_help() {
  echo 2>&1 "Could not remove hook!"
  echo 2>&1 "It might not exist or you might not be at the project root"
}

remove_hook || show_help
