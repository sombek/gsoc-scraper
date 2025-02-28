# [Choice] Python version: 3.12-bookworm, 3.11-bookworm, 3.10-bookworm and 3.12-bullseye, 3.11-bullseye, 3.10-bullseye
FROM mcr.microsoft.com/devcontainers/python:1-3.12-bookworm

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/* /tmp/library-scripts

# Install pnpm
RUN npm install -g pnpm prettier