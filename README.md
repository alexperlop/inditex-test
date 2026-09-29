# Zara Challenge · Smartphones Catalog

Aplicación web para consultar un catálogo de teléfonos móviles, ver el detalle configurable de cada modelo (color y almacenamiento) y gestionar un carrito persistente.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript** estricto
- **TanStack Query v5** con precarga en servidor + `HydrationBoundary` en cliente
- **Zod 4** para validar respuestas de la API (esquemas + adapter a tipos de dominio)
- **Zustand 5** (middleware `persist` → localStorage) para el carrito
- **Axios** (singleton) para la capa de red
- **SASS + CSS Modules** con variables CSS en `:root`
- **Vitest 3 + Testing Library** para unit/integration; **Cypress 16** para E2E
- **ESLint 9 (flat config)** + **Prettier** + **Husky + lint-staged**

## Requisitos

- Node.js `>= 24.11.1` (ver `.nvmrc`). El PDF pedía Node 18; se optó por la versión del `.nvmrc` porque Next 16/Turbopack requiere un runtime moderno.
- npm 10+.

## Puesta en marcha

```bash
nvm use            # opcional, pero recomendado
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
```

Variables de entorno (`.env.local`):

| Variable        | Ámbito | Descripción                                                                            |
| --------------- | ------ | -------------------------------------------------------------------------------------- |
| `PHONE_API_URL` | server | Base URL de la API pública.                                                            |
| `PHONE_API_KEY` | server | API key inyectada por el BFF en el header `x-api-key`. **Nunca se expone al cliente.** |

## Scripts

| Script              | Descripción                                                                 |
| ------------------- | --------------------------------------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo (assets sin minimizar, HMR).                         |
| `npm run build`     | Build de producción (minifica y concatena vía Turbopack).                   |
| `npm run start`     | Sirve el build de producción (`.next`).                                     |
| `npm run typecheck` | `tsc --noEmit`.                                                             |
| `npm run lint`      | ESLint (Next core-web-vitals + jsx-a11y + prettier).                        |
| `npm run format`    | Prettier `--write .`                                                        |
| `npm run test`      | Vitest watch. `test:run` para un solo pase; `test:coverage` para cobertura. |
| `npm run e2e`       | Cypress headless. `e2e:open` para modo interactivo.                         |

### Modo desarrollo vs producción

- **Desarrollo**: `next dev` sirve JS/CSS sin minimizar, con HMR y sourcemaps.
- **Producción**: `next build && next start` genera bundles minificados y concatenados. La ruta `/api/products` cachea con `s-maxage=60, stale-while-revalidate=300`.

## Arquitectura

```
src/
├── app/                       App Router (páginas, layout, route handlers BFF)
│   ├── api/products/          BFF: proxy autenticado a la API real
│   ├── products/[id]/         Detalle (RSC + prefetch)
│   ├── cart/                  Carrito (cliente)
│   ├── layout.tsx             Providers globales + Navbar
│   ├── page.tsx               Listado (RSC + prefetch + HydrationBoundary)
│   └── globals.scss
├── features/
│   ├── catalog/               Grid, SearchBar, ResultCount, hooks
│   ├── product-detail/        ProductConfigurator (Compound + Provider+Reducer)
│   └── cart/                  Store Zustand, CartItem, CartSummary, CartView
├── shared/
│   ├── layout/Navbar.tsx      Navbar (Render Prop `renderRight`)
│   ├── hoc/withErrorBoundary  HOC para envolver features con ErrorBoundary
│   └── styles/                tokens.scss, mixins.scss
├── services/
│   ├── http/axiosClient.ts    Singleton axios (server e instancia cliente separadas)
│   └── products/productsService.ts   Contrato de dominio (list, getById)
├── adapters/                  Zod schemas + DTO → dominio (normaliza http→https)
├── domain/                    Tipos puros (Product, CartItem…)
├── lib/                       env (Zod), queryClient (Singleton por entorno), format
└── providers/                 QueryProvider (client)
tests/                         Vitest setup
cypress/                       E2E specs + fixtures
```

## Patrones aplicados (y por qué)

