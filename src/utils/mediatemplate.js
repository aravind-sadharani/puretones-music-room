import {css} from "styled-components"

const sizes = {
  desktop: 1200,
  tablet: 900,
  phone: 600
}

const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${sizes[label] / 16}em) {
      ${css(...args)}
    }
  `
  return acc
}, {})

const dark = (...args) => css`
  @media (prefers-color-scheme: dark) {
    ${css(...args)}
  }
`

export { media, dark }