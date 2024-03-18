// Task 5 - FilesController.js

import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';

const FilesController = {
  async postUpload(req, res) {
    const { name, type, parentId, isPublic, data } = req.body;

    // Check if name is missing
    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }

    // Check if type is missing or not accepted
    if (!type || !['folder', 'file', 'image'].includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }

    // Check if data is missing for non-folder types
    if (type !== 'folder' && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }

    // Retrieve user based on the token (you'll need to implement this logic)
    const user = getUserFromToken(req.token);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if parentId is set
    if (parentId) {
      const parentFile = await File.findById(parentId);

      if (!parentFile) {
        return res.status(400).json({ error: 'Parent not found' });
      }

      if (parentFile.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }

    // Save the file locally
    let localPath = '';
    if (type !== 'folder') {
      if (!fs.existsSync(FOLDER_PATH)) {
        fs.mkdirSync(FOLDER_PATH, { recursive: true });
      }

      localPath = path.join(FOLDER_PATH, `${uuidv4()}.dat`);
      const fileContent = Buffer.from(data, 'base64');
      fs.writeFileSync(localPath, fileContent);
    }

    // Create the file document
    const file = new File({
      userId: user._id,
      name,
      type,
      parentId: parentId || 0,
      isPublic: isPublic || false,
      localPath,
    });

    await file.save();

    return res.status(201).json(file);
  },
};

module.exports = FilesController;
