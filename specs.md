# zDays v5 — Cryptographic Specification (Release v1.11)

**Status:** Experimental — Published for independent cryptanalysis and conformance testing
**Version:** zDays v5 (implementation release v1.11)
**Specification revision:** 1.0
**Purpose:** Precise specification for independent analysis and interoperable implementations

> **Security warning:** zDays v5 is experimental cryptographic software. The custom block cipher has not undergone formal peer review or independent professional cryptanalysis. Absence of a known attack is not evidence of security. This specification separates tested implementation properties from cryptanalytic assumptions and unproven security claims.

---

# 1. Overview

zDays v5 is a file-encryption construction consisting of:

1. Argon2id-based password/key derivation
2. HKDF-SHA-256 key expansion
3. A custom 128-bit block cipher
4. A key-dependent 8-bit substitution box derived from the encryption key
5. A four-iteration ARX diffusion function
6. A fixed byte permutation
7. CBC block chaining
8. PKCS#7 padding
9. HMAC-based authentication
10. A versioned `.ydz` encrypted-container format

The block cipher operates on 128-bit blocks interpreted as four 32-bit little-endian words. The production browser implementation uses a WebAssembly engine; TypeScript reference implementations are provided for portability and review.

This release (v1.11) documents the current production construction and test vectors and is intended to assist independent cryptanalysis and interoperable reimplementations.

---

# 2. Cryptographic Parameters

- Block size: 128 bits (16 bytes)
- Word size: 32 bits
- Number of words: 4
- Key material: 32 bytes (256 bits)
- Production cipher rounds: 20
- S-box size: 256 entries (8→8)
- Fixed S-box core: SM4 S-box (used as the cryptographic core)
- ARX iterations per diffusion call: 4
- Byte permutation: stride-5 modulo 16
- Key expansion: HKDF-SHA-256
- Mode: CBC
- Padding: PKCS#7
- Authentication: HMAC-SHA-256
- Production engine: WebAssembly (AssemblyScript compiled to WASM)

---

# 3. Security Status

Treat zDays v5 as an experimental cipher. The following implementation and empirical properties have been verified for the current production code:

* WASM binary instantiates and exports the expected functions.
* The WASM diffusion function has matching behavior with the TypeScript reference implementation (four ARX iterations per call).
* The inverse diffusion function in both WASM and TypeScript correctly inverts the forward diffusion for verified test vectors.
* Deterministic S-box generation produces permutations (bijective S-boxes) in tested keys.
* The SM4 core S-box properties (DU=4, nonlinearity=112) are known and preserved by affine equivalence.
* HKDF-SHA-256 round-key derivation with distinct labels is implemented and tested.
* At least one complete 20-round encryption result (zero-key/zero-plaintext) has been reproduced byte-for-byte between WASM and a Python reference model.
* A permanent test-vector suite is included in the repository.

Open and unproven items (no formal proof provided in this release):

* Full 20-round differential or linear proofs.
* Differential-hull and linear-hull completeness.
* Integral / higher-order differential analysis.
* Side-channel and fault resistance guarantees for the WASM or JS implementations.
* Resistance under various related-key models.

Independent cryptanalysis is encouraged and required before considering zDays v5 for protecting high-value assets.

---

# 4. Mathematical Conventions

- Byte positions are zero-indexed.
- A 128-bit block is represented as X = x_0 || x_1 || ... || x_15 (each x_i is a byte).
- The four 32-bit words (W_0..W_3) use little-endian encoding in the reference implementation.
- 32-bit additions in ARX are modulo 2^32. Bytewise additions (round ADD stage) are modulo 256.
- ROTL_n denotes a left rotation on 32-bit words.

---

# 5. Key Material

- The cipher uses 256-bit key material (32 bytes).
- When a user supplies a password, Argon2id derives the 256-bit key using per-container salt and configured Argon2id parameters.
- The repository documents recommended Argon2id security levels; production containers record the exact Argon2id parameters used.

---

# 6. HKDF Key Expansion

Round keys are derived using HKDF with SHA-256. For round r the implementation derives two independent 16-byte round-key streams using UTF‑8 labels:

