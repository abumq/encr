#!/usr/bin/env node

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

const fs = require('fs');
const resolve = require('path').resolve;
const minimist = require('minimist');
const inquirer = require('inquirer');
const packageJson = require('./package.json');
const Encr = require('./');

const args = minimist(process.argv);

function displayVersion() {
  console.log(`encr v${packageJson.version}\n${packageJson.description}\nhttps://github.com/amrayn/encr\n\n(c) Amrayn Web Services\nhttps://amrayn.com`);
}

if (args.v) {
  displayVersion();
  process.exit(0);
}

if (args.h) {
  displayVersion();
  console.log(`
encr [-d] -i <input> -o <output> [--force] [--key <secret>] [--alg <algorithm>]

-i\tInput file - this can be encrypted or plain data file
-o\tOutput file. If this option is 'stdout' it is output as string. Do not use this option to store to file as this will corrupt the encoding of buffer
-d\tUse this option to decrypt the input [Default option is to encrypt]
--key\tThe secret key to use for encryption. Alternatively you can provide environment variable 'ENCR_SECRET'.
--force\tIf output file already exists, use this option to overwrite.
--alg\tEncryption algorithm to use. **It defaults to AES-256 CBC**

You can look at this table at https://github.com/amrayn/encr
`);
  process.exit(0);
}

const isDecrypt = typeof args.d !== 'undefined';
const overwrite = typeof args.force !== 'undefined';

if (!args.i) {
  console.error('ERROR: Input file not specified [encr -i encrypted-file.inc]');
  process.exit(1);
}

if (!fs.existsSync(args.i)) {
  console.error('ERROR: File [%s] does not exist', args.i);
  process.exit(1);
}

if (fs.existsSync(args.o) && !overwrite) {
  console.error('ERROR: File [%s] already exists. [use --overwrite]', args.o);
  process.exit(1);
}

let secret = args.key || process.env.ENCR_SECRET;

if (secret) {
  if (args.key) {
    console.warn('WARNING: It is not a good practice to use CLI for secrets\n');
  }
  start();
} else {
  inquirer.prompt([
      {
        name: 'secret',
        message: 'Enter encryption secret. [you can also set in env variable ENCR_SECRET]',
        type: 'password',
      },
    ],
  ).then((answers) => {
    secret = answers.secret;
    start();
  });
}

function start() {

  if (!secret) {
    console.error('Secret not specified');
    process.exit(1);
  }

  const data = fs.readFileSync(args.i);

  const encr = new Encr(secret, args.alg);

  const finalize = async buf => {
    if (args.o === 'stdout') {
      console.log(buf.toString());
    } else {
      fs.writeFileSync(args.o, buf);
    }
  };

  const handleException = e => {
    console.error(e.message || 'Unknown error occurred');
    process.exit(1);
  }

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
