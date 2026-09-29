import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier';

const config = [
  ...nextCoreWebVitals,
  {
    rules: {
      ...jsxA11yPlugin.configs.recommended.rules,
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'react/jsx-boolean-value': ['warn', 'never'],
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx', 'tests/**/*'],
    rules: {
      'no-console': 'off',
    },
  },
  prettier,
  {
    ignores: [
      'node_modules/',
      '.next/',
      'out/',
      'coverage/',
      'cypress/videos/',
      'cypress/screenshots/',
      'cypress/downloads/',
      'next-env.d.ts',
    ],
  },
];

export default config;
