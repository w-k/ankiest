import logout from "app/auth/mutations/logout"
import { Link, Routes, useMutation } from "blitz"
import { HomeIcon, LogoutIcon } from "./icons"
import { QuickAdd } from "./QuickAdd"
import { Search } from "./Search"

export const Banner = () => {
  const [logoutMutation] = useMutation(logout)
  const handleLogout = async () => {
    await logoutMutation()
  }
  return (
    <div className="flex flex-row justify-between text-periwinkle-100 bg-periwinkle-500 px-2 py-1 h-10">
      <div className="flex space-x-8">
        <Link href={Routes.Home()}>
          <a className="hover:text-blushPink-200">
            <HomeIcon />
          </a>
        </Link>
        <Search />
      </div>
      <div className="flex space-x-8">
        <div className="hover:text-blushPink-200">
          <QuickAdd />
        </div>
        <div>
          <button className="hover:text-blushPink-200" onClick={handleLogout}>
            <LogoutIcon />
          </button>
        </div>
      </div>
    </div>
  )
}
