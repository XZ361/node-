var express = require('express');
var router = express.Router();
var User=require('./../models/user');
require('./../utils/util');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/test', function(req, res, next) {
  res.send('test');
});
router.post("/login",(req,res,next)=>{
  var param={
    userName:req.body.userName,
    userPwd:req.body.userPwd
  }
  //获取用户名和密码后，要利用user模型去查找
  //并炒作mongoose，利用mongoose的api来炒作
  User.findOne(param,(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message
      });
    }else{
      if(doc){
        //将信息返回给前端，通过cookie进行存储
        res.cookie("userId",doc.userId,{
          path:'/',
          maxAge:1000*60*60
        });
        res.cookie("userName",doc.userName,{
          path:'/',
          maxAge:1000*60*60
        });
        //req.session.user=doc;
        res.json({
          status:'0',
          msg:'',
          result:{
              userName:doc.userName
          }
        })
      }

    }
  })
})

//注销接口
router.post('/logout',function (req,res,next) {
  res.cookie('userId','', {
    path:'/',
    maxAge:-1

  })
  //res.json用来想服务端输出
  res.json({
    status:'0',
    msg:'',
    result:''
  })
})
//检验登陆
router.get('/checkLogin',(req,res,next)=>{
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:'',
      result:req.cookies.userName||''
    })
  }else{
    res.json({
      status:'1',
      msg:'未登录',
      result:''
    })
  }
})
//查询当前用户的购物车数据
router.get('/cartList',(req,res,next)=>{
  var userId=req.cookies.userId;
  User.findOne({
    userId:userId
  },(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:doc.cartList
        })
      }
    }
  })
})
//购物车删除
router.post('/cartDel',(req,res,next)=>{
  var userId=req.cookies.userId;//删除前，掐按获取用户id下的数据
  //和商品id,post提交时可通过req.body获取发送过来的是商品id
  let productId=req.body.productId;
  User.update({
    userId:userId
  },{
    $pull:{
      'cartList': {
        'productId':productId
      }
    }
  },(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:'success'

        })
      }
    }
  })


})
//购物车商品数量的修改
router.post('/cartEdit',(req,res,next)=>{
  var userId=req.cookies.userId,
    productId=req.body.productId,
    productNum=req.body.productNum,
    checked=req.body.checked;
    User.update({'userId':userId,"cartList.productId":productId},{
      "cartList.$.productNum":productNum,
      "cartList.$.checked":checked
    },(err,doc)=>{
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        res.json({
          status:'0',
          msg:'',
          result:'success'
        })
      }
    })
})

//购物车全选的修改
router.post('/editCheckAll',(req,res,next)=>{
  var userId=req.cookies.userId,
    checkAll=req.body.checkAll?1:0;
  User.findOne({"userId":userId},(err,user)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      if(user){
        user.cartList.forEach((item)=>{
          this.checked=checkAll;
        })
        user.save((err1,doc)=>{
          if(err1){
            res.json({
              status:'1',
              msg:err1.message,
              result:''
            });
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
})

//查询用户地址接口
router.get('/addressList',(req,res,next)=>{
  var userId=req.cookies.userId;
  User.findOne({userId:userId},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:doc.addressList
      })
    }
  })
})

//设置默认的地址借口
router.post('/setDefault',(req,res,next)=>{
  let userId=req.cookies.userId,addressId=req.body.addressId;
  if(!addressId){
    res.json({
      status:'1003',
      msg:'addressId is null',
      result:''
    })
  }else{
    User.findOne({userId:userId},(err,doc)=>{
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else{
        var addressList=doc.addressList;
        addressList.forEach((item)=>{
          if(item.addressId==addressId){
            item.isDefault=true;
          }else{
            item.isDefault=false;
          }
        })
        doc.save((err1,doc1)=>{
          if(err1){
            res.json({
              status:'1',
              msg:err1.message,
              result:''
            })
          }else{
            res.json({
              status:'0',
              msg:'',
              result:''
            })
          }
        })
      }
    })

  }
})

//删除地址接口
router.post('/delAddress',(req,res,next)=>{
  let userId=req.cookies.userId,addressId=req.body.addressId;
  User.update({
    userId:userId
  },{
    $pull:{
      'addressList': {
        'addressId':addressId
      }
    }
  },(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:''
      })
    }
  })
})

//订单支付页面
router.post('/payMent',(req,res,next)=>{
  let userId=req.cookies.userId,orderTotal=req.body.orderTotal,addressId=req.body.addressId;
  User.findOne({userId:userId},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      let address='',goodsList=[];//将用户的选择地址和购买的商品存储起来
      doc.addressList.forEach((item)=>{
        if(item.addressId==addressId){
          address=item;//获取当前用户的地址信息
        }
      })
      //获取用户购物车的购买商品,用filter也可可以实现遍历
      doc.cartList.filter((item)=>{
        if(item.checked=='1'){
          goodsList.push(item);
        }
      })

      var platform='622';//自定义平台吗
      var r1=Math.floor(Math.random()*10);
      var r2=Math.floor(Math.random()*10);

      var sysDate=new Date().Format('yyyyMMddhhmmss');
      var createDate=new Date().Format('yyyy-MM-dd hh:mm:ss');
      var orderId=platform+r1+sysDate+r2;
      //创建订单
      var order={
        orderId:orderId,//订单号
        orderTotal:orderTotal,
        addressInfo:address,
        goodsList:goodsList,
        orderStatus:1,
        createDate:createDate

      }
      doc.orderList.push(order);
      doc.save((err1,doc1)=>{
        if(err1){
          res.json({
            status:'1',
            msg:err1.message,
            result:''
          })

        }else{
          res.json({
            status:'0',
            msg:'',
            result:{
              orderId:order.orderId,
              orderTotal:order.orderTotal,

            }
          })
        }
      })

    }
  })
})

//根据订单id查询订购单信息
router.get('/orderDetail',(req,res,next)=>{
  var userId=req.cookies.userId,orderId=req.param('orderId');
  User.findOne({userId:userId},(err,userInfo)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''

      })
    }else{
      var orderList=userInfo.orderList;
      var orderTotal=0;
      if(orderList.length>0){
        orderList.forEach((item)=>{

          if(item.orderId==orderId){
            orderTotal=item.orderTotal;
          }
        });
        if(orderTotal>0){
          res.json({
            status:'0',
            msg:'',
            result:{
              orderId:orderId,
              orderTotal:orderTotal
            }
          })
        }else{
          res.json({
            status:'120002',
            msg:'无此订单',
            result:''
          })
        }

      }else{
        res.json({
          status:'120001',
          msg:'当前哟用户未创建订单',
          result:''

        })
      }

    }
  })
})
module.exports = router;
