// server.ts
import next from "next"
import { createServer } from "http"
import { parse } from "url"
import { log } from "blitz"

const { PORT = "3000" } = process.env
const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      if (!dev && req.headers["x-forwarded-proto"] !== "https") {
        res.writeHead(302, {
          Location: `https://${req.headers.host}${req.url}`,
        })
        res.end()
        return
      }
      const parsedUrl = parse(req.url!, true)
      void handle(req, res, parsedUrl)
    }).listen(PORT, () => {
      log.success(`Ready on http://localhost:${PORT}`)
    })
  })
  .catch((e) => {
    console.error(e)
  })
