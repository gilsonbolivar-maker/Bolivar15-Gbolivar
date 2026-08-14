# Harmonize Clinical

Sistema de gestão para clínicas de estética e harmonização orofacial: prontuário,
mapeamento facial 2D de injetáveis, agenda de retoques, estoque com controle de
lote/ANVISA, financeiro e assistente de IA para protocolos e pós-cuidado.

Roda como **PWA**: instala na tela inicial e funciona offline.

## Rodando localmente

**Pré-requisitos:** Node.js 20+

```bash
npm install
cp .env.example .env        # opcional: a IA tem fallback sem chave
npm run dev                 # http://localhost:3000
```

| Script | O que faz |
| --- | --- |
| `npm run dev` | Servidor Express + Vite em modo desenvolvimento |
| `npm run build` | Build de produção (front em `dist/` + `dist/server.cjs`) |
| `npm start` | Sobe o build de produção |
| `npm run lint` | Checagem de tipos (`tsc --noEmit`, modo strict) |

### Variáveis de ambiente

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `GEMINI_API_KEY` | Não | Chave do Gemini. Sem ela, as rotas de IA respondem com conteúdo de exemplo (`isMock: true`) em vez de falhar. |
| `GEMINI_MODEL` | Não | Modelo usado nas rotas de IA. Padrão: `gemini-2.5-flash`. |
| `APP_URL` | Não | URL pública onde o app está hospedado. |

## PWA

O service worker só é registrado no **build de produção** — em desenvolvimento
ele conflita com o HMR do Vite. Para testar a instalação e o modo offline:

```bash
npm run build && npm start
```

Arquivos envolvidos:

| Arquivo | Papel |
| --- | --- |
| `public/manifest.webmanifest` | Nome, ícones, cores, atalhos (`?module=…`) |
| `public/sw.js` | Cache da casca do app e estratégias de rede |
| `src/hooks/usePwa.ts` | Registro do SW, aviso de atualização, prompt de instalação, status offline |
| `src/components/PwaBanners.tsx` | Avisos flutuantes de offline / atualização / instalar |

**Estratégias de cache:** navegação usa *network-first* (pega a versão nova
assim que houver rede, cai no cache quando offline); `/assets/*` usa
*cache-first* porque os nomes têm hash; `/api/*` **nunca** é cacheado, para as
respostas de IA serem sempre reais.

Quando um novo build é publicado, o app mostra "Nova versão disponível" e o
usuário aplica com um clique — sem precisar desinstalar nada.

## Backup dos dados

⚠️ **Todos os dados da clínica ficam no `localStorage` do navegador.** Não há
servidor de banco de dados. Limpar os dados de navegação, desinstalar o PWA ou
trocar de aparelho **apaga tudo**.

O botão **"Backup dos dados"** na barra lateral exporta o estado completo
(pacientes, agendamentos, estoque, procedimentos, financeiro e pontos de
mapeamento facial) para um `.json`, e restaura a partir dele em dois modos:

- **Mesclar** — mantém o que já existe e acrescenta só os registros novos (dedup por `id`);
- **Substituir** — descarta os dados atuais do aparelho.

Onde houver suporte (Chrome/Edge), o download usa a File System Access API para
o usuário escolher a pasta; nos demais navegadores cai no download convencional.

## Estrutura

```
src/
  App.tsx                 Estado global, navegação e persistência local
  types.ts                Modelos de domínio (paciente, agendamento, lote, …)
  data/mockData.ts        Dados iniciais de demonstração
  components/             Um módulo por área clínica + FaceMapStudio
  hooks/usePwa.ts         Integração com service worker e instalação
  utils/date.ts           Datas no fuso local (YYYY-MM-DD)
  utils/storage.ts        Leitura/escrita resiliente no localStorage
  utils/backup.ts         Serialização, validação e merge do backup
public/                   Manifest, service worker e ícones
server.ts                 Express: rotas de IA + entrega do build
```
