<template>
  <div id="app">
    <div class="box">
      <div class="left">
        <div class="header">
          <h2>视频上传</h2>
          <upload-video
            ref="upload"
            :progress.sync="progress"
            :auto="value"
            :preview="value1"
            @localPath="localPath"
          >
            <el-button type="primary">视频上传</el-button>
          </upload-video>
        </div>
        <div class="progress">
          <p>进度</p>
          <el-progress :text-inside="true" :stroke-width="26" :percentage="progress"></el-progress>
        </div>
        <div class="btn-list">
          <el-switch
            v-model="value"
            active-text="自动上传"
            inactive-text="手动上传"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
          <el-button type="primary" :disabled="value" @click="startUpload">开始上传</el-button>
          <el-button type="primary" @click="pauseUpload">暂停上传</el-button>
          <el-button type="primary" @click="resumeUpload">恢复上传</el-button>
          <el-switch
            v-model="value1"
            active-text="开启本地预览"
            inactive-text="关闭本地预览"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </div>
        <div class="video-box" v-if="value1">
          <video :src="videoPath" v-if="videoPath" controls="controls"></video>
        </div>
      </div>
      <div class="right">
        <div class="header">
          <h2>图片上传</h2>
          <upload-img>
            <el-button type="primary">图片上传</el-button>
          </upload-img>
          <upload-img>
            <el-button type="primary">图片上传</el-button>
          </upload-img>
          <upload-img>
            <el-button type="primary">图片上传</el-button>
          </upload-img>
          <upload-img>
            <el-button type="primary">图片上传</el-button>
          </upload-img>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import UploadVideo from './components/UploadVideo'
import UploadImg from './components/UploadImg'
export default {
  name: 'App',
  components: {
    UploadVideo,
    UploadImg
  },
  data() {
    return {
      progress: 0,
      value: false,
      value1: false,
      videoPath: ""
    }
  },
  methods: {
    startUpload() {
      this.$refs.upload.startUpload()
    },
    localPath(val) {
      this.videoPath = val
      console.log(val)
    },
    pauseUpload() {
      this.$refs.upload.pauseUpload()
    },
    resumeUpload() {
      this.$refs.upload.resumeUpload()
    }
  }
}
</script>

<style>
.box {
  display: flex;
  justify-content: space-around;
}
.left,.right {
  width: 800px;
  border: 1px solid rgb(150, 150, 150);
  height: 600px;
}
.header {
  display: flex;
  justify-content: space-between;
  height: 60px;
  align-items: center;
  padding: 0 20px;
}
.progress {
  padding: 0 20px;
}
.btn-list {
  padding: 10px 20px;
}
.video-box {
  width: 95%;
  height: 350px;
  border: 1px solid #000;
  margin: 0 auto;
  border-radius: 20px;
}
.video-box video {
  width: 100%;
  max-height: 350px;
}
</style>
