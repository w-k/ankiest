import { Link, Routes } from "blitz"
import { HomeIcon } from "./icons"
import { QuickAdd } from "./QuickAdd"

export const Banner = () => {
  return (
    <div className="flex flex-row justify-between text-periwinkle-100 bg-periwinkle-500 px-2 py-1">
      <Link href={Routes.Home()}>
        <a>
          <HomeIcon />
        </a>
      </Link>
      <div>
        <QuickAdd />
      </div>
    </div>
  )
}
