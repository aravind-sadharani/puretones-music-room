import * as React from 'react'
import styled from 'styled-components'

const PostGraphicContainer = styled.svg`
    width: 100%;
    height: 56.25%;
    margin-bottom: -7px;
    path {
        stroke: ${({theme}) => theme.light.noticeBackground};
        ${({theme}) => theme.isDark`stroke: ${theme.dark.noticeBackground};`}
    }
    .pen {
        stroke: ${({theme}) => theme.light.linkColor};
        ${({theme}) => theme.isDark`stroke: ${theme.dark.linkColor};`}
    }
    ellipse {
        fill: ${({theme}) => theme.light.noticeBackground};
        ${({theme}) => theme.isDark`fill: ${theme.dark.noticeBackground};`}
    }
    rect {
        width: 100%;
        height: 100%;
        fill: ${({theme}) => theme.light.buttonBackground};
        ${({theme}) => theme.isDark`fill: ${theme.dark.buttonBackground};`}
    }
    text {
        fill: ${({theme}) => theme.light.noticeBackground};
        ${({theme}) => theme.isDark`fill: ${theme.dark.noticeBackground};`}
        font-weight: 700;
        font-size: 1.4em;
    }
`

const PostGraphic = ({title}) => (
    <PostGraphicContainer viewBox="0 0 288 172" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect rx="5" fill="#333366"/>
        <path className="pen" d="M72 126.705L73.0562 125.076L74.2298 123.447L76.3422 120.337L77.3984 118.856L78.572 117.449L79.6282 116.116L80.6844 114.857L81.7406 113.747L82.9142 112.784L83.9704 111.895L85.0266 111.155L86.2002 110.489L87.2564 110.044L88.3126 109.748L89.3688 109.6H90.5424L91.5986 109.748L92.6548 110.044L93.711 110.489L94.8846 111.155L95.9408 111.895L96.997 112.784L98.1706 113.747L99.2268 114.857L100.283 116.116L101.339 117.449L102.513 118.856L103.569 120.337L105.681 123.447L106.855 125.076L108.967 128.334L110.141 129.963L112.253 133.073L113.31 134.554L114.483 135.961L115.539 137.294L116.596 138.553L117.652 139.663L118.825 140.626L119.882 141.514L120.938 142.255L122.111 142.921L123.168 143.366L124.224 143.662L125.28 143.81H126.454L127.51 143.662L128.566 143.366L129.622 142.921L130.796 142.255L131.852 141.514L132.908 140.626L134.082 139.663L135.138 138.553L136.194 137.294L137.25 135.961L138.424 134.554L139.48 133.073L141.593 129.963L142.766 128.334L144.879 125.076L146.052 123.447L148.165 120.337L149.221 118.856L150.394 117.449L151.451 116.116L152.507 114.857L153.563 113.747L154.737 112.784L155.793 111.895L156.849 111.155L158.023 110.489L159.079 110.044L160.135 109.748L161.191 109.6H162.365L163.421 109.748L164.477 110.044L165.533 110.489L166.707 111.155L167.763 111.895L168.819 112.784L169.993 113.747L171.049 114.857L172.105 116.116L173.162 117.449L174.335 118.856L175.391 120.337L177.504 123.447L178.677 125.076L179.734 126.705L181.145 128.524L182.319 130.153L184.431 133.263L185.487 134.744L186.661 136.151L187.717 137.484L188.773 138.743L189.829 139.853L191.003 140.816L192.059 141.705L193.115 142.445L194.289 143.111L195.345 143.556L196.401 143.852L197.458 144H198.631L199.687 143.852L200.744 143.556L201.8 143.111L202.973 142.445L204.03 141.705L205.086 140.816L206.259 139.853L207.316 138.743L208.372 137.484L209.428 136.151L210.602 134.744L211.658 133.263L213.77 130.153L214.944 128.524L216 126.895" stroke="#F76F8E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path className="pen" d="M72 91.7171L72.7047 90.5126L73.4878 89.3081L74.8973 87.0086L75.602 85.9137L76.385 84.8734L77.0898 83.8879L77.7945 82.9572L78.4992 82.136L79.2823 81.4242L79.987 80.7672L80.6918 80.2197L81.4748 79.727L82.1795 79.3985L82.8843 79.1795L83.589 79.07H84.3721L85.0768 79.1795L85.7815 79.3985L86.4863 79.727L87.2693 80.2197L87.974 80.7672L88.6788 81.4242L89.4618 82.136L90.1666 82.9572L90.8713 83.8879L91.576 84.8734L92.3591 85.9137L93.0638 87.0086L94.4733 89.3081L95.2563 90.5126L96.6658 92.9215L97.4488 94.126L98.8583 96.4255L99.5631 97.5205L100.346 98.5607L101.051 99.5462L101.756 100.477L102.46 101.298L103.243 102.01L103.948 102.667L104.653 103.214L105.436 103.707L106.141 104.036L106.845 104.255L107.55 104.364H108.333L109.038 104.255L109.743 104.036L110.447 103.707L111.23 103.214L111.935 102.667L112.64 102.01L113.423 101.298L114.128 100.477L114.832 99.5462L115.537 98.5607L116.32 97.5205L117.025 96.4255L118.434 94.126L119.217 92.9215L120.627 90.5126L121.41 89.3081L122.819 87.0086L123.524 85.9137L124.307 84.8734L125.012 83.8879L125.717 82.9572L126.421 82.136L127.204 81.4242L127.909 80.7672L128.614 80.2197L129.397 79.727L130.102 79.3985L130.806 79.1795L131.511 79.07H132.294L132.999 79.1795L133.704 79.3985L134.408 79.727L135.191 80.2197L135.896 80.7672L136.601 81.4242L137.384 82.136L138.089 82.9572L138.793 83.8879L139.498 84.8734L140.281 85.9137L140.986 87.0086L142.395 89.3081L143.178 90.5126L143.883 91.7171L144.822 93.4274L145.605 94.6319L147.014 96.9314L147.719 98.0264L148.502 99.0666L149.207 100.052L149.911 100.983L150.616 101.804L151.399 102.516L152.104 103.173L152.809 103.72L153.592 104.213L154.296 104.542L155.001 104.761L155.706 104.87H156.489L157.194 104.761L157.898 104.542L158.603 104.213L159.386 103.72L160.091 103.173L160.796 102.516L161.579 101.804L162.283 100.983L162.988 100.052L163.693 99.0666L164.476 98.0264L165.181 96.9314L166.59 94.6319L167.373 93.4274L168.783 91.0185L169.566 89.814L170.975 87.5145L171.68 86.4195L172.463 85.3793L173.168 84.3938L173.872 83.4631L174.577 82.6418L175.36 81.9301L176.065 81.2731L176.77 80.7256L177.553 80.2329L178.257 79.9044L178.962 79.6854L179.667 79.5759H180.45L181.155 79.6854L181.859 79.9044L182.564 80.2329L183.347 80.7256L184.052 81.2731L184.757 81.9301L185.54 82.6418L186.244 83.4631L186.949 84.3938L187.654 85.3793L188.437 86.4195L189.142 87.5145L190.551 89.814L191.334 91.0185L192.744 93.4274L193.527 94.6319L194.936 96.9314L195.641 98.0264L196.424 99.0666L197.129 100.052L197.833 100.983L198.538 101.804L199.321 102.516L200.026 103.173L200.731 103.72L201.514 104.213L202.218 104.542L202.923 104.761L203.628 104.87H204.411L205.116 104.761L205.82 104.542L206.525 104.213L207.308 103.72L208.013 103.173L208.718 102.516L209.501 101.804L210.205 100.983L210.91 100.052L211.615 99.0666L212.398 98.0264L213.103 96.9314L214.512 94.6319L215.295 93.4274L216 92.2229" stroke="#F76F8E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path className="pen" d="M72 66.6L72.5302 65.781L73.1192 64.9619L74.1795 63.3983L74.7097 62.6537L75.2988 61.9463L75.8289 61.2762L76.3591 60.6433L76.8893 60.0848L77.4783 59.6009L78.0085 59.1541L78.5386 58.7818L79.1277 58.4468L79.6579 58.2234L80.188 58.0745L80.7182 58H81.3073L81.8374 58.0745L82.3676 58.2234L82.8977 58.4468L83.4868 58.7818L84.017 59.1541L84.5471 59.6009L85.1362 60.0848L85.6664 60.6433L86.1965 61.2762L86.7267 61.9463L87.3157 62.6537L87.8459 63.3983L88.9062 64.9619L89.4953 65.781L90.5556 67.419L91.1447 68.2381L92.205 69.8017L92.7352 70.5463L93.3242 71.2537L93.8544 71.9238L94.3846 72.5567L94.9147 73.1152L95.5038 73.5991L96.0339 74.0459L96.5641 74.4182L97.1532 74.7532L97.6833 74.9766L98.2135 75.1255L98.7437 75.2H99.3327L99.8629 75.1255L100.393 74.9766L100.923 74.7532L101.512 74.4182L102.042 74.0459L102.573 73.5991L103.162 73.1152L103.692 72.5567L104.222 71.9238L104.752 71.2537L105.341 70.5463L105.871 69.8017L106.932 68.2381L107.521 67.419L108.581 65.781L109.17 64.9619L110.23 63.3983L110.761 62.6537L111.35 61.9463L111.88 61.2762L112.41 60.6433L112.94 60.0848L113.529 59.6009L114.059 59.1541L114.59 58.7818L115.179 58.4468L115.709 58.2234L116.239 58.0745L116.769 58H117.358L117.888 58.0745L118.419 58.2234L118.949 58.4468L119.538 58.7818L120.068 59.1541L120.598 59.6009L121.187 60.0848L121.717 60.6433L122.247 61.2762L122.778 61.9463L123.367 62.6537L123.897 63.3983L124.957 64.9619L125.546 65.781L126.076 66.6L126.505 67.419L127.094 68.2381L128.154 69.8017L128.684 70.5463L129.273 71.2537L129.803 71.9238L130.334 72.5567L130.864 73.1152L131.453 73.5991L131.983 74.0459L132.513 74.4182L133.102 74.7532L133.632 74.9766L134.163 75.1255L134.693 75.2H135.282L135.812 75.1255L136.342 74.9766L136.872 74.7532L137.461 74.4182L137.992 74.0459L138.522 73.5991L139.111 73.1152L139.641 72.5567L140.171 71.9238L140.701 71.2537L141.29 70.5463L141.82 69.8017L142.881 68.2381L143.47 67.419L144.53 65.781L145.119 64.9619L146.18 63.3983L146.71 62.6537L147.299 61.9463L147.829 61.2762L148.359 60.6433L148.889 60.0848L149.478 59.6009L150.008 59.1541L150.539 58.7818L151.128 58.4468L151.658 58.2234L152.188 58.0745L152.718 58H153.307L153.837 58.0745L154.368 58.2234L154.898 58.4468L155.487 58.7818L156.017 59.1541L156.547 59.6009L157.136 60.0848L157.666 60.6433L158.197 61.2762L158.727 61.9463L159.316 62.6537L159.846 63.3983L160.906 64.9619L161.495 65.781L162.556 67.419L163.145 68.2381L164.205 69.8017L164.735 70.5463L165.324 71.2537L165.854 71.9238L166.385 72.5567L166.915 73.1152L167.504 73.5991L168.034 74.0459L168.564 74.4182L169.153 74.7532L169.683 74.9766L170.213 75.1255L170.744 75.2H171.333L171.863 75.1255L172.393 74.9766L172.923 74.7532L173.512 74.4182L174.042 74.0459L174.573 73.5991L175.162 73.1152L175.692 72.5567L176.222 71.9238L176.752 71.2537L177.341 70.5463L177.871 69.8017L178.932 68.2381L179.521 67.419L180.051 66.6L180.479 65.781L181.068 64.9619L182.129 63.3983L182.659 62.6537L183.248 61.9463L183.778 61.2762L184.308 60.6433L184.838 60.0848L185.427 59.6009L185.958 59.1541L186.488 58.7818L187.077 58.4468L187.607 58.2234L188.137 58.0745L188.667 58H189.256L189.787 58.0745L190.317 58.2234L190.847 58.4468L191.436 58.7818L191.966 59.1541L192.496 59.6009L193.085 60.0848L193.615 60.6433L194.146 61.2762L194.676 61.9463L195.265 62.6537L195.795 63.3983L196.855 64.9619L197.444 65.781L198.505 67.419L199.094 68.2381L200.154 69.8017L200.684 70.5463L201.273 71.2537L201.803 71.9238L202.334 72.5567L202.864 73.1152L203.453 73.5991L203.983 74.0459L204.513 74.4182L205.102 74.7532L205.632 74.9766L206.163 75.1255L206.693 75.2H207.282L207.812 75.1255L208.342 74.9766L208.872 74.7532L209.461 74.4182L209.992 74.0459L210.522 73.5991L211.111 73.1152L211.641 72.5567L212.171 71.9238L212.701 71.2537L213.29 70.5463L213.82 69.8017L214.881 68.2381L215.47 67.419L216 66.6" stroke="#F76F8E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M219.035 37.4723C219.082 41.3155 219.028 43.1403 218.012 46.358C215.865 51.0565 215.309 53.9193 215.021 59.0712C215.005 59.3666 215.016 59.6661 215.055 59.9593C215.957 66.5959 217.817 69.4212 222.349 73.867" stroke="#F76F8E"/>
        <path d="M219.035 37.4723C221.469 40.4464 223.31 41.5816 226.156 43.3938C230.821 45.6131 233.088 47.4483 236.619 51.2101C236.822 51.4258 237.006 51.6621 237.163 51.913C240.712 57.5859 240.504 61.1636 239.89 67.4826" stroke="#F76F8E"/>
        <path d="M247.979 70.2142C246.714 66.7386 238.902 66.4236 230.664 69.4219C222.426 72.4202 216.644 77.6832 217.909 81.1588" stroke="#F76F8E" strokeWidth="3"/>
        <path d="M217.909 81.1588L231.361 118.12" stroke="#F76F8E" strokeWidth="3"/>
        <path d="M247.979 70.2142L261.432 107.175" stroke="#F76F8E" strokeWidth="3"/>
        <path d="M219.035 37.4723L226.56 58.1456" stroke="#F76F8E"/>
        <ellipse cx="227.358" cy="60.3382" rx="2" ry="3" transform="rotate(-20 227.358 60.3382)" fill="#F76F8E"/>
        <text x="50%" y="40" textAnchor="middle">{title.length > 22 ? `${title.slice(0,14).trim()} ... ${title.slice(title.length-6,title.length).trim()}` : title}</text>
    </PostGraphicContainer>
)

export default PostGraphic