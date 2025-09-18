FROM mcr.microsoft.com/playwright:v1.55.0-noble

# Set working directory
WORKDIR /home/pwuser

# Ensure npm cache folder exists and belongs to pwuser
RUN mkdir -p /home/pwuser/.npm && chown -R pwuser:pwuser /home/pwuser

# Switch to pwuser
USER pwuser

# Expose the port
EXPOSE 3003

# Default command
CMD ["npx", "-y", "playwright@1.55.0", "run-server", "--port", "3003", "--host", "0.0.0.0"]