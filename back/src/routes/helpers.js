const https = require("https");

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
      console.log(res);
      let body = "";
      res.on("data", d => {
        body += d;
      });
      res.on("end", () => {
        console.log("end");
        body = JSON.parse(body);
        console.log(body);
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
  console.log(url);
  return new Promise(resolve => {
    https.get(url, res => {
      let body = "";
      res.on("data", d => {
        body += d;
      });
      res.on("end", () => {
        console.log("end");
        body = JSON.parse(body);

        resolve(body);
      });
    });
  });
};

module.exports = {
  getCoinList,
  parseList,
  getHistorical
};
