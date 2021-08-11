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
  googleFonts: [
      {
          name: 'Noto Sans',
          styles: [
              '400',
              '400i',
              '700',
              '700i',
          ],
      },
      {
          name: 'Roboto Mono',
          styles: [
              '400',
          ]
      },
  ],
  overrideStyles: () => ({
    pre: {
      fontFamily: ['Roboto Mono', 'monospace'].join(','),
    },
    textarea: {
      fontFamily: ['Roboto Mono', 'monospace'].join(','),
    },
  })
})

export default typography