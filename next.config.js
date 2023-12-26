// const { sessionMiddleware, simpleRolesIsAuthorized } = require("@blitzjs/auth")
const { withBlitz } = require("@blitzjs/next")

const config = {
  // middleware: [
  //   sessionMiddleware({
  //     cookiePrefix: "ankier",
  //     isAuthorized: simpleRolesIsAuthorized,
  //   }),
  // ],
}
module.exports = withBlitz(config)
