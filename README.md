# film_web.1.0
### 基于4.16.4的express版本（没有放node-modules文件夹）
#### 踩过的坑（好多忘记了 (´;︵;`) )
#### 1. 搭express
* express -t jade 文件名
* npm install
* npm start

#### 2. 安装mongoDB
* 下载安装到D:MongoDB文件夹，在mongoDB/data中新建db文件夹
* cmd进入D:\mongoDB\bin目录中输入mongod --dbpath D:\mongoDB\data\db启动服务
* 打开localhost:27017有输出说明安装正确
* 设置windows服务使自启动：
* data文件下下建log文件夹，其中建mongodb.log存日志
* mongoDB文件夹下建mongo.config写：  
        dbpath: D:\mongoDB\data\db  
        logpath: D:\mongoDB\data\log\mongodb.log  
* 管理员身份进入cmd输入mongod --config D:\mongoDB\mongo.config --install -serviceName"MongoDB"
* cmd services.msc看是否启动了
* 之后要用到时就进入文件夹输入mongo就行

#### 3. 坑
* mongodb的连接写在routes/index.js里，写在app.js里连接不上数据库
    ```
    mongoose.connect('mongodb://localhost/imooc')
    mongoose.Promise = global.Promise;
    // 将mongoose已经不被建议的Promise方法替换
    var db = mongoose.connection;
    // 实例化连接对象
    db.on('error', console.error.bind(console, 'MongoDB连接错误:'));
    db.once('open', (callback) => {console.log('MongoDB连接成功！！')})
    ```
* 先mongodb文件夹里新建个数据库：use imooc,再新建集合：db.createCollection(Movie)
* 录入不到mongodb的数据库里
        * 先下载安装mongodb,启动服务，启动后先在mongodb文件夹那里先开一个imooc-->Movies的集合，然后就能录入到数据库了
* 当post数据时，获取request内容在req.body里
    ```
    //当向node服务器post发送数据时，键值对在请求的body里
    var id = req.body.movie._id
    var movieObj = req.body.movie
    ```
* 让object有像array一样的map(),filter()，extend()之类的方法，引入underscore
    ```
    var _ = require('underscore')
    //用新的数据movieObj替换掉老的movie，extend就是替换改变的对应字段的用于object的方法
    _movie = _.extend(movie, movieObj)
    ```
* TypeError: Cannot read property 'movie' of undefined
    * 没有var bodyParser = require('body-parser')会报错，因为请求没有被初始化为对象。console一下req就看出来了  
  
* Cannot read property '_id' of undefined
    * false改成true：app.use(bodyParser.urlencoded({extended: true})); 
* _movie.save(),_movie是Movie的实体，Movie是数据库集合collection，所以_movie有该模型movieschema的方法，save是mongodb中“替换对应内容”的方法，不是movieschema里的写的方法（同理后面的remove方法也是）
    ```
    _movie.save(function(err, movie){ //save方法是数据库的插入文档方法
        if(err){
          console.log(err)
        }
        console.log(_movie)
        console.log(movie)
        res.redirect('/movie/' + movie._id)
      })
    ```
* exec(cb): 如果 exec() 找到了匹配的文本，则返回一个结果数组（这个数组就是回调函数里的第二参数movie）。否则，返回 null。
    ```
    fetch: function(cb) {
        // find里为空表示查询所有内容，并按照更新时间sort排序
        // find()里一定要写{}
        return this.find({}).sort('meta.updateAt').exec(cb)
        //如果 exec() 找到了匹配的文本，则返回一个结果数组。否则，返回 null。
    },
    ```
* 提交的各种地址都要从根目录进入：action = '/admin/movie/new'，不然在A路由跳B路由时会带上A路由的url
* list.jade里的script要tab一下，因为这些都在block content里，也就是在layout.jade的body里
    
