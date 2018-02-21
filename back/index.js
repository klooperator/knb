const app = require("express")();
const logger = require("morgan");
const bParser = require("body-parser");
const http = require("http");
const cors = require("cors");

const router = require("./src/routes/Routes");

app.use(logger());

app.set("port", 3333);
app.set("env", "development");

app.use(
  cors({
    origin: ["http://localhost:3456"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true
  })
);
app.options("*", cors());

app.use(bParser.json());

app.use(router);

if (app.get("env") === "development") {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send("error", {
      message: err.message,
      error: err
    });
  });
}

const server = http.createServer(app);
server.listen(app.get("port"), () => {
  console.log(
    `Server listening on port: ${app.get("port")}. Env is: ${app.get("env")}`
  );
});
console.log(global);
