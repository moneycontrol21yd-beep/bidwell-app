---
license: cc-by-4.0
language:
- en
pretty_name: India Government e-Procurement Tenders & Award-of-Contract (AOC)
tags:
- public-procurement
- government
- india
- tenders
- web-scraping
size_categories:
- 10M<n<100M
task_categories:
- text-classification
- text-retrieval
- table-question-answering
configs:
- config_name: tenders
  data_files: "data/tenders/*.parquet"
- config_name: tender_details
  data_files: "data/tender_details/*.parquet"
- config_name: aoc_tenders
  data_files: "data/aoc_tenders/*.parquet"
- config_name: aoc_details
  data_files: "data/aoc_details/*.parquet"
---

# India Government e-Procurement Tenders & Award-of-Contract (AOC)

A large-scale collection of public-procurement records scraped from India's National
Informatics Centre (NIC) e-Procurement portals (the Central Public Procurement Portal
and affiliated central / state / organisation portals). The corpus covers two linked
views of the tendering lifecycle:

1. **Tenders** — live and archived tender notices (the *call for bids*).
2. **AOC (Award of Contract)** — outcome records showing the awarded value, the
   selected bidder, and the number of bids received.

> ⚠️ **Provenance & licensing notice.** This data was programmatically scraped from
> public Indian government procurement portals. It is redistributed here for research
> and transparency purposes. Verify the licensing/terms-of-use of the source portals
> before any commercial use, and treat all fields as *as-scraped* (see Limitations).

## Dataset at a glance

| Config / table   | Rows       | Description                                                   |
|------------------|------------|---------------------------------------------------------------|
| `tenders`        | 3,952,191  | Tender notice listings (active + archived)                    |
| `tender_details` | 3,178,485  | Per-tender detail blob (EMD, dates, category, description…)    |
| `aoc_tenders`    | 4,921,960  | Award-of-Contract listings                                    |
| `aoc_details`    | 4,540,739  | Per-AOC detail blob (contract value, selected bidder, #bids)  |

- **Time span:** ~2011 – 2026 (by `year`)
- **Geography:** India (central, state, and organisation procurement portals)
- **Language:** English (with some transliterated / mixed-script free text)
- **Source format:** two SQLite databases (`tenders_vps.db`, `aoc_tenders.db`)

## Schema

### `tenders`
| Column | Type | Notes |
|---|---|---|
| `internal_id` | string | Portal-internal id |
| `tender_id` | string | Tender identifier |
| `detail_url` | string | Source URL for the tender detail page |
| `status` | string | `active` (72,574) / `archived` (3,879,617) |
| `organisation_name` | string | Procuring organisation |
| `title` | string | Tender title |
| `reference_number` | string | Tender reference no. |
| `portal_type` | string | `org` (3,910,366) / `state` (41,825) |
| `serial_number` | string | |
| `e_published_date` | string | e.g. `11-Jun-2026 11:59 AM` |
| `bid_submission_closing_date` | string | |
| `tender_opening_date` | string | |
| `corrigendum_url` | string | |
| `scraped_at` | string | Scrape timestamp |
| `partition_id` | int | Internal partition key |

### `tender_details`
| Column | Type | Notes |
|---|---|---|
| `internal_id` | string | Join key → `tenders.internal_id` |
| `tender_id` | string | |
| `details_json` | string (JSON) | Nested key/value detail map |
| `scraped_at` | string | |

`details_json` keys (observed): `EMD`, `Name`, `Address`, `Location`, `Tender Fee`,
`Tender Type`, `Tender Title`, `Tender Category`, `Tender Document`, `ePublished Date`,
`Bid Opening Date`, `Product Category`, `Work Description`, `Organisation Name`,
`Organisation Type`, `Product Sub-Category`, `Bid Submission End Date`,
`Tender Reference Number`, `Bid Submission Start Date`, `Document Download Start/End Date`.

### `aoc_tenders`
| Column | Type | Notes |
|---|---|---|
| `internal_id` | string | |
| `portal_type` | string | `central` (2,005,258) / `state` (2,916,702) |
| `year` | int | 2011–2026 |
| `sl_no` | string | |
| `aoc_date` | string | Award date |
| `closing_date` | string | |
| `title` | string | |
| `ref_no` | string | |
| `tender_id` | string | |
| `org_name` | string | Procuring organisation / state |
| `detail_url` | string | |
| `partition_id` | int | |

### `aoc_details`
| Column | Type | Notes |
|---|---|---|
| `internal_id` | string | Join key → `aoc_tenders.internal_id` |
| `tender_id` | string | |
| `details_json` | string (JSON) | Nested key/value detail map |
| `scraped_at` | string | |

`details_json` keys (observed): `Tender Type`, `Contract Date`, `Contract Value`,
`Published Date`, `Tender Document`, `Tender Ref. No.`, `Organisation Name`,
`Tender Description`, `Number of bids received`, `Name of the selected bidder(s)`,
`Address of the selected bidder(s)`, `Date of Completion/Completion Period in Days`.

## How records link

```
tenders.internal_id      ─┬─►  tender_details.internal_id
aoc_tenders.internal_id  ─┴─►  aoc_details.internal_id
```

Each listing row (`tenders` / `aoc_tenders`) has a corresponding detail row keyed by
`internal_id` (detail counts are lower than listing counts — not every listing has a
scraped detail blob).

## Usage

```python
from datasets import load_dataset

# Listings only
tenders = load_dataset("<org>/<dataset>", "tenders", split="train")
aoc     = load_dataset("<org>/<dataset>", "aoc_tenders", split="train")

# Parse the nested detail blob
import json
details = load_dataset("<org>/<dataset>", "tender_details", split="train")
rec = json.loads(details[0]["details_json"])
print(rec["Work Description"], rec["EMD"])
```

Or query the raw SQLite directly:

```python
import sqlite3, pandas as pd
con = sqlite3.connect("tenders_vps.db")
df = pd.read_sql("SELECT * FROM tenders WHERE status='active' LIMIT 10", con)
```

## Sample rows

10-row previews per table are provided under [`top10_samples/`](top10_samples/).

## Suggested uses

- Procurement transparency, spend & competition analysis (bids received, award values)
- Org / category text classification and entity extraction
- Retrieval / semantic search over tender descriptions
- Time-series of public spending by state, organisation, and year

## Limitations & caveats

- **As-scraped, unnormalised.** Dates are strings (`DD-Mon-YYYY hh:mm AM/PM`), monetary
  values are strings (e.g. `"1874075"`, `"₹ 20441"`) and may contain currency symbols,
  commas, or be empty. `Contract Value` / `EMD` need cleaning before numeric use.
- **Encoding artefacts.** Some free-text fields contain HTML entity / escape residue
  (e.g. `&ampamp#x0d`, `₹`).
- **Missing values.** Detail blobs and many fields can be empty strings; detail tables
  do not fully cover their listing tables.
- **No PII guarantees.** Selected-bidder names and addresses are present as published by
  the source portals; bidders are typically firms but may include individuals.
- **No dedup / verification.** Rows reflect portal state at scrape time and may include
  duplicates, corrigenda, or test entries (e.g. titles like `test1`).

## Citation

```bibtex
@misc{india_eproc_tenders_aoc,
  title  = {India Government e-Procurement Tenders \& Award-of-Contract (AOC)},
  year   = {2026},
  note   = {Scraped from NIC / Central Public Procurement Portal e-procurement portals},
  howpublished = {Hugging Face Datasets}
}
```
