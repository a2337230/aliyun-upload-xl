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
      default: true
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
    }
  },
  mounted() {
    this.uploader = this.createUploader()
  },
  methods: {
    fileChange(e) {
      const file = e.target.files[0]
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
      console.log(file)
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
          this.uploadDisabled = true
          if (this.auto) {
            this.uploader.startUpload()
          }
        },
        // 开始上传
        onUploadstarted: (uploadInfo) => {
          this.getVoucher(uploadInfo)
        },
        // 文件上传成功
        onUploadSucceed: (uploadInfo) => {
          console.log(uploadInfo)
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
          this.$emit('uploadEnd')
        }
      })
      return uploader
    },
    // 生成上传凭证
    getVoucher(uploadInfo) {
      let createUrl = '/AliyunVideo/CreateUploadVideo'
      axios.get(createUrl).then(res=> {
        console.log(res, 1231)
        let data = JSON.parse(res.data.Data);
        let uploadAuth = data.UploadAuth
        let uploadAddress = data.UploadAddress
        let videoId = data.VideoId
        if (uploadInfo.videoId) {
          this.uploader.resumeUploadWithAuth(uploadAuth); //刷新上传凭证
        } else {
          this.uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress,videoId)  
        }          
      })
    },
    // 暂停上传
    pauseUpload () {
      if (this.uploader !== null) {
        this.uploader.stopUpload()
        this.resumeDisabled = false
        this.pauseDisabled = true
      }
    },
    // 恢复上传
    resumeUpload () {
      if (this.uploader !== null) {
        this.uploader.startUpload()
        this.resumeDisabled = true
        this.pauseDisabled = false
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