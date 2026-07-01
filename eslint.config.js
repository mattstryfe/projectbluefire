import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'

// Glob for every Merc-scoped source file. The MER-53 convention rules (import ordering + naming)
// are ERRORS here — they must pass. Legacy BlueFire code is intentionally left alone in this pass:
// naming only WARNS there, and import ordering is not enforced there at all (MER-53 scope decision).
const MERC_FILES = [
  'src/components/merc/**',
  'src/stores/merc*.js',
  'src/workers/merc*.js',
  'src/pages/Merc.vue',
  'src/pages/MercLandingPage.vue',
  'src/configs/merc*.js',
  'src/utils/merc*.js',
  'src/mocks/merc*.js'
]

// Name-pattern naming rules (heuristic — no type info, so we only enforce what's unambiguous from
// the identifier/AST alone). Applied as ERRORS to Merc paths and WARNINGS elsewhere.
//
// Two ESLint rules are needed because they visit different ASTs:
//  • core `no-restricted-syntax`  → SCRIPT AST (works in .js and <script> blocks).
//  • `vue/no-restricted-syntax`   → TEMPLATE AST (VAttribute / VElement nodes).
//
//  1. Event handlers must never use the `on*` prefix (CLAUDE.md → `handle*`, never `on*`). We can
//     enforce the negative (`on*` is banned) cleanly; we can NOT force a handler to BE `handle*`
//     because ESLint can't tell a handler from an ordinary function without type/binding info.
//  2. Template/DOM refs must use the `*Ref` suffix. The reliable signal is the template `ref="…"`
//     binding, so we lint the `ref` VAttribute value (not every `ref()` call — those are also used
//     for plain reactive state like `const tab = ref('open')`, which must NOT be forced to *Ref).
const noOnPrefixSelectors = [
  {
    selector: 'VariableDeclarator[id.name=/^on[A-Z]/]',
    message: 'Event handlers use the "handle" prefix, never "on" (CLAUDE.md naming).'
  },
  {
    selector: 'FunctionDeclaration[id.name=/^on[A-Z]/]',
    message: 'Event handlers use the "handle" prefix, never "on" (CLAUDE.md naming).'
  }
]

// Template ref whose bound name does not end in `Ref` (e.g. ref="mapContainer"). Static string
// bindings only — this is what the codebase uses.
const templateRefSelector = [
  {
    selector: "VAttribute[key.name='ref'][value.value!=/Ref$/]",
    message: 'Template/DOM refs must use the "*Ref" suffix (CLAUDE.md naming).'
  }
]

// Import ordering groups follow CLAUDE.md's documented order: vue core → pinia/composables → local
// components → stores → workers → utils → configs → external libs. `@` is the alias for `src/`.
// Regex approximates the intent. Enforced ERROR on Merc paths only (see MERC_FILES block below).
const importSortGroups = [
  // 1. Vue core.
  ['^vue$', '^vue-router', '^vue/'],
  // 2. Pinia + composables (pinia, VueUse, local composables).
  ['^pinia', '^@vueuse/', '^@/composables/'],
  // 3. Local components.
  ['^@/components/'],
  // 4. Stores.
  ['^@/stores/'],
  // 5. Workers.
  ['^@/workers/'],
  // 6. Utils (+ shared helpers).
  ['^@/utils/', '^@/helperFunctions'],
  // 7. Configs (+ plugins, schemas, services — app-internal wiring).
  ['^@/configs/', '^@/plugins/', '^@/schemas/', '^@/services/', '^@/'],
  // 8. External libraries (node builtins, scoped + bare packages).
  ['^node:', '^@?\\w'],
  // Side-effect imports (CSS, polyfills) and anything else, last.
  ['^\\u0000', '^']
]

export default [
  {
    ignores: ['dist/', 'dist-ssr/', 'android/', 'src/sanity/']
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  prettier,
  {
    files: ['**/*.js', '**/*.vue'],
    // Plugin registered repo-wide so the Merc override below can enable its rules; the import-sort
    // rules themselves are intentionally NOT turned on here (Merc-only — see MERC_FILES block).
    plugins: {
      'simple-import-sort': simpleImportSort
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

      'vue/component-api-style': ['error', ['script-setup', 'composition']],
      'vue/new-line-between-multi-line-property': ['error', { minLineOfMultilineProperty: 2 }],
      'vue/block-order': ['error', { order: [['template', 'script'], 'style'] }],
      'vue/padding-line-between-blocks': ['error', 'always'],
      'vue/html-closing-bracket-newline': [
        'error',
        {
          singleline: 'never',
          multiline: 'always',
          selfClosingTag: { singleline: 'never', multiline: 'always' }
        }
      ],
      'vue/attributes-order': [
        'error',
        {
          order: [
            'DEFINITION',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            'UNIQUE',
            'TWO_WAY_BINDING',
            'SLOT',
            'EVENTS',
            'OTHER_ATTR',
            'CONTENT'
          ]
        }
      ],
      'vue/multi-word-component-names': 'off',
      'vue/html-indent': ['error', 2],
      'vue/singleline-html-element-content-newline': [
        'error',
        { ignoreWhenNoAttributes: false, ignoreWhenEmpty: true }
      ],
      'vue/multiline-html-element-content-newline': ['error', { ignoreWhenEmpty: true }],

      // Naming (heuristic) — WARNINGS repo-wide; escalated to ERRORS on Merc paths below. Legacy
      // BlueFire code (e.g. onScroll handlers) only warns; we don't rename it here.
      'no-restricted-syntax': ['warn', ...noOnPrefixSelectors],
      'vue/no-restricted-syntax': ['warn', ...templateRefSelector]
    }
  },

  // Store ↔ worker layering (blocking ERROR — the important one). A worker module is plain I/O and
  // must NEVER import a Pinia store; the store injects what the worker needs as params. Blocks the
  // `@/stores/*` alias, relative `../stores/*` paths, and any `*Store` named specifier. Repo-wide
  // because it is a guardrail — it produces zero churn unless something actually violates it.
  {
    files: ['src/workers/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/stores/*', '**/stores/*', '../stores/*', './stores/*'],
              message:
                'Workers must not import Pinia stores. The store injects what the worker needs as params (CLAUDE.md store↔worker layering).'
            }
          ],
          paths: [
            {
              name: 'pinia',
              message:
                'Workers must not depend on Pinia. Keep stores out of worker modules (CLAUDE.md layering).'
            }
          ]
        }
      ]
    }
  },

  // Merc-scoped conventions: import ordering + naming as ERRORS. These must pass (fixed in MER-53).
  {
    files: MERC_FILES,
    rules: {
      'simple-import-sort/imports': ['error', { groups: importSortGroups }],
      'simple-import-sort/exports': 'error',
      'no-restricted-syntax': ['error', ...noOnPrefixSelectors],
      'vue/no-restricted-syntax': ['error', ...templateRefSelector]
    }
  }
]
