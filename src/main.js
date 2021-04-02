import Vue from 'vue'
import App from './App.vue'
import "@babel/polyfill"
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Element)
Vue.config.productionTip = false
Vue.prototype.aliossHost = "https://img.xlxt.net/";
Vue.prototype.serverHost = "https://www3.xlxt.net/AliyunOSS/GetOssSignature";
if (!FileReader.prototype.readAsBinaryString) {
  FileReader.prototype.readAsBinaryString = function (fileData) {
    var binary = "";
    var pt = this;
    var reader = new FileReader();      
    reader.onload = function () {
        var bytes = new Uint8Array(reader.result);
        var length = bytes.byteLength;
        for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
      //pt.result  - readonly so assign binary
      pt.content = binary;
      pt.onload()
  }
  reader.readAsArrayBuffer(fileData);
  }
}
new Vue({
  render: h => h(App),
}).$mount('#app')
