FROM node:22-slim

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm install -g pnpm@10.26.1

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile

RUN PORT=3000 BASE_PATH=/ pnpm --filter @workspace/quiz-app run build

RUN pnpm --filter @workspace/api-server run build

EXPOSE 3000

CMD ["sh", "-c", "pnpm --filter @workspace/db run push && pnpm --filter @workspace/api-server run start"]
