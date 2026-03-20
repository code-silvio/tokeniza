# Asset Tokenization Dashboard

Plataforma de monitoramento em tempo real de ativos tokenizados: créditos de carbono globais, protocolos de tokenização de carbono on-chain e tokens de grãos agrícolas.

---

## Stack

| Camada     | Tecnologia                              |
|------------|-----------------------------------------|
| Frontend   | Next.js 16 + TypeScript + Tailwind CSS  |
| Backend    | FastAPI (Python 3.12)                   |
| Cache      | Redis                                   |
| Dev tools  | Uvicorn, python-dotenv, httpx, aiohttp  |

---

## Estrutura do projeto

```
tokeniza/
├── backend/                  # FastAPI
│   ├── main.py               # App principal + CORS
│   ├── routers/
│   │   ├── carbon.py         # /api/carbon/*
│   │   ├── tokens.py         # /api/tokens/*
│   │   └── grains.py         # /api/grains/*
│   ├── services/
│   │   ├── mock_data.py      # Dados mock realistas (fallback)
│   │   ├── verra.py          # Verra Registry + Gold Standard
│   │   ├── coingecko.py      # CoinGecko (preços on-chain)
│   │   ├── defillama.py      # DefiLlama (TVL protocolos)
│   │   ├── thegraph.py       # The Graph (dados on-chain)
│   │   ├── agrotoken.py      # Agrotoken (SOYA, CORA, CAFE)
│   │   └── worldbank.py      # World Bank + Nasdaq (commodities)
│   ├── cache/
│   │   └── redis.py          # Wrapper Redis com TTL por fonte
│   ├── .env.example
│   └── requirements.txt
└── frontend/                 # Next.js
    ├── app/
    └── ...
```

---

## Pré-requisitos

- Python 3.12+
- Node.js 20+
- Redis (local ou Docker)

---

## Instalação e execução

### Backend

```bash
cd backend

# Criar e ativar ambiente virtual
python3 -m venv .venv
source .venv/bin/activate        # macOS/Linux
# .venv\Scripts\activate         # Windows

# Instalar dependências
pip install --upgrade pip
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas chaves de API

# Iniciar o servidor
uvicorn main:app --reload --reload-dir .
```

Backend disponível em: `http://localhost:8000`
Documentação interativa: `http://localhost:8000/docs`

### Redis (Docker)

```bash
docker run -d -p 6379:6379 redis:alpine
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend disponível em: `http://localhost:3000`

---

## Variáveis de ambiente

Crie um arquivo `.env` dentro de `backend/` com base no `.env.example`:

```env
REDIS_URL=redis://localhost:6379
AGROTOKEN_API_TOKEN=      # Token Agrotoken (grãos)
BEZERO_API_KEY=           # BeZero Carbon (ratings)
NASDAQ_API_KEY=           # Nasdaq Data Link (commodities)
```

> As APIs sem chave (Verra, CoinGecko free, DefiLlama, World Bank, The Graph) funcionam sem configuração adicional.

---

## Endpoints da API

### Health
| Método | Rota          | Descrição        |
|--------|---------------|------------------|
| GET    | `/api/health` | Status do backend |

### Crédito de Carbono Global (`/api/carbon`)
| Método | Rota                      | Descrição                        |
|--------|---------------------------|----------------------------------|
| GET    | `/api/carbon/summary`     | Totais globais emitidos/aposentados |
| GET    | `/api/carbon/by-type`     | Distribuição por tipo de projeto |
| GET    | `/api/carbon/by-country`  | Distribuição por país            |
| GET    | `/api/carbon/price-history` | Histórico de preços (24 meses) |
| GET    | `/api/carbon/projects`    | Top projetos Verra               |

### Tokenização de Carbono (`/api/tokens`)
| Método | Rota                        | Descrição                         |
|--------|-----------------------------|-----------------------------------|
| GET    | `/api/tokens/summary`       | TVL total + créditos tokenizados  |
| GET    | `/api/tokens/protocols`     | Cards por protocolo (BCT, NCT…)   |
| GET    | `/api/tokens/tvl-history`   | Histórico de TVL por protocolo    |
| GET    | `/api/tokens/price-spread`  | Spread token vs mercado físico    |

### Tokenização de Grãos (`/api/grains`)
| Método | Rota                                  | Descrição                     |
|--------|---------------------------------------|-------------------------------|
| GET    | `/api/grains/summary`                 | Totais globais tokenizados    |
| GET    | `/api/grains/tokens`                  | Cards SOYA, CORA, CAFE        |
| GET    | `/api/grains/market-compare`          | Token vs mercado tradicional  |
| GET    | `/api/grains/price-history/{symbol}`  | Histórico de preços do token  |
| GET    | `/api/grains/commodity-history/{symbol}` | Histórico World Bank       |

---

## Fontes de dados e TTL de cache

| Seção                    | Fonte                          | TTL    |
|--------------------------|--------------------------------|--------|
| Crédito de Carbono       | Verra Registry (scraping)      | 6h     |
| Preços de carbono        | BeZero / Xpansiv               | 1h     |
| TVL protocolos           | DefiLlama API                  | 5min   |
| Preços on-chain          | CoinGecko API                  | 5min   |
| Dados on-chain           | The Graph                      | 10min  |
| Grãos tokenizados        | Agrotoken API                  | 15min  |
| Commodities tradicionais | World Bank / Nasdaq            | 1h     |

### Sistema de fallback

Cada endpoint segue a hierarquia:

```
API externa → Cache Redis → Dados mock
```

Se a API falhar e o cache expirar, os dados mock realistas são retornados automaticamente sem erro para o usuário.

---

## VS Code — configuração recomendada

Crie `.vscode/settings.json` na raiz do projeto:

```json
{
  "python.defaultInterpreterPath": "${workspaceFolder}/backend/.venv/bin/python"
}
```

---

## Licença

MIT
