# Dr Sumanth Reddy Blog

This project is a Vite + React blog site with Supabase integration and admin upload support.

## Local development

1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase values:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Run:

```bash
npm install
npm run dev
```

Open the app at the local URL shown by Vite.

## Netlify deployment

This project is ready for Netlify deployment.

### Build settings

- Build command: `npm run build`
- Publish directory: `dist`

### Redirect settings

The app uses client-side routing. Netlify will redirect all requests to `index.html` using `_redirects` or `netlify.toml`.

### Environment variables

Set these in Netlify Dashboard → Site settings → Build & deploy → Environment:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## Admin uploads

Only authenticated users can access `/admin` and upload blog posts. Public visitors cannot upload blogs.

## Notes

- The admin page uses Supabase Auth.
- Custom blog JSON uploads are supported via `src/components/BlogUpload.tsx`.
