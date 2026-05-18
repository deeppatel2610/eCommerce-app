const Admin = require("../../models/adminModel");

exports.getLoginUi = (req, res) => {
  res.render("adminLogin", { error: undefined });
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  Admin.findOne({ email, password })
    .then((users) => {
      if (users === null) {
        res.render("adminLogin", { error: "Admin Not Found" });
      } else {
        // Store admin data in session upon successful login
        req.session.admin = users;
        // Redirect to the admin dashboard
        res.redirect("/admin/dashboard");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
};