- "zDays-v5-Round-r-XOR"
- "zDays-v5-Round-r-ADD"

Label usage prevents the two streams from colliding. Implementations MUST use identical labels and HKDF parameters (salt = empty byte string for label-only expansion in the reference code) to interoperate with provided test vectors.

---

# 7. Round-Key Structure

Each round r (0..19) has:

- RK^{XOR}_r: 16-byte XOR round key applied at the start of the round (bytewise XOR)
- RK^{ADD}_r: 16-byte ADD round key applied at the end of the round (bytewise addition modulo 256)

Round keys are derived independently through HKDF as described above.

---

# 8. Key-Dependent S-Box

The substitution layer uses an 8-bit bijective S-box generated deterministically per key by:

S_K(x) = M2 · Core(M1 · x ⊕ c1) ⊕ c2

where M1 and M2 are invertible 8×8 binary matrices over GF(2), and c1,c2 are 8-bit constants. Core is the fixed SM4 S-box. Matrix and constant material is produced from deterministic PRNG output (HKDF/Argon2id expansion in the reference code) according to the repository's generator algorithm.

Implementations MUST reproduce the same matrix-generation algorithm to interoperate with test vectors.

---

# 9. Affine S-Box Properties

Affine equivalence preserves differential uniformity and nonlinearity. Therefore the key-dependent S-box inherits

* Differential uniformity: 4 (maximum single-S-box differential probability 2^-6)
* Nonlinearity: 112

These properties are necessary but not sufficient for the security of the full cipher.

---

# 10. S-Box Generation Requirements

The implementation must produce a bijective permutation for every key. The reference generator uses deterministic row operations over an initial identity matrix and then composes affine transforms around the fixed SM4 core. Implementations should validate generated S-boxes (bijectivity) and include tests reproducing the repository's permanent test vectors.

---

# 11. ARX Diffusion Function

The ARX diffusion operates on four 32-bit words (a,b,c,d). One complete ARX iteration Q performs the following sequence (all additions modulo 2^32, rotations on 32-bit words):

1. a = a + b
2. d = d xor a; d = ROTL_{16}(d)
3. c = c + d
4. b = b xor c; b = ROTL_{12}(b)
5. a = a + b
6. d = d xor a; d = ROTL_{8}(d)
7. c = c + d
8. b = b xor c; b = ROTL_{7}(b)

In zDays v5 the complete diffusion D applies Q four times: D(X) = Q^4(X). This gives the production diffusion primitive used in the WASM and TypeScript implementations.

---

# 12. ARX Inverse

The ARX diffusion is bijective. The inverse is computed by reversing the operation order and replacing additions with subtractions and left rotations with right rotations. Reference implementations include inverseDiffuse that follows the reverse sequence.

---

# 13. Byte Permutation

The fixed byte permutation P maps position i to (5*i) mod 16. Because gcd(5,16)=1 this mapping is a permutation. Implementations must use the same mapping and endianness to match test vectors.

---

# 14. Complete Round Function

Round r transforms state X_r into X_{r+1} via:

1. Y1 = X_r XOR RK^{XOR}_r (bytewise)
2. Y2 = D(Y1) (four-iteration ARX diffusion)
3. Y3 = apply S_K to each byte of Y2
4. Y4 = P(Y3)
5. X_{r+1} = (Y4 + RK^{ADD}_r) mod 256 (bytewise)

Repeat for r = 0..19.

---

# 15. Complete Encryption and Decryption

Encryption: X_0 = plaintext block; compute X_{20} after 20 rounds; ciphertext C = X_{20}.

Decryption: invert each round (subtract RK^{ADD}_r, inverse permutation, inverse S-box, inverse diffusion, XOR RK^{XOR}_r) in reverse order.

---

# 16. CBC Mode and Padding

zDays uses CBC for multi-block encryptions with PKCS#7 padding to a 16-byte block boundary. Implementations MUST verify HMAC before releasing any decrypted plaintext. IV must be unique per encryption with the same key and is stored in the container header.

---

# 17. Authentication and Container Format

The `.ydz` container is versioned and contains metadata (engine version, Argon2id parameters, HKDF labels/versioning, salt, IV, ciphertext, HMAC). The repository contains the production serializer/parser; implementations MUST follow the serializer exactly to interoperate with test vectors.

