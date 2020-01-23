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
  console.log(`encr v${packageJson.version}\n${packageJson.description}\nhttps://github.com/amrayn/encr\n\nWritten by Majid (@abumusamq)\n(c) Amrayn Web Services\nhttps://amrayn.com`);
}

if (args.v) {
  displayVersion();
  process.exit(0);
}

if (args.h) {
  displayVersion();
  console.log(`
-i\tInput file - this can be encrypted or plain data file
-o\tOutput file
-d\tUse this option to decrypt the input [Default option is to encrypt]
--key\tThe secret key to use for encryption. Alternatively you can provide environment variable 'ENCR_SECRET'. If none of these options are provided then you will be securely asked for the key
--overwrite\tIf output file already exists, use this option to overwrite. Alternatively you can set environment variable 'OVERWRITE_ENCR_FILES' to 'true' if you do not want to provide this option
--alg\tEncryption algorithm to use. List depends upon OpenSSL (as per Node.js docs) Run 'openssl list -cipher-algorithms' to choose the possible option. **It defaults to AES-256 CBC**
--encoding\tNode.js character encoding option for the output - see complete list here: https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings

You can look at this table at https://github.com/amrayn/encr
`);
  process.exit(0);
}

const isDecrypt = typeof args.d !== 'undefined';
const overwrite = typeof args.overwrite !== 'undefined'
  || process.env.OVERWRITE_ENCR_FILES === 'true';

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

  const finalize = async result => {
    fs.writeFileSync(args.o, result.toString(args.encoding || 'utf8'));
  };

  const handleException = e => {
    console.error('Error occurred: %s', e.message);
  }

  if (isDecrypt) {
    encr.decrypt(data).then(finalize).then(() => {
      console.log('Decrypted successfully! %s bytes', fs.statSync(args.o).size);
    }).catch(handleException);
  } else {
    encr.encrypt(data).then(finalize).then(() => {
      console.log('Encrypted successfully! %s bytes', fs.statSync(args.o).size);
    }).catch(handleException);
  }
}
