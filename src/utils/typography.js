import Typography from "typography"
import "@fontsource/noto-sans/400.css"
import "@fontsource/noto-sans/400-italic.css"
import "@fontsource/noto-sans/700.css"
import "@fontsource/noto-sans/700-italic.css"
import "@fontsource/roboto-mono/400.css"

const typography = new Typography({
  baseFontSize: "16px",
  baseLineHeight: 1.666,
  headerFontFamily: [
    "Noto Sans",
    "sans-serif"
  ],
  bodyFontFamily: [
    "Noto Sans",
    "sans-serif"
  ],
  omitGoogleFonts: true,
  overrideStyles: () => ({
    code: {
      fontFamily: ['Roboto Mono', 'monospace'].join(','),
    },
    textarea: {
      fontFamily: ['Roboto Mono', 'monospace'].join(','),
    },
  })
})

export default typography