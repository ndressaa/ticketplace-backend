#!/bin/bash

# We do not force full path here since this is configured in Dockerfile: WORKDIR /opt/ticketplace
echo "ENV: $NODE_ENV"
if [[ "$NODE_ENV" == "development" ]]; then
  # Use source map if exists
  if [[ -f "dist/app.js.map" ]]; then
    node --enable-source-maps=dist/app.js.map --trace-warnings dist/app.js
  else
    node --trace-warnings dist/app.js
  fi
else
  node dist/app.js
fi
