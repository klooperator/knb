const https = require("https");
const Coins = require("../db").Coins;
const moment = require("moment");

const getGetParamsAsString = getObj => {
  let out = "?";
  Object.keys(getObj).forEach((k, i) => {
    if (typeof getObj[k] !== "object" && typeof getObj[k] !== "function")
      out = out + (i !== 0 ? "&" : "") + k + "=" + getObj[k];
  });
  return out;
};

const getCoinList = () => {
  const url = "https://www.cryptocompare.com/api/data/coinlist/";
  return new Promise(resolve => {
    https.get(url, res => {
      let body = "";
      res.on("data", d => {
        body += d;
      });
      res.on("end", () => {
        body = JSON.parse(body);
        resolve(body);
      });
    });
  });
};

const parseList = list => {
  return new Promise(resolve => {
    const out = [];
    let i = 0;
    Object.keys(list.Data).forEach(k => {
      try {
        out.push(list.Data[k].Symbol);
      } catch (error) {
        console.log("probably no symbol");
      }
    });
    resolve(out);
  });
};

const getHistorical = query => {
  const url =
    "https://min-api.cryptocompare.com/data/histoday" +
    getGetParamsAsString(query);
  return new Promise(resolve => {
    https.get(url, res => {
      let body = "";
      res.on("data", d => {
        body += d;
      });
      res.on("end", () => {
        body = JSON.parse(body);

        resolve(body);
      });
    });
  });
};

const findQuery = name => {
  return Coins.find({
    where: {
      name
    }
  });
};
const saveCoinQuery = (name, data, query) => {
  return Coins.create({
    name,
    data,
    query
  });
};

const costructDBName = query => {
  const f = "YYYY-MM-DD";
  const day1 = moment(parseInt(query.ts, 10));
  const d1 = day1.format(f);
  const dayLast = day1.add(query.limit, "days").format(f);
  return `${query.fsym}-${query.tsym}_${d1}-${dayLast}`;
};

const getAllCoinQueries = () => {
  return Coins.findAll();
};

const updateDb = (name, data, query) => {
  return Coins.update(data, { where: { name } });
};

module.exports = {
  getCoinList,
  parseList,
  getHistorical,
  findQuery,
  saveCoinQuery,
  costructDBName,
  getAllCoinQueries,
  updateDb
};
