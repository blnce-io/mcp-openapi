import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/http-server'],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: false,
    inlineDependencies: true,
  },
  failOnWarn: false
}) 