<template>
  <details>
    <summary>{{ album.name }}</summary>
    <div>
      <PlayAlbumButton :album="album" />
      <PlayTrackButton
        v-for="item of album.list"
        :key="item.id"
        :album="album"
        :track="item"
      />
    </div>
  </details>
</template>

<script>
export default {
  name: 'AlbumInfo',
  props: {
    album: {
      type: Object || null,
      default: null,
    },
  },
}
</script>
