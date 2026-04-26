// @ts-nocheck
// This file was generated using Claude Sonnet 4.5 and cleaned up manually

// ─── JSDoc typedef shapes ─────────────────────────────────────────────────
// These describe the plain objects that cross the JS↔Swift bridge.

interface CryptoKeyObject {
  type: 'secret';
  algorithm: Object;
  extractable: boolean;
  usages: string[];
  _keyData: ArrayBuffer;
}

interface AesGcmParams {
  name: 'AES-GCM';
  iv: BufferSource;
  additionalData?: BufferSource;
  tagLength?: number;
}

interface AesCbcParams {
  name: 'AES-CBC';
  iv: BufferSource;
}

interface AesKeyGenParams {
  name: 'AES-GCM' | 'AES-CBC';
  length: 128 | 192 | 256;
}

interface HmacKeyGenParams {
  name: 'HMAC';
  hash: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';
  length?: number;
}

interface HkdfParams {
  name: 'HKDF';
  hash: 'SHA-256' | 'SHA-384' | 'SHA-512';
  salt: BufferSource;
  info: BufferSource;
}

interface Pbkdf2Params {
  name: 'PBKDF2';
  hash: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';
  salt: BufferSource;
  iterations: number;
}

interface Algorithm {
  name: string
  hash?: string | { name: string }
}

// ─── Helpers ──────────────────────────────────────────────────────────────

/**
 * Normalises an algorithm parameter.
 * Accepts a bare string (e.g. `"SHA-256"`) or an object (e.g. `{ name: "AES-GCM", iv: … }`).
 * Always returns a new plain object with at least `{ name: string }`.
 * `name` is upper-cased to match what Swift's `AlgorithmName` enum expects.
 */
function normaliseAlgorithm<T extends Algorithm>(algorithm: string | T): T & { name: string } {
  if (typeof algorithm === "string") {
    return { name: algorithm.toUpperCase() } as T;
  }

  const newAlg = {
    ...algorithm,
    name: algorithm.name.toUpperCase(),
  }

  if (typeof newAlg.hash === 'string') {
    newAlg.hash = newAlg.hash.toUpperCase()
  }

  if (typeof newAlg.hash === 'object' && newAlg.hash.name) {
    newAlg.hash.name = newAlg.hash.name.toUpperCase()
  }

  return newAlg;
}

/**
 * Converts any `BufferSource` to a plain `ArrayBuffer` suitable for crossing
 * the bridge via `Data.from(jsValue:)`.
 */
function toArrayBuffer(value: BufferSource | Array<any>): ArrayBuffer {
  if (value instanceof ArrayBuffer) {
    return value;
  }

  if (ArrayBuffer.isView(value)) {
    return value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength);
  }

  if (Array.isArray(value)) {
    return new Uint8Array(value).buffer;
  }

  throw new TypeError(
    "Expected BufferSource (ArrayBuffer or TypedArray), got " + typeof value
  );
}

/**
 * Coerces named `BufferSource` fields on `algObj` to `ArrayBuffer` so they
 * cross the bridge correctly. Skips missing / null / undefined fields.
 *
 * @param algObj - Mutable copy of a normalised algorithm object.
 * @param keys   - Field names to coerce (e.g. "iv", "salt", "info").
 * @returns `algObj` with named fields replaced by `ArrayBuffer`s.
 */
function coerceBufferFields<T extends Algorithm>(algObj: T, ...keys: (keyof T)[]): object {
  for (const key of keys) {
    if (algObj[key] != null) {
      // @ts-ignore
      algObj[key] = toArrayBuffer(algObj[key]);
    }
  }
  return algObj;
}

// ─── CryptoKey ────────────────────────────────────────────────────────────

/**
 * Thin wrapper conforming to the Web Crypto `CryptoKey` interface.
 *
 * Internally the key is just the plain `CryptoKeyObject` bridge shape.
 * `_keyData` is kept non-enumerable so it does not show up in plugin
 * `JSON.stringify` / `console.log` output, matching the spec's intent
 * that the raw bytes are opaque.
 */
