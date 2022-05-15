/* eslint-disable */

import { readLines } from "https://deno.land/std/io/buffer.ts"

let index = 0
const lines: string[] = []
for await (const line of readLines(Deno.stdin)) {
  lines.push(line)
  index++
}

const infinitive = lines[0]

const extract = (line?: string): string => {
  if (!line) {
    return ""
  }
  const tabSeparatedParts = line.split("\t")
  const lastTabSeparatedPart = tabSeparatedParts[tabSeparatedParts.length - 1]!
  const parts = lastTabSeparatedPart.split(", ")
  return parts[0] ?? ""
}

const referenceLine = lines.indexOf("Indicativo")

const lineForms: Record<number, string> = {
  2: "1ª persona singular (yo) presente indicativo",
  3: "2ª persona singular (tú) presente indicativo",
  4: "3ª persona singular (él/ella/usted) presente indicativo",
  5: "1ª persona plural (nosotros) presente indicativo",
  6: "2ª persona plural (vosotros) presente indicativo",
  7: "3ª persona plural (ellos/ellas/ustedes) presente indicativo",

  10: "1ª persona singular (yo) imperfecto indicativo",
  11: "2ª persona singular (tú) imperfecto indicativo",
  12: "3ª persona singular (él/ella/usted) imperfecto indicativo",
  13: "1ª persona plural (nosotros) imperfecto indicativo",
  14: "2ª persona plural (vosotros) imperfecto indicativo",
  15: "3ª persona plural (ellos/ellas/ustedes) imperfecto indicativo",

  18: "1ª persona singular (yo) pretérito indicativo",
  19: "2ª persona singular (tú) pretérito indicativo",
  20: "3ª persona singular (él/ella/usted) pretérito imperfecto indicativo",
  21: "1ª persona plural (nosotros) pretérito indicativo",
  22: "2ª persona plural (vosotros) pretérito indicativo",
  23: "3ª persona plural (ellos/ellas/ustedes) pretérito indicativo",

  34: "1ª persona singular (yo) condicional indicativo",
  35: "2ª persona singular (tú) condicional indicativo",
  36: "3ª persona singular (él/ella/usted) condicional indicativo",
  37: "1ª persona plural (nosotros) condicional indicativo",
  38: "2ª persona plural (vosotros) condicional indicativo",
  39: "3ª persona plural (ellos/ellas/ustedes) condicional indicativo",

  76: "1ª persona singular (yo) presente subjuntivo",
  77: "2ª persona singular (tú) presente subjuntivo",
  78: "3ª persona singular (él/ella/usted) presente subjuntivo",
  79: "1ª persona plural (nosotros) presente subjuntivo",
  80: "2ª persona plural (vosotros) presente subjuntivo",
  81: "3ª persona plural (ellos/ellas/ustedes) presente subjuntivo",
}

console.log("question,answer")

for (const entry of Object.entries(lineForms)) {
  console.log(`${infinitive}: ${entry[1]},${extract(lines[referenceLine + parseInt(entry[0])])}`)
}
