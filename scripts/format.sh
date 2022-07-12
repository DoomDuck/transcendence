#!/usr/bin/env bash

# Install prettier if missing
if [[ ! -f node_modules/prettier/bin-prettier.js ]]; then
    npm install --no-save prettier
fi

exec ./node_modules/prettier/bin-prettier.js --write \
    $(find src -name '*.ts' && find src -name '*.svelte')