class CryptoKey {
  type: 'secret';
  algorithm: object;
  extractable: boolean;
  usages: readonly string[];
  _keyData!: ArrayBuffer;

  constructor(keyData: ArrayBuffer, algorithm: object, extractable: boolean, usages: string[]) {
    this.type = "secret";
    this.algorithm = Object.freeze(Object.assign({}, algorithm));
    this.extractable = extractable;
    this.usages = Object.freeze(usages.slice());

    // Non-enumerable so it stays hidden from plugin introspection.
    Object.defineProperty(this, "_keyData", {
      value: keyData,
      writable: false,
      enumerable: false,
      configurable: false,
    });
  }

  get [Symbol.toStringTag]() { return "CryptoKey"; }

  /**
   * Serialises this key to the plain bridge object shape understood by Swift.
   * Called internally before every bridge call that takes a CryptoKey.
   *
   * @returns {CryptoKeyObject}
   */
  _bridgeObject(): CryptoKeyObject {
    return {
      type: this.type,
      algorithm: this.algorithm,
      extractable: this.extractable,
      usages: Array.from(this.usages),
      _keyData: this._keyData,
    };
  }
}

// ─── SubtleCrypto ─────────────────────────────────────────────────────────

class SubtleCryptoAPI {
  // ── digest ──────────────────────────────────────────────────────────────

  /**
   * @param {string|{name:string}} algorithm
   * @param {BufferSource}         data
   * @returns {Promise<ArrayBuffer>}
   */
  async digest(algorithm: string | { name: string; }, data: BufferSource): Promise<ArrayBuffer> {
    const alg = normaliseAlgorithm(algorithm);
    const buf = toArrayBuffer(data);

    return Application.crypto_digest(alg.name, buf)
  }

  // ── generateKey ─────────────────────────────────────────────────────────

  /**
   * @param {AesKeyGenParams|HmacKeyGenParams} algorithm
   * @param {boolean}  extractable
   * @param {string[]} keyUsages
   * @returns {Promise<CryptoKey>}
   */
  async generateKey(algorithm: AesKeyGenParams | HmacKeyGenParams, extractable: boolean, keyUsages: string[]): Promise<CryptoKey> {
    const alg = normaliseAlgorithm(algorithm);
    const key = Application.crypto_generateKey(alg, extractable, keyUsages)
    return cryptoKeyFromBridgeObject(key, alg)
  }

  // ── importKey ───────────────────────────────────────────────────────────

  /**
   * @param {'raw'|'jwk'}          format
   * @param {BufferSource|Object}  keyData   - Raw bytes for `"raw"`, JWK object for `"jwk"`.
   * @param {Object}               algorithm
   * @param {boolean}              extractable
   * @param {string[]}             keyUsages
   * @returns {Promise<CryptoKey>}
   */
  async importKey(format: 'raw' | 'jwk', keyData: BufferSource | object, algorithm: Algorithm, extractable: boolean, keyUsages: string[]): Promise<CryptoKey> {
    const alg = normaliseAlgorithm(algorithm);
    
    // "raw" → ArrayBuffer; "jwk" → pass the plain object as-is.
    const bridgeData = format === "jwk" ? Object.assign({}, keyData) : toArrayBuffer(keyData as BufferSource);
    const keyObject = await Application.crypto_importKey(format, bridgeData, alg, extractable, keyUsages)

    return cryptoKeyFromBridgeObject(keyObject, alg)
  }

  // ── exportKey ───────────────────────────────────────────────────────────

  /**
   * @param {'raw'|'jwk'} format
   * @param {CryptoKey}   key
   * @returns {Promise<ArrayBuffer|Object>}
   */
  async exportKey(format: 'raw' | 'jwk', key: CryptoKey): Promise<ArrayBuffer | object> {
    if (!(key instanceof CryptoKey)) throw new TypeError("key must be a CryptoKey");
    return Application.crypto_exportKey(format, key._bridgeObject())
  }

