import { useState } from "react"
import { EditModal } from "./EditModal"
import { AddIcon } from "./icons"

export const QuickAdd = () => {
  const [active, setActive] = useState(false)
  const toggle = () => {
    setActive(!active)
  }
  return (
    <>
      <button onClick={toggle}>
        <AddIcon />
      </button>
      {active && <EditModal onDeactivate={toggle} />}
    </>
  )
}
