#!/bin/bash
source .env_app_build

cd ../../

docker build -f ci-cd/Dockerfile --build-arg FIREBASE_API_KEY=$FIREBASE_API_KEY --build-arg NEXT_PUBLIC_MESSAGE_EDIT_ENABLED=$NEXT_PUBLIC_MESSAGE_EDIT_ENABLED --build-arg NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY --build-arg NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST -t app-coachbotai:local .