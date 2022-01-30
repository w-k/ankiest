export const Question = (props: { text: string }) => {
  return (
    <div className="ml-auto mr-auto flex h-96 tablet:h-72 laptop:h-48 w-full p-8 tablet:p-4 laptop:p-2">
      <span className="self-end">{props.text}</span>
    </div>
  )
}
