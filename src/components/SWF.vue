<template>
  <div class="hello">
    <h1>{{ title }}</h1>
    <span>zipcode: {{ this.zip }}</span>
  </div>
</template>

<script>
  export default {
    name: 'SWF',
		drawerToggle: false,
    data: () => ({
      title: 'Simple Weather Forecast (SWF)',
    }),
		props:['zip'],
		created: function () {
			// `this` points to the vm instance
			console.log('zip ', this.zip)
		},
  }
</script>

<style scoped>

</style>
