# EduSimLabs

A suite of educational simulation tools for finance and trading.

## Apps

- **Main Website**: Landing page and navigation to simulations
- **FX Forward Terminal**: FX forward trading simulation
- **Multiplayer Boardroom**: Global capital allocation simulation
- **FICC Trademaster Pro**: Fixed income, currencies, and commodities trading simulation

## Local Development

Run all apps locally:

```bash
./start-all.sh
```

This starts each app on different ports:
- Main: http://localhost:5173
- FX Forward: http://localhost:5174
- Boardroom: http://localhost:5175
- Trademaster: http://localhost:5176

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