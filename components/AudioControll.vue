<template>
  <div>
    <AudioPlayer :album="album" :source="source" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AudioControll',
  computed: {
    ...mapState({
      album: (state) => state.player.album,
      source: (state) => state.player.current,
    }),
  },
}
</script>
