# SYNA · Wearable & Health Data Integration

How health metrics get into SYNA, what we recommend for the MVP clinical pilot, and what to expect without a paid aggregator (Terra / Thryve).

---

## TL;DR — recommended MVP approach

| Decision | Recommendation |
|----------|----------------|
| **Primary integration** | **Apple Health (iOS)** + **Health Connect (Android)** — not direct per-brand APIs first |
| **Why** | One permission flow per platform; most watches (Apple Watch, many Garmin/Fitbit/Oura setups) already sync into the phone’s health store |
| **React Native vs native bridge** | **Use maintained RN libraries + Expo dev client** — avoid writing a custom Swift bridge unless a library blocks a critical metric |
| **Paid aggregator (Terra / Thryve)** | **Defer** for pilot; revisit if background sync reliability or Fitbit/Garmin/Whoop gaps block enrollment |
| **User UI** | **Yes — a dedicated “Connect health data” step** with a button, plain-language explanation, and OS permission sheet |
| **Server “nightly pull”** | **Without an aggregator, there is no server-side HealthKit API.** Device uploads nightly via background task → Supabase |

---

## How it actually works (mental model)

Most users do **not** connect SYNA to their watch directly.

```
Wearable (Watch / Oura / Whoop / Fitbit / Garmin)
        ↓  (vendor app syncs)
Phone health hub (Apple Health  ·  Health Connect)
        ↓  (SYNA reads, with permission)
SYNA app  →  upload normalized rows  →  Supabase (EU)
        ↓
Nightly pattern engine (Edge Functions)
```

**Apple HealthKit** and **Android Health Connect** are on-device APIs. Apple/Google do not expose a free server API to pull a user’s health history without the app running on their phone.

Implication for SYNA: automatic sync = **background upload from the app**, not a true server-initiated pull from Apple/Google.

---

## Option comparison

### A · Phone health hubs only (recommended MVP)

Read from **HealthKit (iOS)** and **Health Connect (Android)**.

| Pros | Cons |
|------|------|
| One integration per OS, not per brand | Coverage depends on what each watch writes into the hub |
| No €500/mo aggregator fee | **No server-side pull** — need background sync on device |
| Matches “connect once, sync automatically” UX | HRV type (`rMSSD` vs SDNN), stress scores, temp delta vary by source |
| Works with Expo RN + dev client | Requires custom native build (not Expo Go) |
| Privacy-friendly — user controls OS permissions | Fitbit / Garmin / Whoop may sync **partially** or not at all to Health Connect |

**Libraries (Expo-compatible, dev client required):**

