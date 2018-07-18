
//tab切换
$('footer>div').click(function(){
  var index = $(this).index()
  $('main>div').eq(index).fadeIn().siblings().hide()
  $(this).addClass('active').siblings().removeClass('active')
})

var startNum = 0
var isloading = false
load()
function load(){
  //请求枷锁机制
  if(isloading) return
  isloading = true
  $('.loading').show()
  $.ajax({
    type: 'GET',
    url: 'https://api.douban.com/v2/movie/top250',
    data: {
      start: startNum,
      count: 20,
    },
    dataType: 'jsonp'
  }).done(function(res){
    //console.log(res)
    renderData(res)
    startNum+=20
  }).fail(function(err){
    console.log('err')
  }).always(function(){
    isloading = false
    $('.loading').hide()
  })
}


function renderData(data){
  data.subjects.forEach(function(movie){
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
  $('main div.container').append($node)
  })
}

//滚动懒加载&函数节流
$('main').scroll(function(){
    //console.log(1)
    if($('#top250').height() - 10 <= $('main').height() + $('main').scrollTop()) {
      console.log(2)
      load()
    }
})