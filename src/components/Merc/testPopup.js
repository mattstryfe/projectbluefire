import Vue from 'vue'

const getChildrenTextContent = function (children) {
  return children.map(function (node) {
    return node.children
      ? getChildrenTextContent(node.children)
      : node.text
  }).join('')
}

Vue.component('anchored-heading', {
  render: function (createElement) {
    return createElement('h1', this.title)
  },
  // render: function (createElement) {
  //   // create kebab-case id
  //   const headingId = getChildrenTextContent(this.$slots.default)
  //     .toLowerCase()
  //     .replace(/\W+/g, '-')
  //     .replace(/(^-|-$)/g, '')
  //
  //   return createElement(
  //     '<h1>this is a thing</h1>'
  //     // 'h' + this.level,
  //     // [
  //     //   createElement('a', {
  //     //     attrs: {
  //     //       name: headingId,
  //     //       href: '#' + headingId
  //     //     }
  //     //   }, this.$slots.default)
  //     // ]
  //   )
  // },
  data() {
    return {
      title: 'popup'
    }
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
