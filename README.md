# SHUVO Downloader Website (Vercel only, zero database, zero extra accounts)

## Ki ache
- `/` - public downloader page (paste link -> download), platform grid + announcement
  banner - shob `downloaders.json` and `broadcast.json` file theke aashe
- `/admin` - password protected admin panel: notun downloader er jonno JSON generate
  kore (API test kore field mapping shoho), and announcement banner er JSON generate kore
- Kono database (Supabase/Firebase/etc) lagbe na. Data update korte shudhu GitHub e
  `downloaders.json` / `broadcast.json` file edit kore commit korte hobe - Vercel
  automatic redeploy kore dibe (~30-60 sec).

App eta site ke WebView e load korbe, tai **app update kono din lagbe na** - website
edit korle shobar app automatic notun content dekhabe.

---

## STEP 1: `config.js` e password set koro

```js
module.exports = {
  ADMIN_PASSWORD: "asraful123",
};
```
(already set ache, chaile change koro)

## STEP 2: GitHub e private repo banao and push koro

```bash
cd downloader-website
git init
git add .
git commit -m "initial commit"
```
GitHub e private repo banao, tarpor:
```bash
git remote add origin https://github.com/<username>/<repo>.git
git branch -M main
git push -u origin main
```

## STEP 3: Vercel e deploy

1. https://vercel.com -> GitHub diye sign up/login (card lagena)
2. "Add New Project" -> tomar repo select koro -> Deploy
3. Bas, kono environment variable/database setup lagbe na - deploy hoye jabe.

---

## Notun downloader add korar niyom (database chara)

1. `/admin` e login koro
2. API endpoint, URL pattern, "Test API" diye field mapping koro
3. "Generate JSON" click koro -> ekta JSON block dekhabe
4. GitHub e giye `downloaders.json` file open koro, pencil (edit) icon e click koro
5. `"downloaders": []` er moddhe generate kora JSON ta paste koro (comma diye alada
   kore multiple entry rakha jai)
6. Commit koro -> Vercel automatic redeploy kore dibe

Example `downloaders.json` (2 ta entry shoho):
```json
{
  "downloaders": [
    {
      "name": "TikTok",
      "icon_base64": null,
      "url_pattern": "tiktok\\.com",
      "api_endpoint": "https://your-api.com/tiktok",
      "api_method": "GET",
      "api_headers": {},
      "api_url_param": "url",
      "link_field": "data.download_url",
      "title_field": "data.title",
      "thumb_field": "data.thumbnail",
      "active": true
    }
  ]
}
```

## Announcement banner update korar niyom

1. `/admin` e "Site Announcement" form fill koro -> "Generate JSON"
2. GitHub e `broadcast.json` open koro, pura content generate kora JSON diye replace
   koro, commit koro

---

## Next: App banano (WebView wrapper)
Website live hoye gele, ei URL ta diye AIDE Pro te WebView app banabo. Website URL
dile ami eta wire kore dibo.
