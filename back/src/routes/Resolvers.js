const _h = require("./helpers");
const cache = require("memory-cache");

const coinList = async (req, res) => {
  console.log(req, res);
  let cl = cache.get("coin_list");
  if (!cl) {
    cl = await _h.getCoinList();
    cache.put("coin_list", JSON.stringify(cl), 5 * 60 * 60 * 1000);
  } else {
    cl = JSON.parse(cl);
  }
  let coinArray = cache.get("coin_array");
  if (!coinArray) {
    coinArray = await _h.parseList(cl);
    cache.put("coin_array", JSON.stringify(coinArray), 5 * 60 * 60 * 1000);
  } else {
    coinArray = JSON.parse(coinArray);
  }
  res.send(coinArray);
};

const ping = async (req, res) => {
  console.log("ping", req);
  res.send("pong");
};

const historical = async (req, res) => {
  const { query } = req;
  const data = await _h.getHistorical(query);
  console.log(data);
  res.send(data);
};

module.exports = {
  coinList,
  ping,
  historical
};
