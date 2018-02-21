const router = require("express").Router();
const resolvers = require("./Resolvers");

router.get("/api/coin_list", resolvers.coinList);
router.get("/api/ping", resolvers.ping);
router.get("/api/historcal", resolvers.historical);

module.exports = router;
