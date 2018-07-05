var mongoose=require('mongoose');//先获取mongoose对象
//创建userSchema模型
var userSchema=new mongoose.Schema({
  "userId":String,
  "userName":String,
  "userPwd":String,
  "orderList":Array,
  "cartList":[
    {
      "productId":String,
      "productName":String,
      "salePrice":String,
      "productImage":String,
      "checked":String,
      "productNum":String
    }
  ],
  "addressList":[
    {
      'addressId': String,
      'userName': String,
      'streetName':String,
      'postCode': Number,
      'tel': Number,
      'isDefault': Boolean
    }
  ]
})
///将生成的用户集合导出，共外部调用
module.exports=mongoose.model("User",userSchema);


