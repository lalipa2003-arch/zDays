// AssemblyScript core block cipher and helpers (compiles to WASM)

function gcd(a: u32, b: u32): u32 {
    return b === 0 ? a : gcd(b, a % b);
}

const TEMP_PERMUTE_PTR = memory.data(4096);

function permute(block: usize, len: u32): void {
    if (len > 4096) return;
    let stride: u32 = 5;
    while (gcd(stride, len) !== 1) stride++;

    for (let i: u32 = 0; i < len; i++) {
        store<u8>(TEMP_PERMUTE_PTR + ((i * stride) % len), load<u8>(block + i));
    }
    for (let i: u32 = 0; i < len; i++) {
        store<u8>(block + i, load<u8>(TEMP_PERMUTE_PTR + i));
    }
}

const TEMP_INV_PERMUTE_PTR = memory.data(4096);

function inversePermute(block: usize, len: u32): void {
    if (len > 4096) return;
    let stride: u32 = 5;
    while (gcd(stride, len) !== 1) stride++;

    for (let i: u32 = 0; i < len; i++) {
        store<u8>(TEMP_INV_PERMUTE_PTR + i, load<u8>(block + ((i * stride) % len)));
    }
    for (let i: u32 = 0; i < len; i++) {
        store<u8>(block + i, load<u8>(TEMP_INV_PERMUTE_PTR + i));
    }
}

function diffuse(block: usize, len: u32): void {
    if (len < 16) return;
    let a = load<u32>(block + 0);
    let b = load<u32>(block + 4);
    let c = load<u32>(block + 8);
    let d = load<u32>(block + 12);

    // Iteration 1
    a = (a + b) | 0; d = (d ^ a) | 0; d = (d << 16 | d >>> 16) | 0;
    c = (c + d) | 0; b = (b ^ c) | 0; b = (b << 12 | b >>> 20) | 0;
    a = (a + b) | 0; d = (d ^ a) | 0; d = (d << 8 | d >>> 24) | 0;
    c = (c + d) | 0; b = (b ^ c) | 0; b = (b << 7 | b >>> 25) | 0;

    // Iteration 2
    a = (a + b) | 0; d = (d ^ a) | 0; d = (d << 16 | d >>> 16) | 0;
    c = (c + d) | 0; b = (b ^ c) | 0; b = (b << 12 | b >>> 20) | 0;
    a = (a + b) | 0; d = (d ^ a) | 0; d = (d << 8 | d >>> 24) | 0;
    c = (c + d) | 0; b = (b ^ c) | 0; b = (b << 7 | b >>> 25) | 0;

    // Iteration 3
    a = (a + b) | 0; d = (d ^ a) | 0; d = (d << 16 | d >>> 16) | 0;
    c = (c + d) | 0; b = (b ^ c) | 0; b = (b << 12 | b >>> 20) | 0;
    a = (a + b) | 0; d = (d ^ a) | 0; d = (d << 8 | d >>> 24) | 0;
    c = (c + d) | 0; b = (b ^ c) | 0; b = (b << 7 | b >>> 25) | 0;

    // Iteration 4
    a = (a + b) | 0; d = (d ^ a) | 0; d = (d << 16 | d >>> 16) | 0;
    c = (c + d) | 0; b = (b ^ c) | 0; b = (b << 12 | b >>> 20) | 0;
    a = (a + b) | 0; d = (d ^ a) | 0; d = (d << 8 | d >>> 24) | 0;
    c = (c + d) | 0; b = (b ^ c) | 0; b = (b << 7 | b >>> 25) | 0;

    store<u32>(block + 0, a);
    store<u32>(block + 4, b);
    store<u32>(block + 8, c);
    store<u32>(block + 12, d);
}

function inverseDiffuse(block: usize, len: u32): void {
    if (len < 16) return;
    let a = load<u32>(block + 0);
    let b = load<u32>(block + 4);
    let c = load<u32>(block + 8);
    let d = load<u32>(block + 12);

    // Inverse Iteration 4
    b = (b >>> 7 | b << 25) | 0; b = (b ^ c) | 0; c = (c - d) | 0;
    d = (d >>> 8 | d << 24) | 0; d = (d ^ a) | 0; a = (a - b) | 0;
    b = (b >>> 12 | b << 20) | 0; b = (b ^ c) | 0; c = (c - d) | 0;
    d = (d >>> 16 | d << 16) | 0; d = (d ^ a) | 0; a = (a - b) | 0;

    // Inverse Iteration 3
    b = (b >>> 7 | b << 25) | 0; b = (b ^ c) | 0; c = (c - d) | 0;
    d = (d >>> 8 | d << 24) | 0; d = (d ^ a) | 0; a = (a - b) | 0;
    b = (b >>> 12 | b << 20) | 0; b = (b ^ c) | 0; c = (c - d) | 0;
    d = (d >>> 16 | d << 16) | 0; d = (d ^ a) | 0; a = (a - b) | 0;

    // Inverse Iteration 2
    b = (b >>> 7 | b << 25) | 0; b = (b ^ c) | 0; c = (c - d) | 0;
    d = (d >>> 8 | d << 24) | 0; d = (d ^ a) | 0; a = (a - b) | 0;
    b = (b >>> 12 | b << 20) | 0; b = (b ^ c) | 0; c = (c - d) | 0;
    d = (d >>> 16 | d << 16) | 0; d = (d ^ a) | 0; a = (a - b) | 0;

    // Inverse Iteration 1
    b = (b >>> 7 | b << 25) | 0; b = (b ^ c) | 0; c = (c - d) | 0;
    d = (d >>> 8 | d << 24) | 0; d = (d ^ a) | 0; a = (a - b) | 0;
    b = (b >>> 12 | b << 20) | 0; b = (b ^ c) | 0; c = (c - d) | 0;
    d = (d >>> 16 | d << 16) | 0; d = (d ^ a) | 0; a = (a - b) | 0;

    store<u32>(block + 0, a);
    store<u32>(block + 4, b);
    store<u32>(block + 8, c);
    store<u32>(block + 12, d);
}

