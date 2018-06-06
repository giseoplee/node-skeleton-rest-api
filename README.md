# node-skeleton-rest-api
Skeleton REST-API Server Convention By NodeJS(8.11.2) Express

## 1. Directory Structure Description

- Service : service directory is common module type functions (ex. redis connect, RDB transaction)
- Controller : controller directory is validate the request and branch to the model
- Model : modules that perform data transactions through the ORM
- Entity : entity directory is define entity objects to use ORM
- Utils : utility modules
- Config : configuration information