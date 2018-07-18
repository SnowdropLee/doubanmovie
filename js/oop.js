//分页
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


var Top250 = {
  startNum  : 0,
  count :  10,
  isloading : false,
  isfinished  : false,
  init: function(){
    var me = this
    this.$contain = $('#top250'),
    this.$container = this.$contain.find('.container')
    this.bind()
    this.getData(me.renderData)
  },
  bind: function(){
    var me = this
    this.$contain.on('scroll',function(){
      if(me.clock) {
        clearTimeout(me.clock)
      }
      me.clock = setTimeout(function(){
        //console.log('scroll')
        if(me.isToBottom() && !me.isfinished){
          //console.log('bottom')
          me.getData(function(data){
            me.renderData(data)
            if(me.startNum * me.count >= data.total){
              me.isfinished = true
              me.$contain.find('.nomore').show()
            }
          })
        }
      },100)
    })
  },
  getData: function(callback){
    var me = this
    if(me.isloading) return
    me.isloading = true
    $('.loading').show()
    $.ajax({
      type: 'GET',
      url: 'https://api.douban.com/v2/movie/top250',
      data: {
        start: me.startNum * me.count,
        count: me.count,
      },
      dataType: 'jsonp'
    }).done(function(res){
      //console.log(res)
      callback(res)
      me.startNum++
      //console.log('startNum ---'+ me.startNum)
    }).always(function(){
      //console.log('done')
      $('.loading').hide()
      me.isloading = false
    })
  },
  isToBottom : function(){
    return  this.$contain.height() + this.$contain.scrollTop() +30  >= this.$container.height()
  },
  renderData: function(data){
    var me = this
    //console.log(data)
    data.subjects.forEach(function(movie){
      //console.log(movie)
      var tpl = `<div class="item">
          <a href="">
            <div class="cover">
              <img src="http://img7.doubanio.com/view/photo/s_ratio_poster/public/p1910813120.jpg" alt="">
            </div>
            <div class="detail">
              <h2>霸王别姬</h2>
              <div class="extra"><span class="score"></span><span>分</span> / <span class="collect">1000</span><span>收藏</span></div>
              <div class="extra"><span class="year"></span> / <span class="genres"></span></div>
              <div class="extra">导演:<span class="director"></span></div>
              <div class="extra">主演: <span class="casts"></span></div>
            </div>
          </a>
        </div>`
      var $node = $(tpl)
      //console.log($node)
      $node.find('.cover img').attr('src',movie.images.medium)
      $node.find('.itme>a').href = movie.alt
      $node.find('.itme>a').attr('href',movie.alt)
      $node.find('.detail>h2').text(movie.title)
      $node.find('.score').text(movie.rating.average)
      $node.find('.collect').text(movie.collect_count)
      $node.find('.director').text(movie.directors.map(v=>v.name).join('/'))
      $node.find('.casts').text(movie.casts.map(v=>v.name).join('、'))
      $node.find('.year').text(movie.year)
      $node.find('.genres').text(movie.genres.join('、'))
      //console.log(movie.genres)
      $('#top250 .container').append($node)
    })
  },
}

var Usbox = {
  init: function(){
    //this.bind()
    this.getData(this.renderData)
  },
  getData: function(callback){
    var me = this
    $.ajax({
      type: 'GET',
      url: 'https://api.douban.com/v2/movie/us_box',
      dataType: 'jsonp'
    }).done(function(res){
      //console.log(res)
      callback(res)
      //console.log('startNum ---'+ me.startNum)
    }).fail(function(){
      console.log('err')
    }).always(function(){
      //console.log('done')
    })
  },
  renderData: function(data){
    //console.log(data)
    data.subjects.forEach(function(movie){
      var mo = movie.subject
      //console.log(movie)
      var tpl = `<div class="item">
          <a href="#">
            <div class="cover">
              <img src="http://img7.doubanio.com/view/photo/s_ratio_poster/public/p1910813120.jpg" alt="">
            </div>
            <div class="detail">
              <h2>霸王别姬</h2>
              <div class="extra"><span class="score"></span><span>分</span> / <span class="collect">1000</span><span>收藏</span></div>
              <div class="extra"><span class="year"></span> / <span class="genres"></span></div>
              <div class="extra">导演:<span class="director"></span></div>
              <div class="extra">主演: <span class="casts"></span></div>
            </div>
          </a>
        </div>`
      var $node = $(tpl)
      $node.find('.cover img').attr('src',mo.images.medium)
      $node.find('.itme>a').attr('href',mo.alt)
      $node.find('.detail>h2').text(mo.title)
      $node.find('.score').text(mo.rating.average)
      $node.find('.collect').text(mo.collect_count)
      $node.find('.director').text(mo.directors.map(v=>v.name).join('/'))
      $node.find('.casts').text(mo.casts.map(v=>v.name).join('、'))
      $node.find('.year').text(mo.year)
      $node.find('.genres').text(mo.genres.join('、'))
      //console.log(movie.genres)
      $('#beimei div.container').append($node)
    })
  },
}

