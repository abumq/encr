#!/usr/bin/env node

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

const fs = require('fs');
const resolve = require('path').resolve;
const minimist = require('minimist');
const inquirer = require('inquirer');
const packageJson = require('./package.json');
const Encr = require('./');

const args = minimist(process.argv);

function displayVersion() {
  console.log(`encr v${packageJson.version}\n${packageJson.description}\nhttps://github.com/abumq/encr\n\n(c) 2020 @abumq (Majid Q.)`);
}

if (args.v) {
  displayVersion();
  process.exit(0);
}

if (args.h) {
  displayVersion();
  console.log(`
encr [-d] -i <input> -o <output> [--force] [--key <secret>] [--alg <algorithm>]
encr -g <length>

-i\tInput file - this can be encrypted or plain data file
-o\tOutput file. If this option is 'stdout' it is output as string. Do not use this option to store to file as this will corrupt the encoding of buffer
-d\tUse this option to decrypt the input [Default option is to encrypt]
--key\tThe secret key to use for encryption. Alternatively you can provide environment variable 'ENCR_SECRET'.
--force\tIf output file already exists, use this option to overwrite.
--alg\tEncryption algorithm to use. **It defaults to AES-256 CBC**

You can look at this table at https://github.com/abumq/encr
`);
  process.exit(0);
}

const isGenerate = typeof args.g !== 'undefined';
const isDecrypt = typeof args.d !== 'undefined';
const overwrite = typeof args.force !== 'undefined';

// encryption/decryption
if (!isGenerate && !args.i) {
  console.error('ERROR: Input file not specified [encr -i encrypted-file.inc]');
  process.exit(1);
}

if (!isGenerate && !fs.existsSync(args.i)) {
  console.error('ERROR: File [%s] does not exist', args.i);
  process.exit(1);
}

if (!isGenerate && fs.existsSync(args.o) && !overwrite) {
  console.error('ERROR: File [%s] already exists. [use --force]', args.o);
  process.exit(1);
}

if (!isGenerate && !args.o) {
  console.error('ERROR: Output destination not specified');
  process.exit(1);
}

let secret = args.key || process.env.ENCR_SECRET;

if (isGenerate) {
  start();
} else if (secret) {
  if (args.key && args.o !== 'stdout') {
    console.warn('WARNING: It is not a good practice to use CLI or environment variables for secrets\n');
  }
  start();
} else {
  inquirer.prompt([
      {
        name: 'secret',
        message: 'Enter encryption secret. [you can also set in environment variables ENCR_SECRET]',
        type: 'password',
      },
    ],
  ).then((answers) => {
    secret = answers.secret;
    start();
  });
}

function start() {

  const handleException = e => {
    console.error(e.message || 'Unknown error occurred');
    process.exit(1);
  }

  if (isGenerate) {
    const encr = new Encr();
    encr.generateNonce(args.g ? Number(args.g) : undefined).then(console.log).catch(handleException);
    return;
  }

  if (!secret) {
    console.error('Secret not specified');
    process.exit(1);
  }

  const data = fs.readFileSync(resolve(args.i));

  const encr = new Encr(secret, args.alg);

  const finalize = async buf => {
    if (args.o === 'stdout') {
      console.log(buf.toString());
    } else {
      fs.writeFileSync(args.o, buf);
    }
  };

  if (isDecrypt) {
    encr.decrypt(data).then(finalize).then(() => {
      if (args.o !== 'stdout') {
        console.log('Decrypted successfully! %s bytes', fs.statSync(args.o).size);
      }
    }).catch(handleException);
  } else {
    encr.encrypt(data).then(finalize).then(() => {
      if (args.o !== 'stdout') {
        console.log('Encrypted successfully! %s bytes', fs.statSync(args.o).size);
      }
    }).catch(handleException);
  }
}
