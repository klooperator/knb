const Sequelize = require("sequelize");
const path = require("path");
const dbPath = path.resolve(__dirname, "../../sqlite/knb.db");

const sequelize = new Sequelize("sqlite:" + dbPath);

const Coins = sequelize.define("Coins", {
  name: Sequelize.STRING,
  data: Sequelize.STRING,
  query: Sequelize.STRING
});

const sync = () => {
  Coins.sync({
    /* force: true */
  }).then(() => {
    console.log("db synced...");
  });
};

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    sync();
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelize;
module.exports.Coins = Coins;
