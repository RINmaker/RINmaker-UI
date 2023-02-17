

export default function SvgNodeDegree() {
    return (
        <svg width="285" height="80">
            <g className="lgnode" transform="translate(5, 10)">
                <circle r="4" x="10px" fill="#2EC448" style={{strokeWidth: "0px", stroke: "black"}}></circle>
                <text fontSize="10" y="5px" x="10px" fill="#16181A">1</text>
            </g>
            <g className="lgnode" transform="translate(65, 10)">
                <circle r="4" x="10px" fill="#9F8B00" style={{strokeWidth: "0px", stroke: "black"}}></circle>
                <text fontSize="10" y="5px" x="10px" fill="#16181A">15</text>
            </g>
            <g className="lgnode" transform="translate(125, 10)">
                <circle r="4" x="10px" fill="#C32222" style={{strokeWidth: "0px", stroke: "black"}}></circle>
                <text fontSize="10" y="5px" x="10px" fill="#16181A">30</text>
            </g>
            <g className="lgnode" transform="translate(182, 10)">
                <circle r="4" x="10px" fill="#1F77B4" style={{strokeWidth: "0px", stroke: "black"}}></circle>
                <text fontSize="10" y="5px" x="10px" fill="#16181A">Over 30</text>
            </g>
        </svg>
    );
}