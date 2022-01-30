import logout from "app/auth/mutations/logout"
import { Link, Routes, useMutation } from "blitz"
import { HomeIcon, LogoutIcon } from "./icons"
import { QuickAdd } from "./QuickAdd"

export const Banner = () => {
  const [logoutMutation] = useMutation(logout)
  const handleLogout = async () => {
    await logoutMutation()
  }
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
      <div>
        <button onClick={handleLogout}>
          <LogoutIcon />
        </button>
      </div>
    </div>
  )
}
