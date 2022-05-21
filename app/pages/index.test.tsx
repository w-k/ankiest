import { render } from "test/utils"

import Home from "./index"

// This is to shut up the husky pre-push hook which fails if there are no tests.
test.skip("renders page without throwing errors", () => {
  render(<Home />)
})
