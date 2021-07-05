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
  ],
})

export default typography