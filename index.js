/**
 * Bismillah ar-Rahmaan ar-Raheem
 *
 * encr
 *
 * (c) 2020 Amrayn Web Services
 * (c) 2020 @abumusamq
 *
 * This library is released under the MIT Licence.
 *
 * https://amrayn.com
 */

const crypto = require('crypto');

class Encr {
  constructor(key, algorithm = 'aes-256-cbc') {
    this.key = crypto.createHash('sha256').update(key).digest('base64').substr(0, 32);
    this.algorithm = algorithm;
  }

  encrypt(buffer) {
    return new Promise((res, rej) => {
      try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
        res(Buffer.concat([iv, cipher.update(buffer), cipher.final()]));
      } catch (e) {
        rej(e);
      }
    });
  }

  decrypt(data) {
    return new Promise((res, rej) => {
      try {
        const iv = data.slice(0, 16);
        const encrypted = data.slice(16);
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
        res(Buffer.concat([decipher.update(encrypted), decipher.final()]));
      } catch (e) {
        rej(e);
      }
    });
  }
};

module.exports = Encr;
