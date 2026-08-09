# Luxe Axis — Build Plan for the LLD Applications

**Everything in `LXA-TECH-LLD-001` except this marketing website.**

| Field | Value |
|---|---|
| Plan code | LXA-BUILD-PLAN-001 |
| Source documents | LXA-TECH-HLD-001 v1.0, LXA-TECH-LLD-001 v1.0 (both baselined 1 May 2026) |
| Written | August 2026 |
| Covers | Space OS (M01–M20), Client Portal, Designer Console, Vendor Portal, Admin Console, Mobile app, Vastu-Tech AI, Virtual Staging, Material Recommendations, Public Design API, all supporting infrastructure |
| Does **not** cover | `luxeaxis-website` (this repo) — already in build. Its obligations to Space OS are specified in §14. |
| Status | **Option B funded.** Delivery model: development by Claude Code — see §9. Two decisions still open (§2.2, §2.3). |
| Implementation | `../luxeaxis-spaceos` — local Docker foundation and the sprint prompt library are built and verified. See below. |

> **The foundation exists.** `luxeaxis-spaceos` is scaffolded next to this repo with a running local Docker stack (Postgres+pgvector, Redis, MinIO, Keycloak, LocalStack, WireMock, Mailpit, Grafana/Loki/Tempo/Prometheus) and an executable prompt per sprint.
>
> - Stack and cloud-to-local substitution map: `../luxeaxis-spaceos/docs/local-foundation.md`
> - Sprint prompts S0–S14 and the Vastu track: `../luxeaxis-spaceos/docs/prompts/README.md`
> - Start it: `cd ../luxeaxis-spaceos && make setup`

---

## 0. How to read this plan

The LLD is a good document. It is specific enough to code against, which is rare, and its architectural instincts (modular monolith, symbolic Vastu engine, RLS at the database) are sound. This plan does not relitigate it.

What this plan adds is the thing the LLD deliberately left out: **an executable delivery model** — what gets built in what order, by how many people, at what cost, with what evidence that each step is done.

It also surfaces one uncomfortable arithmetic problem (§2.1) that must be settled before Sprint 0, because every downstream number depends on it.

Read §1–§3 for the decision. Read §4–§9 to run the build. Read §19 to start on Monday.

---

## 1. Scope

### 1.1 In scope

| # | Deliverable | Surfaces |
|---|---|---|
| D1 | **Space OS platform** — API, workers, scheduler, database, infrastructure | Backend |
| D2 | **Space OS Console** — internal workspace (Designer Console M05, project management M03, CRM M02, budget M08, snags M10) | React SPA |
| D3 | **Client Portal** (M04) | Responsive web + mobile |
| D4 | **Vendor Portal** (M09) | Responsive web |
| D5 | **Admin & Operations Console** (M19) | React SPA, SSO-gated |
| D6 | **Mobile application** — client tracking + field snag capture + AR (M12) | React Native / Expo |
| D7 | **Vastu-Tech AI** (M13) — perception model, rule engine, explanation layer, report renderer | Python services + GCP Vertex AI |
| D8 | **Virtual Staging Suite** (M14) | Python service + Vertex AI |
| D9 | **Material Recommendation Engine** (M15) | Python service + pgvector |
| D10 | **Notification fabric** (M16) — email, WhatsApp, SMS, push, in-app | Backend |
| D11 | **Subscription & Billing** (M17) | Backend + Razorpay |
| D12 | **Analytics & Reporting** (M18) | CDC → Snowflake → dbt → Metabase |
| D13 | **Public Design API** (M20) | External REST surface, Year 2 |
| D14 | **Shared platform assets** — design tokens, `Axis UI` component library, generated SDK, CI/CD, IaC, observability | Cross-cutting |

### 1.2 Explicitly out of scope for this plan

- The marketing website itself (this repo). Its build continues on its own track.
- Phase 1 no-code stack operations (Monday.com, Airtable, Milanote). In scope only as a **migration source** (§13).
- Business/commercial artefacts: pricing, sales process, marketing content production.
- Per-module production runbooks — authored sprint-by-sprint during build, not up front.

### 1.3 What "done" means for this plan

Space OS Phase 2 is done when **every active Luxe Axis project runs on Space OS and the Phase 1 no-code stack is switched off**, with the Six-Gate workflow enforced in software, clients transacting through the portal, and Vastu-Tech producing reviewed reports on internal projects.

That is the finish line. Everything below is sequencing toward it.

---

## 2. Three decisions that must be settled before Sprint 0

These are blocking. Sprint 0 can technically start without them, but Sprint 3 cannot.

### 2.1 The budget does not fit the scope — by roughly 5×

The HLD sets Phase 2 build CapEx at **Rs. 12–18 lakh** over Months 5–12 (§12.6), while simultaneously describing a team of **5 to 13 engineers** (§7 ADR rationale) and a 28-week sprint plan covering 20 modules including a patent-pending hybrid AI system and native AR on two platforms.

The arithmetic:

| Model | Blended monthly cost | 7 months | Verdict |
|---|---|---|---|
| Rs. 12–18 L as stated | — | Rs. 12–18 L | Funds **~1 senior engineer** for the period, or a small fixed-scope contract |
| 5-engineer in-house squad (Chennai, mid-senior) | ~Rs. 9–11 L | **Rs. 63–77 L** | Delivers the P1 module set |
| Full LLD scope (8–9 people incl. AI track) | ~Rs. 15–18 L | **Rs. 105–126 L** | Delivers everything in the LLD |
| Offshore/agency squad of 5 | ~Rs. 8–10 L | Rs. 56–70 L | Delivers P1, weaker on AI |

The stated budget is a **cloud-run-cost figure wearing a build-cost label**, or it assumes founder-CTO labour is free and uncosted. Either way it cannot be planned against.

**Three ways out. Pick one:**

| Option | Scope | Team | Cost | Timeline |
|---|---|---|---|---|
| **A — Fund the plan** | Full LLD P1 + P2 + Vastu-Tech beta | 8 (5 product, 2 AI, 1 DevOps) | Rs. 100–125 L | 30 weeks |
| **B — Cut to fit a real squad** *(recommended)* | P1 modules + Vastu-Tech **narrow** beta; defer AR, Virtual Staging, Materials, Public API to Year 2 | 5 + 1 fractional DevOps | Rs. 65–80 L | 30 weeks |
| **C — Hold the Rs. 18 L ceiling** | Six-Gate engine + Client Portal + Document Vault only. No CRM, no billing, no AI, no mobile. | 1 senior + founder | Rs. 15–20 L | 20 weeks, and the no-code stack stays live indefinitely |

**Recommendation: Option B.** It preserves the strategic moat (Six-Gate in software + Vastu-Tech) and the client-facing differentiation, defers everything whose revenue lands in Year 2 anyway, and is fundable without a raise. The rest of this plan is written against Option B, with Option A deltas marked `[+A]`.

> ### ✅ Resolved — August 2026
>
> **Option B is funded, and development will be done with Claude Code.**
>
> The delivery model changes the cost structure substantially and the calendar somewhat — but less than intuition suggests, because most of this project's critical path is not code-writing. See **§9** for the revised team, **§10** for revised cost, and **§9.4** for the honest analysis of what does and does not compress.

### 2.2 Vastu-Tech accuracy target vs. available training data

The HLD commits to **≥ 85% scoring accuracy vs. expert by Month 9**. The LLD sets Stage-1 metrics of Room mAP ≥ 0.88, north-arrow accuracy ≥ 0.95, end-to-end Plan-Model F1 ≥ 0.85 — and proposes bootstrapping from a 500-plan dataset in Sprint 0 (task 23).

500 plans, ~40% of which are internal projects from a studio that has not yet delivered at volume, is thin for a segmentation model expected to hit mAP 0.88 across five typologies plus hand-drawn scans. The synthetic-plan generator (30% of the corpus) is itself a project — a procedural floor-plan generator with controllable typology and style is 3–4 engineer-weeks before a single label exists.