  // ── encrypt ─────────────────────────────────────────────────────────────

  /**
   * @param {AesGcmParams|AesCbcParams} algorithm
   * @param {CryptoKey}                 key
   * @param {BufferSource}              data
   * @returns {Promise<ArrayBuffer>}
   */
  async encrypt(algorithm: AesGcmParams | AesCbcParams, key: CryptoKey, data: BufferSource): Promise<ArrayBuffer> {
    if (!(key instanceof CryptoKey)) throw new TypeError("key must be a CryptoKey");

    const alg = coerceBufferFields(normaliseAlgorithm(algorithm), "iv", "additionalData" as any);
    const buf = toArrayBuffer(data);

    return Application.crypto_encrypt(alg, key._bridgeObject(), buf)
  }

  // ── decrypt ─────────────────────────────────────────────────────────────

  /**
   * @param {AesGcmParams|AesCbcParams} algorithm
   * @param {CryptoKey}                 key
   * @param {BufferSource}              data
   * @returns {Promise<ArrayBuffer>}
   */
  async decrypt(algorithm: AesGcmParams | AesCbcParams, key: CryptoKey, data: BufferSource): Promise<ArrayBuffer> {
    if (!(key instanceof CryptoKey)) throw new TypeError("key must be a CryptoKey");

    const alg = coerceBufferFields(normaliseAlgorithm(algorithm), "iv", "additionalData" as any);
    const buf = toArrayBuffer(data);

    return Application.crypto_decrypt(alg, key._bridgeObject(), buf);
  }

  // ── sign ────────────────────────────────────────────────────────────────

  /**
   * @param {string|{name:string}} algorithm  - e.g. `"HMAC"` or `{ name: "HMAC" }`.
   * @param {CryptoKey}            key
   * @param {BufferSource}         data
   * @returns {Promise<ArrayBuffer>}
   */
  async sign(algorithm: string | { name: string; }, key: CryptoKey, data: BufferSource): Promise<ArrayBuffer> {
    if (!(key instanceof CryptoKey)) throw new TypeError("key must be a CryptoKey");

    const alg = normaliseAlgorithm(algorithm);
    const buf = toArrayBuffer(data);

    return Application.crypto_sign(alg.name, key._bridgeObject(), buf);
  }

  // ── verify ──────────────────────────────────────────────────────────────

  /**
   * @param {string|{name:string}} algorithm
   * @param {CryptoKey}            key
   * @param {BufferSource}         signature
   * @param {BufferSource}         data
   * @returns {Promise<boolean>}
   */
  async verify(algorithm: string | { name: string; }, key: CryptoKey, signature: BufferSource, data: BufferSource): Promise<boolean> {
    if (!(key instanceof CryptoKey)) throw new TypeError("key must be a CryptoKey");

    const alg = normaliseAlgorithm(algorithm);
    const sig = toArrayBuffer(signature);
    const buf = toArrayBuffer(data);

    return Application.crypto_verify(alg.name, key._bridgeObject(), sig, buf);
  }

  // ── deriveBits ──────────────────────────────────────────────────────────

  /**
   * @param {HkdfParams|Pbkdf2Params} algorithm
   * @param {CryptoKey}               baseKey
   * @param {number}                  length  - Output bit-length.
   * @returns {Promise<ArrayBuffer>}
   */
  async deriveBits(algorithm: HkdfParams | Pbkdf2Params, baseKey: CryptoKey, length: number): Promise<ArrayBuffer> {
    if (!(baseKey instanceof CryptoKey)) throw new TypeError("baseKey must be a CryptoKey");

    const alg = coerceBufferFields(normaliseAlgorithm(algorithm), "salt", "info" as any);

    return Application.crypto_deriveBits(alg, baseKey._bridgeObject(), length);
  }

  // ── deriveKey ───────────────────────────────────────────────────────────

