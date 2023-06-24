#!/bin/bash
# podman build --format docker --tag th-helm-playground-frontend .

docker buildx build --push \
  --platform linux/arm64/v8,linux/amd64 \
  --tag docker.io/tobiashochguertel/th-helm-playground-frontend:1.0.0 \
  --tag docker.io/tobiashochguertel/th-helm-playground-frontend:latest \
  .