# encr
Simple promise based 256-bit encryption wrapper for Node.js

```
yarn add encr
```

<br>

[![Donate](https://amrayn.github.io/donate.png?v2)](https://amrayn.com/donate)

## CLI

```
encr [-d] -i <input> -o <output> [--overwrite] [--key <secret>] [--alg <algorithm>]
```

### Arguments

| **Arg** | **Description** |
|--|--|
| `-i` | Input file - this can be encrypted or plain data file |
| `-o` | Output file. If this option is `stdout` it is output as string. Do not use this option to store to file as this will corrupt the encoding of buffer |
| `-d` | Use this option to decrypt the input|
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
The MIT License (MIT)

Copyright (c) 2020 Amrayn Web Services
Copyright (c) 2020 @abumusamq

https://github.com/amrayn/
https://amrayn.com

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

```
