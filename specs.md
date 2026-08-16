# zDays Cryptographic Engine Specification (Draft)

## Latest release: v1.10 (tag: 26.H2, 2026-08-08)

Highlights

- Diffusion early-round fix (v1.10): the diffusion primitive was strengthened so a single `diffuse()` call now performs four quarter-round operations (previously it ran only one). This raises the single-call avalanche from ~26 bits to ~64 bits and removes the soft early-round behaviour.
- Library release (v1.0.7): a consumable package `@idiotbready/zdays` was published; see release v1.0.7 for installation and API examples.
- Chunked WASM processing (v1.0.4+): encrypt/decrypt now process payloads in bounded 1MB chunks (`CHUNK_SIZE`) so WebAssembly linear memory does not need to grow to the full file size. `onProgress` callbacks are wired into the chunk loops.
- WASM bounds & buffer guards (v1.0.4): temporary permutation buffers increased (256 → 4096 bytes) and explicit bounds guards added to avoid memory corruption.
- Constant-time padding & memory hygiene (v1.0.4): PKCS#7 padding validation was rewritten into a strictly bitwise constant-time check and `zeroMemory` was extended to do multi-pass wiping to resist compiler optimizations.

For full release notes, see: https://github.com/lalipa2003-arch/zDays/releases

---

## Overview

zDays is an experimental, open-source file encryption engine designed to run entirely offline in the browser. It combines established primitives (Argon2id, HKDF-SHA256, HMAC-SHA256) with a custom ARX-based block cipher implemented in AssemblyScript/WebAssembly.

This document records the engine design and recent implementation changes; treat the cipher as experimental and invite cryptanalysis.

---

# Design Goals

* Offline-only encryption
* Strong password-based key derivation
* Authenticated encrypted containers
* Modular cryptographic architecture
* WebAssembly performance and safety (bounded memory usage)
* Open implementation for public review

---

# Architecture

```
Password
    │
    ▼
 Argon2id
    │
    ▼
256-bit Master Key
    │
    ▼
HKDF-SHA256
 ├── Encryption Key
 ├── Authentication Key
 └── Metadata Key
```

Master key material is domain-separated via HKDF and never reused directly.

---

# Key Derivation

- Argon2id is used for password stretching with a per-container random salt and memory-hard parameters.
- Parameters are configurable in the engine options (trade-off: memory/time vs. attacker cost).

---

# Encryption Pipeline

Each file is encrypted using the following sequence:

1. Generate random salt and IV(s)
2. Derive master key with Argon2id
3. Expand subkeys with HKDF-SHA256 (Encryption, Auth, Metadata)
4. Encrypt metadata (separately)
5. Encrypt payload using chunked processing (1MB chunks) and the custom block cipher
6. Compute HMAC-SHA256 authentication values
7. Emit versioned `.ydz` container

---

# Block Cipher

Current Version: v1.10

## Block Size

128 bits (16 bytes)

## Default Rounds

20 (configurable per engine mode)

Each round performs:

1. XOR Round Key
2. ARX Diffusion
3. Affine-equivalent substitution layer
4. Byte permutation
5. Modular Addition Round Key

---

# Diffusion Layer (v1.10 changes)

- The diffusion stage operates on four 32-bit words and uses ARX (Add-Rotate-XOR) operations.
- In v1.10 the `diffuse()` primitive was changed so a single call runs four quarter-rounds (previously a single quarter-round). This change produces a strong avalanche from the first round (single-call avalanche ~64/128 bits) and mitigates early-round differential weaknesses.
- Reference ports (WASM/TS/Python/Go/Java/C#/Swift/Ada) should match bit-for-bit after this change.

---

# Substitution Layer

- Per-session S-boxes are derived using affine equivalence:

```
S(x) = M2 · Core(M1 · x ⊕ c1) ⊕ c2
```

- `Core` is a fixed 8-bit permutation chosen for good cryptographic properties. M1, M2, c1, c2 are key-dependent.

---

# Permutation Layer

- Bytes are rearranged using a coprime stride permutation. Default mapping for 16-byte blocks:

```
index = (index * 5) mod 16
```

---

# Mode of Operation & Chunking

- CBC mode is used with a fresh 128-bit IV per container (via `crypto.getRandomValues()`).
- Large payloads are processed in bounded chunks (CHUNK_SIZE = 1MB by default) to avoid growing WASM linear memory. Chunks are encrypted in sequence and progress callbacks are emitted.

---

# Metadata Protection

- Metadata (filename, MIME type, timestamps, engine version, parameters) is encrypted with a dedicated Metadata Key derived from HKDF.

---

# Authentication

- Containers include HMAC-SHA256 values covering: header, metadata, and payload.
- Authentication is verified with constant-time comparison before any plaintext is released.

---

# File Format

- `.ydz` container (versioned) stores: header, salt, IV(s), encrypted metadata, encrypted payload (chunked), authentication values.

---

# Implementation Safety Notes

- WASM buffers: temporary permutation buffers were increased from 256 to 4096 bytes and explicit bounds guards added to avoid memory corruption with larger block sizes.
- Padding: PKCS#7 padding checks are implemented in strictly bitwise constant-time form to avoid timing leakage.
- Memory hygiene: sensitive buffers are zeroed using a multi-pass wipe to resist compiler optimization elision.

---

# Releases & Package

- v1.10 (tag: 26.H2) — diffusion early-round fix (2026-08-08)
  - https://github.com/lalipa2003-arch/zDays/releases/tag/26.H2
- v1.0.7 — library package `@idiotbready/zdays` published (2026-08-04)
  - https://github.com/lalipa2003-arch/zDays/releases/tag/v1.0.7
- v1.0.4 — chunked processing, padding, WASM guards, zeroisation (2026-08-02)
  - https://github.com/lalipa2003-arch/zDays/releases/tag/v1.0.4

---

# Security Notes

- The custom block cipher is experimental and has not received formal academic cryptanalysis. Users should not use zDays for high-value assets until independent review is completed.
- Reports can be made following the repo SECURITY.md — maintainers can accept private disclosures via GitHub Security Advisories or the contact provided in SECURITY.md.

---

# Project Philosophy

zDays is an open cryptographic project aiming for transparency, reproducibility, and community-driven improvement. Feedback, benchmarks, and cryptanalysis are welcomed.
