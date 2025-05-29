FROM --platform=$BUILDPLATFORM node:20-bullseye AS builder

RUN apt-get update
RUN apt-get install tree

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@9 --activate

RUN echo -e "pnpm $(pnpm -v)"
RUN pnpm add -g env-cmd

ARG TARGETPLATFORM
ARG BUILDPLATFORM

RUN echo "I am running on $BUILDPLATFORM, building for $TARGETPLATFORM" > /log

COPY . /src
WORKDIR "/src"

RUN tree .

# pnpm install
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# building esbuild-deploy
RUN pnpm -r run build

# pnpm install esbuild-deploy
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Create test results directory and set permissions
RUN mkdir -p /src/packages/testing-e2e/test-results && \
    chmod 777 /src/packages/testing-e2e/test-results

# Set working directory to e2e package
WORKDIR "/src/packages/testing-e2e"

# Use exec form of CMD with explicit shell to ensure proper signal handling
CMD ["/bin/sh", "-c", "pnpm run test"]