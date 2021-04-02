<template>
  <div id="app">
    <div class="box">
      <el-button type="primary">图片上传</el-button>
      <el-button type="primary">图片批量上传</el-button>
      <upload-video :progress.sync="progress">
        <el-button type="primary">视频上传</el-button>
      </upload-video>
      <upload-video>
        <el-button type="primary">视频批量上传</el-button>
      </upload-video>
      进度： {{progress}}
    </div>
  </div>
</template>
<script>
import UploadVideo from './components/UploadVideo'
export default {
  name: 'App',
  components: {
    UploadVideo
  },
  data() {
    return {
      progress: 0
    }
  },
}
</script>

<style>
.box {
  display: flex;
  width: 800px;
  border: 1px solid rgb(150, 150, 150);
  padding: 10px;
  border-radius: 20px;
  justify-content: space-around;
  margin: 50px auto;
}
</style>
