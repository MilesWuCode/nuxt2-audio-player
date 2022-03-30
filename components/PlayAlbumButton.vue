<template>
  <button @click="onClick">
    {{ album.name }}
  </button>
</template>

<script>
export default {
  name: 'PlayAlbumButton',
  props: {
    album: {
      type: Object,
      required: true,
    },
  },
  methods: {
    onClick() {
      this.$store.dispatch('player/play', {
        album: this.album,
      })
    },
  },
}
</script>
