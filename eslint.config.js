import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  {
    ignores: ['dist/', 'dist-ssr/', 'android/', 'src/sanity/']
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  prettier,
  {
    files: ['**/*.js', '**/*.vue'],
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
      'vue/multiline-html-element-content-newline': ['error', { ignoreWhenEmpty: true }]
    }
  }
]
