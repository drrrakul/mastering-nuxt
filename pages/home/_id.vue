<template>
<div class="app-container">
  <property-gallery :images="home.images" />
  <property-details :home="home" />
  <property-description :home="home" />
  <property-map :home="home" />
  <property-reviews :reviews="reviews" />
  <property-host :user="user" />
</div>
</template>

<script>
export default {
    head() {
        return {
            title: this.home.title,
        };
    },
    mounted() {
        this.$maps.showMap(this.$refs.map, this.home._geoloc.lat, this.home._geoloc.lng);
    },
    async asyncData({ params, $dataApi, error }) {
      const responses = await Promise.all([
        $dataApi.getHome(params.id),
        $dataApi.getReviewsByHomeId(params.id),
        $dataApi.getUserByHomeId(params.id),
      ])
      const badResponse = responses.find((response) => !response.ok)
      if (badResponse) return error({ statusCode: badResponse.status, message: badResponse.statusText })

      return {
          home: responses[0].json,
          reviews: responses[1].json.hits,
          user: responses[2].json.hits[0],
      };
    },
}
</script>