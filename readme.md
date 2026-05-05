# DASS - Cadastro de Tamanhos

Monorepo com backend em Node.js (Express + Prisma) e frontend em Vue 3 (Vite).

Serviços:

- PostgreSQL (via Docker Compose)

Como rodar (exemplo):

1. Iniciar banco

```bash
docker compose up -d
```

2. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

3. Frontend

```bash
cd frontend
npm install
npm run dev
```

