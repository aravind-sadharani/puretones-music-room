import * as React from 'react'
import { Buffer } from 'buffer'
import { Link } from 'gatsby'
import styled from 'styled-components'
import DronePlayer from 'applets/droneplayer'
import ScalePlayer from 'applets/scaleplayer'
import MotifPlayer from 'applets/motifplayer'
import Brand from 'components/brand'
import Zlib from 'react-zlib-js'

const PureTonesEmbedContainer = styled.div`
    position: relative;
    left: -12px;
    width: calc(100% + 24px);
    padding: 12px 12px 0 12px;
    margin: 0 0 1em 0;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    border-radius: 5px;
`

const dronePRTBase64 = `MCAvcHVyZXRvbmVzL1ppdGFfTGlnaHQvRHJ5L1dldF9NaXgKMCAvcHVyZXRvbmVzL1ppdGFfTGlnaHQvTGV2ZWwKMyAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvQ29tbW9uX0ZyZXF1ZW5jeQowIC9wdXJldG9uZXMvUHVyZVRvbmVzX3YxLjAvMHgwMC9PY3RhdmVfU2VsZWN0b3IKMCAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvRmluZV9UdW5lCjcgL3B1cmV0b25lcy9QdXJlVG9uZXNfdjEuMC8weDAwL1BlcmlvZAo1IC9wdXJldG9uZXMvUHVyZVRvbmVzX3YxLjAvMHgwMC8xc3RfU3RyaW5nL1NlbGVjdF9Ob3RlCjAgL3B1cmV0b25lcy9QdXJlVG9uZXNfdjEuMC8weDAwLzFzdF9TdHJpbmcvUGxheV9TdHJpbmcvT25jZQoxIC9wdXJldG9uZXMvUHVyZVRvbmVzX3YxLjAvMHgwMC8xc3RfU3RyaW5nL1BsYXlfU3RyaW5nL0xvb3AKMCAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvMXN0X1N0cmluZy9GaW5lX1R1bmUKMCAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvMXN0X1N0cmluZy9VbHRyYWZpbmVfVHVuZQo1IC9wdXJldG9uZXMvUHVyZVRvbmVzX3YxLjAvMHgwMC8xc3RfU3RyaW5nL1ZhcmlhbmNlCjAgL3B1cmV0b25lcy9QdXJlVG9uZXNfdjEuMC8weDAwLzFzdF9TdHJpbmcvR2Fpbgo1LjYgL3B1cmV0b25lcy9QdXJlVG9uZXNfdjEuMC8weDAwLzFzdF9TdHJpbmcvT2N0YXZlXzEKNy44IC9wdXJldG9uZXMvUHVyZVRvbmVzX3YxLjAvMHgwMC8xc3RfU3RyaW5nL09jdGF2ZV8yCjUuNiAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvMXN0X1N0cmluZy9PY3RhdmVfMwoxLjAgL3B1cmV0b25lcy9QdXJlVG9uZXNfdjEuMC8weDAwLzFzdF9TdHJpbmcvT2N0YXZlXzQKMC40IC9wdXJldG9uZXMvUHVyZVRvbmVzX3YxLjAvMHgwMC8xc3RfU3RyaW5nL09jdGF2ZV81CjAuMiAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvMXN0X1N0cmluZy9PY3RhdmVfNgowIC9wdXJldG9uZXMvUHVyZVRvbmVzX3YxLjAvMHgwMC8ybmRfU3RyaW5nL1NlbGVjdF9Ob3RlCjAgL3B1cmV0b25lcy9QdXJlVG9uZXNfdjEuMC8weDAwLzJuZF9TdHJpbmcvUGxheV9TdHJpbmcvT25jZQoxIC9wdXJldG9uZXMvUHVyZVRvbmVzX3YxLjAvMHgwMC8ybmRfU3RyaW5nL1BsYXlfU3RyaW5nL0xvb3AKMCAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvMm5kX1N0cmluZy9GaW5lX1R1bmUKMCAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvMm5kX1N0cmluZy9VbHRyYWZpbmVfVHVuZQo1IC9wdXJldG9uZXMvUHVyZVRvbmVzX3YxLjAvMHgwMC8ybmRfU3RyaW5nL1ZhcmlhbmNlCjAgL3B1cmV0b25lcy9QdXJlVG9uZXNfdjEuMC8weDAwLzJuZF9TdHJpbmcvR2Fpbgo1LjYgL3B1cmV0b25lcy9QdXJlVG9uZXNfdjEuMC8weDAwLzJuZF9TdHJpbmcvT2N0YXZlXzEKNy44IC9wdXJldG9uZXMvUHVyZVRvbmVzX3YxLjAvMHgwMC8ybmRfU3RyaW5nL09jdGF2ZV8yCjUuNiAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvMm5kX1N0cmluZy9PY3RhdmVfMwoxLjAgL3B1cmV0b25lcy9QdXJlVG9uZXNfdjEuMC8weDAwLzJuZF9TdHJpbmcvT2N0YXZlXzQKMC40IC9wdXJldG9uZXMvUHVyZVRvbmVzX3YxLjAvMHgwMC8ybmRfU3RyaW5nL09jdGF2ZV81CjAuMiAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvMm5kX1N0cmluZy9PY3RhdmVfNgoxMiAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvM3JkX1N0cmluZy9TZWxlY3RfTm90ZQowIC9wdXJldG9uZXMvUHVyZVRvbmVzX3YxLjAvMHgwMC8zcmRfU3RyaW5nL1BsYXlfU3RyaW5nL09uY2UKMSAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvM3JkX1N0cmluZy9QbGF5X1N0cmluZy9Mb29wCjAgL3B1cmV0b25lcy9QdXJlVG9uZXNfdjEuMC8weDAwLzNyZF9TdHJpbmcvRmluZV9UdW5lCjAgL3B1cmV0b25lcy9QdXJlVG9uZXNfdjEuMC8weDAwLzNyZF9TdHJpbmcvVWx0cmFmaW5lX1R1bmUKNSAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvM3JkX1N0cmluZy9WYXJpYW5jZQowIC9wdXJldG9uZXMvUHVyZVRvbmVzX3YxLjAvMHgwMC8zcmRfU3RyaW5nL0dhaW4KNS42IC9wdXJldG9uZXMvUHVyZVRvbmVzX3YxLjAvMHgwMC8zcmRfU3RyaW5nL09jdGF2ZV8xCjcuOCAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvM3JkX1N0cmluZy9PY3RhdmVfMgo1LjYgL3B1cmV0b25lcy9QdXJlVG9uZXNfdjEuMC8weDAwLzNyZF9TdHJpbmcvT2N0YXZlXzMKMS4wIC9wdXJldG9uZXMvUHVyZVRvbmVzX3YxLjAvMHgwMC8zcmRfU3RyaW5nL09jdGF2ZV80CjAuNCAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvM3JkX1N0cmluZy9PY3RhdmVfNQowLjIgL3B1cmV0b25lcy9QdXJlVG9uZXNfdjEuMC8weDAwLzNyZF9TdHJpbmcvT2N0YXZlXzYKNSAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvNHRoX1N0cmluZy9TZWxlY3RfTm90ZQowIC9wdXJldG9uZXMvUHVyZVRvbmVzX3YxLjAvMHgwMC80dGhfU3RyaW5nL1BsYXlfU3RyaW5nL09uY2UKMSAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvNHRoX1N0cmluZy9QbGF5X1N0cmluZy9Mb29wCjAgL3B1cmV0b25lcy9QdXJlVG9uZXNfdjEuMC8weDAwLzR0aF9TdHJpbmcvRmluZV9UdW5lCjAgL3B1cmV0b25lcy9QdXJlVG9uZXNfdjEuMC8weDAwLzR0aF9TdHJpbmcvVWx0cmFmaW5lX1R1bmUKNSAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvNHRoX1N0cmluZy9WYXJpYW5jZQowIC9wdXJldG9uZXMvUHVyZVRvbmVzX3YxLjAvMHgwMC80dGhfU3RyaW5nL0dhaW4KNS42IC9wdXJldG9uZXMvUHVyZVRvbmVzX3YxLjAvMHgwMC80dGhfU3RyaW5nL09jdGF2ZV8xCjcuOCAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvNHRoX1N0cmluZy9PY3RhdmVfMgo1LjYgL3B1cmV0b25lcy9QdXJlVG9uZXNfdjEuMC8weDAwLzR0aF9TdHJpbmcvT2N0YXZlXzMKMS4wIC9wdXJldG9uZXMvUHVyZVRvbmVzX3YxLjAvMHgwMC80dGhfU3RyaW5nL09jdGF2ZV80CjAuNCAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvNHRoX1N0cmluZy9PY3RhdmVfNQowLjIgL3B1cmV0b25lcy9QdXJlVG9uZXNfdjEuMC8weDAwLzR0aF9TdHJpbmcvT2N0YXZlXzYKMCAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvNXRoX1N0cmluZy9TZWxlY3RfTm90ZQowIC9wdXJldG9uZXMvUHVyZVRvbmVzX3YxLjAvMHgwMC81dGhfU3RyaW5nL1BsYXlfU3RyaW5nL09uY2UKMSAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvNXRoX1N0cmluZy9QbGF5X1N0cmluZy9Mb29wCjAgL3B1cmV0b25lcy9QdXJlVG9uZXNfdjEuMC8weDAwLzV0aF9TdHJpbmcvRmluZV9UdW5lCjAgL3B1cmV0b25lcy9QdXJlVG9uZXNfdjEuMC8weDAwLzV0aF9TdHJpbmcvVWx0cmFmaW5lX1R1bmUKNSAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvNXRoX1N0cmluZy9WYXJpYW5jZQowIC9wdXJldG9uZXMvUHVyZVRvbmVzX3YxLjAvMHgwMC81dGhfU3RyaW5nL0dhaW4KNS42IC9wdXJldG9uZXMvUHVyZVRvbmVzX3YxLjAvMHgwMC81dGhfU3RyaW5nL09jdGF2ZV8xCjcuOCAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvNXRoX1N0cmluZy9PY3RhdmVfMgo1LjYgL3B1cmV0b25lcy9QdXJlVG9uZXNfdjEuMC8weDAwLzV0aF9TdHJpbmcvT2N0YXZlXzMKMS4wIC9wdXJldG9uZXMvUHVyZVRvbmVzX3YxLjAvMHgwMC81dGhfU3RyaW5nL09jdGF2ZV80CjAuNCAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvNXRoX1N0cmluZy9PY3RhdmVfNQowLjIgL3B1cmV0b25lcy9QdXJlVG9uZXNfdjEuMC8weDAwLzV0aF9TdHJpbmcvT2N0YXZlXzYKMTIgL3B1cmV0b25lcy9QdXJlVG9uZXNfdjEuMC8weDAwLzZ0aF9TdHJpbmcvU2VsZWN0X05vdGUKMCAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvNnRoX1N0cmluZy9QbGF5X1N0cmluZy9PbmNlCjEgL3B1cmV0b25lcy9QdXJlVG9uZXNfdjEuMC8weDAwLzZ0aF9TdHJpbmcvUGxheV9TdHJpbmcvTG9vcAowIC9wdXJldG9uZXMvUHVyZVRvbmVzX3YxLjAvMHgwMC82dGhfU3RyaW5nL0ZpbmVfVHVuZQowIC9wdXJldG9uZXMvUHVyZVRvbmVzX3YxLjAvMHgwMC82dGhfU3RyaW5nL1VsdHJhZmluZV9UdW5lCjUgL3B1cmV0b25lcy9QdXJlVG9uZXNfdjEuMC8weDAwLzZ0aF9TdHJpbmcvVmFyaWFuY2UKMCAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvNnRoX1N0cmluZy9HYWluCjUuNiAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvNnRoX1N0cmluZy9PY3RhdmVfMQo3LjggL3B1cmV0b25lcy9QdXJlVG9uZXNfdjEuMC8weDAwLzZ0aF9TdHJpbmcvT2N0YXZlXzIKNS42IC9wdXJldG9uZXMvUHVyZVRvbmVzX3YxLjAvMHgwMC82dGhfU3RyaW5nL09jdGF2ZV8zCjEuMCAvcHVyZXRvbmVzL1B1cmVUb25lc192MS4wLzB4MDAvNnRoX1N0cmluZy9PY3RhdmVfNAowLjQgL3B1cmV0b25lcy9QdXJlVG9uZXNfdjEuMC8weDAwLzZ0aF9TdHJpbmcvT2N0YXZlXzUKMC4yIC9wdXJldG9uZXMvUHVyZVRvbmVzX3YxLjAvMHgwMC82dGhfU3RyaW5nL09jdGF2ZV82Cg==`

