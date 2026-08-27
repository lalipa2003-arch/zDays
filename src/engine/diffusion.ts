// JavaScript/TypeScript versions of the diffusion helpers

export function diffuse(block: Uint8Array): void {
    if (block.length < 16) return;
    const view = new DataView(block.buffer, block.byteOffset, block.byteLength);
    let a = view.getUint32(0, true);
    let b = view.getUint32(4, true);
    let c = view.getUint32(8, true);
    let d = view.getUint32(12, true);

    a = (a + b) | 0; d = (d ^ a) | 0; d = (d << 16 | d >>> 16) | 0;
    c = (c + d) | 0; b = (b ^ c) | 0; b = (b << 12 | b >>> 20) | 0;
    a = (a + b) | 0; d = (d ^ a) | 0; d = (d << 8 | d >>> 24) | 0;
    c = (c + d) | 0; b = (b ^ c) | 0; b = (b << 7 | b >>> 25) | 0;

    view.setUint32(0, a, true);
    view.setUint32(4, b, true);
    view.setUint32(8, c, true);
    view.setUint32(12, d, true);
}

export function inverseDiffuse(block: Uint8Array): void {
    if (block.length < 16) return;
    const view = new DataView(block.buffer, block.byteOffset, block.byteLength);
    let a = view.getUint32(0, true);
    let b = view.getUint32(4, true);
    let c = view.getUint32(8, true);
    let d = view.getUint32(12, true);

    b = (b >>> 7 | b << 25) | 0; b = (b ^ c) | 0; c = (c - d) | 0;
    d = (d >>> 8 | d << 24) | 0; d = (d ^ a) | 0; a = (a - b) | 0;
    b = (b >>> 12 | b << 20) | 0; b = (b ^ c) | 0; c = (c - d) | 0;
    d = (d >>> 16 | d << 16) | 0; d = (d ^ a) | 0; a = (a - b) | 0;

    view.setUint32(0, a, true);
    view.setUint32(4, b, true);
    view.setUint32(8, c, true);
    view.setUint32(12, d, true);
}
