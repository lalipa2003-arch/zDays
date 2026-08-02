# Changelog

All notable changes to this project will be documented in this file.

Format: https://keepachangelog.com/en/1.0.0/
This project uses Semantic Versioning where practical.


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
