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

Once the script has finished booting you can visit the consolidated site at `http://localhost:8080`.
Each simulation is mounted under a path so the main page and URLs stay consistent
with production:

- `/` → main website (port 3000)
- `/fx-forward-terminal` → FX Forward Terminal (port 3001)
- `/multiplayer-boardroom` → Multiplayer Boardroom (port 3002)
- `/ficc-trademaster-pro` → FICC Trademaster Pro (port 3003)

You can still start an individual app by `cd`‑ing into its folder and running
`npm install && npm run dev`; the port numbers above are defined in each app's
`vite.config.ts`.

## Deployment to Google Cloud

The project is configured for automated deployment to Google Cloud Run using Cloud Build.

### Prerequisites

- Google Cloud Project with billing enabled
- Cloud Build API enabled
- Cloud Run API enabled
- Container Registry API enabled

### Setting Up the Build Trigger

1. **Connect Repository**:
   - In Google Cloud Build Console, connect your GitHub repository `sumeet2496/edusimlabs`

2. **Create Trigger**:
   - **Name**: EduSimLabs Deploy
   - **Source**: GitHub (select your repo)
   - **Branch**: `^main$` (builds on pushes to main)
   - **Build Configuration**: Cloud Build configuration file (yaml or json)
   - **Cloud Build configuration file location**: `/cloudbuild.yaml` (default)
   - **Save**

3. **Trigger Build**:
   - Push to `main` branch or click "Run" in the console

### Troubleshooting

**Error: "invalid app path 'miain'"**
- This means the trigger is set to "Buildpack" mode with incorrect app path
- Change the build configuration to "Cloud Build configuration file" as described above
- Ensure the branch is set to `main`, not a specific commit

**Build succeeds but deployment fails**
- Check that your Google Cloud project has the required permissions
- Ensure the service account has Cloud Run Admin role

### Services Deployed

After successful build, these Cloud Run services will be available:
- `edusimlabs-main`: Main website
- `edusimlabs-fx-forward`: FX Forward Terminal
- `edusimlabs-boardroom`: Multiplayer Boardroom
- `edusimlabs-trademaster`: FICC Trademaster Pro

Each service will have a public URL for access.

### Manual Build

If needed, run Cloud Build manually:

```bash
gcloud builds submit --config cloudbuild.yaml
```

## Architecture

Each simulation is a separate React/Vite application built with buildpacks and deployed as containerized services on Cloud Run.