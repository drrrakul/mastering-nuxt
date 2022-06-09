<template>
  <div style="text-align: center;">
    <img src="https://freefrontend.com/assets/img/html-funny-404-pages/SVG-Animation-404-Page.gif" style="width:400px;">
    <br/><br/>
    <h1>Error!!!</h1>
    {{ error.message }} {{ error.statusCode }}
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: 'BIG PROBLEMS'
    }
  },
  props: {
    error: {
      type: Object,
      required: true,
    }
  }
}
</script>