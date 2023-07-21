// Bismillah ar-Rahmaan ar-Raheem
// 
// encr - Simple promise based encryption wrapper for Node.js and CLI based on crypto module
//
// (c) 2020 @abumq (Majid Q.)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const crypto = require('crypto');

const CHARSET = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._~';

class Encr {
  constructor(key, algorithm = 'aes-256-cbc') {
    if (key) {
      this.key = crypto.createHash('sha256').update(key).digest('base64').substr(0, 32);
      this.algorithm = algorithm;
    }
  }

  async encrypt(buffer) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    return Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
  }

  async decrypt(data) {
    const iv = data.slice(0, 16);
    const encrypted = data.slice(16);
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]);
  }

  async generateNonce(length = 32) {
    if (length === 0) {
      return '';
    }
    const result = [];
    crypto.randomBytes(length).forEach(c => result.push(CHARSET[c % CHARSET.length]));
    return result.join('');
  }
};

module.exports = Encr;
