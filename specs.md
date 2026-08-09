# zDays Cryptographic Engine Specification 

## Overview

zDays is an experimental, open-source file encryption engine designed to operate entirely offline. The application runs inside the browser and performs all cryptographic operations locally without transmitting user data to external servers.

The engine combines established cryptographic primitives such as Argon2id, HKDF-SHA256, and HMAC-SHA256 with a custom ARX-based block cipher implemented in WebAssembly.

---

# Design Goals

The primary goals of zDays are:

* Offline-only encryption
* Strong password-based key derivation
* Authenticated encrypted containers
* Modular cryptographic architecture
* WebAssembly performance
* Open implementation suitable for public review

The project is experimental and intended for analysis and improvement by the community.

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

The master key is never used directly.

Each derived key has a single purpose through domain-separated HKDF expansion.

---

# Key Derivation

Passwords are processed using Argon2id.

The configuration is designed to be memory-hard, increasing the computational cost of brute-force attacks.

A unique random salt is generated for every encrypted container.

---

# Encryption Pipeline

Each file is encrypted using the following sequence:

1. Generate random salt
2. Derive Master Key using Argon2id
3. Expand subkeys using HKDF-SHA256
4. Encrypt metadata
5. Encrypt payload
6. Authenticate container
7. Produce a `.ydz` container

---

# Block Cipher

Current Version: v1.0.3

## Block Size

128 bits (16 bytes)

## Default Rounds

20

Each round performs:

1. XOR Round Key
2. ARX Diffusion
3. Affine-equivalent substitution layer
4. Byte permutation
5. Modular Addition Round Key

---

# Diffusion Layer

The diffusion stage operates on four 32-bit words.

It uses ChaCha-inspired Add-Rotate-XOR (ARX) operations to rapidly spread changes throughout the internal state.

The layer provides strong practical diffusion while remaining computationally efficient.

---

# Substitution Layer

Beginning with version 1.0.3, zDays no longer generates S-boxes using Fisher-Yates shuffling.

Instead, every encryption session derives a unique S-box using affine equivalence:

```
S(x) = M₂ · Core(M₁ · x ⊕ c₁) ⊕ c₂
```

where:

* Core is a fixed, independently chosen 8-bit permutation with strong cryptographic properties.
* M₁ and M₂ are key-dependent invertible 8×8 matrices over GF(2).
* c₁ and c₂ are key-dependent affine constants.

This construction preserves important properties of the Core S-box while producing a unique substitution layer for each encryption key.

---

# Permutation Layer

Bytes are rearranged using a coprime stride permutation.

For a 16-byte block, the default mapping is:

```
index = (index × 5) mod 16
```

This distributes byte positions between rounds.

---

# Mode of Operation

Cipher Block Chaining (CBC)

Every encryption generates a fresh 128-bit IV using:

```
crypto.getRandomValues()
```

IV reuse is intentionally avoided.

---

# Metadata Protection

Metadata is encrypted independently from file contents.

Metadata includes information such as:

* Original filename
* MIME type
* Timestamp
* Engine version
* Encryption parameters

A dedicated Metadata Key is derived through HKDF domain separation.

---

# Authentication

zDays authenticates encrypted data before decryption.

The container includes multiple HMAC-SHA256 authentication values covering:

* Header
* Metadata
* Payload

Verification occurs before any plaintext is released.

Constant-time comparison is used to reduce timing side-channel leakage.

---

# File Format

Encrypted files use the `.ydz` container format.

Each container stores:

* Header
* Salt
* IV(s)
* Encrypted metadata
* Encrypted payload
* Authentication values

The format is versioned to allow future compatibility.

---

# Security Notes

zDays intentionally builds upon widely studied components:

* Argon2id
* HKDF-SHA256
* HMAC-SHA256

The custom block cipher is experimental.

While the implementation follows modern engineering practices, the cipher has not undergone formal academic cryptanalysis or received a security proof.

Users should treat the cipher as an experimental design and are encouraged to inspect, analyze, and review the implementation.

---

# Project Philosophy

zDays is an open cryptographic project.

Its goals are:

* transparency,
* reproducibility,
* experimentation,
* continuous improvement through public review.

Feedback, analysis, benchmarks, and cryptanalytic research are welcomed.
