# Security

zDays is experimental cryptographic software. The custom block cipher and other components have not undergone formal academic cryptanalysis. DO NOT use zDays to protect high-value assets until an independent security review and audit have been completed.

Responsible disclosure

- If you believe you've found a security vulnerability, please open a GitHub issue titled: "[security] <short summary>" and mark it with the `security` label. Include as much detail as you can (affected version, steps to reproduce, proof-of-concept, test vectors).
- If you need to share sensitive PoC code or exploit data privately, indicate in the issue that you'd like a private disclosure and include an encrypted attachment or request contact details. Replace `<maintainer-contact>` in this document with an email or other secure channel if you want a direct contact method.

What to include in a report

- Affected release(s)/tag(s)
- High-level description of the issue
- Steps to reproduce (minimal PoC if possible)
- Test vectors and input files used
- Platform and environment details (OS, browser, wasm engine, version)

Verification and timeline

- We aim to acknowledge high-severity reports, and work with reporters to reproduce and mitigate. For public disclosure we prefer to coordinate timing with the reporter.

Warnings and disclaimers

- The repository intentionally ships an experimental cipher and must be treated as research software.
- No license is included in this repository by author request; this affects reuse and redistribution — see README for details.
