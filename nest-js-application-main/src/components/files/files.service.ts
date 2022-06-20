import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { randomUUID } from 'crypto';

@Injectable()
export class FilesService {
  public async removeFile(
    postHash: string,
    fileName: string,
  ): Promise<boolean> {
    try {
      const filePath = path.resolve(
        __dirname,
        '..',
        '..',
        'static',
        'storage',
        'posts',
        postHash,
        `${fileName}`,
      );
      if (filePath) {
        fs.unlink(filePath, (err) => {
          if (err) {
            return false;
          }
        });
        return true;
      }
      return false;
    } catch (ex) {
      return false;
    }
  }

  public async removeFolder(post_hash: string): Promise<boolean> {
    try {
      const filePath = path.resolve(
        __dirname,
        '..',
        '..',
        'static',
        'storage',
        'posts',
        post_hash,
      );
      if (filePath) {
        fs.rmdirSync(filePath, { recursive: true });
        return true;
      }
      return false;
    } catch (ex) {
      console.log('removeFolder ex', ex);
      return false;
    }
  }

  public async updateFile(file: any, post_hash: string, image: string) {
    try {
      const filePath = path.resolve(
        __dirname,
        '..',
        '..',
        'static',
        'storage',
        'posts',
        post_hash,
      );
      const isExists = fs.existsSync(path.join(filePath, image));
      if (isExists && file !== void 0) {
        fs.unlink(path.join(filePath, image), (err) => {
          if (err) {
            return '';
          }
        });
        const newFilePath = `${randomUUID()}.png`;
        fs.writeFileSync(path.join(filePath, newFilePath), file.buffer, {
          mode: 777,
        });
        return newFilePath;
      }
      return '';
    } catch (ex) {
      console.log('updateFile ex', ex);
      console.log('updateFile ex', ex);
      return '';
    }
  }

  public async createFile(file, post_hash: string): Promise<string> {
    try {
      const fileName = randomUUID() + '.png';
      const filePath = path.resolve(
        __dirname,
        '..',
        '..',
        'static',
        'storage',
        'posts',
        post_hash || 'Empty',
      );
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, fileName), file[0].buffer, {
        mode: 777,
      });

      return fileName;
    } catch (e) {
      console.log(e);
      throw new HttpException(
        'Error on file uploading',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