| Patrón                              | Dónde                                                                                                   | Motivación                                                                                                                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **BFF**                             | `src/app/api/products/**/route.ts`                                                                      | Oculta `PHONE_API_KEY` del bundle, inyecta el header `x-api-key`, permite cachear y normalizar la respuesta. Cumple el requisito de autenticación sin exponer credenciales. |
| **Singleton**                       | `services/http/axiosClient.ts`, `lib/queryClient.ts`                                                    | Una única instancia de Axios por proceso; `QueryClient` por request en el servidor y global en el cliente (patrón oficial de TanStack para Next).                           |
| **Capa de servicios + adaptadores** | `services/products`, `adapters/product.*`                                                               | Los componentes trabajan con tipos de dominio. El adapter valida con Zod y normaliza (p. ej., `imageUrl` de `http://` a `https://`). Aísla del cambio de API.               |
| **Precarga e hidratación**          | `app/page.tsx`, `app/products/[id]/page.tsx`                                                            | RSC hace `prefetch/fetchQuery` y `dehydrate`. El cliente hidrata con `<HydrationBoundary>`, evitando el flash de "loading" y mejorando TTFB.                                |
| **Compound Components**             | `ProductConfigurator` (`.Gallery`, `.Header`, `.ColorPicker`, `.StoragePicker`, `.Price`, `.AddToCart`) | El configurador comparte estado interno; consumidores componen la UI a su gusto sin prop-drilling.                                                                          |
| **Provider + Reducer**              | `ConfiguratorProvider` con `useReducer`                                                                 | Estado local no trivial (color + storage → habilitar CTA + precio derivado). Es local a un feature, así que se prefiere React puro a Zustand.                               |
| **State Initializer**               | `ConfiguratorProvider({ initialColor, initialStorage })`                                                | Permite arrancar el configurador en un estado concreto (útil para tests y variantes futuras).                                                                               |
| **Render Prop**                     | `<Navbar renderRight={() => <CartNavButton />} />`                                                      | Desacopla la Navbar del store del carrito; se puede reutilizar inyectando cualquier acción a la derecha.                                                                    |
| **HOC**                             | `withErrorBoundary` en `CatalogView` y `ProductDetailView`                                              | Envuelve las vistas con un ErrorBoundary de cliente sin repetir el árbol JSX.                                                                                               |
| **Custom hooks**                    | `useProducts`, `useProduct`, `useCart`, `useCartCount`, `useHasHydrated`, `useDebouncedValue`           | Encapsulan TanStack Query + Zustand para que los componentes sean declarativos.                                                                                             |
| **Lazy loading + Suspense**         | `SimilarProducts` con `next/dynamic` + `Suspense` fallback                                              | El bloque de productos similares no bloquea el LCP del detalle.                                                                                                             |

> Los patrones se han incluido solo cuando aportan valor real. No se ha forzado ninguno "para cumplir" — cada uno resuelve un problema concreto documentado arriba.

## Testing

### Unit + integración (Vitest)

```bash
npm run test:run
```

Cobertura:

- Adapter (`product.adapter`): mapping, normalización de URLs, errores de schema.
- `formatPrice`, `useDebouncedValue`.
- `configuratorReducer` (transiciones puras).
- `useCartStore` (add / duplicados / remove / clear).
- Integración de `ProductConfigurator` con React Testing Library: verifica el patrón Compound + Provider + habilitación del CTA + actualización de precio.

### E2E (Cypress)

```bash
npm run build
PORT=3010 PHONE_API_URL=... PHONE_API_KEY=... npm run start &
CYPRESS_baseUrl=http://localhost:3010 npm run e2e
```

Specs:

- `catalog.cy.ts`: render del grid inicial (SSR + hidratación) y filtrado con búsqueda + URL como fuente de verdad.
- `cart-flow.cy.ts`: flujo completo (detalle → configurar color/almacenamiento → añadir al carrito → total correcto → eliminar) y persistencia tras `reload()`.

Los tests E2E usan la API real (endpoint público con SLA razonable). Para CI en un entorno hermético habría que añadir un modo mock (p. ej. MSW en el propio proceso Next).

## Accesibilidad y consola limpia

- Landmarks (`header`, `main`), `aria-label` en la Navbar, `role="radiogroup"` + `aria-checked` en los selectores de color/almacenamiento, `aria-live="polite"` en contadores y precio.
- Focus visible con `:focus-visible` + outline.
- Fuentes: `Helvetica, Arial, sans-serif` según el enunciado.
- ESLint `no-console: warn` (solo `warn`/`error`), `plugin:jsx-a11y/recommended`.

## Despliegue

Preparada para Vercel:

1. Importa el repositorio.
2. Añade `PHONE_API_URL` y `PHONE_API_KEY` como variables de entorno (Production/Preview).
3. Build command: `npm run build`. Output: por defecto (App Router).

`next.config.mjs` incluye `images.remotePatterns` para el host de las imágenes.

## Estructura del repositorio (raíz)

- `.env.example`, `.nvmrc`, `.npmrc`, `.prettierrc`, `.prettierignore`, `.gitignore`
- `eslint.config.mjs`, `next.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `cypress.config.ts`
- `.husky/pre-commit` → `npx lint-staged`

## Decisiones y trade-offs

- **App Router** sobre Pages Router: encaja de forma natural con RSC, streaming y Suspense.
- **Zustand para el carrito** en vez de Context API: `persist` middleware nativo, no re-renderiza toda la app.
- **BFF integrado** en `src/app/api/**` en lugar de proxy externo: cero configuración extra en Vercel; misma origen; oculta la key.
- **Zod en adapter, no en cada componente**: la validación ocurre en el borde del sistema.
- **No se han usado**: RxJS/Sagas (no aporta), StyledComponents (SASS + variables CSS es más simple y sin runtime).
