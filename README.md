# PROJECT: Atlas Files manager

## DESCRIPTION

This project is a summary of this back-end trimester: authentication, NodeJS, MongoDB, Redis, pagination, and background processing.

The objective is to build a simple platform to upload and view files:

* User authentication via a token
* List all files
* Upload a new file
* Change permission of a file
* View a file
* Generate thumbnails for images

## PROVIDED FILES

`package.json`, `.eslintrc.js`, `babel.config.js`

## TASKS

### 0. Redis utils - `utils/redis.js`

### 1. MongoDB utils - `utils/db.js`

### 2. First API - `server.js`, `routes/index.js`, `controllers/AppController.js`

### 3. Create a new user - `utils/`, `routes/index.js`, `controllers/UsersController.js`

### 4. Authenticate a user - `utils/`, `routes/index.js`, `controllers/UsersController.js`, `controllers/AuthController.js`

### 5. First file - `utils/`, `routes/index.js`, `controllers/FilesController.js`

### 6. Get and list file - `utils/`, `routes/index.js`, `controllers/FilesController.js`

### 7. File publish/unpublish - `utils/`, `routes/index.js`, `controllers/FilesController.js`

### 8. File data - `utils/`, `routes/index.js`, `controllers/FilesController.js`

### 9. Image Thumbnails - `utils/`, `controllers/FilesController.js`, `worker.js`

## AUTHORS

Caramon Hofstetter and Evan Richardson