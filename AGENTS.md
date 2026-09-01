

<!-- IH-CONTAINER-POLICY:v1:BEGIN -->
# IH-CONTAINER-POLICY:v1

When creating or modifying a containerized application for Insight Health:

1. Use only the subscribed private Chainguard first-party bases below. Do not
   substitute Docker Hub, `cgr.dev/chainguard/*`, an unpinned image, `latest`,
   or an image outside the subscription:
   * `cgr.dev/insighthealth.ai/node:<version>@sha256:<64-hex-digest>`
   * `cgr.dev/insighthealth.ai/python:<version>@sha256:<64-hex-digest>`
   Build stages use the matching `-dev` tag and production stages use the
   matching non-`-dev` tag. Verify the digest belongs to the tag before use.
2. Build and publish only `linux/arm64`. Set Buildx/BuildKit to that one
   platform, and set Kubernetes node selection, ECS `runtime_platform`, or
   Lambda `architectures` to ARM64 wherever the deployment technology exposes
   the setting. Never emit a multi-architecture manifest. An amd64 choice is
   allowed only with a narrow, active `unsupported-architecture` exception
   backed by reproducible evidence that the dependency itself lacks ARM64;
   an amd64 CI runner is not evidence.
3. Every new containerized workload, and every legacy workload whose governed
   files are touched, must add a root `.insight/container-policy.yaml` and
   declare each Dockerfile, build file, deployment file, and `linux/arm64`.
   Unknown build/deployment formats stop for an adapter or approved exception.
4. The private APK repository is only for installing packages inside a build
   stage. Pass authentication with a BuildKit secret (for example
   `--mount=type=secret,id=cgr_token`); never put credentials in a Dockerfile,
   ARG/ENV, layer, log, image, or repository.
5. `datadog-agent`, `external-secrets`, and
   `aws-load-balancer-controller` are reserved for their corresponding
   infrastructure workloads and are never application bases. First-party
   deploy artifacts may remain in Insight Health ECR; this rule governs bases
   and directly deployed third-party images.
6. If no subscribed Chainguard image supports the required first-party
   technology, stop and request a subscription. Do not silently use Go, Java,
   amd64-only, or another generic base. Temporary non-Chainguard use is only
   for third-party vendor software and needs one approval from
   `container-policy-approvers`.
7. Never weaken or remove this block. Explain the image, tag, digest, manifest
   platforms, and deployment architecture in the change summary. The required
   GitHub check `Insight Container Policy` is the enforcement boundary; this
   guidance does not replace that check.

The organization policy source and exception registry are in the private
`insight-health-ai/.github` repository. Exceptions name an exact repository,
workload, and path, include evidence and tracking links, and expire within 90
days. Ask an owner to record one team approval before relying on one.
<!-- IH-CONTAINER-POLICY:v1:END -->
