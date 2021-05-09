const { DataTypes } = require("sequelize");
const db = require("./db");

const User = db.define("UserTH_LTW2s", {
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.findByEmail = async function (email) {
  console.log("in find by email " + email);

  return User.findOne({
    where: {
      email,
    },
  });
};

User.CreateUser = async function (fullname, email, password) {
  User.create({
    fullname: `${fullname}`,
    email: `${email}`,
    password: `${password}`,
  });
};

User.findById = async function (id) {
  return User.findByPk(id);
};

module.exports = User;
