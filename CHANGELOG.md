# Changelog

All notable changes to this project will be documented in this file.

Format: https://keepachangelog.com/en/1.0.0/
This project uses Semantic Versioning where practical.

## [v1.11] - 2026-08-30
### Changed
- Published the full zDays v5 cryptographic specification and promoted the implementation to release v1.11 for public cryptanalysis and conformance testing.
- Confirmed WASM/TypeScript parity for the diffusion primitive (four ARX iterations per diffuse call).
- Added and published the permanent test-vector suite used for verification (including zero-key/zero-plaintext vector).
- Clarified S-box generation and HKDF round-key derivation labels for cross-implementation compatibility.

### Notes
- This release marks the repository and specification as ready for independent analysis. "Stable" indicates spec/implementation synchronization for testing, not a cryptographic endorsement.
- Spec: specs.md
- Full spec & test vectors available in the repository.

## [v1.10] - 2026-08-08
### Fixed
- Diffusion early-round weakness: updated the diffusion implementation so a single `diffuse` call performs four quarter-round operations (instead of one), bringing the single-call avalanche from ~26 bits to ~64 bits and eliminating the weak early-round behaviour observed in prior builds.

### Notes
- Release tag: 26.H2
- Release page: https://github.com/lalipa2003-arch/zDays/releases/tag/26.H2

## [v1.0.7] - 2026-08-04
### Added
- Published a consumable library package: `@idiotbready/zdays` available from the project's custom npm registry.
- Library usage and tutorial added: APIs include `generateRandomKey`, `generateRandomMasterPassword`, `encryptFile`, `decryptFile`, and `YdzMetadata` types.

### Notes
- Release published: https://github.com/lalipa2003-arch/zDays/releases/tag/v1.0.7

## [v1.0.4] - 2026-08-02
### Added
- WASM Memory Ceiling & Chunked Processing: restructured `encryptBlockCipher` and `decryptBlockCipher` to process ciphertext in bounded 1MB chunks (`CHUNK_SIZE`), preventing WASM linear memory from growing to the full file size. Wired `onProgress` callbacks into the chunk loops.

### Fixed
- Constant-Time PKCS#7 Padding Validation, multi-pass memory zeroisation, and WASM bounds checks.

---

(older entries omitted for brevity - see repository history)
