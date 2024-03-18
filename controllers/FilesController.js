// Task 5 and 6 - FilesController.js

const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const { ObjectId } = require('mongodb');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class FilesController {
  static async postUpload(req, res) {
    // Get the user ID from Redis based on the token
    const token = req.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      console.log('No userId or invalid');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Extract relevant data from the request body
    const {
      name, type, parentId = '0', isPublic = false, data,
    } = req.body;

    // Validate the request body
    if (!name) {
      console.log('Missing name');
      return res.status(400).json({ error: 'Missing name' });
    }
    if (!type || !['folder', 'file', 'image'].includes(type)) {
      console.log('Missing type');
      return res.status(400).json({ error: 'Missing type' });
    }
    if (!data && type !== 'folder') {
      console.log('Missing data');
      return res.status(400).json({ error: 'Missing data' });
    }

    // Check if a parent file is specified
    let parentFile = null;
    if (parentId !== '0') {
      parentFile = await dbClient.db.collection('files').findOne({ _id: new ObjectId(parentId) });
      if (!parentFile) {
        console.log('Parent not found');
        return res.status(400).json({ error: 'Parent not found' });
      }
      if (parentFile.type !== 'folder') {
        console.log('Parent is not a folder');
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }

    // Prepare the file data to be saved
    const fileData = {
      userId: new ObjectId(userId),
      name,
      type,
      isPublic,
      parentId: parentId !== '0' ? new ObjectId(parentId) : 0,
    };

    // If the file type is not a folder, save the file locally
    if (type !== 'folder') {
      const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      const fileName = uuidv4();
      const filePath = path.join(folderPath, fileName);

      const fileBuffer = Buffer.from(data, 'base64');
      fs.writeFileSync(filePath, fileBuffer);

      fileData.localPath = filePath;
    }

    // Insert the file data into the database
    const newFile = await dbClient.db.collection('files').insertOne(fileData);

    // Return the response
    console.log('newFile is:', newFile);
    return res.status(201).json({
      id: newFile.insertedId,
      userId: fileData.userId,
      name: fileData.name,
      type: fileData.type,
      isPublic: fileData.isPublic,
      parentId: fileData.parentId,
      ...(type !== 'folder' && { localPath: fileData.localPath }),
    });
  }

  // Get a specific file by ID
  static async getShow(req, res) {
    const token = req.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      console.log('No userId or invalid');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const fileId = req.params.id;
    const file = await dbClient.db.collection('files').findOne({ _id: new ObjectId(fileId), userId: new ObjectId(userId) });
    if (!file) {
      console.log('File not found');
      return res.status(404).json({ error: 'Not found' });
    }

    return res.status(200).json(file);
  }

  // Get all files with pagination
static async getIndex(req, res) {
    const token = req.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Default values for pagination
    let parentId = '0';
    const perPage = 20;
    const skipAmount = 0;

    try {
        // Construct the query based on userId and parentId
        const query = { userId: new ObjectId(userId), parentId };

        // Retrieve files based on the query with pagination
        const files = await dbClient.db.collection('files')
            .find(query)
            .limit(perPage)
            .skip(skipAmount)
            .toArray();

        // Prepare the response data
        const response = files.map((file) => ({
            id: file._id.toString(),
            userId: file.userId.toString(),
            name: file.name,
            type: file.type,
            isPublic: file.isPublic,
            parentId: file.parentId.toString(),
        }));

        // Return the response
        return res.json(response);
    } catch (error) {
        console.error('Error in getIndex:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = FilesController;
