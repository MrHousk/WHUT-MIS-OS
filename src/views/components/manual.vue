<template>
  <div id="reader"></div>
</template>

<script>
  export default {
    methods: {
      loadManual() {
        var option = {
          docId: "doc-ig6mypph8p6x6x8",
          token: "TOKEN",
          host: "BCEDOC",
          width: 1200, // 文档容器宽度
          pn: 1, // 定位到第几页，可选
          ready: function (handler) { // 设置字体大小和颜色, 背景颜色（可设置白天黑夜模式）
            handler.setFontSize(1);
            handler.setBackgroundColor("#000");
            handler.setFontColor("#fff");
          },
          flip: function (data) { // 翻页时回调函数, 可供客户进行统计等
            console.log(data.pn);
          },
          fontSize: "big",
          toolbarConf: {
            page: true, // 上下翻页箭头图标
            pagenum: true, // 几分之几页
            full: false, // 是否显示全屏图标,点击后全屏
            copy: false, // 是否可以复制文档内容
            position: "center" // 设置 toolbar中翻页和放大图标的位置(值有left/center)
          } //文档顶部工具条配置对象,必选
        };
        new Document("reader", option);
      }
    },
    created() {
      this.loadManual()
    }
  }
</script>

<style>
#reader {
  margin: 0 auto;
}
</style>
