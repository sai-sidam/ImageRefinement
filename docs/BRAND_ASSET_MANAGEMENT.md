# Brand asset management — single source of truth

Central place for what brand assets exist and where they live. SMM and Director use these to keep identity and AI outputs consistent.

---

## Asset types (complete list)

| # | Asset type | Description |
|---|------------|-------------|
| 1 | **Product images** | Approved hero/detail shots per SKU; product-only and on-model. |
| 2 | **Mood boards** | Curated visuals for campaigns, collections, or aesthetic direction. |
| 3 | **Color palettes** | Brand colors, hex codes, and usage (primary, secondary, accents). |
| 4 | **Logos** | Master logo files (primary, secondary, lockups); formats and clear space. |
| 5 | **Approved model library** | Diverse cast profiles, approved looks, usage rights/model releases for consistent talent representation. |
| 6 | **Typography assets** | Licensed font files, web fonts, and usage guidelines for headlines, body, digital. |
| 7 | **Graphic design elements** | Brand icons, patterns, textures, decorative borders, recurring visual motifs. |
| 8 | **Video & motion graphics** | Approved short-form clips, brand stingers, motion templates, music/audio for social. |
| 9 | **Brand voice & tone guidelines** | Written communication style, key messaging pillars, approved terminology, editorial standards. |
| 10 | **Social media templates** | Pre-designed templates for Instagram Stories, Reels covers, carousel layouts, highlight icons, profile elements. |
| 11 | **AI prompt library** | Curated successful AI prompts (and negative prompts) by output type (e.g. lifestyle street style, studio portrait) for consistent style and quality. |
| 12 | **Campaign-specific visuals** | Imagery, graphics, and concepts developed for specific campaigns or seasonal launches. |
| 13 | **Lifestyle photography/video** | Non-product imagery that captures brand aesthetic, target audience, and aspirational mood. |
| 14 | **Usage guidelines & best practices** | How all brand assets should be used: DOs and DON'Ts, sizing, placement, legal considerations. |

---

## Where to store

For a small team, a hybrid approach combining a version-controlled repository (Git/GitHub) for critical, ready-to-deploy assets and documentation, with a cloud-based external storage solution (Google Drive or a dedicated Digital Asset Management system for scalability) for large, raw, and working files, provides both efficiency and organization.

**1. Repository (Git/GitHub):**  
This is for code, documentation, and *final, prepared* assets for social media that are ready for immediate deployment and require version control for specific campaigns.

- `./docs/` (All brand guidelines, strategy documents, content calendars, and process definitions)
- `./instagram-output/` (Final, optimized social media assets ready for scheduling/posting – e.g., optimized JPEGs, short MP4s for Reels, complete with approved captions and hashtags if bundled)
- `./brand-assets/logo-variants/` (Official vector logo files, approved brand fonts, and essential graphic elements)

**2. External storage (Google Drive / dedicated DAM):**  
This is the central hub for all high-resolution, raw, and working files. It provides robust storage, sharing capabilities, and is suitable for large media files that don't need direct versioning in a code repository.

- `June & Ember Assets/`
  - `01_RAW_Photography/`
    - `YYYYMMDD_ShootName/` (e.g., `20231026_ResortCollection_Shoot`)
      - `RAW/` (Original camera RAW files)
      - `Proofs_Selection/` (Low-resolution watermarked images for review and selection)
  - `02_Edited_Photography/`
    - `YYYYMMDD_ShootName/`
      - `HighRes_Print/` (High-resolution TIFF/JPEG for print collateral)
      - `Web_Optimized/` (Optimized JPEGs for website use)
      - `Social_Media_Ready/` (Final, high-quality JPEGs/TIFFs for social media *before* platform-specific optimization or captioning in the repo)
  - `03_Video_Masters/`
    - `YYYYMMDD_ReelName/`
      - `OriginalFootage/` (Raw video clips)
      - `Final_Edits_FullRes/` (Full-resolution MP4s, ProRes masters for final video content)
  - `04_Design_Source_Files/`
    - `Website_UI/` (Figma, Sketch, Adobe XD files for website design)
    - `Social_Graphics_PSD_AI/` (Adobe Photoshop PSD templates, Illustrator AI files for social media graphics, print materials)
  - `05_Brand_Guidelines_Master/` (The definitive, official PDF version of June & Ember brand guidelines)
  - `06_MoodBoards_Inspiration/`
    - `Seasonal_MoodBoards/`
    - `Campaign_Specific/`

---

*Source: Expert review (Gemini); implemented per project guidelines.*