| Platform | Package | Notes |
|----------|---------|-------|
| iOS | [`@kingstinct/react-native-healthkit`](https://github.com/kingstinct/react-native-healthkit) | TypeScript, actively maintained; prefer over legacy `react-native-health` |
| Android | [`react-native-health-connect`](https://github.com/matinzd/react-native-health-connect) | Official Health Connect records API |

Legacy `react-native-health` (iOS): community-maintained, uneven maintenance, permission/type matrix quirks — **not our first choice**. A custom Swift bridge only worth it if HealthKit access is blocked in RN (unlikely for MVP metrics).

---

### B · Direct wearable OAuth APIs (selective add-on)

Connect to **Fitbit**, **Garmin**, **Oura**, **Whoop**, **Samsung Health** via each vendor’s developer API.

| Pros | Cons |
|------|------|
| Richer history & device-native metrics | **Separate OAuth + token storage per vendor** |
| Server-side scheduled sync possible (vendor webhooks/polling) | Weeks of work per brand; ToS & approval processes |
| Better backfill for brands that under-sync to Health Connect | Token refresh, rate limits, schema differences |
| No aggregator fee | Still need normalization layer in Supabase |

**MVP suggestion:** add **at most one** direct API after hub sync is live — pick the device most common in your pilot cohort (often **Oura** or **Apple Watch via HealthKit only**).

---

### C · Paid aggregators (Terra, Thryve, ROOK)

| Pros | Cons |
|------|------|
| One OAuth → many devices | **~$500+/mo** — out of scope for startup MVP |
| Normalized schema + server webhooks | Vendor lock-in |
| True server-side nightly pull | Clinical pilot budget |

**Pilot:** spec mentions aggregator; **override for MVP** with hub + device upload unless enrollment fails on sync quality.

---

## Do we need a UI connector?

**Yes.** Users must explicitly connect and grant permissions.

Typical flow (Stage 1 onboarding):

1. Screen: *“Connect your health data”* — explain that SYNA reads from Apple Health / Health Connect; watches that sync there work automatically.
2. **Button:** `Connect Apple Health` / `Connect Health Connect`
3. OS permission sheet (read types listed below)
4. **Backfill spinner:** “Loading your last 30–90 days…”
5. **First insight** from backfilled data (product requirement)

Also in **Me → Wearable connection**: reconnect, last sync time, source device name, troubleshooting (“Open the Health app and check that Sleep / Heart Rate are shared”).

**Not enough:** silent permission on first launch without context — health apps need informed consent (GDPR + App Store guidelines).

---

## Installation (technical, Expo)

SYNA already uses **Expo dev client** (`expo-dev-client`). Health APIs require **native modules** → custom build, not Expo Go.

```bash
cd client
npx expo install @kingstinct/react-native-healthkit react-native-health-connect
# Config plugins in app.config.js for HealthKit entitlements + Health Connect manifest
npx expo prebuild   # if managing native projects
npx expo run:ios
npx expo run:android
```

**iOS:** enable HealthKit capability, usage descriptions in `Info.plist`, read-only entitlements.

**Android:** Health Connect app must be installed (Android 14+ integrated; older devices need Play Store install). Declare permissions per record type.

**Tokens:** Health hub reads do not use OAuth tokens — permissions are OS-level. Direct vendor APIs store refresh tokens in `expo-secure-store` + Supabase Vault.

---

## Background sync without an aggregator

| Trigger | Implementation |
|---------|----------------|
| App open | Full incremental sync + upload |
| Background fetch | `expo-background-fetch` / iOS `BGAppRefreshTask` — upload since last cursor |
| “Nightly engine” | Edge Function runs on **already-uploaded** `wearable_data` rows; schedule after expected upload window (e.g. 04:00 local + grace) |

**Gap risk:** if the user never opens the app and background fetch is denied, nights are missing → engine shows “insufficient data” (correct per spec — no imputation).

---

## Metrics SYNA needs (from build spec §7)

Canonical daily fields map to `wearable_data` table.

---

### Master table — metric availability & SYNA need

| Metric | SYNA needs? | Apple Health / Watch | Health Connect / Wear OS | Fitbit API | Garmin API | Oura API | Whoop API | Notes |
|--------|:-----------:|:--------------------:|:------------------------:|:----------:|:----------:|:--------:|:---------:|-------|
| **HRV rMSSD** | **Yes** (primary) | ⚠️ Often via SDNN proxy; rMSSD in HK only if source writes it | ⚠️ Variable | ✅ | ✅ | ✅ | ✅ | Validate source; store what hub gives + flag |
| **HRV SDNN** | Yes (fallback) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| **Resting heart rate** | **Yes** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| **Nocturnal / sleep HR** | **Yes** (M1) | ✅ | ✅ | ⚠️ | ⚠️ | ✅ | ✅ | Derive from sleep-window samples |
| **Max HR** | Yes | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| **24h HR curve** | Nice-to-have | ⚠️ Large samples | ⚠️ | ❌ daily only | ⚠️ | ⚠️ | ⚠️ | MVP: daily aggregates enough |
| **Total sleep duration** | **Yes** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Minutes |
| **Sleep efficiency** | **Yes** | ✅ | ⚠️ | ✅ | ✅ | ✅ | ✅ | |
| **Sleep latency** | Yes | ✅ | ⚠️ | ⚠️ | ⚠️ | ✅ | ⚠️ | |
| **Sleep stages (deep/REM/light)** | **Yes** | ✅ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ | |
| **Awakenings** | **Yes** | ✅ | ⚠️ | ⚠️ | ✅ | ✅ | ⚠️ | |
| **Steps** | **Yes** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| **Active minutes** | **Yes** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| **Active calories / intensity** | Yes | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| **Workouts** | Nice-to-have | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | D4 movement context |
| **Respiratory rate (night)** | Yes (M1 context) | ✅ (Series 8+) | ⚠️ | ⚠️ | ⚠️ | ✅ | ✅ | |
| **SpO₂ (night)** | Yes (if available) | ✅ (Series 6+) | ⚠️ | ⚠️ | ⚠️ | ✅ Gen3 | ⚠️ | Optional gate |
| **Wrist / skin temp delta** | **Yes** (vasomotor) | ✅ (Series 8+) | ⚠️ | ❌ | ⚠️ | ✅ | ⚠️ | Store °C delta vs 28d baseline |
| **Device stress score** | Yes (D2) | ⚠️ Mindfulness / third-party | ⚠️ | ❌ | ✅ Body Battery proxy | ⚠️ | ✅ Recovery | Often HRV-derived; map carefully |
| **Source device name** | **Yes** (meta) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| **Sample timestamps** | **Yes** (meta) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| **Completeness flag** | **Yes** (meta) | App-computed | App-computed | App-computed | App-computed | App-computed | App-computed | Per spec — never impute |

Legend: ✅ reliably available · ⚠️ partial / device-dependent · ❌ not typically available

---

### SYNA need summary (yes / no)

| Category | Include in MVP ingest? |
|----------|:----------------------:|
| HRV (rMSSD + SDNN fallback) | **Yes** |
| Resting + nocturnal HR | **Yes** |
| Sleep duration, efficiency, stages, awakenings | **Yes** |
| Steps + active minutes | **Yes** |
| Night respiration + SpO₂ | **Yes** (nullable) |
| Wrist temperature delta | **Yes** (nullable) |
| Device stress / recovery score | **Yes** (nullable, source-mapped) |
| 24h HR curve (full resolution) | **No** (post-MVP) |
| Workout-level detail | **No** (nice-to-have) |
| Blood pressure, glucose, weight | **No** (out of cardiovascular MVP scope) |
| ECG, AFib alerts | **No** (clinical device territory) |
| Manual user-typed device values | **No** (explicitly out of scope) |

---

## Mapping to SYNA engine (why each metric matters)

| SYNA use | Metrics |
|----------|---------|
| **Cardiometabolic cluster** | HRV, resting/nocturnal HR, palpitations (log) |
| **Sleep cluster** | Sleep duration, efficiency, latency, stages, awakenings + morning sleep quality log |
| **Vasomotor cluster** | Temp delta, night sweats / hot flush logs |
| **M1 cardiovascular meta-pattern** | Night sweats + sleep fragmentation + HRV z ≤ −1 + nocturnal HR z ≥ +1 |
| **Driver D1 (sleep deficit)** | Sleep metrics |
| **Driver D2 (stress)** | Stress score + stress log |
| **Driver D4 (movement)** | Steps, active minutes |
| **28-day personal baseline** | All continuous wearable metrics above |

---

## Pilot enrollment implication (from spec §14)

> Participants need **nightly wearable coverage** — own device or loaner.

| Device strategy | Integration path |
|-----------------|------------------|
| **Apple Watch** | HealthKit — best MVP fit on iOS |
| **Oura Ring** | HealthKit on iOS + optional Oura OAuth for richer backfill |
| **Whoop** | Partial HealthKit; **Whoop API** if cohort is Whoop-heavy |
| **Fitbit / Garmin** | Often weak Health Connect sync → **direct API** or loaner Oura/Apple Watch |
| **Samsung Galaxy Watch** | Health Connect |

**Practical pilot rule:** prefer participants whose device **already syncs sleep + HR + HRV into Apple Health or Health Connect**, or provide a loaner that does.

---

## Recommended build sequence

| Week | Work |
|------|------|
| 1 | HealthKit + Health Connect read prototype; log sample types to console |
| 2 | Permission UI + 30-day backfill → `wearable_data` upsert in Supabase |
| 3 | Normalization (canonical units) + completeness flags + source device |
| 4 | Background upload job + “last synced” in Me tab |
| 5 | Evaluate gaps on 3–5 real devices; decide **one** direct API if needed |
| 6+ | Engine gates on real completeness (≥14 nights for M1) |

---

## Challenges to plan for

1. **rMSSD vs SDNN** — Apple Watch often exposes SDNN; engine should accept both, prefer rMSSD when present.
2. **Health Connect fragmentation** — not all OEMs write sleep stages or HRV.
3. **No server-side HealthKit** — engine schedule must tolerate upload delay.
4. **Background limits** — iOS kills background work aggressively; user education helps (“Open SYNA once every few days” as fallback).
5. **GDPR** — health data stays EU (Supabase Frankfurt); document subprocessors if adding vendor APIs later.
6. **App Store review** — clear privacy policy, HealthKit usage strings, no diagnostic claims.
7. **Spec vs budget tension** — original spec says “aggregator”; hub-first is the cost-conscious MVP tradeoff — document in pilot protocol.

---

## Decision record (proposed)

| Question | Answer for MVP |
|----------|--------------|
| Swift custom bridge? | **No** — use `@kingstinct/react-native-healthkit` unless blocked |
| `react-native-health` (legacy)? | **Avoid** — maintenance / type matrix issues you heard about are real |
| Connect UI button? | **Yes** — onboarding Stage 1 + Me tab |
| Connect to watch directly? | **No** — connect to **phone health hub**; watch via vendor sync |
| Terra / Thryve now? | **No** — revisit if sync coverage blocks N=100 |
| Direct Fitbit/Garmin/Whoop? | **Phase 2** — max one vendor based on cohort |

---

## Related code (when implementation starts)

| Area | Location (planned) |
|------|-------------------|
| Health permissions UI | `client/app/onboarding/connect-health.tsx` |
| HealthKit / HC service | `client/lib/health/` |
| Normalized upload | Supabase Edge Function `sync-wearable-batch` |
| Storage | `wearable_data` table (spec §9) |

---

*SYNA · Wearable integration strategy · MVP clinical pilot · June 2026*
