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

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
#ENV NODE_TLS_REJECT_UNAUTHORIZED=0

COPY . /src
WORKDIR "/src"

RUN tree .

# pnpm install
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# building esbuild-deploy
RUN pnpm --filter='./packages/esbuild-deploy' run build

# installing esbuild-deploy as workspace dependency
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

CMD ["pnpm", "--filter", "./packages/testing-e2e", "run", "test"]