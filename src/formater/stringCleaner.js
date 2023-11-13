export default function stringCleaner(str) {
  let clean = str
  //   clean = clean.replace(clean[0], clean[0].toUpperCase())
  //   console.log(clean)
  for (let i = 0; i < clean.length; i++) {
    if (i == 0) {
      clean = clean.replace(clean[i], clean[i].toUpperCase())
    }
    if (clean[i] == "_") {
      clean = clean.replace(clean[i], " ")
    }
  }
  return clean
}
