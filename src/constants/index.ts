import type { ProductSpecs } from '../domain/product';

export const API = {
  BROWSER_BASE_URL: '/api',
  TIMEOUT_MS: 15_000,
  CACHE_CONTROL: 'public, s-maxage=60, stale-while-revalidate=300',
  FALLBACK_STATUS: 502,
  HEADERS: {
    ACCEPT: 'application/json',
    API_KEY_HEADER: 'x-api-key',
  },
  ENDPOINTS: {
    PRODUCTS: '/products',
    productById: (id: string) => `/products/${encodeURIComponent(id)}`,
  },
  ERRORS: {
    FETCH_LIST: 'Failed to fetch products',
    FETCH_DETAIL: 'Failed to fetch product',
  },
} as const;

export const QUERY = {
  DEFAULT_STALE_TIME_MS: 60 * 1000,
  DEFAULT_GC_TIME_MS: 5 * 60 * 1000,
  DEFAULT_RETRY: 1,
  PRODUCTS_LIST_STALE_TIME_MS: 5 * 60 * 1000,
  PRODUCT_DETAIL_STALE_TIME_MS: 60 * 1000,
  KEYS: {
    PRODUCTS: 'products',
    LIST: 'list',
    DETAIL: 'detail',
  },
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  DEFAULT_OFFSET: 0,
} as const;

export const SIMILAR_PRODUCTS_LIMIT = 4;

export const SEARCH = {
  DEBOUNCE_MS: 350,
  DEFAULT_DEBOUNCE_MS: 300,
  QUERY_PARAM: 'search',
} as const;

export const FORMAT = {
  LOCALE: 'es-ES',
  CURRENCY: 'EUR',
} as const;

export const ROUTES = {
  HOME: '/',
  CART: '/cart',
  productDetail: (id: string) => `/products/${encodeURIComponent(id)}`,
} as const;

export const CART = {
  STORAGE_KEY: 'zara-cart-v1',
  LINE_ID_SEPARATOR: '::',
} as const;

export const CONFIGURATOR_ACTION = {
  SET_COLOR: 'SET_COLOR',
  SET_STORAGE: 'SET_STORAGE',
  RESET: 'RESET',
} as const;

export const ENV = {
  NODE_ENVS: ['development', 'production', 'test'] as const,
  DEFAULT_NODE_ENV: 'development',
  ERROR_KEY_REQUIRED: 'PHONE_API_KEY is required',
  ERROR_INVALID_PREFIX: 'Invalid server environment variables',
} as const;

export const TEST_IDS = {
  ADD_TO_CART: 'add-to-cart',
  CURRENT_PRICE: 'current-price',
  CART_COUNT: 'cart-count',
  CART_ITEM: 'cart-item',
  REMOVE_ITEM: 'remove-item',
  SUMMARY_COUNT: 'summary-count',
  SUMMARY_TOTAL: 'summary-total',
  SEARCH_INPUT: 'search-input',
  PRODUCT_GRID: 'product-grid',
  RESULT_COUNT: 'result-count',
  COLOR_PICKER_PREFIX: 'color',
  STORAGE_PICKER_PREFIX: 'storage',
} as const;

export const IMAGE_SIZES = {
  PRODUCT_CARD: '(max-width: 480px) 45vw, (max-width: 768px) 30vw, 22vw',
  GALLERY: '(max-width: 768px) 100vw, 50vw',
  CART_ITEM: '(max-width: 768px) 30vw, 120px',
} as const;

export const SPEC_LABELS: ReadonlyArray<[keyof ProductSpecs, string]> = [
  ['screen', 'Pantalla'],
  ['resolution', 'Resolución'],
  ['processor', 'Procesador'],
  ['mainCamera', 'Cámara principal'],
  ['selfieCamera', 'Cámara frontal'],
  ['battery', 'Batería'],
  ['os', 'Sistema operativo'],
  ['screenRefreshRate', 'Tasa de refresco'],
];

export const HTML_LANG = 'es';

export const META = {
  APP_TITLE: 'Mobile Store · Zara Challenge',
  APP_DESCRIPTION: 'Catálogo de teléfonos móviles con configurador y carrito.',
  CART_TITLE: 'Carrito · Mobile Store',
} as const;

export const COPY = {
  common: {
    RETRY: 'Reintentar',
    LOADING: 'Cargando…',
    ERROR_HEADING: 'Algo ha ido mal',
    UNEXPECTED_ERROR: 'Error inesperado',
    errorBoundaryMessage: (message: string) => `Ha ocurrido un error: ${message}`,
    NOT_FOUND_TITLE: 'Página no encontrada',
    NOT_FOUND_BODY: 'El recurso que buscas no existe.',
    NOT_FOUND_LINK: 'Volver al inicio',
  },
  nav: {
    BRAND: 'MOBILE\u00A0STORE',
    PRIMARY_ARIA: 'Principal',
    HOME_ARIA: 'Ir al inicio',
    cartAria: (count: number) => `Ir al carrito. ${count} artículos.`,
  },
  catalog: {
    HEADING: 'Teléfonos móviles',
    SEARCH_LABEL: 'Buscar por nombre o marca',
    SEARCH_PLACEHOLDER: 'Buscar por nombre o marca…',
    LOADING: 'Cargando productos…',
    ERROR: 'No pudimos cargar los productos.',
    EMPTY: 'No hay resultados para tu búsqueda.',
    RESULT_ONE: '1 resultado',
    resultMany: (count: number) => `${count} resultados`,
  },
  productDetail: {
    BREADCRUMBS_ARIA: 'Migas de pan',
    BACK: '← Volver al catálogo',
    LOADING: 'Cargando producto…',
    ERROR: 'No pudimos cargar el producto.',
    SPECS_HEADING: 'Especificaciones',
    SIMILAR_HEADING: 'Productos similares',
    ADD_TO_CART: 'Añadir al carrito',
    COLOR_LEGEND: 'Color',
    colorAria: (selected: string) => `Color. Seleccionado: ${selected}.`,
    COLOR_NONE: 'Sin selección',
    STORAGE_LEGEND: 'Almacenamiento',
    configuratorProviderError: 'useConfigurator hooks must be used inside <ProductConfigurator>',
  },
  cart: {
    LOADING: 'Cargando carrito…',
    EMPTY_TITLE: 'Tu carrito está vacío',
    EMPTY_HINT: 'Aún no has añadido productos.',
    CONTINUE: 'Continuar comprando',
    HEADING: 'Carrito',
    SUMMARY_ARIA: 'Resumen del pedido',
    ITEMS_LABEL: 'Artículos',
    TOTAL_LABEL: 'Total',
    REMOVE: 'Eliminar',
    removeAria: (brand: string, name: string) => `Eliminar ${brand} ${name} del carrito`,
  },
} as const;

export const LOG = {
  API_PREFIX: '[api]',
  ERROR_BOUNDARY_PREFIX: '[error-boundary]',
  API_NETWORK: 'network',
} as const;
