const CartProduct =require("../models/cartProduct");
const User = require('../models/userModel')

exports.addToCartItem = async(req,res)=> {
  try {
    // get current user id
    const userId = req.userId
    const { productId } = req.body

    if(!productId){
      return res.status(402).json({message : "Provide product Id", success : false})
    }

    // item is already added to the cart or not
    const checkItemCart = await CartProduct.findOne({
      userId : userId,
      productId : productId
    })

    if(checkItemCart){
      return res.status(400).json({
        message : "Item already in cart"
      })
    }

    const cartItem = new CartProduct({
      quantity : 1,
      userId : userId,
      productId : productId
    })
    const save = await cartItem.save()

    const updatecartUser = await User.updateOne({_id : userId},{
      $push : {
        shopping_cart : productId
      }
    })

    return res.json({
      data : save,
      message : "Item add successfully",
      success : true
    })
  } catch (error) {
    return res.status(500).json({message : error.message || error, success : false})
  }
}

exports.getCartItem = async(req,res) => {
  try {
    const userId = req.userId  //only login user is access

    const cartItem = await CartProduct.find({
      userId : userId     
    }).populate('productId')

    return res.json({
      data : cartItem,
      success : true
    })

  } catch (error) {
    return res.status(500).json({message : error.message || error, success : false})
  }
}

// update item- increase & decrease item

exports.updateCartItemQty = async(req,res)=> {
  try {
    const userId = req.userId
    const { _id,qty } = req.body

    if(!_id || !qty){
      return res.status(400).json({message : "Provide _id and qty"})
    }

    const updateCartItem = await CartProduct.updateOne({
      _id : _id,
      userId : userId
    }, {
      quantity : qty
    })

    return res.json({message : "Item added", success : true, data : updateCartItem})
  } catch (error) {
    return res.status(500).json({message : error.message || error, success : false})
  }
}

// when the cart product qty is 1 after decreasing it should remove on cart
exports.deleteCartItemQty = async(req,res)=> {
  try {
    const userId = req.userId //coming from middleware
    const {_id} = req.body

    if(!_id){
      return res.status(400).json({message : "Provide _id", success : false})
    }

    const deleteCartItem = await CartProduct.deleteOne({_id : _id, userId : userId})

    return res.json({message : "Item remove", success : true, data : deleteCartItem})
  } catch (error) {
    return res.status(500).json({message : error.message || error, success : false})
  }
}