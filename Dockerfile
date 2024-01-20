# Use the official PostgreSQL image from Docker Hub
FROM postgres:latest

# Set the password for the default 'postgres' user
ENV POSTGRES_PASSWORD admin1234

# Expose the default PostgreSQL port
EXPOSE 5432