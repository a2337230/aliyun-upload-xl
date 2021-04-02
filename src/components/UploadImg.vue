<template>
  <div class="uploadImg">
    <div :id="'selectfiles' + domID" class="selectfiles">1</div>
    <slot></slot>
  </div>
</template>
<script>
import axios from 'axios'
import plupload from 'plupload'
import moment from 'moment'
export default {
  name: 'UploadImg',
  props: {
    // 限制文件上传个数
    multiple: {
      type: Number,
      default: 10
    },
    // 限制上传类型
    mimetypes: {
      type: String,
      default: 'jpg,gif,png'
    },
    // 限制上传大小
    fileSize: {
      type: String,
      default: '100mb'
    },
    // 是否允许选取重复文件
    duplicates: {
      type: Boolean,
      default: false
    },
    // 指定上传文件夹
    dir: {
      type: String,
      default: 'upload'
    }
  },
  data() {
    return {
      // 上传元素渲染ID，防止多个组件同时存在
      domID: parseInt(Date.now() + Math.random() * 9999 + 1)
    }
  },
  mounted() {
    this.initialUploader()
  },
  methods: {
    // 图片上传
    initialUploader() {
      this.uploader = new plupload.Uploader({
        runtimes : 'html5,flash,silverlight,html4',
        browse_button: 'selectfiles' + this.domID,
        url: this.aliossHost,
        multi_selection: this.multiple > 1 ? true : false,
        filters: {
          mime_types: [
            { title : "Image files", extensions : this.mimetypes }
          ],
          max_file_size: this.fileSize,
          prevent_duplicates: this.duplicates
        },
        init: {
          PostInit: () => {
            console.log('初始化完成')
          },
          FilesAdded: (up, files) => {
            // 限制上传个数
            if (files.length > this.multiple) {
              up.files.length = files.length = this.multiple
            }
            this.set_upload_param(up, files, true);
          },
          UploadProgress: (up, files) => {
            this.$emit('updateProgress', files.percent, files, up)
          },
          FileUploaded: (up, file, info) => {
            if (info.status === 200) {
              this.$emit('uploadEnd', '/' + file.imgUrl, file, up)
            }
            console.log('/' + file.imgUrl, this.domID)
          },
          Error: (up, err) => {
            this.$emit('uploadError', err, up)
          }
        }
      })
      this.uploader.init()
    },
    set_upload_param(up, file) {
      file.forEach(item => {
        setTimeout(() => {
          axios.get(this.serverHost, {
            params: { dir: this.dir}
          }).then(res => {
            let data = res.data
            console.log(data)
            if (data.Code === 200) {
              let type = item.type.split('/')[1]
              item.imgUrl = `${this.dir}/${moment(new Date()).format('YYYY/MM/DD')}/${Date.now()}.${type}`
              let new_multipart_params = {
                'key': item.imgUrl,
                'policy': data.Data.policy,
                'OSSAccessKeyId': data.Data.accessid,
                'success_action_status' : '200',
                'signature': data.Data.signature
              }
              up.setOption({
                'url': data.Data.host,
                'multipart_params': new_multipart_params 
              })
              up.start()
            }
          })
        }, parseInt(Math.random() * 500))
      })
    }
  }
}
</script>
<style lang="css">
.uploadImg {
  width: max-content;
  height: max-content;
  position: relative;
}
.uploadImg .selectfiles {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 9999;
  opacity: 0;
}
</style>