# EduSimLabs

A suite of educational simulation tools for finance and trading.

## Apps

- **Main Website**: Landing page and navigation to simulations
- **FX Forward Terminal**: FX forward trading simulation
- **Multiplayer Boardroom**: Global capital allocation simulation
- **FICC Trademaster Pro**: Fixed income, currencies, and commodities trading simulation

## Local Development

Run all apps locally in development mode behind a single proxy:

```bash
# from the repository root
npm install            # only needed once to install proxy deps
./run.sh               # starts each app and a proxy on port 8080
```

Once the script has finished booting you can visit the consolidated site at `http://localhost:3011` (or `http://<host-ip>:3011`).
Each simulation is mounted under a path so the main page and URLs stay consistent
with production. The main website is also reachable via `/home` which is rewritten
back to `/` by the proxy.

- `/home` or `/` → main website (port 3000)
- `/fx-forward-terminal` → FX Forward Terminal (port 3001)
- `/multiplayer-boardroom` → Multiplayer Boardroom (port 3002)
- `/ficc-trademaster-pro` → FICC Trademaster Pro (port 3003)

You can still start an individual app by `cd`‑ing into its folder and running
`npm install && npm run dev`; the port numbers above are defined in each app's
`vite.config.ts`.

## Deployment to Google Cloud

The project is configured for automated deployment to Google Cloud Run using Cloud Build. This deploys all applications as separate services plus a proxy service that routes requests to them.

### Prerequisites

- Google Cloud Project with billing enabled
- Cloud Build API enabled
- Cloud Run API enabled
- Container Registry API enabled
- Service account with Cloud Run Admin and Storage Admin roles

### Setting Up the Build Trigger

1. **Connect Repository**:
   - In Google Cloud Build Console, connect your GitHub repository `sumeet2496/edusimlabs`
   - Grant access to the repository

2. **Create Trigger**:
   - **Name**: EduSimLabs Deploy
   - **Source**: GitHub (select your repo)
   - **Branch**: `^main$` (builds on pushes to main)
   - **Build Configuration**: Cloud Build configuration file (yaml or json)
   - **Cloud Build configuration file location**: `/cloudbuild.yaml` (default)
   - **Save**

3. **Trigger Build**:
   - Push to `main` branch or click "Run" in the console

### Services Deployed

After successful build, these Cloud Run services will be available:
- `edusimlabs-main`: Main website
- `edusimlabs-fx-forward`: FX Forward Terminal
- `edusimlabs-boardroom`: Multiplayer Boardroom
- `edusimlabs-trademaster`: FICC Trademaster Pro
- `edusimlabs-proxy`: Proxy service that routes to all apps on port 8080

### Configure Proxy Environment Variables

After deployment, you need to set the environment variables for the proxy service to point to the actual service URLs:

1. Get the URLs of the deployed services:
   ```bash
   gcloud run services list --region=us-central1
   ```

2. Update the proxy service environment variables:
   ```bash
   gcloud run services update edusimlabs-proxy \
     --region=us-central1 \
     --set-env-vars MAIN_URL=https://edusimlabs-main-xxxxxx.run.app,FX_URL=https://edusimlabs-fx-forward-xxxxxx.run.app,BOARDROOM_URL=https://edusimlabs-boardroom-xxxxxx.run.app,TRADEMASTER_URL=https://edusimlabs-trademaster-xxxxxx.run.app
   ```
   Replace `xxxxxx` with the actual hash from your service URLs.

3. Access the application at the proxy service URL (e.g., `https://edusimlabs-proxy-xxxxxx.run.app`)

### Manual Build

If needed, run Cloud Build manually:

```bash
gcloud builds submit --config cloudbuild.yaml
```

### Troubleshooting

**Error: "invalid app path 'miain'"**
- This means the trigger is set to "Buildpack" mode with incorrect app path
- Change the build configuration to "Cloud Build configuration file" as described above
- Ensure the branch is set to `main`, not a specific commit

**Build succeeds but deployment fails**
- Check that your Google Cloud project has the required permissions
- Ensure the service account has Cloud Run Admin role
- Verify that the Dockerfiles are present in each app directory

**Proxy not routing correctly**
- Ensure the environment variables are set correctly with the full URLs of the services
- Check the Cloud Run logs for the proxy service