<template>
  <div>
    <PlayControll />
    <hr />
    <AlbumInfo v-for="item of albums" :key="item.id" :album="item" />
    <hr />
    <p>
    Input
    </p>
    <textarea v-model="inputAlbums" style="width:800px;height:300px;"></textarea>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      albums: [
        {
          id: 1,
          name: 'album 1',
          list: [
            {
              id: 1,
              name: 'name 001',
              artist: 'artist 001',
              file: 'http://localhost:5500/01.mp3',
              image: 'https://picsum.photos/id/123/300/300',
            },
            {
              id: 2,
              name: 'name 002',
              artist: 'artist 002',
              file: 'http://localhost:5500/02.mp3',
              image: 'https://picsum.photos/id/234/300/300',
            },
            {
              id: 3,
              name: 'name 003',
              artist: 'artist 003',
              file: 'http://localhost:5500/03.mp3',
              image: 'https://picsum.photos/id/345/300/300',
            },
          ],
        },
        {
          id: 2,
          name: 'album 2',
          list: [
            {
              id: 4,
              name: 'name 004',
              artist: 'artist 004',
              file: 'http://localhost:5500/04.mp3',
              image: 'https://picsum.photos/id/456/300/300',
            },
            {
              id: 5,
              name: 'name 005',
              artist: 'artist 005',
              file: 'http://localhost:5500/05.mp3',
              image: 'https://picsum.photos/id/567/300/300',
            },
            {
              id: 6,
              name: 'name 006',
              artist: 'artist 006',
              file: 'http://localhost:5500/06.mp3',
              image: 'https://picsum.photos/id/678/300/300',
            },
          ],
        },
        {
          id: 3,
          name: 'album empty',
          list: [],
        },
      ],
    }
  },
  computed: {
    inputAlbums: {
      get() {
        return JSON.stringify(this.albums, null, 2)
      },
      set(value) {
        this.albums = JSON.parse(value)
        return JSON.parse(value)
      },
    },
  },
}
</script>
