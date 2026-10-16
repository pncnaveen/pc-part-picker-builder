/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'domain-no-framework',
      comment: 'packages/domain must stay free of Nest, Prisma, messaging, Redis, React (AD-16)',
      severity: 'error',
      from: { path: '^packages/domain' },
      to: {
        path: [
          '^node_modules/@nestjs',
          '^node_modules/@prisma',
          '^node_modules/prisma',
          '^node_modules/@pcppb/db',
          '^node_modules/amqplib',
          '^node_modules/ioredis',
          '^node_modules/react',
          '^packages/db',
          '^apps/',
        ],
      },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
  },
};
