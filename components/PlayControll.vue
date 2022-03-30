<template>
  <div>
    <client-only>
      <AudioPlayer :album="album" :source="source" />
    </client-only>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'PlayControll',
  computed: {
    ...mapState({
      album: (state) => state.player.album,
      source: (state) => state.player.current,
    }),
  },
}
</script>
