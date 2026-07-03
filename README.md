# CV Health Demographics

A one-page, anonymous survey for collecting basic demographic and
cardiovascular health information (age, gender, chronic comorbidities,
medication use, smoking, and other lifestyle risk factors) for research
purposes. No name or other identifying information is collected. Includes a
light/dark theme toggle.

## Files

- `index.html` / `style.css` / `script.js` — the survey page. No build step;
  open `index.html` directly or host it anywhere static (e.g. GitHub Pages).
- `google-apps-script/Code.gs` — backend script that saves each submission
  as a new row in a Google Sheet in your Google Drive.

## Connecting submissions to a Google Sheet (one-time setup, ~5 minutes)

1. Go to [sheets.google.com](https://sheets.google.com) and create a new
   blank spreadsheet (e.g. name it "CV Health Demographics Responses").
2. In the sheet, click **Extensions → Apps Script**.
3. Delete any placeholder code in the editor, then copy the full contents of
   `google-apps-script/Code.gs` from this repo and paste it in.
4. Click **Deploy → New deployment**.
5. Next to "Select type", click the gear icon and choose **Web app**.
6. Set:
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Click **Deploy**, then **Authorize access** and approve the permissions
   (you'll see a Google warning screen for unverified apps — click
   **Advanced → Go to (project name)** to proceed; this is expected for a
   script you wrote yourself).
8. Copy the **Web app URL** it gives you.
9. Open `script.js` in this repo and replace
   `PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with that URL.

From then on, every submitted response appears as a new row in the
spreadsheet, with a header row added automatically on the first submission.

If you ever change `Code.gs`, you'll need to create a **new deployment**
(or deploy a new version) for the changes to take effect.

## Hosting the page

The simplest option is GitHub Pages:

1. In this repo, go to **Settings → Pages**.
2. Under "Build and deployment", set Source to **Deploy from a branch**,
   pick this branch and the `/ (root)` folder, then save.
3. GitHub gives you a public URL a minute or two later.

## Possible additions

- **Blood pressure / resting heart rate** fields, if self-reported values
  are useful for your research.
- **Waist circumference**, another common CV risk indicator alongside BMI.
- **A submission confirmation code** shown to the respondent, in case you
  need a way to let people request deletion of their (anonymous) entry
  later.
- **Rate limiting / duplicate protection** (e.g. one submission per device
  via a localStorage flag), if you want to discourage repeat submissions.
- **A printable/QR version** so the link can be handed out at a clinic or
  event without typing a URL.
- **Data export automation**, e.g. a scheduled Apps Script trigger that
  emails you a CSV export weekly.
