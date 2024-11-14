# Use the official MySQL 8.0 image as the base
FROM mysql:8.0

# Set environment variables for MySQL setup (root password, user, password, database)
ENV MYSQL_ROOT_PASSWORD=rootpass
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=userpass
ENV MYSQL_DATABASE=userdatabase

# Copy initialization scripts into the container (if you have any)
# COPY ./init.sql /docker-entrypoint-initdb.d/

# Expose MySQL's default port
EXPOSE 3306

CMD ["mysqld", "--bind-address=0.0.0.0", "--port=$PORT"]