var Search = {
  startNum:0,
  count:10,
  isloading : false,
  isfinished  : false,
  init:function(){
    this.$contain = $('#search'),
    this.$container = this.$contain.find('.container')
    //this.keyword = this.$contain.find('input').val()
    this.bind()
  },
  bind:function(){
    var me  =  this
    //输入获取val
    // me.$contain.find('input').on('keyup',function(){
    //   //console.log('keyup')
    //   me.keyword = $(this).val()
    // })

    me.$contain.find('input').on('keyup',function(e){
        me.keyword = $(this).val()
        if(e.key ==="Enter"){
           //每次重置搜索内容为空
            me.$container.text('') 
            me.getData(function(data){
                me.renderData(data)
            })
        }
    })

    //点击加载数据
    me.$contain.find('.button').on('click',function(){
      //console.log('click')
      //每次重置搜索内容为空
      me.$container.text('')

      me.getData(function(data){
          me.renderData(data)
      })
    })
    
    //滚动加载
    this.$contain.on('scroll',function(){
      //console.log('scroll')
      if(me.clock) {
        clearTimeout(me.clock)
      }
      me.clock = setTimeout(function(){
        //console.log('scroll')
        if(me.isToBottom() && !me.isfinished){
          //console.log('bottom')
          me.getData(function(data){
            me.renderData(data)
            if(me.startNum * me.count >= data.total){
              me.isfinished = true
              me.$contain.find('.nomore').show()
            }
          })
        }
      },100)
     })
    
  },
  getData:function(callback){
    var me = this
    var keyword = me.$contain.find('input').val()
    if(me.isloading) return
    me.isloading = true
    $('.loading').show()
    $.ajax({
      type : 'GET',
      url :'https://api.douban.com/v2/movie/search',
      data : {
        start:me.startNum * me.count,
        count: me.count,
        q:  keyword,
      },
      dataType : 'jsonp'
    }).done(function(res){
      //console.log(res)
      callback(res)
      me.startNum++
      //console.log('startNum ---'+ me.startNum)
    }).always(function(){
      //console.log('done')
      $('.loading').hide()
      me.isloading = false
      
    })
  },
  isToBottom : function(){
    return  this.$contain.height() + this.$contain.scrollTop() +30  >= this.$container.height()
  },
  renderData:function(data){
      //console.log(data)
      data.subjects.forEach(function(movie){
            var tpl = `<div class="item">
                    <a href="#">
                        <div class="cover">
                            <img src="http://img7.doubanio.com/view/photo/s_ratio_poster/public/p1910813120.jpg" alt="">
                        </div>
                        <div class="detail">
                            <h2>霸王别姬</h2>
                            <div class="extra"><span class="score"></span><span>分</span> / <span class="collect">1000</span><span>收藏</span></div>
                            <div class="extra"><span class="year"></span> / <span class="genres"></span></div>
                            <div class="extra">导演:<span class="director"></span></div>
                            <div class="extra">主演: <span class="casts"></span></div>
                          </div>
                    </a>
                </div>`
            var $node = $(tpl)
            $node.find('.cover img').attr('src',movie.images.medium)
            $node.find('.itme>a').attr('href',movie.alt)
            $node.find('.detail>h2').text(movie.title)
            $node.find('.score').text(movie.rating.average)
            $node.find('.collect').text(movie.collect_count)
            $node.find('.director').text(movie.directors.map(v=>v.name).join('/'))
            $node.find('.casts').text(movie.casts.map(v=>v.name).join('、'))
            $node.find('.year').text(movie.year)
            $node.find('.genres').text(movie.genres.join('、'))
            //console.log(movie.genres)
            $('#search .container').append($node)
        })
       
  }
}

var App = {
  init: function(){
    Paging.init()
    Top250.init()
    Usbox.init()
    Search.init()
  },
}
App.init()