

export default function SvgNodePolarity() {
    return (
        <svg width="285" height="20">
            <g className="lgnode" transform="translate(5, 10)">
                <circle r="4" x="10px" fill="#808080" style={{ strokeWidth: "0px", stroke: "black" }}></circle>
                <text fontSize="10" y="5px" x="10px" fill="#16181A">non polar</text>
            </g>
            <g className="lgnode" transform="translate(75, 10)">
                <circle r="4" x="10px" fill="#00BFFF" style={{ strokeWidth: "0px", stroke: "black" }}></circle>
                <text fontSize="10" y="5px" x="10px" fill="#16181A">polar</text>
            </g>
        </svg>
    );
}