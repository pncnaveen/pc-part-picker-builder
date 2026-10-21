import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.next/**', '_bmad/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    files: ['apps/frontend/**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
  {
    files: ['apps/frontend/**/*.{ts,tsx}'],
    ignores: ['apps/frontend/src/infrastructure/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'axios',
              message: 'Import axios only from apps/frontend/src/infrastructure/.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['packages/domain/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@pcppb/db',
                '@nestjs/*',
                '@prisma/*',
                'prisma',
                'amqplib',
                'ioredis',
                'react',
                'react-dom',
              ],
              message: 'packages/domain must not import frameworks or infra (AD-16).',
            },
          ],
        },
      ],
    },
  },
);
