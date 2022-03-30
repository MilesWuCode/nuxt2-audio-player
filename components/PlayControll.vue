<template>
  <div>
    <client-only>
      <AudioPlayer :source="source" />
    </client-only>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'PlayControll',
  computed: {
    ...mapState({
      source: (state) => state.player.current,
    }),
  },
}
</script>