---

# 18. Verified Implementation Tests & Test Vectors

The repository contains a permanent test-vector suite. Verified vectors include:

* WASM diffusion test for sequential input (documented in repository)
* Zero-key / zero-plaintext full encryption vector (documented below)
* Additional vectors for common keys and plaintexts (zero, all-FF, sequential, printable, ASCII)

Reference zero-key/zero-plaintext vector (MUST be preserved):

Key (32 bytes):
00000000000000000000000000000000
00000000000000000000000000000000

Plaintext (16 bytes):
00000000000000000000000000000000

Ciphertext (16 bytes):
c6b02247503160ee4f479a1a2f3b992e

WASM and an independent Python reference produce the same value for this vector.

---

# 19. Empirical Differential / Diffusion Observations

Empirical testing (random difference sampling and targeted searches) indicates strong diffusion after a small number of rounds; sample statistics show the majority of differences activate most bytes after diffusion. These are experimental results and do not constitute formal proofs.

---

# 20. Known Limitations and Open Questions

The following cryptanalytic problems remain open and are explicitly not proven in this specification:

* Exact multi-round differential bounds
* Differential-hull and linear-hull completeness
* Integral and higher-order distinguishers
* Algebraic-degree growth and algebraic attacks
* Side-channel effects and WASM-specific leakage
* Fault injection effects and resilience

Independent analysis is encouraged, and the repo includes reproducible test vectors and reference-code to assist such work.

---

# 21. Conformance Requirements

Implementations claiming zDays v5 conformance must reproduce:

1. 128-bit blocks, little-endian word encoding
2. HKDF-SHA-256 round-key derivation with exact labels
3. Key-dependent affine S-box generation as specified
4. Four ARX iterations per diffusion call
5. Stride-5 byte permutation mapping
6. 20-round production configuration
7. Exact inverse operations and parity with test vectors

Any deviation should be treated as a variant and must not be presented as zDays v5.

---

# 22. Recommended Independent Cryptanalysis Pipeline

Suggested analysis steps for an independent cryptanalyst:

1. Formalize the specification
2. Reimplement a reference model (Python/Go/Rust)
3. Reproduce all test vectors
4. Analyze S-box properties and key-generation effects
5. Perform exact 2- and 3-round searches (SAT/SMT/MILP)
6. Extend to differential-hull and linear-hull analysis
7. Integral and higher-order analysis
8. Algebraic investigation (degree growth)
9. Side-channel and implementation-focused analysis
10. Produce reproducible evidence for any findings

---

# 23. Release Statement (v1.11)

Release v1.11 marks the publication of the full zDays v5 specification and the promotion of the current implementation to a stable release intended for public cryptanalysis and compatibility testing. The repository includes the WASM engine, TypeScript reference implementations, and a permanent test-vector suite.

**Important:** "Stable" in this context means the implementation and spec are synchronized and versioned for analysis; it does not mean the cipher is cryptographically proven.

---

# 24. Reference Test Vector (preserved)

Key:
00000000000000000000000000000000
00000000000000000000000000000000

Plaintext:
00000000000000000000000000000000

Ciphertext:
c6b02247503160ee4f479a1a2f3b992e

---

# 25. Contact and Reporting

Report security issues following the repository `SECURITY.md` procedures. Private disclosures may be handled through GitHub Security Advisories or the contact methods described in the project documentation.

---

# 26. Change History

- v1.11 (2026-08-30) — Spec published and implementation promoted for public cryptanalysis; four-iteration ARX diffusion; WASM/TS parity; permanent test-vector suite added.
- v1.10 (2026-08-08) — Diffusion early-round fix and WASM/TS parity established.
- v1.0.7 (2026-08-04) — Library package published (`@idiotbready/zdays`).
- v1.0.4 (2026-08-02) — Chunked WASM processing, padding and memory hygiene improvements.

---

# 27. Disclaimer

zDays v5 is experimental. The maintainers publish the specification to enable independent analysis; do not treat this release as a recommendation to replace vetted standards for high-value secrets.
