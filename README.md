# 阿里云上传demo

## demo地址

```
https://www3.xlxt.net/uploaddemo/
```



## 视频上传



#### props

| 参数          | 类型           | 说明                                         |
| ------------- | -------------- | -------------------------------------------- |
| timeout       | Number         | *请求过期时间*                               |
| partSize      | Number         | *分片大小*                                   |
| parallel      | Number         | *上传分片数*                                 |
| retryCount    | Number         | *网络失败重试次数*                           |
| retryDuration | Number         | *网络失败重试间隔 默认秒*                    |
| region        | String         | *上传视频点播地域 默认 cn-hangzhou*          |
| userId        | String         | *阿里云账号id*                               |
| accept        | String         | *限制类型*                                   |
| fileSize      | Number         | *限制文件大小 默认2G*                        |
| auto          | Boolean        | *是否自动上传*                               |
| preview       | Boolean        | *是否本地预览*                               |
| progress      | String, Number | *上传进度*（该参数实时更新需要加sync修饰符） |

#### Events

| 事件名称    | 回调参数         | 说明                 |
| ----------- | ---------------- | -------------------- |
| errSize     | -                | 上传超出大小         |
| localPath   | 返回本地视频地址 | 需配合preview使用    |
| errFile     | -                | 上传失败             |
| pauseUpload | -                | 文件上传被取消       |
| getVideoId  | 视频ID           | 视频开始上传时获取id |
| uploadEnd   | 视频ID           | 视频上传成功         |

#### Methods

| 方法名      | 说明                                           |
| ----------- | ---------------------------------------------- |
| startUpload | 开始上传（关闭自动上传后可手动触发上传）       |
| pauseUpload | 暂停上传（暂无断点续传接口，暂停等于取消上传） |

## 图片上传

#### props

| 参数       | 类型    | 说明                                 |
| ---------- | ------- | ------------------------------------ |
| multiple   | Number  | *限制文件上传个数*  ，默认为1        |
| mimetypes  | String  | *限制上传类型*   ， 默认 jpg,gif,png |
| fileSize   | String  | *限制上传大小* ， 默认100mb          |
| duplicates | Boolean | *是否允许选取重复文件*  ， 默认false |
| dir        | String  | *指定上传文件夹* , 默认upload        |

#### Events

| 事件名称       | 回调参数 | 说明             |
| -------------- | -------- | ---------------- |
| uploadError    | 错误信息 | 图片上传错误回调 |
| uploadEnd      | 图片地址 | 上传成功回调     |
| updateProgress | 上传进度 | 上传中进度回调   |

