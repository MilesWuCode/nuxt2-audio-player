<template>
  <div>
    <audio ref="audio" controls></audio>

    <hr />

    <div>
      <div>
        <p class="info">
          {{ source && source.id }} - {{ source && source.name }}
        </p>

        <p class="info">
          {{ currentTime | secondsToString }} / {{ duration | secondsToString }}
        </p>

        <div class="slider">
          <VueSlider
            v-model="currentPercent"
            :contained="true"
            :disabled="readyState !== 4"
            :dot-style="sliderDotStyle"
            :drag-on-click="true"
            :interval="0.01"
            :max="1"
            :min="0"
            :process="sliderProcess"
            :rail-style="sliderRailStyle"
            :use-keyboard="false"
            tooltip="none"
          />
        </div>
      </div>

      <div>
        <button :disabled="readyState !== 4" @click="stop">Stop</button>
        |
        <button :disabled="!paused || readyState !== 4" @click="play">
          Play
        </button>
        <button :disabled="paused" @click="pause">Pause</button>
        |
        <button :disabled="readyState !== 4" @click="backward">-15s</button>
        <button :disabled="readyState !== 4" @click="forward">+15s</button>
        |
        <button @click="loop">loop</button>
        <button @click="prev">prev</button>
        <button @click="next">next</button>
        |
        <button @click="mule">mute</button>
      </div>

      <div>
        <p>
          volume:
          <input v-model="volume" type="range" min="0" max="1" step="0.01" />
          {{ volume }}
          <span v-show="muted" style="color: red">muted</span>
        </p>
        <p>
          rate:
          <input v-model="rate" type="range" min="0.5" max="2.0" step="0.25" />
          {{ rate }}
        </p>
      </div>
    </div>

    <hr />

    <div>
      <button @click="consoleAudio">console audio</button>
      <button @click="loadFile">load file</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AudioPlayer',
  filters: {
    secondsToString(sec) {
      const t = Math.floor(sec)

      if (t === 0) {
        return '0:00'
      }

      const h = Math.floor(t / 3600)

      const m = Math.floor((t - h * 3600) / 60)

      const s = (t - h * 3600 - m * 60).toString().padStart(2, '0')

      if (t >= 3600) {
        return `${h.toString()}:${m.toString().padStart(2, '0')}:${s}`
      } else if (t >= 600) {
        return `${m.toString().padStart(2, '0')}:${s}`
      } else {
        return `${m}:${s}`
      }
    },
  },
  props: {
    album: {
      type: Object || null,
      default: null,
    },
    source: {
      type: Object || null,
      default: null,
    },
  },
  data() {
    return {
      audio: null,
      second: 0,
      volume: 0.5,
      rate: 1,
      currentTime: 0,
      logCurrentTime: 0,
      duration: 0,
      paused: true,
      muted: false,
      readyState: 0,
      quickSeconds: 15,
      buffer: 0,
      // 進度條
      sliderProcess: (dotsPos) => [
        [0, dotsPos[0], { backgroundColor: '#666' }],
        [dotsPos[0], this.buffer, { backgroundColor: '#999' }],
      ],
      // 進度條圓點
      sliderDotStyle: { backgroundColor: '#fff' },
      // 進度條外圍
      sliderRailStyle: { backgroundColor: '#ddd' },
      log: null,
    }
  },
  computed: {
    currentPercent: {
      get() {
        if (!this.audio) {
          return 0
        }

        if (this.duration === 0) {
          return 0
        }

        const percent =
          Math.floor((this.currentTime / this.duration) * 100) / 100

        return percent
      },
      set(value) {
        this.audio.currentTime = Math.floor(Number(this.audio.duration) * value)

        return value
      },
    },
  },
  watch: {
    rate(newValue, oldValue) {
      if (Number(newValue) === Number(oldValue)) {
        return
      }

      console.log({ new: Number(newValue), old: Number(oldValue) })

      this.audio.playbackRate = Number(newValue)
    },
    volume(newValue, oldValue) {
      if (Number(newValue) === Number(oldValue)) {
        return
      }

      console.log({ new: Number(newValue), old: Number(oldValue) })

      if (this.audio.muted && Number(newValue) > 0) {
        this.audio.muted = false
      }

      if (!this.audio.muted) {
        this.audio.volume = Number(newValue)
      }
    },
    source(newValue) {
      console.log('watch source')

      this.logEnd('watch source', this.logCurrentTime)

      this.loadFile()
    },
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('beforeunload', this.onBeforeunload)
    })

    this.initPlayer()
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.onBeforeunload)
  },
  methods: {
    initPlayer() {
      // case1
      this.audio = this.$refs.audio
      // case2
      // this.audio = new Audio

      this.audio.autoplay = true
      this.audio.playbackRate = this.rate
      this.audio.volume = this.volume
      this.paused = this.audio.paused
      this.muted = this.audio.muted
      this.readyState = Number(this.audio.readyState)

      this.audio.onprogress = () => {
        console.log('audio-event', 'progress')
      }

      this.audio.onplaying = () => {
        console.log('audio-event', 'playing')

        // this.logStart('onplaying')
      }

      this.audio.onwaiting = () => {
        console.log('audio-event', 'waiting')
      }

      this.audio.onseeking = () => {
        console.log('audio-event', 'seeking')

        this.logEnd('onseeking', this.logCurrentTime)
      }

      this.audio.onseeked = () => {
        console.log('audio-event', 'seeked')

        this.logStart('onseeked')
      }

      this.audio.onended = () => {
        console.log('audio-event', 'ended')

        this.logEnd('onended', this.logCurrentTime)

        this.next()
      }

      this.audio.onloadedmetadata = () => {
        console.log('audio-event', 'loadedmetadata')
      }

      this.audio.onloadeddata = () => {
        console.log('audio-event', 'loadeddata')
      }

      this.audio.oncanplay = () => {
        console.log('audio-event', 'canplay')
      }

      this.audio.oncanplaythrough = () => {
        console.log('audio-event', 'canplaythrough')

        this.readyState = Number(this.audio.readyState)

        this.initMedia()
      }

      this.audio.ondurationchange = () => {
        console.log('audio-event', 'durationchange')

        this.duration = Number(this.audio.duration)
      }

      this.audio.ontimeupdate = () => {
        console.log('audio-event', 'timeupdate')

        if (this.audio.paused === false) {
          this.logCurrentTime = this.audio.currentTime
        }

        this.currentTime = Number(this.audio.currentTime)

        const length = this.audio.buffered.length

        const time = this.audio.currentTime

        if (length === 0) {
          this.buffer = 0
        }

        for (let i = 0; i < length; i++) {
          if (
            this.audio.buffered.start(i) <= time &&
            this.audio.buffered.end(i) >= time
          ) {
            this.buffer =
              (this.audio.buffered.end(i) / Number(this.audio.duration)) * 100
          }
        }
      }

      this.audio.onplay = () => {
        console.log('audio-event', 'play')

        this.paused = this.audio.paused

        this.logStart('onplay')
      }

      this.audio.onpause = () => {
        console.log('audio-event', 'pause', this.audio.paused)

        this.paused = this.audio.paused

        this.logEnd('onpause', this.logCurrentTime)
      }

      this.audio.onratechange = () => {
        console.log('audio-event', 'ratechange')

        if (this.rate === this.audio.playbackRate) {
          return
        }

        this.rate = this.audio.playbackRate
      }

      this.audio.onvolumechange = () => {
        console.log(
          'audio-event',
          'volumechange',
          this.audio.muted,
          this.audio.volume
        )

        this.muted = this.audio.muted

        if (this.audio.muted) {
          this.volume = 0
        } else {
          this.volume = this.audio.volume
        }
      }

      this.audio.onsuspend = () => {
        this.paused = this.audio.paused

        console.log('audio-event', 'suspend', this.audio.paused)
      }

      this.audio.onemptied = () => {
        // specal
        this.logEnd('onemptied', this.logCurrentTime)

        this.duration = 0
        this.paused = this.audio.paused
        this.readyState = Number(this.audio.readyState)

        console.log('audio-event', 'emptied')
      }

      this.audio.onstalled = () => {
        console.log('audio-event', 'stalled')
      }

      this.audio.onerror = () => {
        console.log('onerror', this.audio.error.code)
        // 1 = MEDIA_ERR_ABORTED 用戶中止獲取過程
        // 2 = MEDIA_ERR_NETWORK 下載時發生錯誤
        // 3 = MEDIA_ERR_DECODE 解碼時發生錯誤
        // 4 = MEDIA_ERR_SRC_NOT_SUPPORTED 不支持音頻
      }
    },
    initMedia() {
      if ('mediaSession' in window.navigator) {
        window.navigator.mediaSession.metadata = new MediaMetadata({
          title: this.album.name,
          artist: this.source.artist,
          album: this.source.name,
          artwork: [
            {
              src: this.source.image,
              sizes: '256x256',
              type: 'image/jpg',
            },
          ],
        })

        this.setPositionState()

        window.navigator.mediaSession.setActionHandler('play', () => {
          this.audio.play()
          window.navigator.mediaSession.playbackState = 'playing'
        })

        window.navigator.mediaSession.setActionHandler('pause', () => {
          this.audio.pause()
          window.navigator.mediaSession.playbackState = 'paused'
        })

        window.navigator.mediaSession.setActionHandler('stop', () => {
          this.stop()
          window.navigator.mediaSession.playbackState = 'none'
        })

        window.navigator.mediaSession.setActionHandler(
          'seekbackward',
          (event) => {
            // wip
            event.seekOffset ? this.backward(event.seekOffset) : this.backward()

            this.setPositionState()
          }
        )

        window.navigator.mediaSession.setActionHandler(
          'seekforward',
          (event) => {
            // wip
            event.seekOffset ? this.forward(event.seekOffset) : this.forward()

            this.setPositionState()
          }
        )

        try {
          window.navigator.mediaSession.setActionHandler('seekto', (event) => {
            this.audio.currentTime = event.seekTime

            this.setPositionState()
          })
        } catch (error) {
          console.error(error)
        }

        window.navigator.mediaSession.setActionHandler('previoustrack', () => {
          this.prev()
        })

        window.navigator.mediaSession.setActionHandler('nexttrack', () => {
          this.next()
        })

        // try {
        //   window.navigator.mediaSession.setActionHandler('skipad', () => {
        //     /* Code excerpted. */
        //   })
        // } catch (error) {
        //   console.error(error)
        // }
      }
    },
    loadFile() {
      console.log('click-event', 'loadFile')

      if (this.source) {
        this.audio.src = this.source.file
      }
    },
    play() {
      console.log('click-event', 'play')

      if (Number(this.audio.readyState) === 0) {
        return
      }

      if (!this.audio.paused) {
        return
      }

      this.audio.play()
    },
    stop() {
      console.log('click-event', 'stop')

      if (Number(this.audio.readyState) === 0) {
        return
      }

      this.audio.pause()

      this.audio.src = ''

      this.$store.dispatch('player/stop')
    },
    pause() {
      console.log('click-event', 'pause')

      if (!this.audio.paused) {
        this.audio.pause()
      }
    },
    backward() {
      console.log('click-event', 'backward')

      if (Number(this.audio.readyState) === 0) {
        return
      }

      if (Number(this.audio.currentTime) === 0) {
        return
      }

      this.audio.currentTime = Math.max(
        Number(this.audio.currentTime) - this.quickSeconds,
        0
      )
    },
    forward() {
      console.log('click-event', 'forward')

      if (Number(this.audio.readyState) === 0) {
        return
      }

      if (Number(this.audio.currentTime) === Number(this.audio.duration)) {
        return
      }

      this.audio.currentTime = Math.min(
        Number(this.audio.currentTime) + this.quickSeconds,
        Number(this.audio.duration)
      )
    },
    mule() {
      this.audio.muted = !this.audio.muted
    },
    setPositionState() {
      if (Number.isNaN(this.audio.duration)) {
        return
      }

      if ('setPositionState' in window.navigator.mediaSession) {
        window.navigator.mediaSession.setPositionState({
          duration: this.audio.duration,
          playbackRate: this.audio.playbackRate,
          position: this.audio.currentTime,
        })
      }
    },
    consoleAudio() {
      console.dir(this.audio)
      console.dir(this.audio.readyState)
    },
    prev() {
      this.$store.dispatch('player/prev')
    },
    next() {
      this.$store.dispatch('player/next')
    },
    loop() {
      this.$store.dispatch('player/loop')
    },
    onBeforeunload() {
      this.logEnd('beforeunload', this.logCurrentTime)
    },
    logStart(eventName) {
      console.log('logStart', eventName, this.audio.currentTime)

      this.log = {
        id: this.source.id,
        startSec: this.audio.currentTime,
        endSec: this.audio.currentTime,
        diffSec: 0,
        startTimestamp: parseInt(Date.now() / 1000),
        endTimestamp: parseInt(Date.now() / 1000),
      }
    },
    logEnd(eventName, endSec) {
      if (!this.log) {
        console.log('logEnd', 'log is null')

        return
      }

      if (endSec - this.log.startSec < 3) {
        return
      }

      console.log('logEnd', eventName, endSec)

      this.log.endSec = endSec

      this.log.diffSec = endSec - this.log.startSec

      this.log.endTimestamp = parseInt(Date.now() / 1000)

      console.table({
        event: eventName,
        id: this.log.id,
        start: this.log.startSec,
        end: this.log.endSec,
        diff: this.log.diffSec,
      })

      this.log = null
    },
  },
}
</script>

<style scoped>
audio {
  width: 800px;
}

.slider {
  display: block;
  width: 800px;
}

.info {
  font-size: 14px;
}

div {
  margin: 0 4px 20px 4px;
}
</style>
