# encr
Simple promise based encryption wrapper for Node.js and CLI based on crypto module

<p align="center">
    •   •   •
</p>

<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/encr">
    <img alt="" src="https://img.shields.io/npm/v/encr.svg?style=for-the-badge&labelColor=000000">
  </a>
  <a aria-label="License" href="https://github.com/abumq/encr/blob/master/LICENSE">
    <img alt="" src="https://img.shields.io/npm/l/encr?style=for-the-badge&labelColor=000000">
  </a>
</p>

<p align="center">
    •   •   •
</p>

## Installation

```bash
npm i encr -S
```

```bash
yarn add encr
```

## CLI

```bash
## Encrypt
encr -i <input> -o <output> [--force] [--key <secret>] [--alg <algorithm>]

## Decrypt
encr -d -i <input> -o <output> [--force] [--key <secret>] [--alg <algorithm>]

## Random generator of length (default = 32)
encr -g <length>
```

### Arguments

| **Arg** | **Description** |
|--|--|
| `-i` | Input file - this can be encrypted or plain data file |
| `-o` | Output file. If this option is `stdout` it is output as string. Do not use this option to store to file as this will corrupt the encoding of buffer |
| `-d` | Use this option to decrypt the input|
| `-g` | Generate nonce|
| `--key` | The secret key to use for encryption. Alternatively you can provide environment variable `ENCR_SECRET`. If none of these options are provided then you will be securely asked for the key |

Optional arguments

| **Arg** | **Description** |
|--|--|
| `--force` | If output file already exists, use this option to overwrite. |
| `--alg` | Encryption algorithm to use. List depends upon OpenSSL (as per Node.js docs) Run `openssl list -cipher-algorithms` to choose the possible option. You must choose 256 bit option for correct key length. **It defaults to AES-256 CBC** |
| `-h` | Display this list of options for convenience |
| `-v` | Display version information |

## API
```
const Encr = require('encr');

const encr = new Encr('MySecret');
const plain = Buffer.from('Hello world');

encr.encrypt(plain).then(encrypted => {
  console.log('Encrypted:', encrypted.toString('base64'));
  return encr.decrypt(encrypted);
}).then(decrypted => {
  console.log('Decrypted:', decrypted.toString());
})
```

## License
```
Copyright (c) 2020 @abumq

https://github.com/abumq/

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
