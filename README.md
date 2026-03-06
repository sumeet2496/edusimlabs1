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

### Deployment

1. Connect your GitHub repository to Google Cloud Build
2. Create a build trigger for the `main` branch
3. Set the build configuration to use `cloudbuild.yaml`
4. Push to `main` branch to trigger automatic deployment

Each app will be deployed as a separate Cloud Run service:
- `edusimlabs-main`
- `edusimlabs-fx-forward`
- `edusimlabs-boardroom`
- `edusimlabs-trademaster`

### Manual Build

If needed, run Cloud Build manually:

```bash
gcloud builds submit --config cloudbuild.yaml
```

## Architecture

Each simulation is a separate React/Vite application built with buildpacks and deployed as containerized services on Cloud Run.