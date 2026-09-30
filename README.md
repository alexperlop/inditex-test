# Zara Challenge · Smartphones Catalog

Aplicación web para consultar un catálogo de teléfonos móviles, ver el detalle configurable de cada modelo (color y almacenamiento) y gestionar un carrito persistente.

Este README documenta **qué** se ha construido, **cómo** está organizado y sobre todo **por qué** se ha resuelto de la forma en la que está. Cada decisión intenta minimizar accidental complexity y aportar valor concreto al producto, no cumplir con una lista teórica de "buenas prácticas".

---

## Índice

1. [Stack tecnológico y motivación](#stack-tecnológico-y-motivación)
2. [Requisitos y puesta en marcha](#requisitos-y-puesta-en-marcha)
3. [Scripts](#scripts)
4. [Arquitectura](#arquitectura)
5. [Flujo de datos end-to-end](#flujo-de-datos-end-to-end)
6. [Patrones de diseño aplicados](#patrones-de-diseño-aplicados)
7. [Decisiones técnicas y trade-offs](#decisiones-técnicas-y-trade-offs)
8. [Testing](#testing)
9. [Accesibilidad](#accesibilidad)
10. [Despliegue](#despliegue)

---

## Stack tecnológico y motivación

| Herramienta                            | Versión | Por qué esta elección                                                                                                                                                                                                                                                                                            |
| -------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Next.js (App Router)**               | 16      | Se necesita SSR/RSC para SEO en fichas de producto, streaming para no bloquear el LCP y un lugar natural donde alojar el **BFF** (route handlers) que oculta la API key. El App Router encaja de forma natural con `Suspense`, `HydrationBoundary` y componentes de servidor; el Pages Router se quedaría corto. |
| **React 19**                           | 19      | Server Components estables, `useTransition` mejorado y compatibilidad total con TanStack Query v5 en modo hidratado.                                                                                                                                                                                             |
| **TypeScript estricto**                | 5.9     | El dominio (`Product`, `CartItem`, `ColorOption`, `StorageOption`) es rico en variantes; los tipos previenen bugs sutiles (mezclar `basePrice` con `storage.price`, olvidar validar la selección antes del CTA…).                                                                                                |
| **TanStack Query v5**                  | 5.x     | Cacheo cliente + servidor con **hidratación**: RSC hace `prefetchQuery` → `dehydrate` → el cliente hidrata sin re-fetch. Evita el flash de "loading", reduce roundtrips y da revalidación en background gratis. Un `useEffect + fetch` sería inmediatamente inferior.                                            |
| **Zustand 5**                          | 5.x     | Estado global del **carrito** con middleware `persist` a `localStorage` incluido de fábrica. No queríamos meter Context API + `useReducer` + serialización manual para un caso claramente global y persistente.                                                                                                  |
| **Zod 4**                              | 4.x     | Validación en el **borde del sistema** (adapter). La API es externa y su contrato puede romperse; Zod convierte "unknown" en `ProductDetail` o falla con un mensaje claro. También deriva tipos DTO sin duplicación.                                                                                             |
| **Axios**                              | 1.20    | Interceptores de error, timeouts y separación limpia entre cliente **servidor** (con API key) e **navegador** (sin credenciales). `fetch` nativo obligaría a repetir manualmente estas primitivas.                                                                                                               |
| **SASS + CSS Modules**                 | 1.105   | Aislamiento por componente sin runtime (a diferencia de styled-components/emotion). Los **tokens** (`--color-*`, `--space-*`) viven en `:root` y son consumidos tanto por CSS como por SCSS via `var(...)`. Coste cero en JS.                                                                                    |
| **Vitest 3 + Testing Library**         | 3.2     | Vitest es más rápido que Jest sobre Vite/Turbopack y comparte configuración con el bundler. RTL fuerza a testear como el usuario, no la implementación.                                                                                                                                                          |
| **Cypress 16**                         | 16.1    | E2E real contra el binario de producción. Comprueba el flujo completo (catálogo → configurar → carrito → persistencia) que ningún test unitario puede cubrir.                                                                                                                                                    |
| **ESLint 9 (flat) + Prettier + Husky** | —       | Gate mínimo en `pre-commit`: `lint --fix` + `prettier`. Se evita el drift de estilo y se pillan `no-console`, hooks mal usados y reglas `jsx-a11y` antes de commitear.                                                                                                                                           |

**Filosofía:** cada dependencia resuelve un problema real. No hay librerías "por hype" (ni Redux, ni RxJS, ni una CSS-in-JS con runtime, ni un formulario para inputs sin validación de negocio).

---

## Cómo levantar la aplicación

### Requisitos previos

| Requisito   | Versión                        | Comprobación |
| ----------- | ------------------------------ | ------------ |
| **Node.js** | `>= 24.11.1` (ver `.nvmrc`)    | `node -v`    |
| **npm**     | `>= 10`                        | `npm -v`     |
| **nvm**     | Cualquiera reciente (opcional) | `nvm -v`     |

> El enunciado pedía Node 18; se elevó porque Next 16/Turbopack necesita un runtime moderno y varias APIs (`ReadableStream`, `structuredClone`) son más estables. Si usas `nvm`, `nvm use` en la raíz aplica la versión de `.nvmrc` automáticamente.

### 1 · Clonar e instalar

```bash
git clone <repo-url>
cd inditex-test
nvm use                # opcional pero recomendado
npm ci                 # ci en lugar de install para respetar el lockfile
```

> Se prefiere `npm ci` sobre `npm install` porque instala exactamente lo declarado en `package-lock.json` (más rápido y reproducible). Usa `npm install` solo si vas a añadir/actualizar dependencias.

### 2 · Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` y rellena:

| Variable        | Ámbito | Descripción                                                                            |
| --------------- | ------ | -------------------------------------------------------------------------------------- |
| `PHONE_API_URL` | server | Base URL de la API pública. Ya viene rellenada en `.env.example`.                      |
| `PHONE_API_KEY` | server | API key inyectada por el BFF en el header `x-api-key`. **Nunca se expone al cliente.** |

> Ambas son **server-only**: no llevan prefijo `NEXT_PUBLIC_`, así que el bundler nunca las incluye en el bundle de cliente. Se validan con Zod al arrancar (`src/lib/env.ts`): si falta cualquiera, el proceso muere con un mensaje claro en lugar de fallar en runtime con `undefined`.

### 3 · Levantar en modo desarrollo

```bash
npm run dev
```

- URL: **http://localhost:3000**
- Hot Module Replacement (HMR) activo: guarda un archivo y la UI se actualiza sin recargar.
- Sourcemaps completos, assets sin minimizar.
- El BFF vive en `http://localhost:3000/api/products` (proxy autenticado hacia `PHONE_API_URL`).

Para usar un puerto distinto:

```bash
PORT=3010 npm run dev
```

### 4 · Levantar en modo producción (local)

Sirve para verificar el bundle real antes de desplegar:

```bash
npm run build          # genera .next/ con bundles minificados
npm run start          # sirve la build en http://localhost:3000
```

Diferencias con `dev`:

- JS/CSS minificados y concatenados por Turbopack.
- Cache HTTP activo en `/api/products` (`s-maxage=60, stale-while-revalidate=300`).
- Sin HMR ni sourcemaps.

### 5 · Verificaciones de calidad (opcional pero recomendado)

Antes de commitear (Husky ejecuta `lint-staged` automáticamente en el `pre-commit`, pero puedes lanzarlas manualmente):

```bash
npm run typecheck      # tsc --noEmit
npm run lint           # ESLint
npm run format:check   # Prettier en modo verificación
```

### Troubleshooting común

| Síntoma                                        | Causa probable                      | Solución                                                       |
| ---------------------------------------------- | ----------------------------------- | -------------------------------------------------------------- |
| `Error: PHONE_API_KEY is required` al arrancar | `.env.local` no existe o está vacío | `cp .env.example .env.local` y rellenar la key.                |
| Puerto 3000 ocupado (`EADDRINUSE`)             | Otro proceso escuchando             | `PORT=3010 npm run dev` o `lsof -ti:3000 \| xargs kill`.       |
| `Node version mismatch`                        | Versión distinta a `.nvmrc`         | `nvm install && nvm use`.                                      |
| Cambios en `.env.local` no aplican             | Next cachea el env al arrancar      | Reiniciar `npm run dev`.                                       |
| Imágenes rotas del proveedor                   | Host no autorizado                  | Añadir el host en `next.config.mjs` → `images.remotePatterns`. |

---

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

---

## Arquitectura

### Estructura de carpetas

```
src/
├── app/                       App Router (páginas, layout, route handlers BFF)
│   ├── api/products/          BFF: proxy autenticado a la API real
│   ├── products/[id]/         Detalle (RSC + prefetch)
│   ├── cart/                  Carrito (cliente)
│   ├── layout.tsx             Providers globales + Navbar
│   ├── page.tsx               Listado (RSC + prefetch + HydrationBoundary)
│   └── globals.scss
├── features/                  Módulos verticales por dominio funcional
│   ├── catalog/               Grid, SearchBar, ResultCount, hooks
│   ├── product-detail/        ProductConfigurator (Compound + Provider + Reducer)
│   └── cart/                  Store Zustand, CartItem, CartSummary, CartView
├── shared/                    Componentes/estilos/HOCs reutilizables entre features
│   ├── layout/Navbar.tsx      Navbar (Render Prop `renderRight`)
│   ├── hoc/withErrorBoundary  HOC para envolver features con ErrorBoundary
│   ├── components/            OptionPicker, SkipLink, LoadingMessage, QueryErrorRetry
│   └── styles/                tokens.scss, mixins.scss
├── services/                  Capa de infraestructura (HTTP, endpoints)
│   ├── http/axiosClient.ts    Singleton axios (servidor con key / cliente sin key)
│   └── products/              Contrato de dominio (list, getById)
├── adapters/                  Zod schemas + DTO → dominio (normaliza http→https)
├── domain/                    Tipos puros (Product, ProductDetail, CartItem…)
├── lib/                       env (Zod), queryClient (Singleton por entorno), format, queryKeys
├── providers/                 QueryProvider (client)
└── constants/                 Literales centralizados (rutas, copies, keys de storage)
tests/                         Vitest setup
cypress/                       E2E specs + fixtures
```

### ¿Por qué esta estructura?

La estructura no es casual: responde a **tres principios explícitos** que se aplicaron de forma consistente. Antes del detalle carpeta a carpeta, conviene entender esos principios porque explican todas las decisiones que vienen después.

#### Principio 1 · Screaming Architecture (feature-first)

> "La estructura del proyecto debería gritar el dominio del negocio, no el framework." — Robert C. Martin

Al abrir `src/features/` un desarrollador nuevo ve inmediatamente **qué hace la aplicación**: `catalog`, `product-detail`, `cart`. No ve `components/`, `hooks/`, `stores/`, `containers/` — eso son tipos técnicos que existen en cualquier app de React y no comunican nada sobre este producto.

**Alternativa descartada (folder-by-type):**

```
src/
├── components/    ProductCard, CartItem, SearchBar, Gallery, ColorPicker...
├── hooks/         useProducts, useCart, useDebouncedValue, useProduct...
├── stores/        cartStore
└── pages/         index, products/[id], cart
```

Ese enfoque **falla en escala**: añadir "wishlist" obliga a tocar 4-5 carpetas, y para entender el flujo del carrito hay que saltar entre `components/CartItem`, `hooks/useCart`, `stores/cartStore` y `pages/cart`. Con **folder-by-feature** todo lo del carrito vive en `features/cart/` — un solo lugar mental.

**Beneficios concretos observados en este proyecto:**

- Borrar una feature = borrar una carpeta. Cero código huérfano.
- Cambios localizados: modificar el configurador solo toca `features/product-detail/`.
- Onboarding rápido: la carpeta describe el dominio.
- Escalabilidad: añadir features no aumenta la complejidad de las existentes.

#### Principio 2 · Separación de responsabilidades por capas (hexagonal ligero)

El código está estratificado en **capas con dirección de dependencia clara** (siempre de fuera hacia dentro):

```
                    ┌─────────────────────────────────────┐
    Framework  →    │  app/         (Next.js: rutas, RSC) │
                    ├─────────────────────────────────────┤
    UI/Features →   │  features/    (componentes+estado)  │
                    │  shared/      (UI reutilizable)     │
                    ├─────────────────────────────────────┤
    Aplicación →    │  services/    (casos de uso HTTP)   │
                    ├─────────────────────────────────────┤
    Frontera    →   │  adapters/    (Zod + DTO→dominio)   │
                    ├─────────────────────────────────────┤
    Dominio     →   │  domain/      (tipos puros)         │
                    └─────────────────────────────────────┘
                    │  lib/, constants/ (transversales)   │
                    └─────────────────────────────────────┘
```

- **`domain/`** no importa de nadie: es el núcleo estable.
- **`adapters/`** solo importa de `domain/`: traduce el mundo exterior a dominio.
- **`services/`** importa `adapters/` + infraestructura HTTP: orquesta casos de uso.
- **`features/`** importa `services/` + `domain/`: nunca conoce Axios, Zod, ni el DTO externo.
- **`app/`** importa `features/`: solo compone rutas y layouts.

Esta separación es lo que permite que **un cambio en el DTO externo (por ejemplo, `product.title` en vez de `product.name`) solo toque `adapters/`**. Los componentes no se enteran.

#### Principio 3 · Colocación por proximidad de uso

Cosas que cambian juntas viven juntas. Cosas que se usan una vez viven donde se usan; cosas que se usan por múltiples features viven en `shared/`. La regla explícita para promover algo a `shared/` es **"usado por ≥2 features"**; hasta entonces se queda dentro del feature. Esto evita el clásico "cementerio de utils/" donde nadie sabe qué hay ni si sigue vivo.

Dentro de cada feature se sigue el mismo principio a menor escala: `components/`, `hooks/`, `state/`, `store/` co-localizados en la carpeta de la feature. Las pruebas viven **al lado del código que prueban** (`configuratorReducer.test.ts` junto a `configuratorReducer.ts`), no en un `__tests__/` remoto.

---

### Detalle carpeta a carpeta

- **`app/`** — Solo lo que Next.js exige que viva ahí: `page.tsx`, `layout.tsx`, `error.tsx`, `loading.tsx`, `not-found.tsx` y route handlers en `api/`. **Cero lógica de negocio**. Cada `page.tsx` es esencialmente un thin wrapper que compone una feature y opcionalmente hace `prefetchQuery` + `dehydrate` para SSR. Esto mantiene las páginas triviales y hace que las features sean **reutilizables** fuera de `app/` (por ejemplo, portarlas a otra app o testearlas sin Next).

- **`features/`** — Módulos verticales por dominio funcional (`catalog`, `product-detail`, `cart`). Cada uno es autocontenido: sus componentes, hooks, estado y estilos viven dentro. Un feature puede depender de `shared/`, `services/`, `domain/` y `lib/`, **pero nunca de otro feature**. Esta regla mantiene los features desacoplados: `cart` no sabe nada de `catalog`. Cuando dos features necesitan compartir algo, ese algo sube a `shared/` o expone una API pública en el feature productor.

- **`shared/`** — El material reutilizable **con vocación transversal**: `Navbar`, `SkipLink`, `OptionPicker`, `QueryErrorRetry`, `withErrorBoundary`, tokens SCSS, mixins. La regla es estricta: **se promueve solo cuando existen ≥2 consumidores reales**. Nunca en anticipación de posibles usos. Esto evita que `shared/` se convierta en un basurero.

- **`services/`** — Capa de aplicación / infraestructura: `http/axiosClient.ts` (Singleton con dos variantes servidor/cliente) y `products/productsService.ts` (contrato de dominio con `list`, `getById`). Los servicios son la **única puerta a la red**; ningún componente hace `fetch` o `axios.get` directamente. Esto centraliza timeouts, interceptores de error, y hace trivial mockear en tests.

- **`adapters/`** — Frontera del sistema. Recibe `unknown` desde HTTP, lo valida con Zod y lo mapea a tipos de dominio. Además normaliza (`http→https` en imágenes, `trim()` en strings). **Es la única carpeta que conoce el DTO externo.** Si el proveedor cambia el contrato, aquí se absorbe el cambio.

- **`domain/`** — Tipos puros del negocio (`Product`, `ProductDetail`, `ColorOption`, `StorageOption`, `CartItem`). Sin dependencias. Sin comportamiento. Es el vocabulario común que hablan todas las capas superiores. Mantenerlo aislado permite razonar sobre el modelo sin pensar en HTTP, React o Zod.

- **`lib/`** — Utilidades transversales realmente delgadas: `env.ts` (validación de variables con Zod al arrancar), `queryClient.ts` (Singleton por entorno), `format.ts` (`formatPrice`), `queryKeys.ts` (constantes de keys de TanStack Query). Regla explícita: **si un archivo de `lib/` crece más de ~50 líneas o adquiere estado, probablemente pertenece a `services/` o a un feature**.

- **`providers/`** — Providers de cliente que envuelven la app en `app/layout.tsx` (por ejemplo, `QueryProvider`). Separado de `shared/` porque su naturaleza es distinta: no es UI reutilizable, es infraestructura de runtime.

- **`constants/`** — Literales centralizados agrupados por dominio (`API`, `CART`, `COPY`, `ROUTES`, `QUERY`, `CONFIGURATOR_ACTION`, `LOG`). Elimina magic strings, facilita i18n futura y permite refactors seguros con búsqueda global. **Trade-off consciente:** añade un nivel de indirección al leer código; se acepta porque el beneficio en mantenibilidad supera el pequeño coste cognitivo.

- **`tests/` (raíz)** — Solo setup global de Vitest (`setup.ts`, matchers). Los tests unitarios/integración viven **junto al código** (`*.test.ts` colocated). Los E2E viven en `cypress/`.

---

### Comparativa con estructuras habituales

| Estructura                                                                        | Descripción                                      | Por qué **no** se eligió aquí                                                                                                            |
| --------------------------------------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Folder-by-type** (`components/`, `hooks/`, `stores/`)                           | Todo agrupado por tipo técnico                   | Añadir features requiere tocar N carpetas; entender un flujo obliga a saltar entre ellas. Escala mal.                                    |
| **Atomic Design** (`atoms/`, `molecules/`, `organisms/`, `templates/`, `pages/`)  | Componentes clasificados por tamaño visual       | Las categorías son subjetivas y generan discusiones estériles ("¿esto es molécula u organismo?"). No aporta valor al dominio de negocio. |
| **Domain-Driven Design completo** (bounded contexts, agregados, repos, use-cases) | Capas y patrones DDD estrictos                   | Sobre-ingeniería para una app de 3 features. Todo el aparato DDD sin el volumen de negocio que lo justifica se vuelve ceremonia.         |
| **Flat structure** (`src/*.tsx`)                                                  | Todo en la raíz                                  | Solo válido para ~5 archivos. Se descarta desde el minuto uno.                                                                           |
| **✅ Feature-first + hexagonal ligero** (elegido)                                 | Features verticales + separación de capas mínima | Suficiente estructura para crecer sin ceremonia. Cada capa justifica su existencia con un problema resuelto.                             |

---

### Reglas de dependencia (contratos entre carpetas)

Estas reglas se aplican en revisión de código y son las que preservan la integridad de la estructura a largo plazo:

1. **`domain/` no importa de nadie.** Si domain importa de un adapter o service, la dirección de dependencias se invirtió.
2. **`adapters/` solo importa de `domain/` y de Zod.** Nunca de features ni services.
3. **`services/` importa de `adapters/`, `domain/`, `lib/`, `constants/`.** Nunca de features ni de `app/`.
4. **`features/*` nunca se importan entre sí.** Comparten a través de `shared/` o `services/`.
5. **`app/` puede importar de todo, pero no expone nada** (es la capa terminal).
6. **`shared/` no importa de features.** Si necesita algo de un feature, ese algo probablemente debía estar en `shared/`.
7. **`constants/` y `lib/` no importan de features, services, ni adapters.** Son transversales y deben permanecer libres de acoplamiento.

Estas reglas no están automatizadas (podrían serlo con `eslint-plugin-boundaries` o `dependency-cruiser` en un futuro), pero son explícitas y respetadas.

---

## Flujo de datos end-to-end

Ejemplo: usuario navega a `/products/[id]`.

```
┌───────────────────────────────────────────────────────────────────────┐
│  1. Next.js RSC ejecuta app/products/[id]/page.tsx en el servidor     │
│     └─ queryClient.prefetchQuery(['product', id], ...)                │
│         └─ productsService.getById(id)                                │
│             └─ getServerApiClient().get('/products/:id')              │
│                 └─ Axios inyecta x-api-key                            │
│                     └─ API externa responde JSON crudo                │
│                         └─ adaptProductDetail(raw)                    │
│                             └─ Zod valida + mapea DTO → ProductDetail │
│                                 └─ Query cacheada en el servidor      │
│  2. dehydrate(queryClient) → HTML enviado al cliente                  │
│  3. <HydrationBoundary state={dehydratedState}> en cliente            │
│     └─ ProductDetailView usa useProduct(id)                           │
│         └─ TanStack Query encuentra el cache, no re-fetch             │
│             └─ Render inmediato, sin flash de loading                 │
└───────────────────────────────────────────────────────────────────────┘
```

Ventajas concretas:

- **TTFB bajo**: HTML con datos ya renderizados.
- **Zero flash de loading** en la primera visita.
- **Revalidación en background** si el usuario vuelve pasado `staleTime`.
- **La API key nunca sale del servidor** — el navegador solo ve `/api/products*` (misma origen).

El listado (`/`) y el detalle siguen el mismo patrón. El carrito, por definición cliente y persistente, vive fuera de este flujo (Zustand + `persist`).

---

## Patrones de diseño aplicados

Cada patrón está incluido **solo cuando aporta valor real**. Se documenta el problema que resuelve.

### 1. Backend for Frontend (BFF)

- **Dónde:** `src/app/api/products/**/route.ts`
- **Problema:** la API pública requiere una `x-api-key`. Si se llama desde el navegador, la key acaba en el bundle.
- **Solución:** un route handler de Next actúa de proxy. El navegador solo conoce `/api/products*`; el handler añade la key en el servidor.
- **Bonus:** normaliza el status code de error, cachea con `Cache-Control: s-maxage=60, stale-while-revalidate=300`, y da un punto único para futuras transformaciones o rate-limiting.

### 2. Singleton

- **Dónde:** `services/http/axiosClient.ts`, `lib/queryClient.ts`
- **Problema:** crear una instancia de Axios o `QueryClient` por request es caro y rompe el cache.
- **Solución:**
  - Axios: una instancia por proceso, con dos variantes (`serverInstance` con key, `browserInstance` sin key). Elección automática según `typeof window`.
  - QueryClient: **uno por request en el servidor** (aísla cache entre usuarios) y **uno global en el cliente** (patrón oficial recomendado por TanStack para Next).

### 3. Capa de servicios + Adaptadores (Hexagonal ligero)

- **Dónde:** `services/products/*`, `adapters/product.*`
- **Problema:** un cambio en el DTO externo no debería propagarse a los componentes.
- **Solución:** los componentes trabajan **solo con tipos de dominio** (`domain/product.ts`). El adapter valida con Zod y normaliza (por ejemplo, promueve `http://` a `https://` en las imágenes, hace `trim()` de campos, etc.). Si mañana el proveedor devuelve `product.title` en lugar de `product.name`, se cambia un `map` y el resto compila sin tocar.

### 4. Prefetch en RSC + HydrationBoundary

- **Dónde:** `app/page.tsx`, `app/products/[id]/page.tsx`
- **Problema:** en un SPA típico ves el spinner antes de cada pantalla.
- **Solución:** el servidor pre-carga la query (`fetchQuery`), serializa el cache con `dehydrate` y el cliente lo rehidrata. La query se resuelve en el primer render sin `useEffect` ni loading state.

### 5. Compound Components

- **Dónde:** `ProductConfigurator` (`.Gallery`, `.Header`, `.ColorPicker`, `.StoragePicker`, `.Price`, `.AddToCart`)
- **Problema:** el configurador tiene estado compartido (color, almacenamiento, precio derivado) entre 6 sub-componentes. Pasarlo por props es prop-drilling; hacer un mega-componente es rígido.
- **Solución:** `ProductConfigurator` expone sus hijos como propiedades. El consumidor decide **cómo componerlos**:

  ```tsx
  <ProductConfigurator product={product}>
    <ProductConfigurator.Gallery />
    <ProductConfigurator.Header />
    <ProductConfigurator.ColorPicker />
    <ProductConfigurator.StoragePicker />
    <ProductConfigurator.Price />
    <ProductConfigurator.AddToCart />
  </ProductConfigurator>
  ```

  El estado compartido va por Context (no por props). Ideal para variantes futuras (p. ej. mostrar el precio arriba en móvil).

### 6. Provider + Reducer con contextos separados

- **Dónde:** `ConfiguratorProvider` (`state/ConfiguratorContext.tsx`)
- **Problema:** el estado del configurador (color, storage, precio derivado, selección válida para el CTA) es local a un feature. Meterlo en Zustand sería sobre-ingeniería; hacerlo con `useState` esparcido, un caos.
- **Solución:** `useReducer` con acciones puras y **dos contextos separados** — uno "estable" (product + acciones memoizadas) y otro "derivado" (state + precio + selección). Componentes que solo consumen acciones (como `AddToCart`) no re-renderizan al cambiar el color, eliminando renders innecesarios.

### 7. State Initializer

- **Dónde:** `ConfiguratorProvider({ initialColor, initialStorage })`
- **Problema:** los tests y futuras variantes (ej.: deep-link `?color=black&storage=256`) necesitan arrancar el configurador en un estado concreto.
- **Solución:** el Provider acepta estado inicial opcional. Cero acoplamiento entre la lógica del reducer y quién lo inicializa.

### 8. Render Prop

- **Dónde:** `<Navbar renderRight={() => <CartNavButton />} />`
- **Problema:** la Navbar no debería importar el store del carrito (dependencia invertida): rompería la reutilización si mañana se usa en un contexto sin carrito.
- **Solución:** la Navbar recibe una función que renderiza el "slot" derecho. Puede llevar cualquier CTA (carrito, login, notificaciones), y la Navbar sigue siendo genérica.

### 9. Higher-Order Component (HOC)

- **Dónde:** `withErrorBoundary(CatalogView)`, `withErrorBoundary(ProductDetailView)`
- **Problema:** cada vista de feature debería estar protegida por un ErrorBoundary con UI de fallback consistente. Repetir el JSX es ruido.
- **Solución:** un HOC envuelve la vista y expone el mismo componente con manejo de errores homogéneo. Coste sintáctico: cero.

### 10. Custom Hooks

- **Dónde:** `useProducts`, `useProduct`, `useCart`, `useCartCount`, `useHasHydrated`, `useDebouncedValue`
- **Problema:** los componentes deberían ser declarativos. Meter `useQuery`, `useStore(selector)`, `useEffect` inline los ensucia.
- **Solución:** cada hook encapsula la fuente (TanStack Query, Zustand, timers) y expone una API específica. Además facilita testear la lógica sin renderizar componentes.

### 11. Lazy loading + Suspense

- **Dónde:** `SimilarProducts` con `next/dynamic` + `<Suspense fallback={…}>`
- **Problema:** el bloque "productos similares" no es crítico para el LCP del detalle.
- **Solución:** se carga como chunk dinámico y renderiza con fallback ligero. El resto de la página no espera a este bundle.

### 12. Selectores con Zustand

- **Dónde:** `useCartCount = useCartStore((s) => s.items.length)`
- **Problema:** suscribirse a todo el store re-renderiza en cada `addItem` aunque solo quieras el contador.
- **Solución:** cada consumidor selecciona el slice mínimo. La Navbar se re-renderiza solo cuando cambia la longitud.

---

## Decisiones técnicas y trade-offs

Aquí se explica **por qué se eligió A en lugar de B** en los puntos donde había alternativa razonable.

| Decisión                                       | Alternativa descartada                          | Motivo                                                                                                                                                                                                                                  |
| ---------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **App Router** sobre **Pages Router**          | Pages Router                                    | App Router es el camino oficial en Next 16, soporta RSC nativo, `Suspense`, `loading.tsx` y route handlers homogéneos. Pages Router va camino de deprecación.                                                                           |
| **BFF integrado** en `src/app/api/**`          | Proxy externo o llamada directa desde cliente   | Con route handlers no hace falta desplegar nada aparte. La misma origen elimina CORS. Y sobre todo: la key **nunca** llega al navegador.                                                                                                |
| **TanStack Query** con hidratación             | `useEffect` + `fetch`, SWR, Redux Toolkit Query | Cache compartido cliente/servidor, dedupe automático, revalidación en background, y **hidratación oficial** con RSC en Next. Alternativas serían inferiores en algún eje.                                                               |
| **Zustand** para el carrito                    | Context API + `useReducer`, Redux               | `persist` middleware de fábrica (`localStorage`), selectores nativos, cero boilerplate. Redux es desproporcionado para un carrito. Context API obligaría a implementar `persist` a mano y a splittear providers para evitar re-renders. |
| **Zod en el adapter, no en cada componente**   | Validar en el consumidor                        | La validación pertenece al **borde del sistema**. Si el DTO cambia, el adapter falla ruidosamente en un test y el resto sigue estático-seguro.                                                                                          |
| **SASS + CSS Modules + variables CSS**         | styled-components / emotion / Tailwind          | Sin runtime en JS (mejor performance), aislamiento por componente, `tokens.scss` en `:root` para tematización (modo oscuro futuro, por ejemplo). Tailwind quedó descartado por preferencia y por el peso del setup.                     |
| **Fuente `Helvetica, Arial, sans-serif`**      | Google Fonts / `next/font` con Inter, Roboto…   | El enunciado lo pedía explícitamente. Además elimina un roundtrip a Google y evita CLS.                                                                                                                                                 |
| **`next/image`**                               | `<img>` nativa                                  | Optimización automática (webp/avif), `sizes`, lazy loading, y evita CLS con `width/height`. `remotePatterns` en `next.config.mjs` autoriza el host de las imágenes de la API.                                                           |
| **Zustand con `partialize: { items }`**        | Persistir todo el store                         | Se persiste solo el estado esencial. Nunca se persisten funciones ni derivados. Reduce el payload en `localStorage` y evita basura serializada.                                                                                         |
| **Cypress contra binario de producción**       | Cypress contra `next dev`                       | El build de producción tiene comportamientos distintos (cache headers, minificación, static generation). Probar contra `start` refleja la realidad.                                                                                     |
| **`no-console: warn`** salvo `warn/error`      | Prohibir toda `console.*`                       | Los `console.error` del interceptor de Axios son útiles en producción para debugging real; los `log` de debug son ruido y se cazan en review.                                                                                           |
| **Constantes centralizadas** (`src/constants`) | Literales inline                                | Las rutas, keys de storage, copies y separadores viven en un solo sitio. Facilita i18n futura y auditoría.                                                                                                                              |
| **Node 24 (no 18)**                            | Node 18 como pedía el PDF                       | Next 16 + Turbopack requiere runtime moderno; Node 18 arroja warnings/incompatibilidades. El `.nvmrc` documenta la decisión.                                                                                                            |
| **No RxJS, no Sagas**                          | Middlewares de flujo                            | No hay flujos asíncronos complejos ni WebSockets. TanStack Query cubre el 100% de la asincronía.                                                                                                                                        |

---

## Testing

### Estrategia general (pirámide de tests)

Tres niveles, aplicados donde aportan valor:

```
        ┌─────────────────────┐
        │   E2E (Cypress)     │   ← pocos, lentos, alta confianza
        │   flujos completos  │
        ├─────────────────────┤
        │  Integración (RTL)  │   ← medianos, cubren la interacción de piezas
        │  árboles React con  │
        │  Providers reales   │
        ├─────────────────────┤
        │      Unit (Vitest)  │   ← muchos, rápidos, cubren lógica pura
        │  funciones, hooks,  │
        │  reducers, stores   │
        └─────────────────────┘
```

Herramientas:

- **Vitest 3** para unit + integración (`jsdom` como entorno DOM).
- **@testing-library/react + @testing-library/user-event** para interacción realista.
- **Cypress 16** para E2E contra un binario de producción real.

Configuración: `vitest.config.ts` (alias `@ → src/`, setup en `tests/setup.ts`), `cypress.config.ts` (baseUrl `http://localhost:3000`, specs en `cypress/e2e/**/*.cy.ts`).

---

### 1 · Tests unitarios (Vitest)

Verifican **funciones puras, hooks aislados, reducers y stores** sin renderizar árboles React grandes.

**Modo watch (durante desarrollo):**

```bash
npm run test
```

**Un solo pase (útil en CI o pre-push):**

```bash
npm run test:run
```

**Con cobertura (reporte HTML en `coverage/index.html`):**

```bash
npm run test:coverage
```

**Filtrar tests por nombre de archivo o `describe`:**

```bash
npm run test -- product.adapter        # solo tests cuyo path/nombre contiene "product.adapter"
npm run test -- -t "normalizes http"   # solo tests cuyo nombre coincide con el patrón
```

**Ubicación:** los tests viven **junto al código** (`*.test.ts` colocated), no en una carpeta `__tests__/` remota. Facilita encontrarlos y borrarlos con la unidad que prueban.

**Cobertura relevante actualmente:**

| Archivo                                                         | Qué verifica                                                                               |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `src/adapters/product.adapter.test.ts`                          | Mapping DTO → dominio, normalización `http→https`, errores de schema, `trim()` de strings. |
| `src/lib/format.test.ts`                                        | `formatPrice` con distintos locales / edge cases.                                          |
| `src/features/catalog/hooks/useDebouncedValue.test.ts`          | Debounce con timers falsos (`vi.useFakeTimers`).                                           |
| `src/features/product-detail/state/configuratorReducer.test.ts` | Transiciones puras del reducer (SET_COLOR, SET_STORAGE, edge cases).                       |
| `src/features/cart/store/useCartStore.test.ts`                  | `addItem` (nuevo/duplicado), `removeItem`, `clear`, generación de `cartLineId`.            |

---

### 2 · Tests de integración (Vitest + React Testing Library)

Verifican **piezas colaborando entre sí** (componente + Provider + reducer + store) con la API pública real de RTL.

Se ejecutan con el **mismo comando que los unit tests** (Vitest no distingue: la diferencia está en el enfoque):

```bash
npm run test:run
```

**Cobertura relevante:**

- `src/features/product-detail/components/ProductConfigurator/ProductConfigurator.test.tsx`:
  1. Se monta el `ProductConfigurator` completo (con todos los sub-componentes Compound + `ConfiguratorProvider`).
  2. El usuario cambia color y almacenamiento con `userEvent`.
  3. Se verifica que el CTA "Añadir" pasa de disabled a enabled.
  4. Se verifica que el precio mostrado se actualiza al `storage.price` seleccionado.
  5. Al hacer click en el CTA, `useCartStore.addItem` recibe la selección correcta.

**Buenas prácticas seguidas:**

- Se testea **como el usuario interactúa**, no la implementación interna (evitamos `wrapper.state()` o similares).
- Queries por rol/label accesible (`getByRole('radio', { name: /black/i })`), no por `data-testid` salvo excepciones.
- `userEvent` sobre `fireEvent` porque simula la secuencia real de eventos DOM (focus, keydown, click…).

---

### 3 · Tests E2E (Cypress)

Verifican **flujos completos de usuario** contra un binario de producción real, con red, localStorage y navegación reales.

**Requisitos previos:**

- La app debe estar corriendo (idealmente el build de producción, no `dev`).
- Variables de entorno configuradas (`PHONE_API_URL`, `PHONE_API_KEY`).

**Opción A — La app ya está levantada en `http://localhost:3000`:**

```bash
npm run e2e          # modo headless (para CI / verificación rápida)
npm run e2e:open     # modo interactivo con GUI (útil en desarrollo)
```

**Opción B — Levantar producción en un puerto distinto y apuntar Cypress ahí:**

```bash
# Terminal 1: build + start en el puerto 3010
npm run build
PORT=3010 npm run start

# Terminal 2: Cypress contra ese puerto
CYPRESS_baseUrl=http://localhost:3010 npm run e2e
```

**Opción C — En una sola línea (útil en scripts):**

```bash
npm run build && \
  PORT=3010 npm run start & \
  npx wait-on http://localhost:3010 && \
  CYPRESS_baseUrl=http://localhost:3010 npm run e2e
```

**Specs incluidas** (`cypress/e2e/`):

| Spec              | Qué cubre                                                                                                                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `catalog.cy.ts`   | Render del grid inicial (SSR + hidratación), filtrado con `SearchBar`, la URL como fuente de verdad del término de búsqueda (`?q=iphone`).                                                                                            |
| `cart-flow.cy.ts` | Flujo end-to-end: catálogo → detalle → configurar color/almacenamiento → añadir al carrito → verificar total → eliminar. Además `cy.reload()` para verificar la **persistencia** en `localStorage` (middleware `persist` de Zustand). |

**Fixtures y support:** `cypress/fixtures/` para datos estáticos, `cypress/support/e2e.ts` para comandos personalizados y hooks globales.

**Por qué contra el build de producción y no `next dev`:**

- Los cache headers del route handler solo funcionan en producción.
- La minificación puede exponer bugs de scope que en dev no aparecen.
- Static generation y streaming se comportan distinto en dev.

> **CI y determinismo:** los E2E actuales golpean la API pública real (endpoint público con SLA razonable). Para un pipeline hermético lo natural es interceptar con `cy.intercept()` o levantar **MSW** dentro del propio proceso Next para servir respuestas fijas. En este proyecto se aceptó el trade-off porque probar contra el proveedor real detecta regresiones del contrato — una decisión revisable si aparecen flakes por red.

---

### Ejecución de la suite completa

Simular lo que un CI ejecutaría en orden:

```bash
npm run typecheck && \
  npm run lint && \
  npm run test:run && \
  npm run build && \
  PORT=3010 npm run start & \
  npx wait-on http://localhost:3010 && \
  CYPRESS_baseUrl=http://localhost:3010 npm run e2e
```

Este orden es intencional: se ejecutan primero los pasos rápidos (typecheck < lint < unit) y solo si pasan se llega al build y a los E2E (los más costosos).

---

## Accesibilidad

- **Landmarks semánticos**: `<header>`, `<main>`, `<nav aria-label>`.
- **SkipLink** al contenido principal (visible con teclado).
- **`role="radiogroup"` + `aria-checked`** en los selectores de color y almacenamiento (`OptionPicker`), navegables con teclado.
- **`aria-live="polite"`** en el contador del carrito y el precio derivado, para que un lector de pantalla anuncie los cambios sin interrumpir.
- **Focus visible** vía `:focus-visible` con outline consistente (token `--focus-ring`).
- **Contraste** revisado con los tokens de color.
- **ESLint** con `plugin:jsx-a11y/recommended` para prevenir regresiones.

---

## Despliegue

Preparada para Vercel:

1. Importa el repositorio.
2. Añade `PHONE_API_URL` y `PHONE_API_KEY` como variables de entorno (Production/Preview).
3. Build command: `npm run build`. Output: por defecto (App Router).

`next.config.mjs` incluye `images.remotePatterns` para el host de las imágenes.

---

## Estructura del repositorio (raíz)

- `.env.example`, `.nvmrc`, `.npmrc`, `.prettierrc`, `.prettierignore`, `.gitignore`
- `eslint.config.mjs`, `next.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `cypress.config.ts`
- `.husky/pre-commit` → `npx lint-staged`

---

## Resumen

La aplicación combina **RSC + hidratación** para performance real, **BFF integrado** para seguridad, **capa de dominio con adaptadores** para robustez frente a cambios externos, y una selección deliberada de **patrones de React** (Compound, Provider + Reducer, Render Prop, HOC, Custom Hooks) aplicados únicamente donde resuelven un problema concreto documentado en las secciones anteriores.
