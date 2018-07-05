var mongoose=require('mongoose');//县引入mongoose
var Schema=mongoose.Schema;//获取表的模型

var productSchema=new Schema({//创商品模型建
    "productId":String,
  "productName":String,
  "salePrice":Number,
  "checked":String,
  "productImage":String
})

module.exports=mongoose.model('Good',productSchema);//生成商品模型，并通过mongooseApi来生成供外部调用
