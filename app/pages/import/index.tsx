import BannerLayout from "app/core/layouts/BannerLayout"
import { BlitzPage, useMutation } from "blitz"
import { ChangeEvent, useState } from "react"
import { parse } from "papaparse"
import { Button } from "app/components/Button"
import createManyCards from "app/cards/mutations/createManyCards"

const readFile = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event: ProgressEvent<FileReader>) => {
      resolve(event.target?.result?.toString() ?? "")
    }
    reader.onerror = (event: ProgressEvent<FileReader>) => {
      reject(event.target?.error)
    }
    reader.readAsText(file, "UTF-8")
  })

interface ImportCard {
  question: string
  answer: string
}

const ImportPage: BlitzPage<{}> = () => {
  const [cards, setCards] = useState<ImportCard[]>([])
  const [createManyCardsMutation] = useMutation(createManyCards)
  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const content = await readFile(event.target.files[0])
      const { data } = parse(content.trim(), { header: true })
      setCards(data as ImportCard[])
    }
  }
  const handleConfirm = () => {
    createManyCardsMutation(cards)
      .then(() => {
        setCards([])
      })
      .catch((e) => {
        console.error(e)
      })
  }
  if (cards.length) {
    // TODO: make the components from the browse page reusable here
    return (
      <>
        <table>
          <thead>
            <tr>
              <th className="px-5">Question</th>
              <th className="px-5">Answer</th>
            </tr>
          </thead>

          <tbody>
            {cards.map((card: ImportCard) => (
              <tr key={card.question} className="odd:bg-gray-100 group">
                <td className="px-5">{card.question}</td>
                <td className="px-5">{card.answer}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-10 w-40">
          <Button primary label="Confirm import" onClick={handleConfirm} />
        </div>
      </>
    )
  }
  return (
    <>
      <input type="file" onChange={handleChange}></input>
    </>
  )
}

ImportPage.authenticate = true
ImportPage.suppressFirstRenderFlicker = true
ImportPage.getLayout = (page) => <BannerLayout title="Import">{page}</BannerLayout>

export default ImportPage
