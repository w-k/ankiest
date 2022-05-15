import { forwardRef, FunctionComponent, RefObject } from "react"

interface ButtonProps {
  label: string
  onClick: () => any
  primary?: boolean
}

export const Button = forwardRef((props: ButtonProps, ref: RefObject<HTMLButtonElement>) => {
  const primaryStyle = `bg-periwinkle-500 hover:bg-periwinkle-600 text-periwinkle-50 hover:text-blushPink-100 px-3 py-2 rounded-md`
  const secondaryStyle =
    "border-solid border-2 tablet:border border-gray-600 hover:border-gray-400 hover:text-gray-400 px-3 py-2 rounded-md"
  return (
    <div
      className={`cursor-pointer ${props.primary ? primaryStyle : secondaryStyle}`}
      onClick={props.onClick}
    >
      <button ref={ref}>{props.label}</button>
    </div>
  )
})