const scalePKBBase64=`MCAvbXVzaWNzY2FsZS9Db21tb25fUGFyYW1ldGVycy8xMl9Ob3RlX1NjYWxlL1NhL0NlbnQKMCAvbXVzaWNzY2FsZS9Db21tb25fUGFyYW1ldGVycy8xMl9Ob3RlX1NjYWxlL1NhLzAuMDFfQ2VudAowIC9tdXNpY3NjYWxlL0NvbW1vbl9QYXJhbWV0ZXJzLzEyX05vdGVfU2NhbGUvUmUvQ2VudAowIC9tdXNpY3NjYWxlL0NvbW1vbl9QYXJhbWV0ZXJzLzEyX05vdGVfU2NhbGUvUmUvMC4wMV9DZW50CjAgL211c2ljc2NhbGUvQ29tbW9uX1BhcmFtZXRlcnMvMTJfTm90ZV9TY2FsZS9nYS9DZW50CjAgL211c2ljc2NhbGUvQ29tbW9uX1BhcmFtZXRlcnMvMTJfTm90ZV9TY2FsZS9nYS8wLjAxX0NlbnQKMCAvbXVzaWNzY2FsZS9Db21tb25fUGFyYW1ldGVycy8xMl9Ob3RlX1NjYWxlL21hL0NlbnQKMCAvbXVzaWNzY2FsZS9Db21tb25fUGFyYW1ldGVycy8xMl9Ob3RlX1NjYWxlL21hLzAuMDFfQ2VudAowIC9tdXNpY3NjYWxlL0NvbW1vbl9QYXJhbWV0ZXJzLzEyX05vdGVfU2NhbGUvUGEvQ2VudAowIC9tdXNpY3NjYWxlL0NvbW1vbl9QYXJhbWV0ZXJzLzEyX05vdGVfU2NhbGUvUGEvMC4wMV9DZW50CjAgL211c2ljc2NhbGUvQ29tbW9uX1BhcmFtZXRlcnMvMTJfTm90ZV9TY2FsZS9EaGEvQ2VudAowIC9tdXNpY3NjYWxlL0NvbW1vbl9QYXJhbWV0ZXJzLzEyX05vdGVfU2NhbGUvRGhhLzAuMDFfQ2VudAowIC9tdXNpY3NjYWxlL0NvbW1vbl9QYXJhbWV0ZXJzLzEyX05vdGVfU2NhbGUvbmkvQ2VudAowIC9tdXNpY3NjYWxlL0NvbW1vbl9QYXJhbWV0ZXJzLzEyX05vdGVfU2NhbGUvbmkvMC4wMV9DZW50Cg==`

