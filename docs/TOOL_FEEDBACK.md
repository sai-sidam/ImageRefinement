# AI image generation — tool feedback loop

How to capture feedback on the AI image tool so we can improve prompts, spot recurring issues, and track quality over time.

---

## I. Data to capture (log variables)

### A. Generation metadata (input)

| Variable | Description |
|----------|-------------|
| **Timestamp** | Date and time of generation. |
| **Generator** | Name/ID of the user who generated the image. |
| **Prompt ID/Name** | Reference to the specific prompt (if using a library) or the full text of the prompt used. |
| **Negative Prompt** | Full text of any negative prompts used. |
| **Seed Value** | The specific seed used (if applicable and logged by the tool). |
| **Model/Tool Version** | Which AI model or version of the tool was used. |
| **Target Use Case** | E.g. Instagram Feed Post, Story Ad, Website Banner. |

### B. Output quality metrics

| Variable | Scale / values | Description |
|----------|-----------------|-------------|
| **Overall Quality Score** | 1–5 | General impression of image quality. |
| **Pose Success** | Yes / No / Partial | Does the pose match intent and appear natural? (e.g. Natural, Stiff, Distorted) |
| **Fabric Texture & Drape** | 1–5 | Realism and accuracy of fabric (e.g. Excellent, Plastic-like, Fuzzy). |
| **Lighting & Shadows** | 1–5 | Appropriateness, realism, consistency (e.g. Natural, Flat, Unrealistic). |
| **Facial Features & Expression** | 1–5 | Naturalness and consistency of face (e.g. Spot on, Uncanny, Inconsistent). |
| **Hands & Extremities** | Yes / No / N/A | Hands, feet, fingers rendered naturally without distortion? |
| **Background Relevance & Quality** | 1–5 | Does the background fit the scene and is it well-rendered? |
| **Accessory/Prop Integrity** | Yes / No / N/A | Jewelry, bags, etc. rendered accurately and consistently? |
| **Brand Alignment** | 1–5 | How well does the image fit June & Ember's aesthetic and ethical principles? |

### C. Outcome & feedback

| Variable | Description |
|----------|-------------|
| **Decision** | Approved | Rejected – Major Rework | Rejected – Minor Rework | Rejected – Unusable |
| **Rejection Reason(s)** | Free text or predefined categories (e.g. Uncanny Valley, Bias Detected, Technical Glitch, Off-Brand). |
| **Action Taken / Recommendation** | e.g. "Adjust prompt for smoother fabric," "Try different seed," "Review ethical guidelines for model diversity." |
| **Reviewer** | Name/ID of the person making the decision. |

---

## II. Logging mechanism

- **Where to log:** A centralized, shared spreadsheet (e.g. Google Sheet, Airtable) or a project/tracking tool (e.g. Jira, Asana, Trello) with custom fields.
- **File naming:** Use a clear convention for generated images (e.g. `JEM_AI_[Date]_[PromptID]_[Version].jpg`) and link each file to its log entry.

---

## III. Feedback loop process

1. **Generate & initial review (SMM/Creative)**  
   Generate images; perform a quick triage; select promising images and those with specific issues for detailed logging.

2. **Detailed logging (SMM/Creative Director)**  
   For each selected image: log generation metadata, score against quality metrics, record decision and rejection reasons, attach or link the image.

3. **Periodic reporting (Creative Director/SMM)**  
   Weekly or bi-weekly: review the log, identify recurring issues and trends, compile a short report (e.g. "Fabric texture consistently weak," "Ethical flag on x image type").

4. **Tool refinement & tracking (Dev/AI tool owner)**  
   Review the report; implement prompt adjustments, model/config changes; monitor later generations for improvement and track quality over time.

---

*Source: Expert review (Gemini); implemented per project guidelines.*
