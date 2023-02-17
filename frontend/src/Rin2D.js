import { Navbar, Text, Button, Spacer, Tooltip, Card } from "@nextui-org/react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import { BsDownload, BsBadge3D } from "react-icons/bs";
import { IoIosStats } from "react-icons/io";
import { AiFillHome } from "react-icons/ai";
import { BiCodeCurly, BiNetworkChart } from "react-icons/bi";
import { TfiPanel } from "react-icons/tfi";
import { Container, Form, Row } from "react-bootstrap";
import { useState, useRef, useLayoutEffect } from "react";

import ForceGraph2D from "react-force-graph-2d";
import ForceGraph3D from "react-force-graph-3d";
import SvgNodeResidue from "./components/SvgNodeResidue";
import SvgNodeChain from "./components/SvgNodeChain";
import SvgNodeDegree from "./components/SvgNodeDegree";
import SvgNodePolarity from "./components/SvgNodePolarity";
import SvgLinkType from "./components/SvgLinkType";
import ModalParams from "./components/ModalParams";
import ModalChart from "./components/ModalChart"


export default function Rin2D() {

    const location = useLocation();
    const navigate = useNavigate();
    const fgRef = useRef();

    const [displayWidth, setDisplayWidth] = useState(window.innerWidth - 400);
    const [displayHeight, setDisplayHeight] = useState(window.innerHeight);

    const [modalParams, setModalParams] = useState(false);
    const [modalChart, setModalChart] = useState(false);

    const [showPanel, setShowPanel] = useState(true);

    const [distValue, setDistValue] = useState(50);
    const [gravityValue, setGravityValue] = useState(-42);

    const [nodeColor, setNodeColor] = useState("col_res");

    const [vanDerWaals, setVanDerWaals] = useState(true);
    const [hbond, setHbond] = useState(true);
    const [pipistack, setPipistack] = useState(true);
    const [ssbond, setSsbond] = useState(true);
    const [ionic, setIonic] = useState(true);
    const [hydrophobic, setHydrophobic] = useState(true);
    const [pication, setPication] = useState(true);
    const [generic, setGeneric] = useState(true);
    const [graphType, setGraphType] = useState(location?.state?.graphType ?? "");


    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    if (location.state === null) {
        return <Navigate to="/" />;
    }


    const graphData = location.state.gData;
    const pdbname = location.state.pdbname;
    const xml = location.state.xml;


    window.addEventListener("resize", () => {

        if (!showPanel) {
            setDisplayWidth(window.innerWidth - 100);
            setDisplayHeight(window.innerHeight);
        } else {
            setDisplayWidth(window.innerWidth - 400);
            setDisplayHeight(window.innerHeight);
        }
    });

    const showControlPanel = (e) => {
        if (e === false) {
            setShowPanel(e);
            setDisplayWidth(window.innerWidth - 100);
        } else {
            setShowPanel(e);
            setDisplayWidth(window.innerWidth - 400);
        }

    }

    const onChangeDistance = (e) => {
        setDistValue(e.target.value);
        fgRef.current.d3Force("link").distance(distValue);
        fgRef.current.d3ReheatSimulation();
    }

    const onChangeGravity = (e) => {
        setGravityValue(e.target.value);
        fgRef.current.d3Force("charge").strength(gravityValue);
        fgRef.current.d3ReheatSimulation();
    }


    const onNodeColorChange = (e) => {
        setNodeColor(e.target.value);

    }

    const downloadXML = () => {
        const url = window.URL.createObjectURL(
            new Blob([xml]),
        );

        const link = document.createElement('a');

        link.href = url;
        link.setAttribute(
            'download',
            `${pdbname}.xml`,
        );

        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    }

    const changeRin = (rin) => {
        setGraphType(rin);
    }

    return (
        <>
            <ModalParams
                log={location.state.log}
                params={location.state.params}
                show={modalParams}
                onHide={() => setModalParams(false)} />

            <ModalChart
                pdbname={pdbname}
                log={location.state.log}
                res_count={[...location.state.res_count]}
                bond_count={[...location.state.bond_count]}
                avg_e_bond={[...location.state.avg_e_bond]}
                avg_dist_bond={[...location.state.avg_dist_bond]}
                hbond_ext_count={[...location.state.hbond_ext_count]}
                num_nodes={location.state.num_nodes}
                num_links={location.state.num_links}
                show={modalChart}
                onHide={() => setModalChart(false)} />


            <div css={{ maxW: "100%", boxSizing: "border-box" }}>

                <Navbar css={{ $$navbarBlurBackgroundColor: "#F1E8FB" }} variant="floating">
                    <Navbar.Brand>
                        <Text
                            h1
                            size={35}
                            css={{
                                p: 10,
                                textGradient: "45deg, $blue600 -20%, $purple600 70%",
                            }}
                            weight="bold"
                        >
                            {pdbname}
                        </Text>
                        <Tooltip placement="bottom" content={"Download XML"}>
                            <Button rounded flat color="secondary" icon={<BsDownload size={19} />} onPress={downloadXML} auto />
                        </Tooltip>
                    </Navbar.Brand>



                    <Navbar.Content activeColor={"secondary"} hideIn="xs" variant="highlight-rounded">


                        {graphType == "2d_rin"
                            ?
                            <Tooltip placement="bottom" content={"3D Vizualization"}>
                                <Button rounded flat color="secondary" icon={<BsBadge3D size={19} />} onPress={() => changeRin("3d_rin")} auto />
                            </Tooltip>
                            :
                            <Tooltip placement="bottom" content={"2D Vizualization"}>
                                <Button rounded flat color="secondary" icon={<BiNetworkChart size={19} />} onPress={() => changeRin("2d_rin")} auto />
                            </Tooltip>
                        }


                        <Spacer x={0.5} />

                        <Tooltip placement="bottom" content={"View Log&Params"}>
                            <Button rounded flat color="secondary" icon={<BiCodeCurly size={19} />} onPress={() => setModalParams(true)} auto />
                        </Tooltip>

                        <Spacer x={0.5} />

                        <Tooltip placement="bottom" content={"Show Stats"}>
                            <Button rounded flat color="secondary" icon={<IoIosStats size={19} />} onPress={() => setModalChart(true)} auto />
                        </Tooltip>

                        <Spacer x={0.5} />


                        <Button onClick={() => navigate("/home")} rounded flat color="secondary" icon={<AiFillHome size={19} />} auto />

                    </Navbar.Content>

                </Navbar>


                <div className="d-flex m-4">

                    {showPanel ?
                        <Card variant="flat" css={{ minWidth: "22rem", maxWidth: "22rem", height: "80vh", background: "#F1E8FB" }}>
                            <Card.Body>

                                <Row className="mx-auto">
                                    <Tooltip className="align-items-center" placement="bottom" content={"Show/hide side panel"}>
                                        <Button rounded flat onClick={() => showControlPanel(!showPanel)} color="secondary" icon={<TfiPanel size={19} />} auto />
                                    </Tooltip>
                                </Row>

                                <br />

                                <Form.Label><p style={{ color: "#9750DD" }}><b>Node colors:</b></p></Form.Label>
                                <Form.Select onChange={onNodeColorChange} value={nodeColor}>
                                    <option value="col_res">Residue</option>
                                    <option value="col_ch">Chain</option>
                                    <option value="col_deg">Degree</option>
                                    <option value="col_pol">Polarity</option>
                                </Form.Select>

                                <hr style={{ color: "#9750DD" }} />

                                <Form.Label><p style={{ color: "#9750DD" }}><b>Gravity:</b></p></Form.Label>
                                <input
                                    type="range"
                                    onChange={onChangeGravity}
                                    min={-150}
                                    max={50}
                                    step={10}
                                    value={gravityValue}
                                />
                                <Form.Text muted>Value: {gravityValue}</Form.Text>
                                <Form.Text muted>Step: 10</Form.Text>

                                <hr style={{ color: "#9750DD" }} />


                                <Form.Label><p style={{ color: "#9750DD" }}><b>Distance:</b></p></Form.Label>
                                <input
                                    type="range"
                                    onChange={onChangeDistance}
                                    min={0}
                                    max={100}
                                    step={10}
                                    value={distValue}
                                />
                                <Form.Text muted>Value: {distValue}</Form.Text>
                                <Form.Text muted>Step: 10</Form.Text>

                                <hr style={{ color: "#9750DD" }} />

                                <div><p style={{ color: "#9750DD" }}><b>Edge types:</b></p></div>

                                <div className="row">
                                    <div className="col-sm">
                                        <FormControlLabel control={
                                            <Checkbox
                                                size="small"
                                                style={{
                                                    color: "lightskyblue",
                                                }}
                                                checked={hbond}
                                                onChange={() => setHbond(!hbond)}
                                            />
                                        }
                                            label={<div style={{ fontSize: "13px" }}>H-bond</div>} />
                                    </div>
                                    <div className="col-sm">
                                        <FormControlLabel control={
                                            <Checkbox
                                                size="small"
                                                style={{
                                                    color: "gold",
                                                }}

                                                checked={vanDerWaals}
                                                onChange={() => setVanDerWaals(!vanDerWaals)}
                                            />

                                        }
                                            label={<div style={{ fontSize: "13px" }}>Van Der Waals</div>} />
                                    </div>
                                </div>


                                <div className="row">
                                    <div className="col-sm">
                                        <FormControlLabel control={
                                            <Checkbox
                                                size="small"
                                                style={{
                                                    color: "red",
                                                }}
                                                checked={pipistack}
                                                onChange={() => setPipistack(!pipistack)}
                                            />
                                        }
                                            label={<div style={{ fontSize: "13px" }}>π-π Stack</div>} />
                                    </div>
                                    <div className="col-sm">
                                        <FormControlLabel control={
                                            <Checkbox
                                                size="small"
                                                style={{
                                                    color: "#9C31F9",
                                                }}
                                                checked={ssbond}
                                                onChange={() => setSsbond(!ssbond)}
                                            />
                                        }
                                            label={<div style={{ fontSize: "13px" }}>ss-bond</div>} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm">
                                        <FormControlLabel control={
                                            <Checkbox
                                                size="small"
                                                style={{
                                                    color: "blue",
                                                }}
                                                checked={ionic}
                                                onChange={() => setIonic(!ionic)}
                                            />
                                        }
                                            label={<div style={{ fontSize: "13px" }}>Ionic</div>} />
                                    </div>

                                    <div className="col-sm">
                                        <FormControlLabel control={
                                            <Checkbox
                                                size="small"
                                                style={{
                                                    color: "#FFA07A",
                                                }}
                                                checked={hydrophobic}
                                                onChange={() => setHydrophobic(!hydrophobic)}
                                            />
                                        }
                                            label={<div style={{ fontSize: "13px" }}>Hydrophobic</div>} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm">
                                        <FormControlLabel control={
                                            <Checkbox
                                                size="small"
                                                style={{
                                                    color: "yellowgreen",
                                                }}
                                                checked={pication}
                                                onChange={() => setPication(!pication)}
                                            />
                                        }
                                            label={<div style={{ fontSize: "13px" }}>π-Cation</div>} />


                                    </div>

                                    <div className="col-sm">
                                        <FormControlLabel control={
                                            <Checkbox
                                                size="small"
                                                style={{
                                                    color: "#615f5f",
                                                }}
                                                checked={generic}
                                                onChange={() => setGeneric(!generic)}
                                            />
                                        }
                                            label={<div style={{ fontSize: "13px" }}>Generic</div>} />


                                    </div>
                                </div>

                                <hr style={{ color: "#9750DD" }} />

                                <Container>
                                    <SvgLinkType />
                                    <br /><br />

                                    {nodeColor === "col_res"
                                        ?
                                        <SvgNodeResidue />
                                        :
                                        nodeColor === "col_ch"
                                            ?
                                            <SvgNodeChain />
                                            :
                                            nodeColor === "col_deg"
                                                ?
                                                <SvgNodeDegree />

                                                :
                                                nodeColor === "col_pol"
                                                    ?
                                                    <SvgNodePolarity />
                                                    :
                                                    null
                                    }


                                </Container>

                            </Card.Body>
                        </Card>
                        :
                        <div>
                            <Tooltip placement="right" content={"Show/hide side panel"}>
                                <Button rounded flat onClick={() => showControlPanel(!showPanel)} color="secondary" icon={<TfiPanel size={19} />} auto />
                            </Tooltip>
                        </div>
                    }

                    {graphType == "2d_rin"
                        ?
                        <ForceGraph2D
                            ref={fgRef}
                            width={displayWidth}
                            height={displayHeight}
                            graphData={graphData}
                            nodeLabel={node => "ID : " + node.id + "<br>Res name : " + node.residue + "<br>Chain id : " + node.chain + "<br>Degree : " + node.degree}
                            linkLabel={edge => "BOND : " + edge.interaction + "<br>Atom 1 : " + edge.a1 + "<br>Atom 2 : " + edge.a2 + "<br>Distance : " + edge.distance + "<br>Energy : " + edge.energy + " kj/mol" + "<br>source : " + edge.source.id + "<br>target : " + edge.target.id}
                            nodeColor={nodeColor}
                            nodeVal={node => node.degree}
                            linkColor={"color_type"}
                            linkWidth={1}
                            linkCurvature={"curvature"}
                            nodeRelSize={2}
                            backgroundColor={"#FFFFFF"}
                            onNodeDragEnd={node => {
                                node.fx = node.x;
                                node.fy = node.y;
                            }}
                            warmupTicks={100}
                            autoPauseRedraw={false}
                            cooldownTime={3000}

                            d3AlphaDecay={0.02}
                            d3VelocityDecay={0.7}
                            enableZoomPanInteraction={true}
                            linkVisibility={(link) => {

                                if (link.interaction.includes("VDW")) {
                                    if (!vanDerWaals) {
                                        return false;
                                    } else if (vanDerWaals) {
                                        return true;
                                    }
                                }

                                if (link.interaction.includes("HBOND")) {
                                    if (!hbond) {
                                        return false;
                                    } else if (hbond) {
                                        return true;
                                    }
                                }

                                if (link.interaction.includes("PIPISTACK")) {
                                    if (!pipistack) {
                                        return false;
                                    } else if (pipistack) {
                                        return true;
                                    }
                                }

                                if (link.interaction.includes("SSBOND")) {
                                    if (!ssbond) {
                                        return false;
                                    } else if (ssbond) {
                                        return true;
                                    }
                                }

                                if (link.interaction.includes("IONIC")) {
                                    if (!ionic) {
                                        return false;
                                    } else if (ionic) {
                                        return true;
                                    }
                                }

                                if (link.interaction.includes("PICATION")) {
                                    if (!pication) {
                                        return false;
                                    } else if (pication) {
                                        return true;
                                    }
                                }

                                if (link.interaction.includes("HYDROPHOBIC")) {
                                    if (!hydrophobic) {
                                        return false;
                                    } else if (hydrophobic) {
                                        return true;
                                    }
                                }

                                if (link.interaction.includes("GENERIC")) {
                                    if (!generic) {
                                        return false;
                                    } else if (generic) {
                                        return true;
                                    }
                                }
                            }}
                        />
                        :
                        <ForceGraph3D
                            ref={fgRef}
                            width={displayWidth}
                            height={displayHeight}
                            graphData={graphData}
                            nodeLabel={node => `<span style="color: black"> ID : ${node.id} <br>Res name : ${node.residue} <br>Chain id : ${node.chain} <br>Degree : ${node.degree}</span>`}
                            linkLabel={edge => `<span style="color: black"> BOND : ${edge.interaction} <br>Atom 1 : ${edge.a1} <br>Atom 2 : ${edge.a2} <br>Distance : ${edge.distance} <br>Energy : ${edge.energy} kj/mol</span>`}
                            nodeColor={nodeColor}
                            nodeVal={node => node.degree}
                            linkColor={"color_type"}
                            nodeOpacity={0.75}
                            linkOpacity={0.6}
                            linkWidth={1.5}
                            linkCurvature={edge => edge.curvature * (-2)} //aumento la curvatura nella versione 3D per distinguere meglio i legami 
                            nodeRelSize={2}
                            backgroundColor={"#FFFFFF"}
                            onNodeDragEnd={node => {
                                node.fx = node.x;
                                node.fy = node.y;
                                node.fz = node.z;
                            }}
                            warmupTicks={100}
                            cooldownTime={3000}

                            d3AlphaDecay={0.02}
                            d3VelocityDecay={0.7}
                            enableZoomPanInteraction={true}
                            linkVisibility={(link) => {

                                if (link.interaction.includes("VDW")) {
                                    if (!vanDerWaals) {
                                        return false;
                                    } else if (vanDerWaals) {
                                        return true;
                                    }
                                }

                                if (link.interaction.includes("HBOND")) {
                                    if (!hbond) {
                                        return false;
                                    } else if (hbond) {
                                        return true;
                                    }
                                }

                                if (link.interaction.includes("PIPISTACK")) {
                                    if (!pipistack) {
                                        return false;
                                    } else if (pipistack) {
                                        return true;
                                    }
                                }

                                if (link.interaction.includes("SSBOND")) {
                                    if (!ssbond) {
                                        return false;
                                    } else if (ssbond) {
                                        return true;
                                    }
                                }

                                if (link.interaction.includes("IONIC")) {
                                    if (!ionic) {
                                        return false;
                                    } else if (ionic) {
                                        return true;
                                    }
                                }

                                if (link.interaction.includes("PICATION")) {
                                    if (!pication) {
                                        return false;
                                    } else if (pication) {
                                        return true;
                                    }
                                }

                                if (link.interaction.includes("HYDROPHOBIC")) {
                                    if (!hydrophobic) {
                                        return false;
                                    } else if (hydrophobic) {
                                        return true;
                                    }
                                }

                                if (link.interaction.includes("GENERIC")) {
                                    if (!generic) {
                                        return false;
                                    } else if (generic) {
                                        return true;
                                    }
                                }
                            }}
                        />
                    }
                </div>



            </div>



        </>
    );

};

