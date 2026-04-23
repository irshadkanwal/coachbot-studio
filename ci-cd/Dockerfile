FROM node:20-slim

ARG FIREBASE_API_KEY
ENV FIREBASE_API_KEY=$FIREBASE_API_KEY

ARG NEXT_PUBLIC_MESSAGE_EDIT_ENABLED
ENV NEXT_PUBLIC_MESSAGE_EDIT_ENABLED=$NEXT_PUBLIC_MESSAGE_EDIT_ENABLED

ARG NEXT_PUBLIC_POSTHOG_HOST
ENV NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST

ARG NEXT_PUBLIC_POSTHOG_KEY
ENV NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY

RUN apt update && apt install -y \
  openssl \
  git

RUN mkdir /home/node/app/
COPY . /home/node/app/
WORKDIR /home/node/app/

RUN npm clean-install
RUN npm run build

# Enable server-side source maps at runtime for better stack traces
ENV NODE_OPTIONS="--enable-source-maps"

RUN chown -R node:node /home/node
USER node

CMD ["npm", "run", "start"]