const sriragamMotif = `Pa . Dha^ . ni(G)(Dha,ni,-5,0.5)^ . ni . Pa
ma . Re(G)(0,-21.51,10,3.5) ga ; Re .
Sa Re(G)(0,-21.51,10,1.5) . ga ; Re . ni' .
Pa' Dha'(G)(0,-21.51,10,1.5) . ni' ; Pa' . ni' ;`

const sriragamMotifBase64 = Buffer.from(sriragamMotif).toString('base64')

/*const samaGanaPKB = `0 /musicscale/Common_Parameters/12_Note_Scale/Sa/Cent
0 /musicscale/Common_Parameters/12_Note_Scale/Sa/0.01_Cent
0 /musicscale/Common_Parameters/12_Note_Scale/Re/Cent
0 /musicscale/Common_Parameters/12_Note_Scale/Re/0.01_Cent
0 /musicscale/Common_Parameters/12_Note_Scale/ga/Cent
0 /musicscale/Common_Parameters/12_Note_Scale/ga/0.01_Cent
0 /musicscale/Common_Parameters/12_Note_Scale/ma/Cent
0 /musicscale/Common_Parameters/12_Note_Scale/ma/0.01_Cent
0 /musicscale/Common_Parameters/12_Note_Scale/Pa/Cent
0 /musicscale/Common_Parameters/12_Note_Scale/Pa/0.01_Cent
0 /musicscale/Common_Parameters/12_Note_Scale/Dha/Cent
0 /musicscale/Common_Parameters/12_Note_Scale/Dha/0.01_Cent
0 /musicscale/Common_Parameters/12_Note_Scale/ni/Cent
0 /musicscale/Common_Parameters/12_Note_Scale/ni/0.01_Cent
`

const defaultPRT = `0 /puretones/Zita_Light/Dry/Wet_Mix
0 /puretones/Zita_Light/Level
3 /puretones/PureTones_v1.0/0x00/Common_Frequency
0 /puretones/PureTones_v1.0/0x00/Octave_Selector
0 /puretones/PureTones_v1.0/0x00/Fine_Tune
7 /puretones/PureTones_v1.0/0x00/Period
5 /puretones/PureTones_v1.0/0x00/1st_String/Select_Note
0 /puretones/PureTones_v1.0/0x00/1st_String/Play_String/Once
1 /puretones/PureTones_v1.0/0x00/1st_String/Play_String/Loop
0 /puretones/PureTones_v1.0/0x00/1st_String/Fine_Tune
0 /puretones/PureTones_v1.0/0x00/1st_String/Ultrafine_Tune
5 /puretones/PureTones_v1.0/0x00/1st_String/Variance
0 /puretones/PureTones_v1.0/0x00/1st_String/Gain
5.6 /puretones/PureTones_v1.0/0x00/1st_String/Octave_1
7.8 /puretones/PureTones_v1.0/0x00/1st_String/Octave_2
5.6 /puretones/PureTones_v1.0/0x00/1st_String/Octave_3
1.0 /puretones/PureTones_v1.0/0x00/1st_String/Octave_4
0.4 /puretones/PureTones_v1.0/0x00/1st_String/Octave_5
0.2 /puretones/PureTones_v1.0/0x00/1st_String/Octave_6
0 /puretones/PureTones_v1.0/0x00/2nd_String/Select_Note
0 /puretones/PureTones_v1.0/0x00/2nd_String/Play_String/Once
1 /puretones/PureTones_v1.0/0x00/2nd_String/Play_String/Loop
0 /puretones/PureTones_v1.0/0x00/2nd_String/Fine_Tune
0 /puretones/PureTones_v1.0/0x00/2nd_String/Ultrafine_Tune
5 /puretones/PureTones_v1.0/0x00/2nd_String/Variance
0 /puretones/PureTones_v1.0/0x00/2nd_String/Gain
5.6 /puretones/PureTones_v1.0/0x00/2nd_String/Octave_1
7.8 /puretones/PureTones_v1.0/0x00/2nd_String/Octave_2
5.6 /puretones/PureTones_v1.0/0x00/2nd_String/Octave_3
1.0 /puretones/PureTones_v1.0/0x00/2nd_String/Octave_4
0.4 /puretones/PureTones_v1.0/0x00/2nd_String/Octave_5
0.2 /puretones/PureTones_v1.0/0x00/2nd_String/Octave_6
12 /puretones/PureTones_v1.0/0x00/3rd_String/Select_Note
0 /puretones/PureTones_v1.0/0x00/3rd_String/Play_String/Once
1 /puretones/PureTones_v1.0/0x00/3rd_String/Play_String/Loop
0 /puretones/PureTones_v1.0/0x00/3rd_String/Fine_Tune
0 /puretones/PureTones_v1.0/0x00/3rd_String/Ultrafine_Tune
5 /puretones/PureTones_v1.0/0x00/3rd_String/Variance
0 /puretones/PureTones_v1.0/0x00/3rd_String/Gain
5.6 /puretones/PureTones_v1.0/0x00/3rd_String/Octave_1
7.8 /puretones/PureTones_v1.0/0x00/3rd_String/Octave_2
5.6 /puretones/PureTones_v1.0/0x00/3rd_String/Octave_3
1.0 /puretones/PureTones_v1.0/0x00/3rd_String/Octave_4
0.4 /puretones/PureTones_v1.0/0x00/3rd_String/Octave_5
0.2 /puretones/PureTones_v1.0/0x00/3rd_String/Octave_6
5 /puretones/PureTones_v1.0/0x00/4th_String/Select_Note
0 /puretones/PureTones_v1.0/0x00/4th_String/Play_String/Once
1 /puretones/PureTones_v1.0/0x00/4th_String/Play_String/Loop
0 /puretones/PureTones_v1.0/0x00/4th_String/Fine_Tune
0 /puretones/PureTones_v1.0/0x00/4th_String/Ultrafine_Tune
5 /puretones/PureTones_v1.0/0x00/4th_String/Variance
0 /puretones/PureTones_v1.0/0x00/4th_String/Gain
5.6 /puretones/PureTones_v1.0/0x00/4th_String/Octave_1
7.8 /puretones/PureTones_v1.0/0x00/4th_String/Octave_2
5.6 /puretones/PureTones_v1.0/0x00/4th_String/Octave_3
1.0 /puretones/PureTones_v1.0/0x00/4th_String/Octave_4
0.4 /puretones/PureTones_v1.0/0x00/4th_String/Octave_5
0.2 /puretones/PureTones_v1.0/0x00/4th_String/Octave_6
0 /puretones/PureTones_v1.0/0x00/5th_String/Select_Note
0 /puretones/PureTones_v1.0/0x00/5th_String/Play_String/Once
1 /puretones/PureTones_v1.0/0x00/5th_String/Play_String/Loop
0 /puretones/PureTones_v1.0/0x00/5th_String/Fine_Tune
0 /puretones/PureTones_v1.0/0x00/5th_String/Ultrafine_Tune
5 /puretones/PureTones_v1.0/0x00/5th_String/Variance
0 /puretones/PureTones_v1.0/0x00/5th_String/Gain
5.6 /puretones/PureTones_v1.0/0x00/5th_String/Octave_1
7.8 /puretones/PureTones_v1.0/0x00/5th_String/Octave_2
5.6 /puretones/PureTones_v1.0/0x00/5th_String/Octave_3
1.0 /puretones/PureTones_v1.0/0x00/5th_String/Octave_4
0.4 /puretones/PureTones_v1.0/0x00/5th_String/Octave_5
0.2 /puretones/PureTones_v1.0/0x00/5th_String/Octave_6
12 /puretones/PureTones_v1.0/0x00/6th_String/Select_Note
0 /puretones/PureTones_v1.0/0x00/6th_String/Play_String/Once
1 /puretones/PureTones_v1.0/0x00/6th_String/Play_String/Loop
0 /puretones/PureTones_v1.0/0x00/6th_String/Fine_Tune
0 /puretones/PureTones_v1.0/0x00/6th_String/Ultrafine_Tune
5 /puretones/PureTones_v1.0/0x00/6th_String/Variance
0 /puretones/PureTones_v1.0/0x00/6th_String/Gain
5.6 /puretones/PureTones_v1.0/0x00/6th_String/Octave_1
7.8 /puretones/PureTones_v1.0/0x00/6th_String/Octave_2
5.6 /puretones/PureTones_v1.0/0x00/6th_String/Octave_3
1.0 /puretones/PureTones_v1.0/0x00/6th_String/Octave_4
0.4 /puretones/PureTones_v1.0/0x00/6th_String/Octave_5
0.2 /puretones/PureTones_v1.0/0x00/6th_String/Octave_6
`*/

