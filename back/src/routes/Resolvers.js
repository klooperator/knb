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
  const cq = await _h.getAllCoinQueries();
  res.send(
    cq.map(e => {
      console.log(e.dataValues.name);
      return e.dataValues.name;
    })
  );
};

const historical = async (req, res) => {
  const { query } = req;
  const dbName = _h.costructDBName(query);
  const c = cache.get(dbName + "_historical");
  if (c) return res.send({ hodl: true });
  let dbData;
  let cloudData;
  try {
    dbData = await _h.findQuery(dbName);
  } catch (error) {
    console.log(error);
  }
  if (!dbData) {
    try {
      cloudData = await _h.getHistorical(query);
      const e = await _h.saveCoinQuery(
        dbName,
        JSON.stringify(cloudData.Data),
        JSON.stringify(query)
      );
      res.send(cloudData);
    } catch (error) {
      console.log(error);
    }
  } else {
    res.send({
      Data: JSON.parse(dbData.dataValues.data),
      originalQuery: JSON.parse(dbData.dataValues.query),
      lastUpdate: dbData.dataValues.updatedAt
    });
  }
  cache.put(dbName + "_historical", "cached", 60 * 1000);
};

const getFromDb = async (req, res) => {
  const { query } = req;
  let dbData;
  try {
    dbData = await _h.findQuery(query.name);
  } catch (error) {
    console.log(error);
  }
  res.send({
    Data: JSON.parse(dbData.dataValues.data),
    originalQuery: JSON.parse(dbData.dataValues.query),
    lastUpdate: dbData.dataValues.updatedAt
  });
};

const refreshDB = async (req, res) => {
  const { query } = req;
  const dbName = _h.costructDBName(query);
  const c = cache.get(dbName + "_refresh");
  if (c) return res.send({ hodl: true });
  try {
    const cloudData = await _h.getHistorical(query);
    const e = await _h.updateDb(
      dbName,
      JSON.stringify(cloudData.Data),
      JSON.stringify(query)
    );
    res.send(cloudData);
  } catch (error) {
    console.log(error);
  }
  cache.put(dbName + "_refresh", "refreshed", 60 * 1000);
};

module.exports = {
  coinList,
  ping,
  historical,
  getFromDb,
  refreshDB
};
