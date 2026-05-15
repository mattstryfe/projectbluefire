# Tips & Tricks

Oddities, underdocumented patterns, and hard-won findings. Add here whenever something takes more than one try to figure out.

---

## Vuetify 4

### `contentClass` — styling teleported overlay content without `:deep()`

Dropdowns, dialogs, tooltips, and snackbars are rendered via `v-overlay` and teleported to `<body>`, outside your component's DOM. Scoped styles and `:deep()` do not reach them.

Use `contentClass` to apply classes directly to the overlay wrapper:

```vue
<!-- On overlay-based components directly -->
<v-menu contentClass="border-sm rounded-lg" />
<v-dialog contentClass="my-dialog" />
<v-tooltip contentClass="my-tooltip" />

<!-- On select/autocomplete/combobox via menu-props -->
<v-combobox :menu-props="{ contentClass: 'border-lg' }" />
<v-select :menu-props="{ contentClass: 'border-sm rounded-lg' }" />
<v-autocomplete :menu-props="{ contentClass: 'my-class' }" />
```

**Components with direct `contentClass` prop** (all built on `v-overlay`):
`v-overlay`, `v-menu`, `v-dialog`, `v-tooltip`, `v-snackbar`, `v-bottom-sheet`, `v-speed-dial`

**Components that expose it via `menu-props`**:
`v-select`, `v-autocomplete`, `v-combobox`

Since Vuetify utility classes (`border-sm`, `rounded-lg`, `bg-surface`, etc.) are global, they work fine here without any custom CSS.

**Rule of thumb:** overlay/dropdown content → `contentClass`. In-place internal structure → `:deep()`.

---

### `#item` slot — `item` vs `item.raw` (Vuetify 3 → 4 breaking change)

In Vuetify 3, the `#item` slot on `v-select`, `v-autocomplete`, and `v-combobox` passed a wrapper object:

```js
// Vuetify 3
{ item: { raw: <your-object>, title, value }, props, index }
```

In Vuetify 4, `item` IS the raw object directly:

```js
// Vuetify 4
{ item: <your-object>, internalItem, props, index }
```

```vue
<!-- Wrong (Vuetify 3 pattern) -->
<template #item="{ item, props }">
  <v-list-item v-bind="props" :title="item.raw.zipcode" />
</template>

<!-- Correct (Vuetify 4) -->
<template #item="{ item, props }">
  <v-list-item v-bind="props" :title="item.zipcode" />
</template>
```

---

### `v-bottom-navigation` — two-row layout (buttons + safe-area shim)

`v-bottom-navigation__content` is a flex row by default. Putting two divs inside produces side-by-side layout, not stacked. To get a buttons row + a shim row below it, override the content wrapper's flex direction with `:deep()` and restore button sizing manually (Vuetify's `> .v-btn` selector breaks when buttons are wrapped in a div):

```vue
<v-bottom-navigation :height="isNative ? 108 : 65">
  <div class="nav-buttons-row d-flex">
    <v-btn v-for="..." />
  </div>
  <div v-if="isNative" class="flex-grow-1" />
</v-bottom-navigation>
```

```css
:deep(.v-bottom-navigation__content) {
  flex-direction: column;
}

.nav-buttons-row {
  flex: 0 0 65px;
  width: 100%;
}

/* Restore grow + height behavior broken by the wrapper div */
.nav-buttons-row :deep(.v-btn) {
  flex: 1 0 0;
  height: 100%;
}
```
