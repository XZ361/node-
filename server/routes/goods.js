var express=require('express');
var router=express.Router();//通过express框架封装好的路由里获取路由
var mongoose=require('mongoose');
var Goods=require('../models/goods');
//链接mongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/imoocmall');//连接到数据库中并调用要用到的数据库
//验证连接成功
mongoose.connection.on("connected",function () {
  console.log('MongoDB connected successed');
})

mongoose.connection.on("error",function () {
  console.log('MongoDB connected failed');
})
//监听链接断开
mongoose.connection.on("disconnected",function () {
  console.log('MongoDB connected disconnected');
})
//向服务器拿数据,并查询商品列表数据
router.get("/list",function (req,res,next) {
  let page=parseInt(req.param('page'));//获取当前的分页数值参数
  let pageSize=parseInt(req.param('pageSize'));//获取当前的每个分页大小的数值
  let sort=req.param('sort');//获取当前的排序参数
  let priceLevel=req.param('priceLevel');
  let params={};
  let skip=(page-1)*pageSize;//尧跳过的数据
  let priceGt='';let priceLte='';
  if(priceLevel!='all'){
    switch(priceLevel){
      case '0':priceGt=0;priceLte=100;break;
      case '1':priceGt=100;priceLte=500;break;

      case '2':priceGt=500;priceLte=1000;break;
      case '3':priceGt=1000;priceLte=5000;break;
    }
    params={
      salePrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }
  let goodsModel=Goods.find(params).skip(skip).limit(pageSize);//默认跳过skip调 数据
  goodsModel.sort({'salePrice':sort});
  goodsModel.exec(function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:{
          count:doc.length,
          list:doc
        }
      });
    }
  })
})
//向服务器提交数据,添加商品到购物车中
router.post("/addCart",function (req,res,next) {
  var userId='100000077';
  //get取参和post取参不同，get取参直接通过req.param获取，post取参需要通过req.body来获取
  var productId=req.body.productId;
  var User=require('../models/user');
  User.findOne({userId:userId},function (err,userDoc) {
    if(err){
      rees.json({
        status:'1',
        msg:err.message,
      })
    }else {
     /**/ //console.log("userDoc"+userDoc);
      if(userDoc){
        let goodsItem='';
        userDoc.cartList.forEach(function (item) {
          if(item.productId==productId){
            goodsItem=item;
            item.productNum++;
          }
        });
        if(goodsItem){
          userDoc.save(function (err2,doc2) {
            if(err2){
              res.json({
                status:'1',
                msg:err2.message
              })
            }else{

                res.json({
                  status:'0',
                  msg:'',
                  result:'success'
                })
            }
          })
        }else{
          Goods.findOne({
            productId:productId
          },function (err1,doc) {
            if(err1){
              res.json({
                status:'1',
                msg:err1.message
              })
            }else{
              if(doc){
                /*通过mongoose查询的结果为Document文档类型而并非对象类型
                ，因此，虽然在后台可以获取到新增的doc.productNum与doc.checked属性，
                但其实并没有对doc进行更改。*/
                /*解决方案；只要将文档对象转换为Object对象即可，使用mongoose自带的Document.prototype.toObject()方法，
                或者使用JSON.stringify()方法,将doc转换为Object对象。然后向数据库插入obj即可*/
                var obj = doc.toObject();
                obj.productNum=1;
                obj.checked=1;
                userDoc.cartList.push(obj);
                userDoc.save(function (err2,doc2) {
                  if(err2){
                    res.json({
                      status:'1',
                      msg:err2.message
                    })
                  }else{
                    res.json({
                      status:'0',
                      msg:'',
                      result:'success'
                    })

                  }
                })
              }
            }
          })
        }


      }
    }
  })

})
module.exports=router;
