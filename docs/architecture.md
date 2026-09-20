AGRI-NEST v7.0 — System Architecture & Implementation

Preamble
AGRI-NEST is a complete Agricultural Operating System for East Africa. This repository contains the source web app and an evolving set of implementation artifacts for the v7.0 architecture: design docs, API contracts, database schema, and ML pipeline notes.

Three pillars
- Offline-first, inclusive access (USSD, voice, offline mobile sync)
- Self-training AI (continuous feedback loop, active learning)
- Complete supply chain visibility (unique batch IDs, QR traceability)

Repository additions
- `docs/` — architecture and per-module docs
- `api/` — OpenAPI specs and API mock files
- `sql/` — database schema and migration scripts
- `ai/` — ML pipeline notes, data contracts

User ecosystem
AGRI-NEST v7.0 is designed around 24 distinct stakeholder personas organised into four functional groups. The platform is built to support inclusive access across mobile app, USSD, voice, web dashboard, and API channels.

1. PRIMARY AGRICULTURAL USERS
1.1 Smallholder Farmer
Description: Individual farming 1–5 acres, mixed crops and/or livestock
Key interactions: Digital Farm, Jicho AI, Soko, Usafiri, Mshauri, Benki ya Shambani, Taka kwa Mali, groups
Access channels: Mobile app, USSD (*123#), voice

1.2 Commercial Farmer
Description: Large-scale farming >5 acres, often with hired managers and workers, remote owners
Key interactions: Multi-farm dashboard, manager/worker role management, bulk transactions, ERP-lite, compliance
Access channels: Mobile app, web dashboard

1.3 Livestock Keeper
Description: Owners of cattle, goats, sheep, pigs, poultry (including pastoralists)
Key interactions: Animal registry, health tracking, breeding, production logs (milk/eggs), veterinary bookings
Access channels: Mobile app, USSD, voice

1.4 Farmer Group / Co-operative (AMCOS / SACCOS)
Description: Formal or informal groups of farmers (10–500 members)
Key interactions: Group dashboard, collective buying/selling, shared equipment calendar, group loans, chat
Access channels: Mobile app (group admin), USSD (members for basic info)

2. SERVICE PROVIDERS
2.5 Agricultural Expert (Bwana Shamba)
Description: Agronomists, extension officers, crop specialists
Key interactions: Mshauri profile, consultation booking (video/visit), rating system, subscription
Access channels: Mobile app (expert mode), web dashboard

2.6 Veterinary Specialist
Description: Veterinarians, para-vets, animal health workers
Key interactions: Animal health consultations, vaccination scheduling, disease reporting, TALIRO certification
Access channels: Mobile app, USSD (text-based reporting)

2.7 Agri-Student
Description: University students in agriculture, agribusiness, animal science
Key interactions: Wanafunzi hub, research publication, internship matching, course enrolment, forum participation
Access channels: Mobile app, web dashboard

2.8 Transport Provider
Description: Owners of trucks, pickups, motorcycles, refrigerated vans
Key interactions: Usafiri job alerts, bid on jobs, GPS tracking, rating system, escrow payments
Access channels: Mobile app (driver mode), USSD (basic job acceptance)

2.9 Agrishop Owner / Agro-dealer
Description: Retailers of agricultural inputs (seeds, fertiliser, pesticides, tools, feed)
Key interactions: Maduka digital shopfront, inventory management, order processing, customer analytics, e-voucher acceptance
Access channels: Mobile app (shop mode), web dashboard

2.10 Warehouse / Storage Operator
Description: Owners of dry grain stores, cold rooms, silos, processing facilities
Key interactions: Kupanga Nafasi listing, availability calendar, warehouse receipt generation, rental booking
Access channels: Mobile app (listing mode), web dashboard

2.11 Equipment Owner
Description: Owners of tractors, harvesters, sprayers, pumps, shellers available for rent
Key interactions: Mashine Zangu listing, availability calendar, GPS tracking, damage reporting
Access channels: Mobile app (equipment mode)

3. INSTITUTIONAL & COMMERCIAL USERS
3.12 Buyer (Local / Regional)
Description: Processors, wholesalers, retailers, hotels, schools, hospitals
Key interactions: Soko product search, bulk orders, escrow payments, supplier rating
Access channels: Web dashboard, mobile app (buyer mode)

3.13 Exporter / International Buyer
Description: Companies purchasing for export to EU, Middle East, Asia
Key interactions: Export module, batch traceability, phytosanitary certificates, blockchain anchoring, forward contracts
Access channels: Web dashboard, API

3.14 Financial Institution (Bank / MFI / SACCO)
Description: Lenders offering agricultural loans (e.g., CRDB, NMB, TADB, SACCOS)
Key interactions: Benki ya Shambani portal, farmer data access (with consent), loan origination, repayment tracking, portfolio monitoring
Access channels: Web dashboard (lender portal), API

3.15 Insurance Company
Description: Providers of weather-index, crop health, livestock mortality insurance
Key interactions: Bima module, policy issuance, automated payout triggers (via API)
Access channels: API, web dashboard

3.16 Government Agency
Description: Ministry of Agriculture, TMA, TARI, TOSCI, TPHPA, NFRA, TRA, BRELA
Key interactions: Farmer registry data (anonymised), regional analytics, pest surveillance, subsidy management, tax reporting
Access channels: API, dedicated government dashboard

3.17 NGO / Development Organisation
Description: FAO, WFP, IFAD, GIZ, World Bank, AGRA
Key interactions: Programme beneficiary tracking, impact measurement, anonymised data access, project reporting
Access channels: API, NGO dashboard

3.18 Impact Investor
Description: Individuals or funds investing in agricultural ventures (e.g., Acumen, Root Capital)
Key interactions: Crowdfund campaign browsing, farmer investment, portfolio tracking, impact metrics
Access channels: Web dashboard

4. PLATFORM ADMINISTRATORS
4.19 AGRI-NEST Super Admin
Description: System owner, senior technical staff
Key interactions: Full system control: user management, financial audit, AI model training, system configuration, backup/restore
Access channels: Admin web dashboard

4.20 AI Model Manager
Description: ML engineers, data scientists
Key interactions: Training data management, model version deployment, performance monitoring, human-in-the-loop assignment
Access channels: Admin web dashboard (ML console)

4.21 Content Moderator
Description: Staff reviewing flagged content
Key interactions: Flagged listings, forum posts, chat messages, dispute evidence
Access channels: Admin web dashboard (moderation queue)

4.22 Customer Support Agent
Description: Staff handling farmer queries, disputes, account issues
Key interactions: User lookup, PIN reset, refund processing, dispute mediation
Access channels: Admin web dashboard, agent mobile app

4.23 Finance Administrator
Description: Staff managing escrow, payouts, commissions
Key interactions: Transaction logs, escrow reconciliation, bank settlement, fee adjustment
Access channels: Admin web dashboard (finance console)

4.24 Partnership Manager
Description: Staff onboarding and managing institutional partners
Key interactions: Partner registration, API key issuance, service level monitoring
Access channels: Admin web dashboard (partners portal)

Summary by Access Channel
Channel	User Types
Mobile App (full)	Farmers, commercial farmers, livestock keepers, group admins, experts, vets, students, transporters, agrishops, warehouse operators, equipment owners, buyers
USSD (*123#)	Farmers, livestock keepers, group members (basic info), transporters (job acceptance)
Voice	Low-literacy farmers, livestock keepers
Web Dashboard	Commercial farmers, group admins, experts, students, buyers, exporters, lenders, insurance, government, NGOs, investors, all admin roles
API	Banks, insurance, government, exporters, researchers, partner apps
Total distinct user roles: 24 (including 6 admin sub-roles)

Next actions
1. Flesh out per-module docs in `docs/modules/`
2. Define OpenAPI for core services in `api/openapi.yaml`
3. Create core PostGIS schema in `sql/schema_core.sql`