  /**
   * @param {HkdfParams|Pbkdf2Params}   algorithm
   * @param {CryptoKey}                 baseKey
   * @param {AesKeyGenParams|HmacKeyGenParams} derivedKeyAlgorithm
   * @param {boolean}                   extractable
   * @param {string[]}                  keyUsages
   * @returns {Promise<CryptoKey>}
   */
  async deriveKey(algorithm: HkdfParams | Pbkdf2Params, baseKey: CryptoKey, derivedKeyAlgorithm: AesKeyGenParams | HmacKeyGenParams, extractable: boolean, keyUsages: string[]): Promise<CryptoKey> {
    if (!(baseKey instanceof CryptoKey)) throw new TypeError("baseKey must be a CryptoKey");

    const alg = coerceBufferFields(normaliseAlgorithm(algorithm), "salt", "info" as any);
    const dkAlg = normaliseAlgorithm(derivedKeyAlgorithm);

    const key = await Application.crypto_deriveKey(alg, baseKey._bridgeObject(), dkAlg, extractable, keyUsages)

    return cryptoKeyFromBridgeObject(key, dkAlg)
  }

  // ── wrapKey / unwrapKey (not supported) ─────────────────────────────────

  wrapKey() { return Promise.reject(new Error("wrapKey is not supported")); }
  unwrapKey() { return Promise.reject(new Error("unwrapKey is not supported")); }

  get [Symbol.toStringTag]() { return "SubtleCrypto"; }
}

// ─── Crypto ───────────────────────────────────────────────────────────────

class CryptoAPI {
  subtle: SubtleCryptoAPI;
  constructor() { this.subtle = new SubtleCryptoAPI(); }

  /**
   * Fills `typedArray` with cryptographically random values in-place and
   * returns the same array, matching the Web Crypto spec.
   *
   * @template {Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array} T
   * @param {T} typedArray
   * @returns {T}
   */
  getRandomValues<T>(typedArray: T): T {
    if (!ArrayBuffer.isView(typedArray)) {
      throw new TypeError("getRandomValues requires a TypedArray");
    }
    if (typedArray.byteLength > 65536) {
      throw new Error("The ArrayBufferView's byte length exceeds the quota (65536)");
    }
    // crypto_getRandomValues is synchronous (JSThrowing) and returns an ArrayBuffer.
    const randomBuf = Application.crypto_getRandomValues(typedArray.byteLength);
    new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength)
      .set(new Uint8Array(randomBuf));
    return typedArray;
  }

  /**
   * Returns a cryptographically random RFC 4122 v4 UUID string.
   * @returns {string}
   */
  randomUUID(): string {
    const b = new Uint8Array(16);
    this.getRandomValues(b);
    b[6] = (b[6]! & 0x0f) | 0x40; // version 4
    b[8] = (b[8]! & 0x3f) | 0x80; // variant bits
    const h = Array.from(b, x => x.toString(16).padStart(2, "0"));
    return `${h.slice(0, 4).join("")}-${h.slice(4, 6).join("")}-${h.slice(6, 8).join("")}-${h.slice(8, 10).join("")}-${h.slice(10).join("")}`;
  }

  get [Symbol.toStringTag]() { return "Crypto"; }
}

// ─── Internal helpers ─────────────────────────────────────────────────────

/**
 * Reconstructs a `CryptoKey` from the plain bridge object returned by the
 * native layer after `generateKey`, `importKey`, or `deriveKey`.
 * The native layer echoes back the same `CryptoKeyObject` shape it received,
 * with `_keyData` set to the (possibly generated) raw key bytes.
 *
 * @param {CryptoKeyObject} obj  - Plain object from the native layer.
 * @param {Object}          alg  - Normalised algorithm used for this operation.
 * @returns {CryptoKey}
 */
function cryptoKeyFromBridgeObject(obj: CryptoKeyObject, alg: object): CryptoKey {
  return new CryptoKey(obj._keyData, alg, obj.extractable, obj.usages);
}
