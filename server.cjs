const https = require("https");
const { parse } = require("url");
const next = require("next").default || require("next");
const fs = require("fs");

const httpsOptions = {
  key: fs.readFileSync("localhost-key.pem"),
  cert: fs.readFileSync("localhost.pem"),
};

const app = next({ dev: true });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  https
    .createServer(httpsOptions, (req, res) => {
      const parsedUrl = parse(req.url || "/", true);
      handle(req, res, parsedUrl);
    })
    .listen(3000, () => {
      console.log("✅ HTTPS server running at https://localhost:3000");
    });
});
