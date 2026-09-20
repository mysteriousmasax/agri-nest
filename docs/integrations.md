External Integrations — Summary

Primary external systems and intended integration method:
- NIDA (National ID): OAuth2 API for identity verification
- TMA / Open-Meteo: weather and rainfall data feeds
- TARI: research datasets, soil maps (bulk import + API)
- TOSCI / TPHPA: product verification and pesticide registry APIs
- TMX / NFRA: price feeds and stock schedules
- Mobile money (M-Pesa, Tigo Pesa, Airtel Money): payments and escrow via provider APIs

Notes
- For each integration: obtain sandbox credentials, define API contract, and implement retry/backoff for flaky telco APIs.
