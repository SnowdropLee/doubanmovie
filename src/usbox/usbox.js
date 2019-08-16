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
                <img src="https://img7.doubanio.com/view/photo/s_ratio_poster/public/p1910813120.jpg" alt="">
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

module.exports = Usbox