# Get NodeJS
FROM node:18-alpine as node-base

RUN apk add --update --no-cache bash

# Makes bash defaults terminal for root
# Use bash as the default shell https://deepsource.io/directory/analyzers/docker/issues/DOK-DL4005
SHELL ["/bin/bash", "-c"]
# Workaround to set default shell to bash
RUN ln -sfv /bin/bash /bin/sh

RUN mkdir -p /opt/ticketplace

WORKDIR /opt/ticketplace

COPY src/entrypoint.sh /entrypoint
RUN chmod +x /entrypoint

# Copy transpiled files
COPY dist/ticketplace-api /opt/quality24/dist

ENV PROJECT_NAME ticketplace-api
ENV LISTEN_PORT 8080

EXPOSE 8080

ENTRYPOINT ["/bin/bash", "/entrypoint"]
