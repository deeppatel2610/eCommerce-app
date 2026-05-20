const CategoriesModel = require("../../models/categoriesModel");

exports.getAllcategory = async (req, res) => {
  try {
    const caregory = await CategoriesModel.find();
    res.status(200).json({
      success: true,
      data: caregory.map((e) => {
        return {
          id: e._id,
          categoriesName: e.categoriesName,
          status: e.status,
        };
      }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

exports.getCategoryById = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const caregory = await CategoriesModel.findById(categoryId);
    res.status(200).json({
      success: true,
      data: {
        id: caregory._id,
        categoriesName: caregory.categoriesName,
        status: caregory.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: error.message,
    });
  }
};
