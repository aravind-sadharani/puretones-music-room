import Typography from "typography"

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