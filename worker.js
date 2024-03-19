const Queue = require('bull');
const imageThumbnail = require('image-thumbnail');
const fs = require('fs');
const { ObjectId } = require('mongodb');
const dbClient = require('./utils/db');
// const redisClient = require('./utils/redis');

const fileQueue = new Queue('fileQueue', process.env.REDIS_URL || 'redis://127.0.0.1:6379');

// eslint-disable-next-line consistent-return
fileQueue.process(async (job, done) => {
  const { userId, fileId } = job.data;

  if (!fileId || !userId) {
    return done(new Error('Missing fileId or userId'));
  }

  const file = await dbClient.db.collection('files').findOne({
    _id: new ObjectId(fileId),
    userId: new ObjectId(userId),
  });

  if (!file) {
    return done(new Error('File not found'));
  }

  const sizes = [500, 250, 100];
  try {
    sizes.forEach(async (size) => {
      const thumbnail = await imageThumbnail(file.localPath, { width: size });
      const thumbnailPath = `${file.localPath}_${size}`;
      fs.writeFileSync(thumbnailPath, thumbnail);
    });
    done();
  } catch (error) {
    done(error);
  }
});

module.exports = { fileQueue };
