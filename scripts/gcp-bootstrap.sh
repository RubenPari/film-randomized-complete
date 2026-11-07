#!/usr/bin/env bash
# One-time GCP setup for Film Randomized (Cloud Run + Cloud SQL + Workload Identity Federation).
# Usage: PROJECT_ID=my-project [REGION=europe-west1] ./scripts/gcp-bootstrap.sh
# After this, every pushed tag v* deploys via .github/workflows/release.yml.
set -euo pipefail

: "${PROJECT_ID:?set PROJECT_ID}"
REGION="${REGION:-europe-west1}"
GITHUB_REPO="${GITHUB_REPO:-RubenPari/film-randomized-complete}"
SERVICE=film-randomized
SQL_INSTANCE=film-randomized-db
DB_NAME=film_randomized
DB_USER=film_app
RUN_SA="film-randomized-run@${PROJECT_ID}.iam.gserviceaccount.com"
DEPLOY_SA="github-deployer@${PROJECT_ID}.iam.gserviceaccount.com"
WIF_POOL=github
WIF_PROVIDER=github

gcloud config set project "$PROJECT_ID"
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')
CONNECTION_NAME="${PROJECT_ID}:${REGION}:${SQL_INSTANCE}"

echo "==> Enabling APIs"
gcloud services enable run.googleapis.com sqladmin.googleapis.com artifactregistry.googleapis.com \
  secretmanager.googleapis.com iam.googleapis.com iamcredentials.googleapis.com sts.googleapis.com

echo "==> Artifact Registry"
gcloud artifacts repositories create "$SERVICE" --repository-format=docker --location="$REGION"

echo "==> Cloud SQL (takes a few minutes)"
gcloud sql instances create "$SQL_INSTANCE" --database-version=POSTGRES_16 \
  --edition=enterprise --tier=db-f1-micro --region="$REGION"
gcloud sql databases create "$DB_NAME" --instance="$SQL_INSTANCE"
DB_PASSWORD=$(openssl rand -hex 24)
gcloud sql users create "$DB_USER" --instance="$SQL_INSTANCE" --password="$DB_PASSWORD"

echo "==> Secrets"
openssl rand -hex 32 | tr -d '\n' | gcloud secrets create jwt-secret --data-file=-
printf 'postgresql://%s:%s@localhost/%s?host=/cloudsql/%s' \
  "$DB_USER" "$DB_PASSWORD" "$DB_NAME" "$CONNECTION_NAME" \
  | gcloud secrets create database-url --data-file=-

echo "==> Service accounts"
gcloud iam service-accounts create film-randomized-run --display-name="Film Randomized runtime"
gcloud iam service-accounts create github-deployer --display-name="GitHub Actions deployer"
gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="serviceAccount:$RUN_SA" \
  --role=roles/cloudsql.client --condition=None
for secret in jwt-secret database-url; do
  gcloud secrets add-iam-policy-binding "$secret" --member="serviceAccount:$RUN_SA" \
    --role=roles/secretmanager.secretAccessor
done
gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="serviceAccount:$DEPLOY_SA" \
  --role=roles/run.developer --condition=None
gcloud artifacts repositories add-iam-policy-binding "$SERVICE" --location="$REGION" \
  --member="serviceAccount:$DEPLOY_SA" --role=roles/artifactregistry.writer
gcloud iam service-accounts add-iam-policy-binding "$RUN_SA" \
  --member="serviceAccount:$DEPLOY_SA" --role=roles/iam.serviceAccountUser

echo "==> Workload Identity Federation for $GITHUB_REPO (release tags v* only)"
gcloud iam workload-identity-pools create "$WIF_POOL" --location=global --display-name="GitHub"
gcloud iam workload-identity-pools providers create-oidc "$WIF_PROVIDER" --location=global \
  --workload-identity-pool="$WIF_POOL" --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref" \
  --attribute-condition="assertion.repository=='${GITHUB_REPO}' && assertion.ref.startsWith('refs/tags/v')"
WIF_PROVIDER_NAME="projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${WIF_POOL}/providers/${WIF_PROVIDER}"
gcloud iam service-accounts add-iam-policy-binding "$DEPLOY_SA" --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${WIF_POOL}/attribute.repository/${GITHUB_REPO}"

echo "==> Cloud Run service (placeholder image; the first release tag replaces it)"
gcloud run deploy "$SERVICE" --region="$REGION" \
  --image=us-docker.pkg.dev/cloudrun/container/hello \
  --service-account="$RUN_SA" --add-cloudsql-instances="$CONNECTION_NAME" \
  --set-secrets=JWT_SECRET=jwt-secret:latest,DATABASE_URL=database-url:latest \
  --allow-unauthenticated --memory=512Mi --min-instances=0 --max-instances=3
APP_URL=$(gcloud run services describe "$SERVICE" --region="$REGION" --format='value(status.url)')

cat <<MSG

Done. App URL: ${APP_URL}

Configure GitHub:
  gh variable set GCP_PROJECT_ID --body "${PROJECT_ID}"
  gh variable set GCP_REGION --body "${REGION}"
  gh variable set GCP_WIF_PROVIDER --body "${WIF_PROVIDER_NAME}"
  gh variable set GCP_DEPLOY_SA --body "${DEPLOY_SA}"
  gh secret set VITE_TMDB_API_KEY

Optional (AI explanations):
  printf '%s' '<key>' | gcloud secrets create ai-gateway-key --data-file=-
  gcloud secrets add-iam-policy-binding ai-gateway-key \\
    --member=serviceAccount:${RUN_SA} --role=roles/secretmanager.secretAccessor
  gcloud run services update ${SERVICE} --region=${REGION} \\
    --update-secrets=AI_GATEWAY_KEY=ai-gateway-key:latest --update-env-vars=AI_GATEWAY_URL=<url>

Release: git tag v0.1.0 && git push origin v0.1.0
MSG
