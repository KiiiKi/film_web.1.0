var express = require('express') 
var mongoose = require('mongoose')
//var path = require('path')
var router = express.Router();//路由
var Movie = require('../models/movie.js')//models里是数据库模型实例，其中模型和模型的方法是schemas里的
var _ = require('underscore')//使Object有像Array的 map()和filter()之类方法

// 连接mongodb数据库imooc，mongoose的连接要写在路由文件中
mongoose.connect('mongodb://localhost/imooc')
mongoose.Promise = global.Promise;//将mongoose已经不被建议的Promise方法替换
var db = mongoose.connection;// 实例化连接对象
db.on('error', console.error.bind(console, 'MongoDB连接错误:'));
db.once('open', (callback) => {console.log('MongoDB连接成功！！')})


/* GET home page. */
router.get('/', function(req, res, next) {
  Movie.fetch(function(err,movies){//Movie实例，.fetch()静态方法【schemas/movies.js里定义】，返回排序后的数组movies
    if(err){
      console.log(err)
    }
    res.render('./pages/index', { 
      title: '首页',
      movies: movies 
    })
  });
});

/* GET detail page. */
router.get('/movie/:id', function(req, res, next) {
  var id = req.params.id;
  console.log("这个/movie/:id的网页中的id是:" + id);
  if(id){
    Movie.findById(id, function(err, movie){
      console.log("detail页面的movie是："+ movie)
      res.render('./pages/detail', {
        title: movie.title,
        movie: movie

      })
    })
  }
});

/* GET admin page. */
router.get('/admin/movie', function(req, res, next) {
  res.render('./pages/admin', { 
    title: '后台录入页',
    movie: [{
      title:'',
      poster: '',
      director: '',
      country: '',
      year: '',
      language: '',
      flash: '',
      summary: '',
    }]
  });
});

/* list.jade upadate movie to admin.jade */
router.get('/admin/update/:id', function(req, res){
  var id = req.params.id
  if(id) {
    Movie.findById(id, function(err, movie){
      res.render('./pages/admin', {
        title: '后台录入页',
        movie: movie
      })
    })
  }
})


/* post movie from admin.jade */
router.post('/admin/movie/new', function(req, res){
  console.log(req.body)
  var id = req.body.movie._id//当向node服务器post发送数据时，键值对在请求的body里
  var movieObj = req.body.movie
  var _movie = new Movie()

  if(id !== 'undefined'){
    Movie.findById(id, function(err, movie){
      console.log(movie)
      if(err){
        console.log(err)
      }
      //用新的数据movieObj替换掉老的movie，extend就是替换改变的对应字段的用于object的方法
      _movie = _.extend(movie, movieObj)
      _movie.save(function(err, movie){ //save方法是数据库的插入文档方法
        if(err){
          console.log(err)
        }
        console.log(_movie)
        console.log(movie)
        res.redirect('/movie/' + movie._id)
      })
    })
  }else{
    _movie = new Movie({
      director: movieObj.director,
      title: movieObj.title,
      country: movieObj.country,
      language: movieObj.language,
      year: movieObj.year,
      poster: movieObj.poster,
      summary: movieObj.summary,
      flash: movieObj.flash
    })
    

    _movie.save(function(err, movie){
      if(err){
        console.log(err)
      }
      console.log("跳转之前电影的id是：" + movie._id);
      res.redirect('/movie/' + movie._id)
    })
    
  }
})


/* GET list page. */
router.get('/admin/list', function(req, res, next) {
  Movie.fetch(function(err,movies){
    if(err){
      console.log(err)
    }
    res.render('./pages/list', { 
      title: '后台列表页',
      movies: movies
    });
  }); 
});


/* list delete movie */
router.delete('/admin/list', function(req, res){
  //从list页面传来的delete操作
  var id = req.query.id
  if(id){
    Movie.remove({_id: id}, function(err, movie){//从数据库中remove移除
      if(err){
        console.log(err)
      }else{
        console.log(movie)
        res.json({success:1})
      }
    })
  }
})


module.exports = router;
