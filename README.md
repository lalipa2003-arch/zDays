<img width="2360" height="1371" alt="IMG_0646" src="https://github.com/user-attachments/assets/cab15306-8811-431d-b58a-95d1db42b3e9" />
# zDays

**zDays** is an experimental, open-source, offline file encryption application built with **React**, **TypeScript**, **AssemblyScript**, and **WebAssembly**.

It performs all cryptographic operations entirely on your device—no accounts, no cloud storage, and no server-side encryption. Files never leave your browser during encryption or decryption.
🌐 **Website:** https://zdays.netlify.app
> **⚠️ Experimental Software**
>
> zDays includes an experimental custom block cipher that has **not** undergone formal academic cryptanalysis or an independent professional security audit. While the project uses established cryptographic primitives such as Argon2id, HKDF-SHA256, and HMAC-SHA256, the custom cipher should be considered experimental. Do not rely on zDays to protect high-value or safety-critical information until it has received substantial independent review.

---

## Features

* 🔒 Offline file encryption and decryption
* ⚡ High-performance WebAssembly cryptographic engine
* 🔑 Memory-hard Argon2id password key derivation
* 🧩 HKDF-SHA256 domain-separated key expansion
* 🛡️ HMAC-SHA256 authenticated container format
* 📦 Custom `.ydz` encrypted file format
* 🗂️ Encrypted metadata protection
* 💾 Local encrypted vault using IndexedDB
* 🎲 High-entropy password generator
* 📊 Real-time password entropy estimation
* 📈 Encryption and decryption progress reporting
* 🧱 Chunked processing for large files
* 🌐 Runs entirely in the browser
* 🚫 No external API calls during encryption or decryption

---

## Cryptographic Architecture

zDays combines established cryptographic building blocks with an experimental custom encryption engine.

### Key Derivation

Passwords are processed using **Argon2id**, a memory-hard password hashing algorithm designed to resist brute-force attacks.

A unique random salt is generated for every encrypted container.

### Key Expansion

The derived master key is expanded using **HKDF-SHA256** into independent keys for:

* Encryption
* Authentication
* Metadata protection

This prevents one component from reusing key material intended for another.

### Encryption Engine

The custom encryption engine is implemented in **AssemblyScript** and compiled to **WebAssembly**.

Current versions use:

* 128-bit block size
* ARX (Addition-Rotation-XOR) diffusion
* Affine-equivalent key-dependent substitution layer
* Byte permutation layer
* CBC mode
* Chunked processing for large files

### Authentication

Encrypted containers are authenticated using **HMAC-SHA256** before any decrypted data is released.

Authentication covers the encrypted metadata, payload, and container structure to detect tampering.

---

## Application Features

### Encryption

* Drag-and-drop file encryption
* Password strength analysis
* Configurable encryption modes
* Automatic `.ydz` container generation

### Decryption

* Container validation
* Metadata verification
* Secure file recovery
* Authentication before decryption

### Local Vault

* IndexedDB-backed encrypted storage
* Import existing `.ydz` files
* Persistent local organization
* Download or permanently delete containers

### Password Generator

* Uses `crypto.getRandomValues()`
* Configurable character sets
* Adjustable password length
* Real-time entropy estimation

---

## Technology Stack

* React 19
* TypeScript
* AssemblyScript
* WebAssembly
* Vite
* Tailwind CSS v4
* IndexedDB
* Web Crypto API

---

## Privacy

All cryptographic operations occur locally inside your browser.

zDays does **not** upload files, passwords, or encryption keys to external servers during normal operation.

---

## Documentation

Additional project documentation is available in this repository:

* `SECURITY.md`
* `SPEC.md`
* Release Notes

---

---

## Contributing

Bug reports, security reviews, implementation feedback, performance improvements, and documentation contributions are welcome.

If you discover a potential security issue, please follow the reporting process described in `SECURITY.md`.
