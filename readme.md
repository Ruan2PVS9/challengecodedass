# DASS - Cadastro de Tamanhos

Monorepo com backend em Node.js (Express + Prisma) e frontend em Vue 3 (Vite).

Serviços:

- PostgreSQL (via Docker Compose)

## Desenvolvimento Local

### 1. Iniciar banco

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

## Deployment em Produção

O projeto está configurado com:
- **Docker**: Dockerfiles para backend e frontend
- **GitHub Actions**: Pipeline de CI/CD automatizado
- **Docker Hub**: Registry para imagens
- **VPS Hostinger**: Deploy via SSH

### Fluxo Rápido
1. Configure os secrets no GitHub 
2. Prepare a VPS Hostinger
3. Faça push para branch `main`
4. GitHub Actions faz build, push para Docker Hub e deploy na VPS automaticamente


