# Use official Playwright base image
FROM mcr.microsoft.com/playwright:v1.55.0-noble

# Set working directory
WORKDIR /home/pwuser

# Run container as the pre-defined playwright user
USER pwuser

# Expose the port so Docker knows about it
EXPOSE 3003

# Default command: start Playwright server
CMD ["npx", "-y", "playwright@1.55.0", "run-server", "--port", "3003", "--host", "0.0.0.0"]