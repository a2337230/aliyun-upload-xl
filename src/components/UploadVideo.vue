<template>
  <div class="upload-video">
    <input
      type="file"
      class="files"
      :accept="accept"
      :disabled="uploadDisabled"
      @change="fileChange"
    >
    <slot></slot>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'UploadVideo',
  props: {
    // 请求过期时间
    timeout: {
      type: Number,
      default: 60000
    },
    // 分片大小
    partSize: {
      type: Number,
      default: 1048576
    },
    // 上传分片数
    parallel: {
      type: Number,
      default: 5
    },
    // 网络失败重试次数
    retryCount: {
      type: Number,
      default: 3
    },
    // 网络失败重试间隔 默认秒
    retryDuration: {
      type: Number,
      default: 2
    },
    // 上传视频点播地域 默认 cn-hangzhou
    region: {
      type: String,
      default: 'cn-hangzhou'
    },
    // 阿里云账号id
    userId: {
      type: String,
      default: '278055044511188943'
      // default: '1303984639806000'
    },
    // 限制类型
    accept: {
      type: String,
      default: 'video/*'
    },
    // 限制文件大小 默认2G
    fileSize: {
      type: Number,
      default: 2147483648
    },
    // 是否自动上传
    auto: {
      type: Boolean,
      default: true
    },
    // 是否本地预览
    preview: {
      type: Boolean,
      default: false
    },
    // 上传进度
    progress: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      // 文件
      file: '',
      // 上传是否禁用
      uploadDisabled: false,
      // 视频ID
      videoId: "",
      // 上一次上传的视频
      prevFile: ""
    }
  },
  mounted() {
    // 兼容同一个视频重复上传
    document.querySelector('.files').addEventListener('click', function() {
      this.value = '';
    }, false);
    this.uploader = this.createUploader()
  },
  methods: {
    fileChange(e) {
      // console.log(e.target.files)
      const file = e.target.files[0]
      // console.log(file.name, this.prevFile)
      // if (file.name === this.prevFile) {
      //   console.log('同一个视频')
      //   return
      // }
      this.prevFile = file.name
      this.$emit('fileInfo', file)
      // 如果超出大小
      if (file.size >= this.fileSize) {
        this.$emit('errSize')
        return
      }
      // 生成本地地址
      if (this.preview) {
        const previewPath = URL.createObjectURL(file)
        this.$emit('localPath', previewPath)
      }
      if (this.uploader) {
        this.uploader.stopUpload()
        this.authProgress = 0
        this.statusText = ""
      }
      var userData = '{"Vod":{}}'
      this.uploader = this.createUploader()
      this.uploader.addFile(file, null, null, null, userData)
      this.uploadDisabled = false
    },
    // 初始化上传
    createUploader () {
      let uploader = new window.AliyunUpload.Vod({
        timeout: this.timeout,
        partSize: this.partSize,
        parallel: this.parallel,
        retryCount: this.retryCount,
        retryDuration: this.retryDuration,
        region: this.region,
        userId: this.userId,
        // 添加文件成功
        addFileSuccess: (uploadInfo) => {
          // 按钮禁用
          if (this.auto && uploadInfo) {
            this.startUpload()
          }
        },
        // 开始上传
        onUploadstarted: (uploadInfo) => {
          this.uploadDisabled = true
          this.getVoucher(uploadInfo)
        },
        // 文件上传失败
        onUploadFailed: (uploadInfo, code, message) => {
          this.$emit('errFile', uploadInfo, code, message)
        },
        // 取消文件上传
        onUploadCanceled: (uploadInfo, code, message) => {
          this.$emit('pauseUpload', uploadInfo, code, message)
        },
        // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
        onUploadProgress: (uploadInfo, totalSize, progress) => {
          let progressPercent = Math.ceil(progress * 100)
          this.$emit('update:progress', progressPercent, totalSize, uploadInfo)
        },
        // 上传凭证超时
        onUploadTokenExpired: (uploadInfo) => {
          this.getVoucher(uploadInfo)
        },
        // 全部文件上传结束
        onUploadEnd: (uploadInfo) => {
          this.uploadDisabled = false
          this.$emit('uploadEnd', this.videoId, uploadInfo)
          // 清空上传列表
          this.uploader.cleanList()
        }
      })
      return uploader
    },
    // 开始上传
    startUpload() {
      this.uploader.startUpload()
    },
    // 生成上传凭证
    getVoucher(uploadInfo) {
      let createUrl = '/AliyunVideo/CreateUploadVideo'
      axios.get(createUrl).then(res=> {
        let data = JSON.parse(res.data.Data);
        let uploadAuth = data.UploadAuth
        let uploadAddress = data.UploadAddress
        let videoId = this.videoId = data.VideoId
        this.$emit('getVideoId', data.VideoId)
        this.uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress,videoId)  
        // if (uploadInfo.videoId) {
        //   this.uploader.resumeUploadWithAuth(uploadAuth); //刷新上传凭证
        // } else {
        //   this.uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress,videoId)  
        // }          
      })
    },
    // 暂停上传
    pauseUpload () {
      if (this.uploader !== null) {
        this.uploader.stopUpload()
        this.uploadDisabled = false
      }
    },
    // 清空上传列表
    cleanList () {
      if (this.uploader !== null) {
        this.uploader.stopUpload()
        this.uploader.cleanList()
        this.uploader = this.createUploader()
        this.uploadDisabled = false
      }
    },
    // 恢复上传
    resumeUpload () {
      if (this.uploader !== null) {
        this.uploader.resumeFile(0)
      }
    },
  },
}
</script>
<style lang="css" scoped>
.upload-video {
  width: max-content;
  height: max-content;
  position: relative;
}
.upload-video .files {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 99999;
  opacity: 0;
}
</style>