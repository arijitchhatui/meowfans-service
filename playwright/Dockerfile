FROM mcr.microsoft.com/playwright:v1.55.0-noble

# Set working directory
WORKDIR /home/pwuser

# Install playwright globally as root
RUN npm install -g playwright@1.55.0

# Ensure pwuser owns its home directory
RUN chown -R pwuser:pwuser /home/pwuser

# Switch to pwuser
USER pwuser

# Expose the port
EXPOSE 3003

# Default command (no npx needed anymore)
CMD ["playwright", "run-server", "--port", "3003", "--host", "0.0.0.0"]