**Decision required:** does Month 9 mean *"the pipeline runs end-to-end on internal projects with a designer correcting the Plan Model"* (achievable, and honestly what the LLD's own human-in-the-loop design at confidence < 0.80 already assumes), or *"85% unassisted accuracy"* (not achievable on this data volume in this window)?

**Recommendation:** redefine the Month 9 milestone as **"assisted beta"** — pipeline live, designer-in-the-loop mandatory, accuracy measured and published internally, no client sees an unreviewed report. Ship the unassisted target when the corpus crosses ~2,500 labelled plans, which the correction loop (LLD §4.13.3) will reach organically. Market it exactly as HLD risk R2 already prescribes: *"AI + human consultant certified."* That framing is both truthful and more valuable to a luxury client than an unattended score.

### 2.3 Where does the Six-Gate workflow's source of truth live during the transition?

Phase 1 runs projects on Monday.com. Phase 2 runs them on M03. There will be a period — realistically 8–12 weeks — where both exist and live projects are mid-gate.

**Decision required:** big-bang cutover at a project boundary, or dual-run with sync?

**Recommendation: cohort cutover, no sync.** New projects start on Space OS from the day M03 passes UAT. Existing projects finish their current gate on Monday.com, then migrate at the gate boundary (a natural transaction point — the gate sign-off is the atomic unit). No bidirectional sync is built; a one-way importer (§13) handles the migration. Building a two-way Monday.com sync would cost 4–5 engineer-weeks for a capability with a 10-week lifespan.

---

## 3. Recommended scope (Option B)

### 3.1 Module disposition

| Module | LLD priority | **This plan** | Rationale |
|---|---|---|---|
| M01 Identity, Tenancy, RBAC | P1 | **Build — Sprint 1** | Everything depends on it |
| M02 CRM & Lead Workflow | P1 | **Build — Sprint 3** | Website lead capture needs a destination |
| M03 Project & Six-Gate | P1 | **Build — Sprints 4–6** | The operational spine; the actual moat |
| M04 Client Portal | P1 | **Build — Sprints 6–8** | Client-visible differentiation |
| M05 Designer Console | P1 | **Build — Sprints 5–8** | Internal throughput |
| M06 Moodboard | P1 | **Build — Sprint 9** | |
| M07 Document Vault | P1 | **Build — Sprint 2** | Prerequisite for M03, M04, M13 |
| M08 Budget & BoQ | P1 | **Build — Sprints 9–10** | |
| M09 Vendor Portal | P2 | **Thin slice — Sprint 12** | RFQ + quote submission only; PO/delivery/payments deferred |
| M10 Snag & Punch List | P1 | **Build — Sprint 11** | Mobile-first; pairs with mobile track |
| M11 3D Progress Viewer | P2 | **Build — Sprint 10** | Cheap (embed + token minting); high perceived value |
| M12 AR Room Preview | P2 | **Defer to Year 2** | 10+ ew, two native runtimes, asset pipeline. Sales impact unproven. |
| M13 Vastu-Tech | P2 | **Build — parallel AI track, Sprints 2–13** | Strategic. Ships as assisted beta (§2.2). |
| M14 Virtual Staging | P3 | **Defer to Year 2** | Revenue is Year 2 by the HLD's own roadmap |
| M15 Material Recommendations | P3 | **Defer — spike only** | Needs closed-project data that does not exist yet |
| M16 Notification Service | P1 | **Build — Sprint 3** | Every module produces notifications |
| M17 Subscription & Billing | P2 | **Engagement billing only — Sprint 12** | SaaS subscriptions deferred with M20 |
| M18 Analytics & Reporting | P2 | **Minimal — Sprint 13** | Metabase on read replica; defer Snowflake/dbt to Year 2 |
| M19 Admin & Ops Console | P1 | **Build — Sprint 7** | Needed to operate the platform |
| M20 Public Design API | P3 | **Defer to Year 2** | Explicitly Year-2 in the HLD |

**Deferred:** M12, M14, M15, M20, plus the SaaS half of M17 and the warehouse half of M18.
**`[+A]`** Option A adds M12 and M14 back in Sprints 12–16 with the two extra engineers.

### 3.2 What deferral costs

Be explicit with the board about what is being traded:

- **No AR at sales stage.** The differentiation argument leans on the Client Portal, Vastu-Tech, and the Six-Gate transparency instead.
- **No Virtual Staging B2B revenue in Year 1.** This was Year-2 revenue in the HLD anyway.
- **Material recommendations stay manual.** The 18% delivery-cost reduction target (HLD §3) loses one of its levers; the Six-Gate automation and BoQ workflow carry it instead.
- **Analytics is dashboards-on-replica, not a warehouse.** Fine below ~50 concurrent projects; revisit when read replica contention appears.

---

## 4. Product surfaces and repositories

Per LLD §3, three repositories. This plan adds a fourth for the AI track and specifies the extraction of shared design tokens from the existing website.

| Repo | Contents | Owner | Status |
|---|---|---|---|
| `luxeaxis-spaceos` | Monorepo — API, workers, scheduler, console apps, shared packages, infra | Engineering Lead | **New** |
| `luxeaxis-website` | Next.js marketing site | Frontend Lead | **Exists** (this repo) |
| `luxeaxis-mobile` | Expo bare React Native | Mobile Engineer | **New — Sprint 10** |
| `luxeaxis-vastu` | Rule corpus, model training code, dataset manifests, model cards | AI Lead | **New — Sprint 1** |

### 4.1 Design tokens — extract from this repo first

This website already has a working Style Dictionary pipeline (`tokens/luxe-axis.tokens.json`, `scripts/build-tokens.ts`, `tokens/transforms.ts`). The LLD calls for the same tokens to feed both the console and the website (§8.3).

**Do not rebuild this.** Sprint 0 task: extract the tokens pipeline into `@luxeaxis/design-tokens`, publish to a private registry (GitHub Packages), and have this website consume it as a dependency. Two engineer-days, and it removes an entire class of brand-drift bugs before it starts.

The same applies to the `Logo` / brand-mark geometry work already done here — `MARK_PATHS` / `MARK_VIEWBOX` belong in `@luxeaxis/ui`, not duplicated per app.

### 4.2 The `luxeaxis-vastu` repo is separate on purpose

The LLD places Vastu code under `py-services/vastu-engine` in the monorepo. Split it:

- The **rule corpus is a trade secret** with a different access-control need than application code. LLD §4.13 says training data and rule encodings are protected as trade secrets — that is incompatible with every engineer and future contractor having read access to the main monorepo.
- Its release cadence is independent (LLD §4.13.8: "rule corpus updates ship independently of model updates").
- Model training needs GPU CI, large-file storage (LFS/DVC), and W&B integration that would bloat the monorepo's CI for everyone.

The monorepo keeps `services/vastu` — the thin orchestrator that calls the Vertex endpoint and the rule-engine Lambda. The corpus and the model live next door.

---

## 5. Architecture spine — decisions to lock in Sprint 0

The LLD's Appendix C lists ten ADRs to author. Author them in Sprint 0, not "within the first month" — an unwritten ADR is a decision that gets relitigated in code review three times.

| ADR | Decision | Lock by |
|---|---|---|
| ADR-001 | NestJS + Node 20 for core API; FastAPI only for AI-adjacent | Sprint 0 |
| ADR-002 | PostgreSQL 15 primary OLTP, logical tenancy via RLS | Sprint 0 |
| ADR-003 | Vastu-Tech hybrid neural + symbolic, never pure LLM | Sprint 0 |
| ADR-004 | AWS Mumbai primary, Singapore DR, multi-account | Sprint 0 |
| ADR-005 | Datadog unified observability | Sprint 0 |
| ADR-006 | Cognito (clients/vendors) + Okta (employees) | Sprint 0 |
| ADR-007 | Trunk-based, feature flags, expand-migrate-contract | Sprint 0 |
| ADR-008 | Cursor pagination, structured filters, idempotency keys, request IDs | Sprint 1 |
| ADR-009 | Next.js App Router + Sanity for the website | Already realised |
| ADR-010 | Expo bare + native ARKit/ARCore bridges | Sprint 10 (deferred with M12) |
| **ADR-011** | **Realtime transport** — resolve LLD Appendix D open item | Sprint 5 |
| **ADR-012** | **Monorepo boundary** — Vastu corpus split out (§4.2) | Sprint 0 |
| **ADR-013** | **Phase 1 migration** — cohort cutover, no dual-run sync (§2.3) | Sprint 0 |

### 5.1 Two refinements to the LLD I recommend

**Schema-per-context vs. single schema.** HLD §7 says "single Postgres instance with schema-per-bounded-context"; LLD §5 describes one flat schema with `tenant_id` everywhere. These conflict. **Take the LLD's flat schema.** Schema-per-context in PostgreSQL fights RLS policies, complicates Prisma migrations, and buys isolation the modular monolith already gets from module boundaries in code. Record the resolution in ADR-002.

**Cognito for clients is the highest-regret decision in the stack.** The HLD acknowledges its "rough developer experience" and picks it for data residency and predictable MAU cost. That reasoning holds, but Cognito's hosted-UI limitations, its awkward custom-attribute model, and its poor migration story out are real costs the team will pay weekly for years. If a re-open is possible, price WorkOS or a self-hosted Ory/Keycloak on the same VPC against it before Sprint 1 commits. If not, **budget 2 extra engineer-weeks in Sprint 1 for Cognito friction** — that is the honest number.

---

## 6. Workstreams

Eight parallel tracks. Each has a single accountable owner and a definition of done.

| # | Workstream | Owner | Runs | Done when |
|---|---|---|---|---|
| **W1** | Platform & Infrastructure | Cloud/DevOps | S0 → S13 | Prod, staging, sandbox in Terraform; zero console-made resources; DR drill passed |
| **W2** | Core Backend (M01, M03, M07, M08, M16) | Backend Lead | S1 → S11 | All P1 modules behind OpenAPI contracts with ≥ 80% coverage |
| **W3** | Console Frontend (M05, M19, CRM/project screens) | Frontend Lead | S2 → S13 | All internal workflows operable without database access |
| **W4** | Client & Vendor surfaces (M04, M09) | Frontend Eng | S6 → S12 | 10 clients transacting; WCAG 2.1 AA audit passed |
| **W5** | AI / Vastu-Tech (M13) | AI Lead | S1 → S13 | Assisted beta live on internal projects; model card published |
| **W6** | Mobile (snag capture, client tracking) | Mobile Eng | S10 → S14 | TestFlight + Play internal build; snag capture ≤ 30s end-to-end |
| **W7** | Integrations (HubSpot, Wati, Razorpay, DocuSign, Foyr) | Backend Eng | S2 → S12 | Each adapter has retry, circuit breaker, webhook intake, replay |
| **W8** | Quality, Security, Compliance | Tech Lead | S0 → S14 | Threat model signed; DPDPA pack complete; E2E suite green on staging |

---

## 7. Effort model

Estimates in **engineer-weeks (ew)**, including code review, tests, and documentation, excluding meetings and holidays. Overhead multiplier of 1.25 applied at the total.

### 7.1 In-scope modules

| Module | Backend | Frontend | Total ew |
|---|---:|---:|---:|
| M01 Identity, Tenancy, RBAC | 5 | 1 | **6** |
| M02 CRM & Lead Workflow | 3 | 2 | **5** |
| M03 Project & Six-Gate Engine | 6 | 2 | **8** |
| M04 Client Portal | 2 | 5 | **7** |
| M05 Designer Console | 1 | 5 | **6** |
| M06 Moodboard | 1 | 3 | **4** |
| M07 Document Vault | 4 | 1 | **5** |
| M08 Budget & BoQ | 4 | 2 | **6** |
| M09 Vendor Portal (thin slice) | 1.5 | 1.5 | **3** |
| M10 Snag & Punch List | 2 | 2 | **4** |
| M11 3D Progress Viewer | 2 | 1 | **3** |
| M16 Notification Service | 6 | — | **6** |
| M17 Engagement billing only | 4 | 1 | **5** |
| M18 Analytics (minimal) | 2 | 1 | **3** |
| M19 Admin & Ops Console | 2 | 3 | **5** |
| | | **Subtotal** | **76** |

### 7.2 Cross-cutting

| Item | ew |
|---|---:|
| W1 Platform, IaC, CI/CD, environments, DR | 14 |
| Design system extraction + `Axis UI` component library | 6 |
| W7 Integration adapters (5 partners) | 10 |
| W8 Security, threat model, DPDPA, a11y audit, pen-test remediation | 8 |
| E2E suite, load tests, staging data pipeline | 6 |
| Phase 1 data migration (§13) | 4 |
| | **48** |

### 7.3 AI track (parallel, separate people)

| Item | ew |
|---|---:|
| Rule DSL + forward-chaining engine + conflict table | 6 |
| Rule corpus encoding — 40 rules Sprint 0, 180 by S13 (with Vastu scholar) | 8 |
| Synthetic plan generator | 4 |
| Dataset assembly, labelling tool, annotator management | 6 |
| Stage-1 perception model — baseline → production checkpoint | 10 |
| DWG parser service | 3 |
| Explanation layer + report renderer + Tamil/English templates | 5 |
| Plan Model correction UI (designer surface) | 3 |
| MLOps — Vertex endpoints, registry, canary, drift monitors, model card | 5 |
| | **50** |

### 7.4 Totals

| Track | Raw ew | ×1.25 | Capacity available | Fit |
|---|---:|---:|---|---|
| Product (§7.1 + §7.2) | 124 | **155** | 5 eng × 30 wk = 150 ew | Tight — 5 ew short |
| AI (§7.3) | 50 | **63** | 2 eng × 30 wk = 60 ew | Tight — 3 ew short |

Both tracks land ~4% over capacity, which is the correct place to be at plan time: it means the scope cut in §3 was real and there is no fat left. **Absorb the gap by descoping M09 Vendor Portal and M18 Analytics entirely if Sprint 8 burndown is behind.** These are pre-ranked cut candidates, per HLD risk R1's "scope cuts ranked in advance."

**Ranked cut list (cut top-down when behind):**
1. M18 Analytics → Metabase manual queries, no in-app dashboards (−3 ew)
2. M09 Vendor Portal → vendors stay on email/WhatsApp (−3 ew)
3. M06 Moodboard → keep Milanote for one more quarter (−4 ew)
4. M11 3D Viewer → share Foyr links manually (−3 ew)
5. M17 Billing → Razorpay links issued manually from the dashboard (−5 ew)

That is 18 ew of pre-authorised relief. Do not cut M01, M03, M04, M07, or M16 — the platform does not function without them.

---

## 8. Delivery plan

Thirty sprints of one week each, or fifteen two-week sprints. **Use one-week sprints through Sprint 6** (fast feedback while the foundation is being poured), then two-week sprints. Numbering below is two-week sprints, S0–S14, ~30 weeks.

Anchor `S0 W1` to the date the fifth engineer starts. Do not anchor it to a funding date.

### Sprint 0 — Foundations (Weeks 1–2)
**Goal: an engineer can clone, run, test, and deploy a hello-world service to staging through CI.**

- W1: AWS Organization, three accounts, IAM Identity Center, Terraform bootstrap (S3 + DynamoDB state, GitHub OIDC), VPC/subnets/NAT in prod + staging
- W1: Route 53 zones, ACM, Secrets Manager, Parameter Store
- W1: Datadog, Sentry, PagerDuty wired to a canary service
- W2: Monorepo bootstrap — pnpm workspaces, Turborepo, shared tsconfig/ESLint/Prettier, CODEOWNERS, branch protection
- W2: NestJS `api-core` skeleton — health, metrics, structured logger (pino), error envelope, request-ID middleware
- W2: React `web-console` skeleton — auth shell, layout, design tokens
- W2: **Extract `@luxeaxis/design-tokens` from `luxeaxis-website`** and re-point the website at it
- W8: ADRs 001–007, 012, 013 written and merged
- W5: `luxeaxis-vastu` repo; GCP project; Vertex service account; VPC peering to AWS

**Exit gate:** green CI on all skeletons; a commit to `main` deploys to staging unattended; Datadog shows the trace.

### Sprint 1 — Identity is real (Weeks 3–4)
- M01 complete: tenants, users, roles, permissions, sessions, audit_log; RLS policies; seed role catalogue
- Cognito user pools (clients, vendors) + Okta workforce IdP with group→role mapping
- JWT issuance/refresh/revocation; Redis session allowlist; RBAC guard middleware
- Login flow with MFA, progressive backoff, lockout
- W5: rule DSL grammar defined; first 10 rules encoded with citations
- **Buffer: +2 ew for Cognito friction (§5.1)**

**Exit gate:** an employee logs in via Okta and a client via Cognito; both receive correctly-scoped JWTs; every write hits `audit_log`; RLS proven by a cross-tenant read attempt that returns zero rows.

### Sprint 2 — Documents and the shell (Weeks 5–6)
- M07 Document Vault: S3 per-env, SSE-KMS, versioning, presigned upload/download, soft delete, share links
- Watermarking worker (async PDF render)
- BullMQ worker + scheduler apps deployed
- W3: console app shell — sidebar, topbar, command palette, notification dock, drawer stack
- `@luxeaxis/ui` component library scaffolded on Radix + tokens; Storybook published
- W7: HubSpot OAuth app, sandbox tenant, adapter skeleton with retry + circuit breaker
- W5: synthetic plan generator started

**Exit gate:** a designer uploads a 40 MB drawing, it versions, a client-scoped share link returns a watermarked PDF, and the original never leaves the bucket.

### Sprint 3 — Leads and notifications (Weeks 7–8)
- M02 CRM: leads, qualifications, activities, audits, proposals; lead capture endpoint
- 30-minute first-response SLA job in BullMQ with escalation
- M16 Notification: EventBridge intake, template engine (MJML/Markdown), channel adapters for SES + Wati + in-app
- W7: Wati account, first approved WhatsApp template, webhook handler
- **This website's `/api` lead forms re-point to Space OS** (§14)

**Exit gate:** a form submission on luxe-axis.com creates a lead in Space OS, mirrors to HubSpot, fires a WhatsApp welcome, and escalates by SMS if untouched for 30 minutes.

### Sprints 4–6 — The Six-Gate engine (Weeks 9–14)
The centrepiece. Three sprints, because this is the module the company runs on.

- **S4:** projects, project_team, gate_definitions seeded G0–G6, project_gates, checklist items; state machine (PENDING → IN_PROGRESS → AWAITING_SIGNOFF → COMPLETED, plus SLIPPED / ROLLED_BACK)
- **S5:** gate advance flow with exit-criteria validation, atomic sign-off transaction with data snapshot, out-of-order rejection (409), wrong-role rejection (403), on-hold SLA pause; ADR-011 realtime decision
- **S5:** SLA slip detection scheduler; Head of Ops dashboard tile
- **S6:** change orders; project timeline aggregation; gate KPI endpoints
- **S5–S6:** W3 console screens — project list (Kanban by gate), project detail, gate sign-off drawer, change-order modal
- **S6:** M05 Designer Console screens — overview, design, drawings, BoQ stub, team

**Exit gate (the important one):** run **three real internal projects** through G0→G1→G2 entirely in Space OS, in parallel with Monday.com, and diff the outcomes. Any divergence is a bug in the gate model, not in the data.

### Sprints 6–8 — Client Portal (Weeks 13–18)
- M04: dashboard, timeline, budget view, documents, approvals queue, inbox
- **Approval action surface** built first — it is the operationally critical one (LLD §4.4). Double-confirm modal, signed approval events with timestamp + IP, full audit trail.
- Mobile-responsive throughout; offline read-cache for the dashboard
- English + Tamil at parity; translator workflow live
- WCAG 2.1 AA sweep with NVDA and VoiceOver
- **S7:** M19 Admin Console — tenant directory, user admin, feature flags, audit log explorer, integration health

**Exit gate:** five real clients using the portal for a live gate approval. Approval-to-audit-record traceability verified by the Tech Lead.

### Sprints 9–11 — Money, materials, snags (Weeks 19–24)
- **S9:** M08 Budget & BoQ — budgets, categories, lines, vendor quotes, approval threshold ladder; client-facing aggregated view
- **S9:** M06 Moodboard — grid editor, reactions, comments, attribution preservation
- **S10:** M11 3D Progress Viewer — Foyr scene registration, short-lived signed embed tokens, progress media, weekly montage job
- **S10:** W6 mobile repo bootstrap — Expo bare, auth, offline SQLite cache, sync state UI
- **S11:** M10 Snag & Punch List — full workflow, mobile capture flow, client sign-off, 48h HIGH-severity escalation

**Exit gate:** a site supervisor logs a snag from a phone on a real site in under 30 seconds, offline, and it syncs on reconnect.

### Sprints 12–13 — Commerce, integrations, analytics (Weeks 25–28)
- **S12:** M17 engagement billing — payment schedule from gate plan, Razorpay payment links, receipts, GST place-of-supply, dunning ladder, nightly reconciliation
- **S12:** M09 Vendor Portal thin slice — RFQ view, quote submission, OTP magic-link auth
- **S12:** W7 DocuSign adapter for engagement letters and > Rs. 5L change orders
- **S13:** M18 minimal analytics — Metabase on read replica, five leadership dashboards
- **S13:** W5 **Vastu-Tech assisted beta goes live** on internal projects

**Exit gate:** an invoice issues automatically on gate sign-off, the client pays by UPI, the receipt lands, and the payment reconciles against the settlement report the next morning without human touch.

### Sprint 14 — Hardening and cutover (Weeks 29–30)
- Full Playwright E2E suite green on staging
- k6 load test at 3× projected Year-1 concurrency
- External penetration test; remediation of all critical and high findings
- DR failover drill to ap-southeast-1; measured time-to-promote and time-to-serve
- Accessibility audit sign-off
- DPDPA compliance pack complete: consent flows, DSR runbook, retention map
- **Phase 1 migration executed** (§13); Monday.com/Airtable set read-only

**Exit gate = Phase 2 production launch.** All clients on Space OS. No-code stack decommissioned.

### 8.1 Milestone map

| Milestone | Sprint | Week | Owner |
|---|---|---|---|
| CI deploys to staging unattended | S0 | 2 | Tech Lead |
| First real login, RLS proven | S1 | 4 | Backend Lead |
| Lead capture live from website | S3 | 8 | Backend Lead |
| **Space OS alpha — internal users only** | S6 | 14 | Engineering Lead |
| First client gate approval in the portal | S8 | 18 | Frontend Lead |
| Snag capture from field mobile | S11 | 24 | Mobile Eng |
| **Vastu-Tech assisted beta** | S13 | 28 | AI Lead |
| **Phase 2 production launch, no-code off** | S14 | 30 | CTO |

Against the HLD's key dates: alpha lands at Month ~8 as planned; Vastu beta at Month ~9 as planned (redefined per §2.2); production launch at Month ~12 as planned. **The published milestones survive the scope cut.** That is the point of cutting scope rather than schedule.

---

## 9. Delivery model — development with Claude Code

### 9.1 The central point

**Claude Code compresses code-writing. Code-writing is not this project's critical path.**

Of the 155 engineer-weeks in §7, roughly 60% is producing code and 40% is specification, decision-making, integration, verification, and work that requires humans in rooms. Only the first part compresses sharply. And the *calendar* is gated by a handful of milestones that do not compress at all:

| Gate | Why it cannot compress | Minimum |
|---|---|---|
| Gate criteria capture (S4) | Requires the Head of Operations' time and judgement | 2 working sessions |
| **Parallel run (S6)** | Three real projects must actually progress through real gates | **2 calendar weeks, irreducible** |
| Client Portal UAT (S8) | Five real clients must complete real approvals | 2 weeks |
| Vastu corpus authoring | 180 rules reviewed by Vastu scholars | scholar-hours, not agent-hours |
| Plan annotation | Human labelling of the training corpus | annotator-hours |
| Penetration test (S14) | External party, scheduled | 1–2 weeks + remediation |
| Phase 1 migration (S14) | PM verification per project; reconciliation | 2 weeks |

Add those up and the floor is roughly **16 weeks** regardless of how fast code appears.

**Revised plan: 20 weeks (10 two-week sprints), not 30.** That is a real ~33% compression, and it is honest. A plan claiming 8 weeks would be assuming the Head of Operations can confirm gate criteria in an afternoon and that three real projects can traverse three gates in a fortnight of wall-clock time they do not have.

### 9.2 Where the bottleneck moves

From *writing* to *reviewing and verifying*.

This is the single most important consequence, and it is easy to get wrong. Agent-written code arrives faster than humans can meaningfully review it. Unreviewed-but-plausible code merged at volume is a worse outcome than slower delivery, because the defects it carries are the confident kind that tests written by the same agent do not catch.

Three structural responses, all already in the plan and now load-bearing:

1. **The ≤ 400-line PR limit becomes stricter, not looser.** Six small PRs beat one large one even when the large one is easier to generate. A 2,000-line PR gets skimmed, and a skimmed review is no review.
2. **Exit gates carry the weight.** Every sprint prompt ends in a demo on real data to a named human. That is now the primary quality control, above code review.
3. **Negative tests are mandatory.** The cross-tenant isolation suite, the "resolved requires a photo" rejection, the unreviewed-Vastu-report 404 — these are what catch confidently-wrong code. `CLAUDE.md` §8 enumerates the agent-specific failure modes to watch for.

⚠ **Budget review capacity explicitly.** A senior engineer can meaningfully review roughly 400–800 lines of unfamiliar code per day. Two reviewers is the realistic ceiling on merge throughput, and that — not generation speed — sets the pace.

### 9.3 Revised roster

| Role | FTE | From | Changed from §9.1 draft | Notes |
|---|---:|---|---|---|
| Engineering Lead / architect | 1.0 | S0 | — | Owns ADRs, reviews everything, sets agent tasking |
| Senior engineer (operator + reviewer) | 2.0 | S0 | **−2** | Drives Claude Code, reviews output, owns integration |
| AI/ML Lead | 1.0 | S0 | — | W5. Vastu governance does not compress |
| ML engineer | 0.5 | S2 | **−0.5** | Training pipeline; agent-assisted |
| Cloud/DevOps | 0.5 | S0 | — | Terraform, CI, environments |
| QA / verification engineer | 0.5 | S2 | **+0.5** | New. Owns E2E, negative-test coverage, exit-gate evidence |
| Vastu scholar consultant | 0.2 | S0 | — | Retained |
| Annotators | 2.0 | S2 | — | Human labelling does not compress |
| **Total engineering FTE** | **5.7** | | **−2.5** | |

Two changes worth defending:

- **Backend and frontend collapse into "senior engineer".** The specialisation mattered when throughput was per-person typing speed. Under agent development the scarce skill is judgement about correctness across the stack, which is one role.
- **A QA/verification engineer is added.** This is a net *increase* in a role most teams cut first. Given §9.2, it is the highest-leverage half-FTE in the plan.

Still required, unchanged: the Head of Operations' time (S4, S6), five real clients (S8), Vastu scholars, annotators, and an external pen tester.

### 9.4 What compresses, and by how much

Honest estimates. Treat as planning assumptions to be revised after Sprint 2 with real data.

| Work type | Share of §7 effort | Compression | Reasoning |
|---|---|---|---|
| CRUD, schema, migrations, DTOs, adapters | ~35% | **4–6×** | Highly patterned; the prompts specify it precisely |
| UI screens from a defined component library | ~15% | **3–5×** | Same |
| Tests | ~15% | **3–4×** | Fast to generate; needs review for test theatre |
| Integration, debugging, environment work | ~15% | **1.5–2×** | Bounded by real systems misbehaving |
| Specification, decisions, ADRs | ~10% | **1×** | Human judgement |
| Review and verification | ~10% | **0.7×** | *Slower* — more code to review per unit time |

Weighted: roughly **2.5–3× on effort**, translating to ~20 weeks against the human-gated floor of ~16.

⚠ Note the last row. Review is the one activity that gets *harder*. Plan for it rather than discovering it in Sprint 4.

### 9.5 Revised sprint map

The §8 sprint content is unchanged — the same work in the same order with the same exit gates. Sprints compress; the human-gated ones do not.

| New sprint | Was | Weeks | Content | Compressed? |
|---|---|---|---|---|
| S0 | S0 | 1–2 | Foundations | Partly — **already done**, see §9.7 |
| S1 | S1–S2 | 3–4 | Identity + Document Vault | Yes |
| S2 | S3 | 5–6 | CRM + Notifications | Yes |
| S3 | S4–S5 | 7–8 | Gate engine + sign-off + SLA | Partly — gate criteria capture is human-gated |
| **S4** | **S6** | **9–10** | Console + **parallel run** | **No — 2 real weeks** |
| S5 | S7 | 11–12 | Admin Console | Yes |
| **S6** | **S8** | **13–14** | Client Portal + **client UAT** | **No — 2 real weeks** |
| S7 | S9–S10 | 15–16 | Budget, Moodboard, 3D, mobile foundation | Yes |
| S8 | S11–S12 | 17–18 | Snags, billing, vendor portal | Partly — field testing is human-gated |
| **S9** | **S13–S14** | **19–22** | Vastu beta, analytics, hardening, **migration** | **No — pen test + migration** |

The Vastu track (S1→S9) still runs in parallel and is paced by corpus authoring and annotation, not by code.

**Milestones hold or improve:** alpha at week 10 (was 14), Vastu beta at week 20 (was 28), production launch at week 22 (was 30).

### 9.6 Cadence

| Ritual | When | Output |
|---|---|---|
| Sprint planning | Day 1 | Committed scope; which prompts run |
| **Daily review block** | Daily, 90 min, protected | Merge queue cleared. **The pacing mechanism.** |
| Burndown review | Weekly | Cut-list decision if behind (§7.4) |
| Demo | Last day of sprint | Working software on real data |
| Retro | Last day of sprint | ≤ 3 owned actions |
| Architecture review | Weekly | ADRs merged or explicitly deferred |
| AI review | Fortnightly | Model metrics, slice analysis, corpus changes |

The daily review block replaces the standup as the load-bearing ritual. If it is skipped for two days, the merge queue becomes the bottleneck and stays that way.

**The weekly burndown review keeps its teeth.** >20% behind at midpoint → the top item on the ranked cut list is cut that day. Not discussed — cut.

### 9.7 Sprint 0 status

Already substantially delivered and verified:

- ✅ Local Docker stack — 14 services, all healthy
- ✅ Postgres role model with RLS proven (superuser/owner/app separation)
- ✅ Keycloak two-realm identity issuing tokens with tenant claims
- ✅ LocalStack (queues, DLQs, event rules, KMS, secrets, SSM), MinIO with versioning, WireMock with failure scenarios, Mailpit, Grafana stack
- ✅ Environment doctor
- ✅ Sprint prompt library S0–S14 + Vastu track
- ✅ `CLAUDE.md` operating contract
- ⬜ App skeletons (`api-core`, `web-console`, `worker`, `scheduler`)
- ⬜ CI/CD pipeline
- ⬜ Cloud foundations — **blocked on AWS account provisioning**
- ⬜ Nine ADRs
- ⬜ `@luxeaxis/design-tokens` extraction from the website

---

## 10. Cost model

### 10.1 Build (Option B via Claude Code, 22 weeks ≈ 5 months)

| Line | Monthly | 5 months |
|---|---:|---:|
| Engineering Lead / architect | Rs. 2.8 L | Rs. 14.0 L |
| Senior engineers × 2 | Rs. 4.4 L | Rs. 22.0 L |
| AI/ML Lead | Rs. 3.0 L | Rs. 15.0 L |
| ML engineer (0.5, from S2) | Rs. 1.1 L | Rs. 4.4 L |
| Cloud/DevOps (0.5) | Rs. 1.2 L | Rs. 6.0 L |
| QA / verification (0.5, from S2) | Rs. 1.0 L | Rs. 4.0 L |
| Vastu consultants × 2 (retained) | Rs. 1.2 L | Rs. 6.0 L |
| Annotators × 2 (contract, from S2) | Rs. 0.7 L | Rs. 2.8 L |
| **Claude Code seats + usage** | Rs. 1.5–2.5 L | Rs. 7.5–12.5 L |
| Recruitment fees (2 senior hires @ 8.33%) | — | Rs. 4.0 L |
| External pen test + security review | — | Rs. 3.5 L |
| **Total build** | | **Rs. 89–94 L** |

Against the §9.1 draft roster (Rs. 141.6 L over 7 months), that is a **~35% reduction and two months earlier** — from fewer heads for less time, partly offset by tool spend and the added QA half-seat.

> ⚠ **Two cautions on this number.**
>
> The Claude Code usage line is the least certain in the table. It scales with how much iteration each sprint takes, and heavy Vastu and E2E work will push toward the upper end. Track it monthly from Sprint 1 and revise this row with real data rather than defending the estimate.
>
> And the saving is contingent on §9.2: if review capacity is not protected, the practical outcome is the same calendar with more defects, not a cheaper build. The Rs. 89–94 L assumes the daily review block actually happens.

> Compare: HLD §12.6 states Rs. 12–18 L for Phase 2. Even under this model the board is approving roughly **5× the stated CapEx**. The gap was never about delivery method — it was that the original figure costed no engineering labour at all.

### 10.2 Run (monthly, at Phase 2 launch)

| Item | Monthly |
|---|---:|
| RDS PostgreSQL r6g.xlarge Multi-AZ + 2 replicas | Rs. 62,000 |
| ECS Fargate (api, worker, scheduler; ~8 tasks avg) | Rs. 28,000 |
| ElastiCache Redis 7 (2-node) | Rs. 12,000 |
| S3 + CloudFront + data transfer | Rs. 15,000 |
| Vertex AI endpoints (min-1 GPU for Vastu) | Rs. 45,000 |
| Datadog (8 hosts, APM, RUM, logs) | Rs. 38,000 |
| Sentry, PagerDuty, Statuspage | Rs. 9,000 |
| Cognito (MAU-based, Y1 volume) | Rs. 4,000 |
| Wati, Razorpay fees, SES, DocuSign | Rs. 22,000 |
| Vercel Pro (website) | Rs. 8,000 |
| Sanity, GitHub, misc SaaS | Rs. 11,000 |
| **Total run** | **≈ Rs. 2.54 L/month** |

The HLD projects Rs. 60,000–1,20,000/month for Phase 2. The gap is almost entirely **Vertex AI min-1 GPU (Rs. 45 K) and Datadog (Rs. 38 K)**.

**Two levers if the run cost must come down:**
- **Drop the Vertex min-1 instance** and accept 40–90s cold starts on Vastu jobs. Vastu is an asynchronous batch job with a 120s SLO — a cold start is invisible to the user. **Saves ~Rs. 38 K/month.** Do this; the LLD's min-1 rule was written for a latency requirement Vastu does not actually have.
- **Start on Datadog's smaller tier or Grafana Cloud** until traffic justifies full APM+RUM. Saves ~Rs. 22 K/month, costs some debugging speed. Judgement call; recommend keeping Datadog through launch and reviewing at Month 15.

With the Vertex change: **≈ Rs. 2.16 L/month.** Still above the HLD figure, but defensible line by line.

---

## 11. Vastu-Tech track detail (W5)

The rest of the platform is well-understood engineering. This is the part with genuine technical risk, so it gets its own plan.

### 11.1 Sequencing

| Sprint | Milestone | Evidence |
|---|---|---|
| S0 | Repo, GCP project, Vertex service account, VPC peering | `hello-vertex` inference returns |
| S1 | Rule DSL grammar + evaluator skeleton; 10 rules encoded | Rules parse; engine runs on a hand-written Plan Model |
| S2–S3 | Synthetic plan generator; labelling tool; annotator onboarding | 200 synthetic + 100 labelled real plans |
| S4–S5 | Baseline perception model trained; metrics recorded | Model card v0.1; mAP measured, not yet at target |
| S5 | DWG parser service (the non-ML happy path) | DWG → Plan Model with no model involved |
| S6–S7 | Corpus to 90 rules; conflict priority table | Two scholars agree on the priority ordering |
| S8–S9 | Perception model iteration 2; correction UI in Designer Console | Designer corrects a Plan Model; correction persists to training set |
| S10–S11 | Explanation layer + report renderer; Tamil + English templates | Branded PDF lands in Document Vault |
| S12 | Corpus to 180 rules; end-to-end pipeline on staging | Full pipeline, real plan, ≤ 120s median |
| S13 | **Assisted beta live**; drift monitors; canary machinery | Reports on internal projects, every one designer-reviewed |

### 11.2 Non-negotiables

- **The DWG path ships before the neural path.** Most Luxe Axis inputs are CAD. A deterministic DWG → Plan Model parser gives a working product with zero ML risk, and makes the perception model an enhancement rather than a dependency. The LLD already permits this (§4.13.3) — this plan promotes it from fallback to primary.
- **No report reaches a client unreviewed during beta.** Enforced in code, not policy: `vastu_reports` has no client-visible state until a designer sets `reviewed_by`.
- **The LLM never adds a claim.** LLD §4.13.5's diffing step is a hard gate — implement it in Sprint 10 alongside the explanation layer, with a test suite of adversarial findings that try to make the model hallucinate a principle.
- **Corpus releases are signed and two-person-approved.** Wire this into the Admin Console (M19) in Sprint 7, before there is a corpus worth protecting.

### 11.3 The measurement that matters

Track **human-correction rate** as the headline metric, not F1. It is the number that predicts whether the product is economically viable: if a designer must correct 60% of Plan Models, Vastu-Tech is costing more time than it saves regardless of what the F1 says. Publish it weekly from S8.

---

## 12. Mobile track detail (W6)

Deferring AR (M12) makes the mobile app much simpler: it becomes a React Native client for existing APIs plus a camera flow.

| Sprint | Scope |
|---|---|
| S9 | Expo bare bootstrap, auth (Cognito + secure storage), app shell, tab navigation |
| S10 | Offline-first layer — SQLite cache, mutation queue, per-entity sync badges, conflict rules |
| S11 | Snag capture flow (camera, room auto-suggest, category, submit ≤ 30s); background photo upload |
| S12 | Client project tracking screens (dashboard, timeline, approvals) |
| S13 | Push notifications (Expo Push → APNs/FCM), deep links matching M16 categories |
| S14 | TestFlight + Play internal; phased production rollout 10% → 50% → 100% |

**No native modules in Option B.** That means Expo managed workflow is viable, not bare — a meaningful simplification. Revisit only when M12 (AR) is scheduled, at which point ejecting to bare is a one-sprint task.

---

## 13. Migration from the Phase 1 no-code stack

Four engineer-weeks, executed in S13–S14, per the cohort-cutover decision (§2.3).

| Source | Target | Approach |
|---|---|---|
| Monday.com — projects, tasks, timelines | M03 projects + project_gates | One-way importer; map boards to gates manually per project (low volume, high stakes — do not automate the mapping) |
| Airtable — budget dashboards | M08 budgets, categories, lines | CSV export → validated importer; reconcile totals to the rupee before cutover |
| Google Drive — documents | M07 Document Vault | Bulk S3 upload with folder → `folder`/`kind` mapping; SHA-256 verified per file |
| Milanote — moodboards | M06 moodboards | Manual re-creation for active projects only; archive the rest as PDF into the Vault |
| Wati — WhatsApp history | M02 lead_activities | Import last 90 days as activity rows; older history stays in Wati |
| Typeform — questionnaires | M02 leads | Export → lead rows with `source = TYPEFORM_LEGACY` |

**Cutover rules:**
1. Migration runs against staging first with a full production copy. Reconciliation report reviewed by Head of Operations.
2. Production migration runs in a declared window with the no-code tools set read-only *before* the export.
3. Every migrated project gets a manual verification pass by its PM before the project is marked `MIGRATED`.
4. No-code subscriptions are kept live (read-only) for 90 days post-cutover, then cancelled.

---

## 14. Contract between this website and Space OS

`luxeaxis-website` (this repo) has four obligations. Each is a small piece of work here that unblocks a large piece of work there.

| # | Obligation | Consumed by | Due |
|---|---|---|---|
| 1 | **Consume `@luxeaxis/design-tokens`** instead of the local `tokens/` pipeline | All Space OS surfaces | S0 |
| 2 | **Lead capture posts to Space OS** `POST /api/v1/leads` with a scoped public API key, replacing the current direct-to-HubSpot path. Persist locally first, enqueue the sync — never lose a lead to a Space OS outage. | M02 | **✅ Endpoint ready** — see contract below |
| 3 | **Fee calculator + Vastu micro-tool submit as leads** with `source_detail` identifying the tool and the captured inputs in `message`/`utm_*` | M02, M13 | S3 / S13 |
| 4 | **Client portal link in the site header** once M04 is live, pointing at the Space OS portal domain | M04 | S8 |

The website continues to own its own content, SEO, and performance budgets. Space OS never renders marketing pages, and the website never reads the Space OS database directly.

### 14.1 Lead capture contract — ready now

```http
POST /api/v1/leads
x-api-key: <issued via the Admin Console; local dev key in migration 009>
content-type: application/json

{
  "source": "WEBSITE",              // or FEE_CALCULATOR, VASTU_TOOL, …
  "source_detail": "contact-form",
  "full_name": "Anjali Raman",      // required
  "email": "anjali@example.com",    // email OR phone required
  "phone": "+91 90000 12345",
  "project_type": "3BHK apartment",
  "budget_range": "20-30L",
  "message": "…",
  "utm_source": "google",
  "utm_campaign": "chennai-interiors"
}
```

```jsonc
// 201
{ "data": { "id": "019fe788-…", "type": "leads",
            "attributes": { "status": "NEW",
                            "sla_fire_at": "2026-08-10T03:30:54.750Z",
                            "sla_deferred": true,
                            "possible_duplicate_count": 1 } },
  "meta": { "request_id": "req_019fe788-…" } }
```

| Response | Meaning |
|---|---|
| `201` | Captured. `sla_fire_at` is when escalation would fire; `sla_deferred` means it fell outside business hours. |
| `400` | Validation failed — name missing, no contact method, or an unrecognised `source`. |
| `401` | Missing, unknown, revoked, or expired key. Deliberately indistinguishable. |
| `403` | Key lacks the `lead.create` scope. |
| `429` | Per-key rate limit exceeded. |

⚠ **The website must still persist locally before calling this.** A lead lost to a Space OS outage is a lost client, and the loss is invisible.

⚠ `possible_duplicate_count` is a count, never a list of ids. Returning ids would let an unauthenticated caller probe whether a given email is already a client.

---

## 15. Quality gates and Definition of Done

### 15.1 Definition of Done — per story

A story is done when **all** of the following are true. No partial credit.

- [ ] Code merged to `main` via PR with ≥ 1 review (2 for `/security`, `/payments`, `/vastu`, `/auth`)
- [ ] Unit tests written; module coverage ≥ 80%
- [ ] OpenAPI spec regenerated and committed
- [ ] Error paths return the canonical envelope with a stable error code
- [ ] Structured logs emitted with `request_id`, `tenant_id`, `user_id`; PII redacted
- [ ] RLS policy present and proven by a negative test if a new table was added
- [ ] Migration reviewed for lock duration and index strategy
- [ ] Feature-flagged if risky; flag and migration documented together in the PR
- [ ] Deployed to staging and exercised by the story's author against real data

### 15.2 CI gates (fail the build)

| Gate | Threshold |
|---|---|
| Lint / format | Zero warnings |
| Typecheck | `tsc --noEmit` clean; `mypy --strict` clean |
| Unit coverage | ≥ 80% |
| Trivy | Zero criticals |
| Bundle size | Per-route JS ≤ 180 KB gzipped |
| Contract tests | Pact verification green |
| E2E smoke | Five critical journeys (LLD §17.2) green on the preview environment |

### 15.3 Sprint-level gates

No sprint is accepted without a **working demo to the CTO and Head of Operations on real or realistic data**. A demo on seeded fixtures is not a demo. This single rule catches more integration rot than any amount of test coverage.

---

## 16. Infrastructure build order (W1)

Sequenced so each layer is usable before the next depends on it.

| Order | Layer | Sprint |
|---:|---|---|
| 1 | AWS Organization, accounts, Identity Center, SCPs | S0 W1 |
| 2 | Terraform bootstrap — remote state, locking, GitHub OIDC | S0 W1 |
| 3 | Networking — VPC, 3 AZs, private/public subnets, NAT, SGs, no inbound SSH | S0 W1 |
| 4 | Shared services — Route 53, ACM, Secrets Manager, Parameter Store, KMS keys | S0 W1 |
| 5 | Observability baseline — Datadog agent, Sentry, PagerDuty, Statuspage | S0 W1 |
| 6 | Datastores — RDS Multi-AZ + replicas, ElastiCache, S3 with lifecycle | S0 W2 |
| 7 | Compute — ECS clusters (api, worker), ALB, ECR with Cosign signing | S0 W2 |
| 8 | CI/CD — GitHub Actions with OIDC, staging auto-deploy, prod manual gate | S0 W2 |
| 9 | Edge — CloudFront, Cloudflare WAF/DDoS, API Gateway for webhook intake | S2 |
| 10 | GCP — Vertex project, service accounts, private connectivity to AWS VPC | S0 W2 |
| 11 | DR region — replica, warm standby, Route 53 failover, Terraform plan pre-validated | S12 |
| 12 | DR drill executed and timed | S14 |

**Rule, enforced from day one:** no resource exists that Terraform did not create. Console changes are permitted only in a declared incident and must be reconciled into code within 48 hours or reverted.

---

## 17. Security, privacy, and compliance track (W8)

| Item | Sprint | Owner | Output |
|---|---|---|---|
| Threat model of the target architecture (STRIDE) | S1 | Tech Lead + external advisor | Threat-model document with ranked mitigations |
| RLS negative-test suite (cross-tenant reads must return zero rows) | S1 | Backend Lead | Test suite in CI |
| Secrets hygiene — scanner in CI, no secrets in images or logs | S0 | DevOps | CI job |
| DPDPA consent flows, DSR runbook, retention map | S6 | Tech Lead + counsel | Compliance pack |
| PII redaction list, centralised at the log boundary | S2 | Backend Lead | Redactor module + test |
| Document access audit — every download logged immutably | S2 | Backend Lead | Audit table + explorer |
| Vastu two-person corpus promotion | S7 | AI Lead | Admin Console workflow |
| Accessibility audit (WCAG 2.1 AA, NVDA + VoiceOver) | S13 | Frontend Lead | Audit report, defects fixed |
| External penetration test | S14 | Tech Lead | Report; all critical + high remediated before launch |
| Quarterly access review process | S14 | CTO | Documented process, first review executed |
| SOC 2 Type I groundwork (Vanta) | Year 2 | CTO | Deferred per HLD |

**One addition to the LLD's security posture:** the audit log's tamper-evidence design (LLD §18.5 — "cryptographic chain hash per day") needs a verification job, not just a generation job. A hash chain nobody checks is decoration. Add a daily verifier that recomputes the chain and pages on mismatch. Half an engineer-day, S2.

---

## 18. Risk register (build-specific)

The HLD's register (R1–R12) covers business and platform risk. These are the risks specific to *executing this build*.

| # | Risk | P | I | Trigger to watch | Mitigation |
|---|---|---|---|---|---|
| ~~B1~~ | ~~Budget decision unresolved~~ | — | — | — | **Closed Aug 2026 — Option B funded, Claude Code delivery (§9).** |
| **B11** | **Review capacity becomes the bottleneck** | **High** | **High** | Merge queue older than 2 days; PRs over 400 lines merging | The daily review block is protected time. Enforce the PR size limit mechanically in CI. If the queue backs up, slow generation — do not skim. |
| **B12** | **Confidently-wrong code passes review** | Med | **Critical** | A defect found in staging that tests covered "green" | Negative tests mandatory (`CLAUDE.md` §8). Exit-gate demos on real data are the primary control, above code review. |
| **B13** | Claude Code usage cost runs above estimate | Med | Low | Monthly spend above Rs. 2.5 L | Track from S1; revise §10.1 with real data. Cost is small relative to headcount — do not optimise it at the expense of review discipline. |
| B2 | ML Engineer hire slips >8 weeks | Med | High | No offer accepted by S-2 | AI Lead does baseline model solo; DWG path (§11.2) carries the product meanwhile |
| B3 | Six-Gate model doesn't match how Ops actually works | Med | Critical | Divergence in the S6 three-project parallel run | The S6 exit gate exists precisely to catch this. Budget one extra sprint for gate-model rework. |
| B4 | Cognito friction exceeds the 2-ew buffer | Med | Med | Sprint 1 burndown | Escalate to ADR-006 re-open; WorkOS as the pre-priced alternative |
| B5 | Client Portal a11y/Tamil parity discovered late | Med | Med | S8 demo reveals gaps | Tamil strings authored *with* the English, not after; a11y linting in CI from S2 |
| B6 | Vertex + Datadog run cost overshoots (§10.2) | High | Med | First full month's bill | Vertex min-1 dropped at launch; cost alarms at 80% of budget from S0 |
| B7 | Phase 1 migration data quality is worse than assumed | Med | High | Staging dry-run reconciliation fails | Dry-run in S13 with a full production copy — two sprints of runway to fix |
| B8 | Vastu corpus authoring blocked on scholar availability | Med | High | Rule count behind the S6 / S12 checkpoints | Retain two scholars, not one; front-load the 40 highest-frequency rules |
| B9 | Scope creep from stakeholder demos | High | Med | Sprint scope grows mid-sprint | Demos generate backlog items, never in-sprint work. Enforced by the Engineering Lead. |
| B10 | The website and Space OS design systems diverge | Med | Low | Visual drift between surfaces | §4.1 token extraction in S0, before either can drift |

---

## 19. Sprint 0 checklist

The LLD's §19 list (29 tasks) is good. This version sequences it by dependency, assigns it to the two-week window, and adds the tasks the LLD omits.

### Week 1 — Cloud and control

| # | Task | Owner | Output |
|---:|---|---|---|
| 1 | AWS Organization; prod/staging/sandbox accounts; IAM Identity Center; SCPs | Cloud | Account IDs documented |
| 2 | Terraform bootstrap — S3 state + DynamoDB lock + GitHub OIDC trust | Cloud | `luxeaxis-terraform-bootstrap` |
| 3 | GitHub org, CODEOWNERS, branch protection, required checks | Tech Lead | Settings recorded in repo |
| 4 | Route 53 zones, ACM certs, Secrets Manager, Parameter Store, KMS keys | Cloud | Terraform module |
| 5 | VPC, 3 AZs, subnets, NAT, security groups (prod + staging) | Cloud | Network diagram + Terraform |
| 6 | Datadog, Sentry, PagerDuty, Statuspage wired to a canary service | Tech Lead | Working dashboards |
| 7 | Cost alarms at 50/80/100% of monthly budget, per account | Cloud | Budget alarms live |
| **8** | **Write ADRs 001–007, 012, 013** | Tech Lead | Merged to `docs/adrs/` |
| **9** | **Decide §2.1 budget option; record it** | CTO | Signed scope decision |

### Week 2 — Code and skeletons

| # | Task | Owner | Output |
|---:|---|---|---|
| 10 | RDS Multi-AZ (prod + staging) + read replicas | Cloud | Connection details + runbook |
| 11 | ElastiCache Redis with ACL | Cloud | Runbook |
| 12 | S3 buckets — versioning, lifecycle, SSE-KMS, MFA-delete on critical | Cloud | Bucket inventory |
| 13 | Monorepo bootstrap — pnpm, Turborepo, tsconfig, ESLint, Prettier | Tech Lead | `luxeaxis-spaceos` |
| 14 | NestJS `api-core` — health, metrics, pino logger, error envelope, request-ID | Backend Lead | Service template |
| 15 | React `web-console` — auth shell, layout, tokens | Frontend Lead | App template |
| 16 | **Extract `@luxeaxis/design-tokens`; re-point `luxeaxis-website` at it** | Frontend Lead | Published package |
| 17 | CI workflows — lint, typecheck, test, build, scan, deploy:staging | Tech Lead | Green pipeline |
| 18 | Schema baseline — identity/tenancy/RBAC tables, RLS policies, seed roles | Backend Lead | First Prisma migration |
| 19 | Okta workforce IdP; group → role mapping | Tech Lead | Okta tenant configured |
| 20 | Cognito pools (clients, vendors); password policy; MFA toggles | Backend Lead | Pools live |
| 21 | GCP project, Vertex service account, private connectivity to AWS VPC | AI Lead | `hello-vertex` responds |
| 22 | `luxeaxis-vastu` repo; DVC/LFS for datasets; W&B project | AI Lead | Repo with first commit |
| 23 | Rule corpus v0.1 — 10 rules encoded with citations | AI Lead + scholar | Rules parse in the DSL |
| 24 | HubSpot OAuth app + sandbox tenant | Backend Eng | Credentials in Secrets Manager |
| 25 | Wati account; first template submitted for approval | Backend Eng | Template pending approval |
| 26 | Razorpay test account; payment-link spike | Backend Eng | Test payment captured |
| 27 | DPDPA scoping call with counsel | Tech Lead | Scope note |
| 28 | Threat model workshop scheduled for S1 | Tech Lead | Calendar + advisor engaged |
| **29** | **Recruitment opened for all unfilled roles** | CTO | Job specs live, recruiter briefed |
| **30** | **Sprint 0 exit demo — commit to `main` → staging, live** | Tech Lead | Demo recorded |

### Sprint 0 exit criteria

All five must be true, or Sprint 1 does not start:

1. An engineer clones the monorepo, runs `pnpm install && pnpm dev`, and has a working local stack in under 15 minutes.
2. A commit to `main` deploys to staging with no human intervention, and Datadog shows the request trace.
3. Every cloud resource in staging and prod was created by Terraform.
4. The nine Sprint-0 ADRs are merged.
5. **The §2.1 budget decision is signed.**

---

## 20. Open decisions for the CTO and Board

| # | Question | Needed by | Default if unanswered |
|---|---|---|---|
| ~~1~~ | ~~Which budget option?~~ | — | ✅ **Resolved Aug 2026 — Option B, Claude Code delivery (§9)** |
| 2 | Does "85% Vastu accuracy by Month 9" mean assisted or unassisted? (§2.2) | Before S4 | Assisted, per §2.2 recommendation |
| 3 | Cohort cutover confirmed; no Monday.com dual-run? (§2.3) | Before S4 | Cohort cutover |
| 4 | Re-open ADR-006 (Cognito) before Sprint 1 commits? (§5.1) | Before S1 | Keep Cognito; absorb the 2-ew buffer |
| 5 | Is AR (M12) genuinely deferrable, or is it a signed sales commitment? | Before S8 | Deferred to Year 2 |
| 6 | Vertex min-1 instance — accept cold starts to save Rs. 38 K/month? (§10.2) | Before S12 | Accept cold starts |
| 7 | Contractor bridge for backend seats during the hiring gap? (§9.2) | Before S0 | Yes, agency squad for S0–S3 |
| 8 | Retain one Vastu scholar or two? (§18, B8) | Before S1 | Two |

### Carried forward from LLD Appendix D

| Item | Resolution point |
|---|---|
| Realtime transport — WebSocket fan-out vs. AppSync | ADR-011, Sprint 5 |
| Search index for moodboards/journal | Year 2, driven by observed query patterns |
| pgvector → dedicated cluster graduation | Deferred with M15 |
| Public Design API monetisation model | Year 2, with M20 |
| Vastu Plan Model archival and re-use policy | Sprint 6, before the correction loop starts accumulating client plans |

---

## Appendix A — Module effort reference

| Module | ew | Sprints | Workstream |
|---|---:|---|---|
| M01 Identity, Tenancy, RBAC | 6 | S1 | W2 |
| M02 CRM & Lead Workflow | 5 | S3 | W2, W7 |
| M03 Project & Six-Gate Engine | 8 | S4–S6 | W2, W3 |
| M04 Client Portal | 7 | S6–S8 | W4 |
| M05 Designer Console | 6 | S5–S8 | W3 |
| M06 Moodboard | 4 | S9 | W3 |
| M07 Document Vault | 5 | S2 | W2 |
| M08 Budget & BoQ | 6 | S9–S10 | W2, W3 |
| M09 Vendor Portal (thin) | 3 | S12 | W4 |
| M10 Snag & Punch List | 4 | S11 | W2, W6 |
| M11 3D Progress Viewer | 3 | S10 | W2, W7 |
| M13 Vastu-Tech | 50 | S1–S13 | W5 |
| M16 Notification Service | 6 | S3 | W2 |
| M17 Engagement billing | 5 | S12 | W2, W7 |
| M18 Analytics (minimal) | 3 | S13 | W2 |
| M19 Admin & Ops Console | 5 | S7 | W3 |
| M12 AR Room Preview | 10 | **Deferred** | — |
| M14 Virtual Staging | 8 | **Deferred** | — |
| M15 Material Recommendations | 8 | **Deferred** | — |
| M20 Public Design API | 6 | **Deferred** | — |

## Appendix B — Critical journeys (E2E suite)

From LLD §17.2, with the sprint in which each becomes testable:

1. Lead capture from website → HubSpot + Space OS sync → first call scheduled — **S3**
2. Project kickoff — G0 → G1 including document upload and team assignment — **S6**
3. Vastu plan upload → analysis complete → report visible to client — **S13**
4. Snag capture on mobile → assignee notified → resolution photo → client sign-off — **S11**
5. Invoice issuance → Razorpay link → payment captured → receipt to client — **S12**

Each becomes a required CI gate the sprint after it first passes.

## Appendix C — Source documents

- `LXA-TECH-HLD-001` — Luxe Axis Space OS & Advanced Website, High-Level Design v1.0
- `LXA-TECH-LLD-001` — Luxe Axis Space OS & Advanced Website, Low-Level Design v1.0
- Luxe Axis Strategic Blueprint V3 — §17 Technology Build Roadmap
- Luxe Axis Operations & Delivery Manual — Six-Gate QMS
- Luxe Axis Sales Manual — CRM workflow, 30-minute SLA
- Luxe Axis Finance Manual — billing, dunning, GST treatment
