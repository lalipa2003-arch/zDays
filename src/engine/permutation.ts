// JavaScript/TypeScript versions of the permutation helpers

function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
}

export function permute(block: Uint8Array): void {
    const len = block.length;
    const temp = new Uint8Array(len);
    let stride = 5;
    while (gcd(stride, len) !== 1) stride++;

    for (let i = 0; i < len; i++) {
        temp[(i * stride) % len] = block[i];
    }
    block.set(temp);
}

export function inversePermute(block: Uint8Array): void {
    const len = block.length;
    const temp = new Uint8Array(len);
    let stride = 5;
    while (gcd(stride, len) !== 1) stride++;

    for (let i = 0; i < len; i++) {
        temp[i] = block[(i * stride) % len];
    }
    block.set(temp);
}