const dronePRTzipBase64 = `eJyl1l1PwjAUxvH7fgo/wV6AFu81eINCAmrizbJAhSWjw1IIfHsxvh1zXPacctek/a1b979odpVu996Gxtld+lKFshhXq3VIb/0pfbahuK+OKmtZM7YHW6s+nZ2eR/OPUXHIkyzNjlmW3jSbTeOKkbdve+sWp7/P+09MFqE82GJma7sIje8Go8rZYr53Vg27lk6tr5ql0l3r8l0oZsFXbpV+vkfx0ATb/SrETevy9D2euIVVeSQeN81WtPPveUjUYx18+fpDJUf0VPqq/PhEyX53ZeWUToyAfJWRq2FyLWe9uN366jwpZwOVJQM502fWkzPTffQ9t4xKmjh50i0YS5pgQdJESZMmFE+aIDRpQiRJcwYlzRmUNGdQ0pxBSXNmVN6p+j6uaeLkTbdgrGmCBU0TJW2aULxpgtCmCZE0zRnUNGdQ05xBTXMGNc2Z6f5fg7COSpo4edItGEuaYEHSREmTJhRPmiA0aUIkSXMGJc0ZlDRnUNKcQUlzBtw8dGTS+pKkWzCWtI5KWscnrWOS1vKkdVzSnEFJcwYlzRmUNGdQ0pwhNw8T2bS5pOkWjDVtopo28U2bmKaNvGkT1zRnUNOcQU1zBjXNGdQ0Z0a9A34HIg4=`

