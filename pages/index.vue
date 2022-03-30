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
          name: '1 album',
          list: [
            {
              id: 1,
              name: '001',
              file: 'http://localhost:5500/01.mp3',
              image: 'https://picsum.photos/id/123/300/300',
            },
            {
              id: 2,
              name: '002',
              file: 'http://localhost:5500/02.mp3',
              image: 'https://picsum.photos/id/234/300/300',
            },
            {
              id: 3,
              name: '003',
              file: 'http://localhost:5500/03.mp3',
              image: 'https://picsum.photos/id/345/300/300',
            },
          ],
        },
        {
          id: 2,
          name: '2 album',
          list: [
            {
              id: 4,
              name: '004',
              file: 'http://localhost:5500/01.mp3',
              image: 'https://picsum.photos/id/456/300/300',
            },
            {
              id: 5,
              name: '005',
              file: 'http://localhost:5500/02.mp3',
              image: 'https://picsum.photos/id/567/300/300',
            },
            {
              id: 6,
              name: '006',
              file: 'http://localhost:5500/03.mp3',
              image: 'https://picsum.photos/id/678/300/300',
            },
          ],
        },
        {
          id: 3,
          name: 'empty',
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
