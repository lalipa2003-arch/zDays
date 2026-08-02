# Changelog

All notable changes to this project will be documented in this file.

Format: https://keepachangelog.com/en/1.0.0/
This project uses Semantic Versioning where practical.


## [v1.0.4] - 2026-08-02
### Added
- WASM Memory Ceiling & Chunked Processing: restructured `encryptBlockCipher` and `decryptBlockCipher` in `/src/engine/zdays-engine.ts` to process ciphertext in bounded 1MB chunks (`CHUNK_SIZE`), preventing WASM linear memory from needing to scale to the full file size.
- Wired `onProgress` callbacks into the chunk loops for both encryption and decryption so progress is reported accurately.

### Fixed
- Diffusion Interoperability Fix: updated `diffuse` and `inverseDiffuse` in both `/assembly/index.ts` (WASM) and `/src/engine/diffusion.ts` (TypeScript fallback) to execute a single quarter-round without the extra state rotation, aligning bit-for-bit with published reference ports (Python, Java, C#, Go, Swift, Ada/SPARK).
- WASM Permutation Buffer Size & Bounds Guard: increased `TEMP_PERMUTE_PTR` and `TEMP_INV_PERMUTE_PTR` from 256 bytes to 4096 bytes in `/assembly/index.ts` and added an explicit `if (len > 4096) return;` guard to protect against memory corruption when using larger block sizes.
- Constant-Time PKCS#7 Padding Validation: replaced the branch-and-mask loop in `decryptBlockCipher` with a strictly bitwise constant-time PKCS#7 padding evaluation that runs across all block bytes without conditional branching or early exits.
- Multi-Pass Memory Zeroisation: enhanced `zeroMemory` in `/src/engine/key-expansion.ts` to perform multi-pass wiping (0xFF, 0xAA, `crypto.getRandomValues`/0x55, followed by an explicit index-based 0x00 loop) to resist compiler optimizations.

### Changed
- Code Cleanup: removed dead/unused pointer constants (`SBOX_PTR`, `RK_XOR_PTR`, `RK_ADD_PTR`, `IV_PTR`) from `/src/engine/zdays-engine.ts` and verified clean compilation via `tsc` and `vite build`.

### Notes
- Release asset: zdays-enginev1.0.4zip
- Release published: https://github.com/lalipa2003-arch/zDays/releases/tag/v1.0.4

## [v1.0.3] - 2026-08-02
### Added
- Affine-equivalent S-box construction improvements described in substitution.ts.
### Changed
- Release renamed and formalized. See release page for updated S-box derivation description.
### Notes
- This release improves S-box generation to use affine equivalence with a fixed high-quality Core S-box (not AES). M1, M2 matrices and constants c1, c2 are key dependent.

## [v1.0.3 beta] - 2026-08-02
### Added
- Strict S-box security checks:
  - Differential Uniformity (DU) validation rejection threshold (DU > 10 rejected).
  - Nonlinearity (NL) check using Fast Walsh-Hadamard Transform; S-boxes with NL < 96 are rejected.
- Dynamic re-generation loop for S-box candidates until a candidate meets security thresholds.
### Notes
- Marked as beta. Release body explicitly warns about the experimental nature of the code.

## [v1.0.2] - 2026-08-01
### Added
- TypeScript and AssemblyScript support files added to the engine artifacts.
### Changed
- Minor bug fixes and packaging updates.
### Notes
- Release asset: zdays-engine.1.0.2zip

## [v1.0.1] - 2026-07-31
### Changed
- Fixed postcss version issue during web packaging.
- Website deployed (release notes referenced https://zdays.netlify.app/).
### Notes
- Release asset: zdays-engine.1.0.1.zip

## [v1.0.0] - 2026-07-31
### Added
- Initial public release describing the zDays encryption algorithm:
  - Argon2id KDF, HKDF-SHA256 domain separation, HMAC-SHA256 authentication, custom ARX block cipher, dynamic S-box generation, CBC mode containers (.ydz).
### Notes
- Release asset: zdays-engine.zip
- Release body includes a high-level explanation of the design and warnings that the cipher is experimental.
