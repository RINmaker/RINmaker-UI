

export default function SvgNodeChain() {
    return (
        <svg width="285" height="35">
            <g className="lgnode" transform="translate(5, 10)">
                <circle r="4" x="10px" fill="#1F77B4" style={{strokeWidth: "0px", stroke: "black"}}>  </circle>
                <text fontSize="10" y="5px" x="10px" fill="#16181A">A</text>
            </g>
            <g className="lgnode" transform="translate(65, 10)">
                <circle r="4" x="10px" fill="#FF7F0E" style={{strokeWidth: "0px", stroke: "black"}}></circle>
                <text fontSize="10" y="5px" x="10px" fill="#16181A">B</text>
            </g>
            <g className="lgnode" transform="translate(125, 10)">
                <circle r="4" x="10px" fill="#2CA02C" style={{strokeWidth: "0px", stroke: "black"}}></circle>
                <text fontSize="10" y="5px" x="10px" fill="#16181A">C</text>
            </g>
            <g className="lgnode" transform="translate(185, 10)">
                <circle r="4" x="10px" fill="#D62728" style={{strokeWidth: "0px", stroke: "black"}}></circle>
                <text fontSize="10" y="5px" x="10px" fill="#16181A">D</text>
            </g>
            <g className="lgnode" transform="translate(245, 10)">
                <circle r="4" x="10px" fill="#B594CD" style={{strokeWidth: "0px", stroke: "black"}}></circle>
                <text fontSize="10" y="5px" x="10px" fill="#16181A">E</text>
            </g>
            <g className="lgnode" transform="translate(5, 25)">
                <circle r="4" x="10px" fill="#8C564B" style={{strokeWidth: "0px", stroke: "black"}}></circle>
                <text fontSize="10" y="5px" x="10px" fill="#16181A">F</text>
            </g>
            <g className="lgnode" transform="translate(65, 25)">
                <circle r="4" x="10px" fill="#E377C2" style={{strokeWidth: "0px", stroke: "black"}}></circle>
                <text fontSize="10" y="5px" x="10px" fill="#16181A">G</text>
            </g>
        </svg>
    );
}