function substitute(block: usize, len: u32, sbox: usize): void {
    for (let i: u32 = 0; i < len; i++) {
        let val = load<u8>(block + i);
        store<u8>(block + i, load<u8>(sbox + val));
    }
}

function inverseSubstitute(block: usize, len: u32, invSbox: usize): void {
    for (let i: u32 = 0; i < len; i++) {
        let val = load<u8>(block + i);
        store<u8>(block + i, load<u8>(invSbox + val));
    }
}

export function encryptBlock(
    blockPtr: usize,
    blockSize: u32,
    rounds: u32,
    roundKeysXorPtr: usize,
    roundKeysAddPtr: usize,
    sboxPtr: usize
): void {
    for (let r: u32 = 0; r < rounds; r++) {
        let rkXor = roundKeysXorPtr + (r * blockSize);
        let rkAdd = roundKeysAddPtr + (r * blockSize);

        for (let i: u32 = 0; i < blockSize; i++) {
            let val = load<u8>(blockPtr + i);
            let keyXor = load<u8>(rkXor + i);
            store<u8>(blockPtr + i, val ^ keyXor);
        }

        diffuse(blockPtr, blockSize);
        substitute(blockPtr, blockSize, sboxPtr);
        permute(blockPtr, blockSize);

        for (let i: u32 = 0; i < blockSize; i++) {
            let val = load<u8>(blockPtr + i);
            let keyAdd = load<u8>(rkAdd + i);
            store<u8>(blockPtr + i, (val + keyAdd) & 0xFF);
        }
    }
}

export function decryptBlock(
    blockPtr: usize,
    blockSize: u32,
    rounds: u32,
    roundKeysXorPtr: usize,
    roundKeysAddPtr: usize,
    invSboxPtr: usize
): void {
    for (let r: i32 = (rounds - 1); r >= 0; r--) {
        let rkXor = roundKeysXorPtr + ((r as u32) * blockSize);
        let rkAdd = roundKeysAddPtr + ((r as u32) * blockSize);

        for (let i: u32 = 0; i < blockSize; i++) {
            let val = load<u8>(blockPtr + i);
            let keyAdd = load<u8>(rkAdd + i);
            store<u8>(blockPtr + i, (val - keyAdd + 256) & 0xFF);
        }

        inversePermute(blockPtr, blockSize);
        inverseSubstitute(blockPtr, blockSize, invSboxPtr);
        inverseDiffuse(blockPtr, blockSize);

        for (let i: u32 = 0; i < blockSize; i++) {
            let val = load<u8>(blockPtr + i);
            let keyXor = load<u8>(rkXor + i);
            store<u8>(blockPtr + i, val ^ keyXor);
        }
    }
}

export function encryptCBC(
    dataPtr: usize,
    dataLen: u32,
    blockSize: u32,
    rounds: u32,
    roundKeysXorPtr: usize,
    roundKeysAddPtr: usize,
    sboxPtr: usize,
    ivPtr: usize
): void {
    let previousBlockPtr = ivPtr;

    for (let offset: u32 = 0; offset < dataLen; offset += blockSize) {
        let blockPtr = dataPtr + offset;

        for (let i: u32 = 0; i < blockSize; i++) {
            let b = load<u8>(blockPtr + i);
            let p = load<u8>(previousBlockPtr + i);
            store<u8>(blockPtr + i, b ^ p);
        }

        encryptBlock(blockPtr, blockSize, rounds, roundKeysXorPtr, roundKeysAddPtr, sboxPtr);

        previousBlockPtr = blockPtr;
    }
}

const PREV_CIPHER_PTR = memory.data(256);
const CURRENT_IV_PTR = memory.data(256);

export function decryptCBC(
    dataPtr: usize,
    dataLen: u32,
    blockSize: u32,
    rounds: u32,
    roundKeysXorPtr: usize,
    roundKeysAddPtr: usize,
    invSboxPtr: usize,
    ivPtr: usize
): void {
    for (let i: u32 = 0; i < blockSize; i++) {
        store<u8>(CURRENT_IV_PTR + i, load<u8>(ivPtr + i));
    }

    for (let offset: u32 = 0; offset < dataLen; offset += blockSize) {
        let blockPtr = dataPtr + offset;

        for (let i: u32 = 0; i < blockSize; i++) {
            store<u8>(PREV_CIPHER_PTR + i, load<u8>(blockPtr + i));
        }

        decryptBlock(blockPtr, blockSize, rounds, roundKeysXorPtr, roundKeysAddPtr, invSboxPtr);

        for (let i: u32 = 0; i < blockSize; i++) {
            let b = load<u8>(blockPtr + i);
            store<u8>(blockPtr + i, b ^ load<u8>(CURRENT_IV_PTR + i));
        }

        for (let i: u32 = 0; i < blockSize; i++) {
            store<u8>(CURRENT_IV_PTR + i, load<u8>(PREV_CIPHER_PTR + i));
        }
    }
}
