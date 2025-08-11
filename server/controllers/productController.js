const Product = require("../models/productModel");

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      image,
      category,
      subCategory,
      unit,
      price,
      stock,
      discount,
      description,
      more_details,
    } = req.body;

    if (
      !name ||
      !image[0] ||
      !category[0] ||
      !subCategory[0] ||
      !unit ||
      !description
    ) {
      return res
        .status(400)
        .json({ message: " Enter required fields", success: false });
    }

    const product = new Product({
      name,
      image,
      category,
      subCategory,
      unit,
      price,
      stock,
      discount,
      description,
      more_details,
    });

    const saveProduct = await product.save();

    return res.json({
      message: "Product created successfully",
      data: saveProduct,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false });
  }
};

exports.getProduct = async (req, res) => {
  try {
    let { page, limit, search } = req.body;

    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }

    const query = search
      ? {
          $text: {
            $search: search,
          },
        }
      : {};

    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .populate("category subCategory"),
      Product.countDocuments(query),
    ]);

    return res.json({
      message: "Product Data",
      success: true,
      totalCount: totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
      data: data,
      page,
      limit
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        message: "Provide _id",
        success: false,
      });
    }

    const deleteProduct = await Product.deleteOne({ _id: _id });

    return res.json({
      message: "Delete Successfully",
      data: deleteProduct,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false });
  }
};

exports.getProductByCategory = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ message: "provide category id", success: false });
    }

    const product = await Product.find({
      category: { $in: id },
    }).limit(15);

    return res
      .status(200)
      .json({ message: "Category product list", data: product, success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false });
  }
};

exports.getProductByCategoryAndSubCategory = async (req, res) => {
  try {
    const { categoryId, subCategoryId } = req.body;
    let { page, limit } = req.body;

    if (!categoryId || !subCategoryId) {
      return res.status(400).json({
        message: "Provide categoryId and subCategoryId",
        success: false,
      });
    }

    if (!page) {
      page = 1;
    }

    if (!limit) {
      limit = 10;
    }

    const query = {
      category: { $in: [categoryId] },
      subCategory: { $in: [subCategoryId] },
    };

    const skip = (page - 1) * limit;

    const [data, dataCount] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);

    return res.json({
      message: "Product list",
      data: data,
      totalCount: dataCount,
      page: page,
      limit: limit,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false });
  }
};

exports.getProductDetails = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findOne({ _id: productId });

    return res.json({
      message: "Product details",
      data: product,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false });
  }
};

// update product
exports.updateProductDetails = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({
        message: "Provide product _id",
        success: false,
      });
    }

    const updateProduct = await Product.updateOne(
      { _id: _id },
      {
        ...req.body,
      }
    );

    return res.json({ message: "updated successfully", success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false });
  }
};

// search product
exports.searchProduct = async (req, res) => {
  try {
    let { search, page, limit } = req.body;

    // if user not provide page , it by default 1 and limit, by default 10
    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }

    const query = search
      ? {
          $text: {
            $search: search,
          },
        }
      : {};

    const skip = (page - 1) * limit;

    const [data, dataCount] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category subCategory"),
      Product.countDocuments(query),
    ]);

    return res.json({
      message: "Product data",
      success: true,
      data: data,
      totalCount: dataCount,
      totalPage : Math.ceil(dataCount/limit),
      page: page,
      limit: limit,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false });
  }
};
