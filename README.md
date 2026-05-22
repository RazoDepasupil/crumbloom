# yumis-web
Crumb-Bloom


docker run --name mysql-container \
-e MYSQL_ROOT_PASSWORD=root123 \
-e MYSQL_DATABASE=myapp \
-p 3306:3306 \
-d mysql:8.0