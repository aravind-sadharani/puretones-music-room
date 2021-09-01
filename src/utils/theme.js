import {css} from "styled-components"

const dark = (...args) => css`
  @media (prefers-color-scheme: dark) {
    ${css(...args)}
  }
`

const globalTheme = {
    isDark: dark,
    light: {
        bodyBackground: 'white',
        textColor: '#404047',
        linkColor: '#f76f8e',
        borderColor: '#e6e6eb',
        buttonBackground: '#333366',
        buttonText: 'white',
        noticeBackground: '#ffead0',
        noticeText: '#404047',
        codeBackground: '#e6e6eb',
    },
    dark: {
        bodyBackground: '#404047',
        textColor: '#b8b8bc',
        linkColor: '#f98ca4',
        borderColor: '#66666c',
        buttonBackground: '#5c5c85',
        buttonText: '#e6e6eb',
        noticeBackground: '#ccbba6',
        noticeText: '#404047',
        codeBackground: 'black',
    }
}

export default globalTheme