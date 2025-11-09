# Toyota Nexus API — Testing Without Frontend

This guide shows how to verify the backend works with Auth0, without wiring the React app yet.

## Prerequisites
- Node 18+ (or 20+ recommended)
- Auth0 tenant with an API (RS256) and a Machine-to-Machine (M2M) Application
- `apps/api/.env` configured:
  - `PORT=8080`
  - `WEB_ORIGIN=http://localhost:5173`
  - `AUTH0_AUDIENCE` = your API Identifier (e.g., `https://api.toyota-nexus`)
  - `AUTH0_ISSUER` = `https://<your-domain>/` (note trailing slash)

## Start the API
PowerShell:
```powershell
npm run dev --prefix apps\api
```
Expected: `[api] listening on http://localhost:8080`

## Root index (public)
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/" | ConvertTo-Json -Compress
```
Expect: metadata JSON including `health`, `authorized`, `data` endpoints.

## Health (public)
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/health"
```
Expect: `{ "status": "ok" }`

## Enable permissions (one-time)
In Auth0 API Settings:
1. Enable RBAC
2. Enable "Add Permissions in the Access Token"
Add permission: `read:data` and grant it to your M2M app.

## Get an access token (M2M)
PowerShell:
```powershell
$Domain = "<your-domain>"  # e.g. dev-xyz.us.auth0.com
$Audience = "https://api.toyota-nexus"
$ClientId = "<M2M_CLIENT_ID>"
$ClientSecret = "<M2M_CLIENT_SECRET>"
$Body = @{ client_id=$ClientId; client_secret=$ClientSecret; audience=$Audience; grant_type="client_credentials" } | ConvertTo-Json
$TokenResponse = Invoke-RestMethod -Method Post -Uri "https://$Domain/oauth/token" -Headers @{ "content-type"="application/json" } -Body $Body
$AccessToken = $TokenResponse.access_token
$AccessToken.Substring(0,30) + "..."
```

cURL:
```bash
curl -X POST "https://<your-domain>/oauth/token" \
  -H "content-type: application/json" \
  -d '{
    "client_id":"<M2M_CLIENT_ID>",
    "client_secret":"<M2M_CLIENT_SECRET>",
    "audience":"https://api.toyota-nexus",
    "grant_type":"client_credentials"
  }'
```

Postman / Insomnia: same POST body.

## Protected: /authorized
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/authorized" -Headers @{ Authorization = "Bearer $AccessToken" }
```
Expect: `{ "message": "Secured Resource" }`

## Scope protected: /data
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/data" -Headers @{ Authorization = "Bearer $AccessToken" }
```
Expect: JSON list. 403 means missing `read:data` scope.

## VS Code REST Client (optional)
Use the included `apps/api/test.http` with the REST Client extension.

## Troubleshooting
| Issue | Cause | Fix |
|-------|-------|-----|
| 401 Unauthorized | Audience/issuer mismatch; expired token | Check `AUTH0_AUDIENCE`, `AUTH0_ISSUER`, get new token |
| 403 on /data | Missing scope | Ensure RBAC, permission, reissue token |
| CORS errors | Origin mismatch | Set `WEB_ORIGIN` in `.env` |
| Cannot GET / | Hitting before update or wrong port | Use `/` or `/health` |

## Next
Install `@auth0/auth0-react` for SPA login and automatic token acquisition.
