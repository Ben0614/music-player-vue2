<template>
  <div>
    <div>
      <h2 class="title">{{`${singData.title} - ${singData.singer}`}}</h2>
      <!-- 專輯 -->
      <!-- 停止加上singlePaused 如果直接清掉rotateAnimation會讓圖片瞬間恢復 -->
      <div
        class="singleWrap"
        :class="isPlay ? 'rotateAnimation' : 'rotateAnimation singlePaused'"
      >
        <img
          :src="require('@/assets/images/心にもないこと.jpg')"
          alt=""
          class="single"
        >
      </div>
      <!-- 音樂播放器 -->
      <audio
        ref="audioPlayer"
        controls
        :src="require('@/data/心にもないこと.mp3')"
      />
      <!-- 歌詞 -->
      <div>
        <h3
          v-for="(lrc,lrcIndex) in lrcs"
          :key="lrcIndex"
          :class="isActive(lrc,lrcIndex) ? 'activeWord' : 'word'"
          @click="goToThisRow(lrc)"
        >{{lrc.word}}
        </h3>
      </div>
    </div>
    <!-- 背景 -->
    <img
      :src="require('@/assets/images/心にもないことbgc.jpg')"
      alt=""
      class="bgc"
    >
    <!-- 波型 -->
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
import singDataJson from '@/data/心にもないこと.json'
export default {
  name: 'SimplePlayer',
  data () {
    return {
      singData: singDataJson,
      lrcs: [],
      currentTime: 0,
      isPlay: false,
      // 波型
      isFirst: false,
      audioCtx: null,
      analyser: null,
      source: null,
      bufferLength: 0,
      dataArray: [],
    }
  },
  computed: {
    activeColor () {
      return this.singData.activeColor
    }
  },
  created () {
    // 歌詞陣列 包含時間和歌詞
    this.singData.startTime.forEach((time, index) => {
      const lrc = {
        // 轉時間格式
        time: this.parseTime(time),
        word: this.singData.lyrics[index]
      }
      this.lrcs.push(lrc)
    })
    console.log('lrcs', this.lrcs);
  },
  mounted () {
    // 調小音量
    this.$refs.audioPlayer.volume = 0.02
    // 監聽 (第二個function都寫在methods裡再引用過來 否則remove時會有問題)
    // 時間變化
    this.$refs.audioPlayer.addEventListener('timeupdate', this.useTimeupdate)
    // 播放
    this.$refs.audioPlayer.addEventListener('play', this.usePlay)
    // 暫停
    this.$refs.audioPlayer.addEventListener('pause', this.usePause)

  },
  methods: {
    // 將時間賦給this.currentTime
    useTimeupdate () {
      this.currentTime = this.$refs.audioPlayer.currentTime
    },
    // 播放就調用波型fucntion
    usePlay () {
      this.isPlay = true
      this.createWaveForm()
    },
    // 暫停就清除計時器 不獲取波型資料
    usePause () {
      this.isPlay = false
      clearInterval(this.interval)
    },
    // 轉時間格式
    parseTime (time) {
      const parts = time.split(':')
      return +parts[0] * 60 + +parts[1]
    },
    // 判斷是否為現在的歌詞
    isActive (lrc, lrcIndex) {
      // 不是最後一行
      if (lrcIndex !== this.lrcs.length - 1) {
        // 播放時間 >= 歌詞開始時間 && 播放時間 < 下一段歌詞開始時間
        if (this.currentTime >= lrc.time && this.currentTime < this.lrcs[lrcIndex + 1].time) {
          return true
        }
      }
      // 是最後一行
      if (lrcIndex === this.lrcs.length - 1) {
        // 播放時間 >= 歌詞開始時間
        if (this.currentTime >= lrc.time) {
          return true
        }
      }
    },
    // 跳到這一行
    goToThisRow (lrc) {
      this.$refs.audioPlayer.currentTime = lrc.time
      this.currentTime = this.$refs.audioPlayer.currentTime
      this.$refs.audioPlayer.play()
    },
    // 獲取波型資料
    createWaveForm () {
      // 已獲取過 (不能重複獲取 會噴掉)
      if (this.isFirst) {
        this.interval = setInterval(() => {
          //生成8位為一個item,長度為bufferLength的array 
          this.dataArray = new Uint8Array(this.bufferLength)
          // 將頻率導入到該array 
          this.analyser.getByteFrequencyData(this.dataArray)
          this.draw()
        }, 100)
      }
      // 未獲取過
      if (!this.isFirst) {
        this.audioCtx = new AudioContext()
        //利用接口得到分析器 
        this.analyser = this.audioCtx.createAnalyser()
        //得到音源
        this.source = this.audioCtx.createMediaElementSource(this.$refs.audioPlayer)
        // source=>middle 
        this.source.connect(this.analyser)
        //middle=>termial 
        this.analyser.connect(this.audioCtx.destination)
        // 設置傅里葉變化的參數,用來設置分析範圍
        this.analyser.fftSize = 128
        //根據范圍得到不同音頻的數量的長度 
        this.bufferLength = this.analyser.frequencyBinCount
        //生成8位為一個item,長度為bufferLength的array 
        this.dataArray = new Uint8Array(this.bufferLength)
        // 將頻率導入到該array 
        this.analyser.getByteFrequencyData(this.dataArray)

        // 重複獲取更新的資料
        this.interval = setInterval(() => {
          //生成8位為一個item,長度為bufferLength的array 
          this.dataArray = new Uint8Array(this.bufferLength)
          // 將頻率導入到該array 
          this.analyser.getByteFrequencyData(this.dataArray)
          this.draw()
        }, 100)

        // isFirst變true
        this.isFirst = true
      }
    },
    // 繪製波型
    draw () {
      // 獲取canvas,canvarCtx
      const canvas = document.querySelector('#canvas')
      const canvasCtx = canvas.getContext('2d')
      // 寬高與螢幕相同
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const bar_w = canvas.width / this.bufferLength;
      for (let i = 0; i < this.bufferLength; i++) {
        let bar_x = i * bar_w;
        let bar_h = (this.dataArray[i] / 255) * canvas.height;
        let bar_y = canvas.height - bar_h
        canvasCtx.fillStyle = `skyblue`;
        canvasCtx.fillRect(bar_x, bar_y, bar_w, bar_h);
      }
    },
  },
  beforeDestroy () {
    // 一定要解除監聽 否則換頁會噴錯
    this.$refs.audioPlayer.removeEventListener('timeupdate', this.useTimeupdate)
    this.$refs.audioPlayer.removeEventListener('play', this.usePlay)
    this.$refs.audioPlayer.removeEventListener('pause', this.usePause)
  },
  destroyed () {
    clearInterval(this.interval)
  },
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  margin-top: 60px;
}
.singleWrap {
  height: 300px;
  width: 300px;
  margin: 10px auto;
  border-radius: 50%;
  overflow: hidden;
}

.single {
  height: 100%;
  width: 100%;
}

.rotateAnimation {
  animation: rotateSingle 3s linear infinite;
}

.title,
.word {
  color: black;
}

.word {
  cursor: pointer;
}

.activeWord {
  color: v-bind(activeColor);
}

.singlePaused {
  animation-play-state: paused;
}

.bgc {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0.5;
  object-fit: cover;
  object-position: top;
}

#canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0.5;
}

@keyframes rotateSingle {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
