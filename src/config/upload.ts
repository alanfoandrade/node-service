import multer, { StorageEngine } from 'multer';
import path from 'path';
import { v4 as uuid } from 'uuid';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  config: {
    disk: Record<string, never>;
    s3: {
      bucket: string;
    };
  };

  driver: 's3' | 'disk';

  multer: {
    storage: StorageEngine;
  };

  tmpFolder: string;

  uploadsFolder: string;
}

export default {
  config: {
    disk: {},
    s3: {
      bucket: process.env.AWS_BUCKET_NAME,
    },
  },

  driver: process.env.STORAGE_DRIVER || 'disk',

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = uuid();
        const fileName = `${fileHash}-${file.originalname.replace(/\s+/g, '')}`;

        return callback(null, fileName);
      },
    }),
  },

  tmpFolder,

  uploadsFolder: path.resolve(tmpFolder, 'uploads'),
} as IUploadConfig;
