<template>
  <button @click="onClick">
    {{ track.name }}
  </button>
</template>

<script>
export default {
  name: 'PlayButton',
  props: {
    album: {
      type: Object,
      required: true,
    },
    track: {
      type: Object,
      required: true,
    },
  },
  methods: {
    onClick() {
      this.$store.dispatch('player/play', {
        album: this.album,
        id: this.track.id,
      })
    },
  },
}
</script>