const PureTonesEmbed = ({location}) => {
    const queryParameters = new URLSearchParams(location.search)
    const appname = queryParameters.get('appname')
    const title = queryParameters.get('title')
    const settings = queryParameters.get('settings')

    if(appname === null) {
        console.log(dronePRTBase64.length,dronePRTzipBase64.length)
        const dronePRTzip = Buffer.from(dronePRTzipBase64, 'base64')
        const dronePRT = Buffer.from(dronePRTBase64, 'base64').toString('ascii')
        Zlib.inflate(dronePRTzip, (err,buffer) => {
            if(err) {
                console.error(err)
            }
            console.log(dronePRT === buffer.toString('ascii'))
        })
        return (
            <PureTonesEmbedContainer>
                <p><Link to={`?appname=drone&title=Default%20Drone&settings=${dronePRTBase64}`}>Drone Demo</Link></p>
                <p><Link to={`?appname=scale&title=Sama-Gana%20Scale&settings=${scalePKBBase64}`}>Scale Demo</Link></p>
                <p><Link to={`?appname=sequencer&title=Sriragam&motif=${sriragamMotifBase64}&settings=${scalePKBBase64}`}>Sequencer Demo</Link></p>
            </PureTonesEmbedContainer>
        )
    }
    
    if(appname === 'drone') {
        let droneSettings
        if(settings !== null) {
            droneSettings = Buffer.from(settings, 'base64').toString('ascii')   
        }
        return (
            <PureTonesEmbedContainer>
                <DronePlayer title={title} settings={droneSettings}></DronePlayer>
                <Brand />
            </PureTonesEmbedContainer>
        )
    }

    if(appname === 'scale') {
        let scale,notespec
        if(settings !== null) {
            scale = Buffer.from(settings, 'base64').toString('ascii')
            const noteLabel = note => scale.includes(note) ? note : 'fade'
            notespec = [
                {white: "Sa", black: `${noteLabel('re')}`},
                {white: `${noteLabel('Re')}`, black: `${noteLabel('ga')}`},
                {white: `${noteLabel('Ga')}`},
                {white: `${noteLabel('ma')}`, black: `${noteLabel('Ma')}`},
                {white: `${noteLabel('Pa')}`, black: `${noteLabel('dha')}`},
                {white: `${noteLabel('Dha')}`, black: `${noteLabel('ni')}`},
                {white: `${noteLabel('Ni')}`},
                {white: "SA"}
            ]
        }
        return (
            <PureTonesEmbedContainer>
                <ScalePlayer title={title} noteSpec={notespec} scale={scale} embed ></ScalePlayer>
                <Brand />
            </PureTonesEmbedContainer>
        )
    }

    if(appname === 'sequencer') {
        let scale,motif,tempo
        if(settings !== null) {
            scale = Buffer.from(settings, 'base64').toString('ascii')
            motif = Buffer.from(queryParameters.get('motif'), 'base64').toString('ascii')
            tempo = queryParameters.get('tempo')
        }
        return (
            <PureTonesEmbedContainer>
                <MotifPlayer title={title} motif={motif} scale={scale} tempo={tempo}></MotifPlayer>
                <Brand />
            </PureTonesEmbedContainer>
        )
    }
}

export default PureTonesEmbed