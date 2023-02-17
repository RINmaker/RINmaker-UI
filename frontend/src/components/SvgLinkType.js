

export default function SvgLinkType() {
    return (
        <svg width="250" height="50">
            <g className="lgedge" transform="translate(0, 0)">
                <rect height="5" width="20" y="8px" fill="lightskyblue "></rect>
                <text fontSize="10" y="15px" x="23px" fill="#16181A">HBOND</text>
            </g>
            <g className="lgedge" transform="translate(75, 0)">
                <rect height="5" width="20" y="8px" fill="gold"></rect>
                <text fontSize="10" y="15px" x="23px" fill="#16181A">VDW</text>
            </g>
            <g className="lgedge" transform="translate(150, 0)">
                <rect height="5" width="20" y="8px" fill="red"></rect>
                <text fontSize="10" y="15px" x="23px" fill="#16181A">PIPISTACK</text>
            </g>
            <g className="lgedge" transform="translate(0, 15)">
                <rect height="5" width="20" y="8px" fill="blue"></rect>
                <text fontSize="10" y="15px" x="23px" fill="#16181A">IONIC</text>
            </g>
            <g className="lgedge" transform="translate(75, 15)">
                <rect height="5" width="20" y="8px" fill="#FFA07A"></rect>
                <text fontSize="10" y="15px" x="23px" fill="#16181A">HYDROP.</text>
            </g>
            <g className="lgedge" transform="translate(150, 15)">
                <rect height="5" width="20" y="8px" fill="yellowgreen"></rect>
                <text fontSize="10" y="15px" x="23px" fill="#16181A">PICATION</text>
            </g>
            <g className="lgedge" transform="translate(0, 30)">
                <rect height="5" width="20" y="8px" fill="#9C31F9"></rect>
                <text fontSize="10" y="15px" x="23px" fill="#16181A">SSBOND</text>
            </g>
            <g className="lgedge" transform="translate(75, 30)">
                <rect height="5" width="20" y="8px" fill="#615f5f"></rect>
                <text fontSize="10" y="15px" x="23px" fill="#16181A">GENERIC</text>
            </g>
            
        </svg>

    );
}