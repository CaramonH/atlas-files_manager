const express = require('express');

const router = express.Router();

// Require controllers
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');
const FilesController = require('../controllers/FilesController');

// API Endpoints

// This checks the status of redis and the db
router.get('/status', AppController.getStatus);
// This tells you the stats of how many users and files there are
router.get('/stats', AppController.getStats);
// This creates a new user
router.post('/users', UsersController.postNew);
// This signs-in the user by generating a new authentication token
router.get('/connect', AuthController.getConnect);
// This signs-out the user based on the token
router.get('/disconnect', AuthController.getDisconnect);
// This retrieves the user based on the token used
// weirdly I think they had a typo and wanted UserController instead of UsersController
router.get('/users/me', UsersController.getMe);
// This retrieves the file based on the data provided in the request body
router.post('/files', FilesController.postUpload);
// This retrieves a specific file by its ID
router.get('/files/:id', FilesController.getShow);
// This retrieves all files
router.get('/files', FilesController.getIndex);
// This publishes a file
router.put('/files/:id/publish', FilesController.putPublish);
// This unpublish a file
router.put('/files/:id/unpublish', FilesController.putUnpublish);
// This should return the content of the file document based on the ID
router.get('/files/:id/data', FilesController.getFile);

module.exports = router;
