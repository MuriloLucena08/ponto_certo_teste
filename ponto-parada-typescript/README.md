# 🚏 Ponto Certo Web

Aplicação web PWA para cadastro e gerenciamento de pontos de parada de transporte público no Distrito Federal. Desenvolvida pela SEMOB-DF.

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| **React 18** + **TypeScript** | Framework e linguagem |
| **Vite** | Build tool e dev server |
| **React Router v6** | Roteamento SPA com rotas protegidas |
| **Leaflet** + **React Leaflet** | Mapas interativos |
| **Dexie.js** (IndexedDB) | Armazenamento local offline-first |
| **Axios** | Requisições HTTP à API |
| **CSS Modules** | Estilização com escopo local |
| **PWA** (vite-plugin-pwa) | Service worker e instalação |

## 📦 Bibliotecas Principais

- **Axios**: Cliente HTTP para consumo da API.
- **React Router Dom**: Gerenciamento de rotas SPA e proteção de acesso.
- **Leaflet & React Leaflet**: Biblioteca base para renderização de mapas e camadas geográficas.
- **Dexie.js**: Wrapper para IndexedDB, facilitando o armazenamento local e persistência offline.
- **Proj4**: Utilizado para conversão de sistemas de coordenadas (UTM para WGS84).
- **React Hook Form**: Gerenciamento de formulários e validações.
- **React Icons**: Conjunto de ícones das bibliotecas *Ionicons*, *Material Design*, *Font Awesome*, etc.
- **React Datepicker**: Componente de seleção de data para o formulário.
- **Leaflet Markercluster**: Plugin para agrupamento de marcadores no mapa, melhorando a performance visual.
- **UUID**: Geração de identificadores únicos para registros locais.
- **Date-fns**: Utilitários para manipulação e formatação de datas.
- **Clsx**: Utilitário para construção condicional de classes CSS.

## 📁 Arquitetura do Projeto

```
src/
├── assets/               # Imagens e GeoJSON (rede viária)
├── components/
│   ├── Commons/           # Componentes reutilizáveis
│   │   ├── Button/        # Botão com variantes (primary, danger, ghost)
│   │   ├── Input/         # Campo de texto com label
│   │   ├── Switch/        # Toggle switch
│   │   ├── Header/        # Cabeçalho da aplicação
│   │   ├── Footer/        # Navegação inferior
│   │   ├── Section/       # Seção com ícone + título + children
│   │   └── ImagePicker/   # Seletor de imagens com preview e remoção
│   ├── AbrigoList/        # Lista de abrigos com formulário inline
│   └── Layout/            # Layout com Header + Footer + Outlet
├── context/
│   ├── AuthContext.tsx     # Estado de autenticação global
│   └── PontoContext.tsx    # CRUD de pontos (Dexie + sync com API)
├── hooks/
│   ├── useFormulario.ts   # Lógica do formulário de cadastro
│   ├── useMapPage.ts      # Geolocalização, mapa e seleção de vias
│   ├── useRegistros.ts    # Listagem, sync e exclusão de registros
│   └── useParadasBanco.ts # Filtros RA/Bacia e visualização de pontos remotos
├── pages/
│   ├── Login/             # Autenticação (nome + matrícula)
│   ├── Map/               # Mapa principal — selecionar ponto + via
│   ├── Formulario/        # Cadastro completo do ponto de parada
│   ├── Registros/         # Pontos salvos localmente + sincronização
│   ├── ParadasBanco/      # Pontos do banco de dados com filtros e clusters
│   └── Sobre/             # Informações sobre o aplicativo
├── services/
│   ├── api.ts             # Instância Axios (baseURL da API SEMOB)
│   ├── auth.ts            # Login e gestão de sessão (localStorage)
│   ├── points.ts          # Criar e listar pontos na API
│   ├── remotePoints.ts    # Buscar pontos remotos (por RA/Bacia)
│   ├── address.ts         # Geocodificação reversa (Nominatim/OSM)
│   ├── via.ts             # Carregar vias próximas do GeoJSON local
│   ├── ra.ts              # Carregar limites de Regiões Administrativas
│   ├── bacia.ts           # Carregar limites de Bacias
│   └── db.ts              # Configuração do Dexie (IndexedDB)
├── types/                 # Interfaces TypeScript (Ponto, Via, RemotePoint, etc.)
└── utils/
    ├── file.ts            # Conversão blob ↔ base64
    ├── formatters.ts      # Formatação de matrícula e datas
    ├── geoUtils.ts        # Distância, projeção na via, interpolação
    └── projection.ts      # Transformação de coordenadas UTM → WGS84
```

## 🔄 Fluxo da Aplicação

```
Login → Mapa (selecionar ponto) → Confirmar via → Formulário → Salvar (Dexie)
                                                                      ↓
                                                              Registros → Sync → API
```

1. **Login**: Usuário informa nome e matrícula. Validação feita pela API.
2. **Mapa**: Geolocalização do usuário. Seleciona um ponto no mapa e confirma.
3. **Vias**: Carrega vias próximas (GeoJSON local). O ponto é interpolado na via mais próxima.
4. **Formulário**: Preenche dados do ponto (endereço, abrigos, imagens, acessibilidade).
5. **Salvar**: Dados salvos no **IndexedDB** (offline-first) com status `pending`.
6. **Sincronizar**: Na tela de Registros, o usuário sincroniza os pontos pendentes com a API.

## 🔒 Autenticação e Rotas

- Todas as rotas (exceto `/login`) são protegidas pelo componente `ProtectedRoute`
- A sessão é mantida via `localStorage` (`idUsuario`)
- Ao perder a sessão, o usuário é redirecionado para `/login`

## 🗺️ Paradas Banco

Visualização dos pontos já cadastrados no banco de dados, com:
- **Filtros** por Região Administrativa (RA) ou Bacia
- **Clusters** de marcadores para performance
- **GeoJSON** com limites geográficos das RAs e Bacias
- **Camada satélite** alternável

## 🚀 Comandos

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

## 📋 Variáveis de Ambiente

Criar um arquivo `.env` na raiz (já está no `.gitignore`):

```env
VITE_API_URL=http://dados.semob.df.gov.br
```

> **Nota:** Atualmente a URL da API está hardcoded em `services/api.ts`. Recomenda-se migrar para variável de ambiente.
