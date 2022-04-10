// server.ts
import blitz from "blitz/custom-server"
import { createServer } from "http"
import { parse } from "url"
import { log } from "next/dist/server/lib/logging"

const { PORT = "3000" } = process.env
const dev = process.env.NODE_ENV !== "production"
const app = blitz({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    if (!dev && req.headers["x-forwarded-proto"] !== "https") {
      res.writeHead(302, {
        Location: `https://${req.headers.host}${req.url}`,
      })
      res.end()
      return
    }
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  }).listen(PORT, () => {
    log.success(`Ready on http://localhost:${PORT}`)
  })
})
