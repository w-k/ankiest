import { Link, RouteUrlObject } from "blitz"

export const LinkButton: React.FunctionComponent<{
  label: string
  href: RouteUrlObject
}> = (props) => {
  return (
    <Link href={props.href}>
      <a className="border-solid border-2 tablet:border p-8 tablet:p-4 laptop:p-2 border-gray-600 hover:border-gray-400 hover:text-gray-400">
        {props.label}
      </a>
    </Link>
  )
}
