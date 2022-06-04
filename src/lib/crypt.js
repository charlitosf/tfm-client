const AES_IV_LENGTH = 16;

export default class Crypt {

    // Encode uint8 array to base64
    static encodeBase64(bytes) {
        return btoa(String.fromCharCode.apply(null, bytes));
        // return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
    }

    // Decode base64 to uint8 array
    static decodeBase64(str) {
        return Uint8Array.from(atob(str), c => c.charCodeAt(0))
        // return new Uint8Array(str.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    }

    // Encode a utf8 string to byte array
    static utf8Encode(str) {
        const encoder = new TextEncoder();
        return encoder.encode(str);
    }

    // Decode a byte array to a utf8 string
    static utf8Decode(bytes) {
        const decoder = new TextDecoder();
        return decoder.decode(bytes);
    }

    // Export key to raw format base64 encoded
    static async exportKey(key) {
        let rawKey = await window.crypto.subtle.exportKey('raw', key);
        return this.encodeBase64(new Uint8Array(rawKey));
    }

    // Import key from an ArrayBuffer
    static importKey(key) {
        return crypto.subtle.importKey(
            "raw",
            key,
            {
                name: "AES-CTR",
                length: 256,
            },
            false,
            ["encrypt", "decrypt"]
        );
    }

    // Encrypts a string using the AES-256 algorithm with subtle crypto.
    // @param {string} str - The string to encrypt encoded in utf8.
    // @param {string} key - The key to use for encryption.
    // @returns {string} The encrypted string in byte array.
    static async encryptAES(str, key) {
        const counter = crypto.getRandomValues(new Uint8Array(AES_IV_LENGTH));
        const bytes = Crypt.utf8Encode(str);        

        // Concat counter and bytes
        const totalBytes = new Uint8Array(counter.length + bytes.length);
        totalBytes.set(counter);
        
        let ciphertext = await crypto.subtle.encrypt(
            {
                name: "AES-CTR",
                counter,
                length: AES_IV_LENGTH * 4,
            },
            key,
            bytes
        );
        ciphertext = new Uint8Array(ciphertext);
        totalBytes.set(ciphertext, counter.length);
        return totalBytes;
    }

    // Encrypts a Uint8Array using the AES-256 algorithm with subtle crypto.
    // @param {ArrayBuffer} bytes - The bytes to encrypt.
    // @param {CryptoKey} key - The key to use for encryption.
    // @returns {Uint8Array} The encrypted bytes.
    static async encryptAESBuffer(bytes, key) {
        const counter = crypto.getRandomValues(new Uint8Array(AES_IV_LENGTH));
        // Concat counter and bytes
        const totalBytes = new Uint8Array(counter.length + bytes.length);
        totalBytes.set(counter);
        
        let ciphertext = await crypto.subtle.encrypt(
            {
                name: "AES-CTR",
                counter,
                length: AES_IV_LENGTH * 4,
            },
            key,
            bytes
        );
        ciphertext = new Uint8Array(ciphertext);
        totalBytes.set(ciphertext, counter.length);
        return totalBytes;
    }


    // Decrypts a string using the AES-256 algorithm with subtle crypto.
    // @param {string} str - The bytes to decrypt.
    // @param {string} key - The key to use for decryption.
    // @returns {string} The decrypted string in utf8.
    static async decryptAES(bytes, key) {
        const plaintext = await crypto.subtle.decrypt(
            {
                name: "AES-CTR",
                counter: bytes.slice(0, AES_IV_LENGTH),
                length: 64,
            },
            key,
            bytes.slice(AES_IV_LENGTH)
        );
        return this.utf8Decode(new Uint8Array(plaintext));
    }

    // Decrypts a Uint8Array using the AES-256 algorithm with subtle crypto.
    // @param {Uint8Array} bytes - The bytes to decrypt.
    // @param {CryptoKey} key - The key to use for decryption.
    // @returns {Uint8Array} The decrypted bytes.
    static async decryptAESBuffer(bytes, key) {
        const plaintext = await crypto.subtle.decrypt(
            {
                name: "AES-CTR",
                counter: bytes.slice(0, AES_IV_LENGTH),
                length: 64,
            },
            key,
            bytes.slice(AES_IV_LENGTH)
        );
        return new Uint8Array(plaintext);
    }

    // Generate a pair of RSA keys
    static async generateRSAKeyPair() {
        return crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: { name: "SHA-256" },
            },
            true,
            ["encrypt", "decrypt"]
        );
    }

    // Encrypts a string using the RSA algorithm with subtle crypto.
    // @param {string} str - The string to encrypt encoded in utf8.
    // @param {CryptoKey} key - The key to use for encryption.
    // @returns {string} The encrypted string in base 64.
    static async encryptRSA(str, key) {
        const bytes = this.utf8Encode(str);
        const ciphertext = await crypto.subtle.encrypt(
            {
                name: "RSA-OAEP",
            },
            key,
            bytes
        );
        return this.encodeBase64(new Uint8Array(ciphertext));
    }

    // Decrypts a string using the RSA algorithm with subtle crypto.
    // @param {string} str - The string to decrypt encoded in base 64.
    // @param {CryptoKey} key - The key to use for decryption.
    // @returns {string} The decrypted string in utf8.
    static async decryptRSA(str, key) {
        const bytes = Crypt.utf8Encode(str);
        const plaintext = await crypto.subtle.decrypt(
            {
                name: "RSA-OAEP",
            },
            key,
            bytes
        );
        return this.utf8Decode(new Uint8Array(plaintext));
    }

    // Digest using SHA-512 with subtle crypto.
    // @param {string} str - The string to digest encoded in utf8.
    // @returns {string} The digest in uint8array.
    static async digestSHA512(str) {
        const bytes = this.utf8Encode(str);
        const digest = await crypto.subtle.digest(
            {
                name: "SHA-512",
            },
            bytes
        );
        return new Uint8Array(digest);
    }

    // Wrap private rsa key with symmetric key
    static async encodeRSAPrivateKey(key, symKey) {
        const exportedKey = await crypto.subtle.exportKey(
            "pkcs8",
            key
        );
        const encryptedKey = await this.encryptAES(this.encodeBase64(new Uint8Array(exportedKey)), symKey);
        return this.encodeBase64(encryptedKey);
    }

    // Unwrap private rsa key with symmetric key
    static async decodeRSAPrivateKey(wrappedKey, symKey) {
        const encryptedKey = this.decodeBase64(wrappedKey);
        const decryptedKey = await this.decryptAES(encryptedKey, symKey);
        const decodedKey = this.decodeBase64(decryptedKey);

        return crypto.subtle.importKey(
            "pkcs8",
            decodedKey,
            {
                name: "RSA-OAEP",
                hash: "SHA-256" ,
            },
            true,
            ["decrypt"]
        );
    }

    // Export public rsa key
    static async exportRSAPublicKey(key) {
        const exportedKey = await crypto.subtle.exportKey(
            "spki",
            key
        );
        return this.encodeBase64(new Uint8Array(exportedKey));
    }

    // Import public rsa key
    static async importRSAPublicKey(key) {
        const decodedKey = this.decodeBase64(key);
        return crypto.subtle.importKey(
            "spki",
            decodedKey,
            {
                name: "RSA-OAEP",
                hash: "SHA-256",
            },
            false,
            ["encrypt"]
        );
    }


    // Create AES-256 key from raw bytes
    static async createKeyFromRaw(bytes, algorithm = "AES-CTR") {
        return crypto.subtle.importKey(
            "raw",
            bytes,
            {
                name: algorithm,
            },
            true,
            ["encrypt", "decrypt"]
        );
    }
}