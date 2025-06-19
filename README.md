# Vounaise Festival

Site web pour gérer les inscriptions au [Vounaise Festival](https://vounaise.party/).

## Installation

```bash
npm install
npm run migrate up
npm run build
```

## Configuration

| Environment variable    | Description                   |
|-------------------------|-------------------------------|
| `DATABASE_URL`          | URL to a postgers database    |
| `ADMIN_PASSWORD`        | Password to access admin page |
| `NUXT_SESSION_PASSWORD` | Secret key for auth tokens    |
