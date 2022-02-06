import { FunctionComponent } from "react"

export const Button: FunctionComponent<{
  label: string
  onClick: () => any
  primary?: boolean
}> = (props) => {
  const primaryStyle = `bg-periwinkle-500 hover:bg-periwinkle-600 text-periwinkle-50 hover:text-blushPink-100 px-3 py-2 rounded-md`
  const secondaryStyle =
    "border-solid border-2 tablet:border border-gray-600 hover:border-gray-400 hover:text-gray-400 px-3 py-2 rounded-md"
  return (
    <div className={props.primary ? primaryStyle : secondaryStyle}>
      <button onClick={props.onClick}>{props.label}</button>
    </div>
  )
}
