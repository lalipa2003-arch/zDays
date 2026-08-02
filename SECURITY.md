# Security Policy

## Experimental Software Notice

**zDays is experimental cryptographic software.**

The project combines well-established cryptographic primitives (such as Argon2id, HKDF-SHA256, and HMAC-SHA256) with an experimental custom block cipher implemented in WebAssembly.

The custom cipher has **not** undergone formal academic cryptanalysis or an independent professional security audit.

**Do not rely on zDays to protect high-value, safety-critical, or mission-critical information until the implementation and custom cryptographic components have received substantial independent review.**

---

# Reporting a Security Vulnerability

If you believe you have discovered a security vulnerability, please report it responsibly.

## Preferred Method — Private GitHub Security Advisory

If possible, request private handling. Sensitive information, exploit details, or proof-of-concept code should not be disclosed publicly until the issue has been investigated.

---

## Alternative — GitHub Issue

If private reporting is unavailable, open a GitHub issue titled:

```text
[security] Short summary
```

If you would like the report handled privately, include the following line in the issue:

```text
Please handle privately.
```

Please **do not** include exploit code, secrets, passwords, or sensitive attachments in a public issue.

---

## Email

Security reports may also be sent to:

```text
donaldduckemail@tutamail.com
```

If your report contains proof-of-concept files or confidential information, consider encrypting the email with GPG if a public key is available.

---

# What to Include

Please include as much information as possible:

* Affected version(s)
* Operating system
* Browser and version
* Steps to reproduce
* Expected behavior
* Actual behavior
* Minimal proof of concept (if safe)
* Test vectors or sample files (if applicable)
* Any relevant logs or screenshots

---

# Scope

Security reports may include, but are not limited to:

* Cryptographic weaknesses
* Implementation bugs
* Memory safety issues
* Authentication or integrity failures
* Side-channel concerns
* Container (.ydz) format issues
* Documentation errors affecting security

---

# Disclosure Process

After receiving a report, we aim to:

* Acknowledge receipt within **72 hours**.
* Reproduce and validate the issue.
* Discuss mitigation or fixes with the reporter.
* Credit the reporter in the release notes if they wish to be acknowledged.

---

# Security Philosophy

zDays is developed with an emphasis on:

* Offline-first operation
* Open-source transparency
* Reproducible implementations
* Defense in depth
* Continuous improvement through public review

Independent analysis, cryptanalysis, testing, and responsible security research are welcomed.

---

# Disclaimer

This project is provided **"as is"**, without any warranty of any kind.

No security system can guarantee absolute protection. Users are responsible for determining whether zDays is appropriate for their intended use.
