# 14 — Docker and ECR

Each backend component has a separate Dockerfile. Each image copies shared backend Redis code where needed and declares its own port. This supports independent build and release lifecycles, but no image build/push pipeline or ECR repository configuration is included.

## Image lifecycle

1. Build the image using the correct build context (Dockerfiles copy `services/...` and `shared`, so builds are intended from `backend`).
2. Tag the image with a unique release identifier or commit SHA.
3. Authenticate to the corresponding ECR registry and push the image.
4. Update the service's ECS task definition to reference the intended tag/digest.
5. Register a new task-definition revision and deploy it through the ECS service.
6. Observe task startup and target health before considering rollout complete.

Pushing a changed image under a mutable tag does not by itself guarantee ECS replaces running tasks; task definitions pin the image reference used to start tasks, and an explicit new revision or forced deployment is generally needed. Immutable tags/digests improve traceability and rollback.

## Dockerfile considerations

Current Dockerfiles use the floating `node` base image and run `npm install`. They do not establish image scanning, non-root runtime, pinned base image digest, production-only dependency install, or CI checks. These are review opportunities, not evidence that corresponding ECR settings exist.

See [16-deployment-architecture.md](16-deployment-architecture.md) and [diagrams/ecr-ecs-deployment.mmd](diagrams/ecr-ecs-deployment.mmd).
