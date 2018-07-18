var $ = require("jquery");
var Paging = {
    init: function(){
      this.$tabs = $('footer>div')
      this.$pages = $('main>section')
      this.bind()
      $('.loading').show()
    },
    bind: function(){
      var me = this
      //绑定事件
      this.$tabs.on('click',function(){
        var $this = $(this)
        var index  = $this.index()
        $this.addClass('active').siblings().removeClass('active')
        me.$pages.eq(index).fadeIn().siblings().fadeOut()
      })
    }
}
module.exports = Paging