var Paging = require('./page/page');
var Top250 =require('./top250/top250');
var Usbox = require('./usbox/usbox');
var Search = require('./search/search');
;

var App = {
    init: function(){
      Paging.init()
      Top250.init()
      Usbox.init()
      Search.init()
    },
  }
  App.init()