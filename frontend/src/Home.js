import { Button, Badge, Grid, Spacer, Progress } from "@nextui-org/react";
import { BsListCheck, BsFillTagFill, BsKeyboard, BsGithub } from 'react-icons/bs';
import { Card, Col, Row, Stack, Container, Form } from "react-bootstrap";
import { useState, useLayoutEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useLocation } from "react-router-dom";

import { nodesRIN, linksRIN, parseXmlBonds, res_count, bond_count, avg_e_bond, avg_dist_bond, hbond_ext_count } from "./functions/Parsing";

export default function Home() {
  const [pdbId, setPdbId] = useState("");
  const [loadPdbId, setLoadPdbId] = useState("");

  const [seqSep, setSeqSep] = useState("");
  const [illformed, setIllformed] = useState("");

  const [policy, setPolicy] = useState("");
  const [hydrogenBond, setHydrogenBond] = useState("");
  const [vdvBond, setVdwBond] = useState("");
  const [ionicBond, setIonicBond] = useState("");
  const [picationBond, setPicationBond] = useState("");
  const [pipistackBond, setPipistackBond] = useState("");
  const [hydrogenBondAngle, setHydrogenBondAngle] = useState("");
  const [picationAngle, setPicationAngle] = useState("");
  const [pipistackNormalNormal, setPipistackNormalNormal] = useState("");
  const [pipistackNormalCentre, setPipistackNormalCentre] = useState("");

  const [type, setType] = useState("");
  const [distance, setDistance] = useState("");

  const [rinSwitch, setRinSwitch] = useState(true);
  const [cmapSwitch, setcmapRinSwitch] = useState(false);

  const [noHydrogen, setNoHydrogen] = useState(false);
  const [keepWater, setKeepWater] = useState(false);

  const [filename, setFilename] = useState("");

  const [loading, setLoading] = useState(false);

  const [logContent, setLogContent] = useState("")

  const navigate = useNavigate();
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const switchChange = (e) => {
    setRinSwitch(!rinSwitch);
    setcmapRinSwitch(!cmapSwitch);
  }

  const readFile = (e) => {
    const fileReader = new FileReader();
    const { files } = e.target;

    let extension = files[0].name.split('.').pop().toLowerCase();

    if (extension === "pdb" || extension === "cif") {
      setFilename(files[0].name);
      fileReader.readAsText(files[0], "UTF-8");
      fileReader.onload = (e) => {
        const content = e.target.result;
        setLoadPdbId(content);
      }
    } else {
      toast.error('Please insert .pdb or .cif file only. Other files will not be considered', {
        position: "bottom-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  }

  function isPositiveNum(n) {
    return Number(n) == n && Number(n) > 0;
  }

  const onSubmitButtons = async (e) => {

    let params = {};

    let isFile = loadPdbId != "" ? true : false;

    if (!isFile && pdbId == "") {
      toast.warn('Please insert a file or a valid one', {
        position: "bottom-right",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {

      if (!isFile) {
        if (pdbId.split(".").pop() == pdbId) {
          params.pdbname = pdbId + ".pdb";
        } else if (pdbId.split(".").pop() == "pdb" || pdbId.split(".").pop() == "cif") {
          params.pdbname = pdbId;
        } else {
          return toast.warn('Please insert a .pdb or .cif file', {
            position: "bottom-right",
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
      } else {
        params.pdbname = filename;
        params.content = loadPdbId;
      }

      if (seqSep != "") {
        if (isPositiveNum(seqSep) && Number(seqSep) % 1 === 0) {
          params.seq_sep = seqSep;
        } else {
          return toast.warn('Please insert a valid value for Sequence Separation', {
            position: "bottom-right",
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
      }

      if (illformed != "sres" && illformed != "") {
        params.illformed = illformed;
      }

      if (noHydrogen != false) {
        params.no_hydrogen = noHydrogen;
      }

      if (keepWater != false) {
        params.keep_water = keepWater;
      }

      if (rinSwitch) {
        params.isRin = true;
        params.isCmap = false;

        if (policy != "all" && policy != "") {
          params.policy = policy;
        }

        if (hydrogenBond != "") {
          if (isPositiveNum(hydrogenBond)) {
            params.hydrogen_bond = hydrogenBond;
          } else {
            return toast.warn('Please insert a valid value for Hydrogen Bond', {
              position: "bottom-right",
              autoClose: 6000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
        }

        if (vdvBond != "") {
          if (isPositiveNum(vdvBond)) {
            params.vdw_bond = vdvBond;
          } else {
            return toast.warn('Please insert a valid value for Van Der Waals bond', {
              position: "bottom-right",
              autoClose: 6000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
        }

        if (ionicBond != "") {
          if (isPositiveNum(ionicBond)) {
            params.ionic_bond = ionicBond;
          } else {
            return toast.warn('Please insert a valid value for Ionic bond', {
              position: "bottom-right",
              autoClose: 6000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
        }

        if (picationBond != "") {
          if (isPositiveNum(picationBond)) {
            params.pication_bond = picationBond;
          } else {
            return toast.warn('Please insert a valid value for π-cation bond', {
              position: "bottom-right",
              autoClose: 6000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
        }

        if (pipistackBond != "") {
          if (isPositiveNum(pipistackBond)) {
            params.pipistack_bond = pipistackBond;
          } else {
            return toast.warn('Please insert a valid value for π-π stack bond', {
              position: "bottom-right",
              autoClose: 6000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
        }

        if (hydrogenBondAngle != "") {
          if (isPositiveNum(hydrogenBondAngle)) {
            params.h_bond_angle = hydrogenBondAngle;
          } else {
            return toast.warn('Please insert a valid value for Hydrogen bond angle', {
              position: "bottom-right",
              autoClose: 6000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
        }

        if (picationAngle != "") {
          if (isPositiveNum(picationAngle)) {
            params.pication_angle = picationAngle;
          } else {
            return toast.warn('Please insert a valid value for π-cation angle', {
              position: "bottom-right",
              autoClose: 6000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
        }

        if (pipistackNormalNormal != "") {
          if (isPositiveNum(pipistackNormalNormal)) {
            params.pipistack_normal_normal = pipistackNormalNormal;
          } else {
            return toast.warn('Please insert a valid value for π-π stack-normal-normal', {
              position: "bottom-right",
              autoClose: 6000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
        }

        if (pipistackNormalCentre != "") {
          if (isPositiveNum(pipistackNormalCentre)) {
            params.pipistack_normal_centre = pipistackNormalCentre;
          } else {
            return toast.warn('Please insert a valid value for π-π stack-normal-centre', {
              position: "bottom-right",
              autoClose: 6000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
        }

      } else if (cmapSwitch) {
        params.isRin = false;
        params.isCmap = true;

        if (type != "ca" && type != "") {
          params.type = type;
        }

        if (distance != "") {
          if (isPositiveNum(distance)) {
            params.distance = distance;
          } else {
            return toast.warn('Please insert a valid value for distance', {
              position: "bottom-right",
              autoClose: 6000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
        }
      }


      if (e.target.name === "generate_xml") {
        setLoading(true);
        if (isFile) {
          fetch("https://rinmaker.dais.unive.it:8002/api/requestxml/fromcontent", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
          })
            .then(async res => {
              if (res.ok) {
                return res.json()
              } else {
                res = await res.json();
                throw new Error(res.data.code);
              }
            })
            .then(data => {
              if (data.data.code === 200) {
                setLoading(false);
                toast.success(data.data.message, {
                  position: "bottom-right",
                  autoClose: 8000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                });
                setLogContent(data.data.log);

                const url = window.URL.createObjectURL(
                  new Blob([data.data.xml]),
                );

                const link = document.createElement('a');

                link.href = url;
                link.setAttribute(
                  'download',
                  `${params.pdbname}.xml`,
                );

                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);


              }
            })
            .catch((err) => {
              if (err === "400") {
                setLoading(false);
                toast.error("Bad Request", {
                  position: "bottom-right",
                  autoClose: 8000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                });
              } else if (err === "500") {
                setLoading(false);
                toast.error("Internal Error", {
                  position: "bottom-right",
                  autoClose: 8000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                });
              }
            });

        } else {

          setLoading(true);
          fetch("https://rinmaker.dais.unive.it:8002/api/requestxml/fromname", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
          })
            .then(async res => {
              if (res.ok) {
                return res.json();
              } else {
                res = await res.json();
                throw new Error(res.data.code);
              }
            })
            .then(data => {
              if (data.data.code === 200) {
                setLoading(false);
                toast.success(data.data.message, {
                  position: "bottom-right",
                  autoClose: 8000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                });

                setLogContent(data.data.log);

                const url = window.URL.createObjectURL(
                  new Blob([data.data.xml]),
                );

                const link = document.createElement('a');

                link.href = url;
                link.setAttribute(
                  'download',
                  `${params.pdbname}.xml`,
                );

                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
              }
            })
            .catch(err => {
              if (err.message === "404") {
                setLoading(false);
                toast.error("File not found", {
                  position: "bottom-right",
                  autoClose: 8000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                });
              } else if (err.message === "400") {
                setLoading(false);
                toast.error("Bad Request", {
                  position: "bottom-right",
                  autoClose: 8000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                });
              } else if (err.message === "500") {
                setLoading(false);
                toast.error("Internal Error", {
                  position: "bottom-right",
                  autoClose: 8000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                });
              }
            })
        }
      } else if (e.target.name === "2d_rin" || e.target.name === "3d_rin") {

        setLoading(true);
        let url;
        if (isFile) {
          url = "https://rinmaker.dais.unive.it:8002/api/requestxml/fromcontent";
        } else {
          url = "https://rinmaker.dais.unive.it:8002/api/requestxml/fromname";
        }

        try {
          const res = await fetch(url, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
          });


          const data = await res.json();
          const fetchRes = data;


          if (fetchRes.data.code === 404) {
            setLoading(false);
            toast.error("File not found", {
              position: "bottom-right",
              autoClose: 8000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });

          } else if (fetchRes.data.code === 400) {
            setLoading(false);
            toast.error("Bad Request", {
              position: "bottom-right",
              autoClose: 8000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });

          } else if (fetchRes.data.code === 500) {
            setLoading(false);
            toast.error("Internal Error", {
              position: "bottom-right",
              autoClose: 8000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });

          } else if (fetchRes.data.code === 200) {

            var log = fetchRes.data.log;
            var xml = fetchRes.data.xml;

            parseXmlBonds(xml);

            let gData = {
              nodes: nodesRIN,
              links: linksRIN
            };

            const state = {
              graphType: e.target.name,
              gData: gData,
              pdbname: params.pdbname,
              log: log,
              params: params,
              xml: xml,
              res_count: res_count,
              bond_count: bond_count,
              avg_e_bond: avg_e_bond,
              avg_dist_bond: avg_dist_bond,
              hbond_ext_count: hbond_ext_count,
              num_nodes: Object.keys(nodesRIN).length,
              num_links: Object.keys(linksRIN).length

            }

            setLoading(false);
            navigate("/rin", { state: state });

          }
        } catch (error) {
          if (error.name !== "AbortError") {
            setLoading(false);
            toast.error("Something went wrong, check internet connection or the service is temporarily unavailable", {
              position: "bottom-right",
              autoClose: 8000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
        }


      }
    }
  }


  return (
    <>

      <ToastContainer
        position="bottom-right"
        autoClose={6000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <Container>
        <Spacer y={1}></Spacer>

        <Grid.Container gap={2}>
          <Grid>
            <Badge enableShadow disableOutline color="error">© Ca' Foscari University of Venice</Badge>
          </Grid>
          <Grid>
            <Badge enableShadow disableOutline color="success"><BsFillTagFill />&nbsp;v0.1.3</Badge>
          </Grid>
          <Grid>
            <Badge enableShadow disableOutline css={{ cursor: "pointer" }} color="secondary"><BsGithub /><a style={{ textDecoration: 'none', color: "white" }} href="https://github.com/RINmaker" target="_blank">&nbsp;RINmaker</a></Badge>
          </Grid>
        </Grid.Container>

        <Spacer y={1}></Spacer>

        <Card className="shadow p-3 mb-5 bg-white rounded" border="light">

          <Card.Body>
            <Row>
              <Col className="d-flex justify-content-center text-center">
                <Stack direction="horizontal" gap={3}>
                  <BsKeyboard />
                  <h2>Input</h2>
                </Stack>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col >
                <Form.Group className="mb-3">
                  <Form.Label>Load file</Form.Label>
                  <Form.Control id="load_pdb_id" name="load_pdb_id" type="file" onChange={readFile} />
                  <Form.Text className="text-muted">
                    Load a PDB or mmCif file
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Type file ID</Form.Label>
                  <Form.Control id="pdb_id" name="pdb_id" type="text" onChange={e => setPdbId(e.currentTarget.value)} />
                  <Form.Text className="text-muted">
                    Specify <i>.pdb</i> or <i>.cif</i> otherwise a pdb will be searched
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col className="d-flex justify-content-center text-center">
                <Stack direction="horizontal" gap={3}>
                  <BsListCheck />
                  <h2>Option</h2>
                </Stack>
              </Col>
            </Row>
            <hr />
            <Row>
              <i>ångström (Å) = 0.1 nanometers = 1<sup>-10</sup> meters</i>
            </Row>
            <br />
            <Row>
              <Col>
                <Form.Label><mark>Sequence Separation</mark></Form.Label>
                <Form.Control
                  id="seq_sep"
                  name="seq_sep"
                  type="text"
                  placeholder="INT:POSITIVE=3"
                  onChange={e => setSeqSep(e.currentTarget.value)}
                />
                <Form.Text muted>
                  Minimum sequence separation
                </Form.Text>
              </Col>
              <Col>
                <Form.Label><mark>illformed</mark></Form.Label>
                <Form.Select id="illformed" name="illformed" defaultValue={"sres"} onChange={e => setIllformed(e.currentTarget.value)}>
                  <option value="kall">keep all</option>
                  <option value="kres">keep residue</option>
                  <option value="sres">skip residue</option>
                </Form.Select>
                <Form.Text muted>
                  Behaviour in case of malformed ring or ionic group.
                  Default: skip residue
                </Form.Text>
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                <Form.Check
                  type="checkbox"
                  name="no_hydrogen"
                  id="no_hydrogen"
                  label="No Hydrogen"
                  checked={noHydrogen}
                  onChange={e => setNoHydrogen(!noHydrogen)}
                />
                <Form.Text muted>
                  Skip hydrogen fixing
                </Form.Text>
              </Col>

            </Row>
            <br />
            <Row>
              <Col>
                <Form.Check
                  type="checkbox"
                  name="keep_water"
                  id="keep_water"
                  label="Keep water"
                  checked={keepWater}
                  onChange={e => setKeepWater(!keepWater)}
                />
                <Form.Text muted>
                  Keep water residues
                </Form.Text>
              </Col>
            </Row>
            <br />
            <Row>
              <Stack direction="horizontal" gap={2}>
                <Form.Check
                  type="switch"
                  id="rin_switch"
                  checked={rinSwitch}
                  onChange={e => switchChange()}
                />
                <p className="code" style={{ color: "#7828C8", fontSize: 25 }}><b>rin</b></p>
              </Stack>
              <Form.Text muted>
                Compute the residue interaction network
              </Form.Text>

            </Row>

            <br />
            <Row>
              <Col sm={3}>
                <Form.Label><mark>Policy</mark></Form.Label>
                <Form.Select id="policy" name="policy" defaultValue={"all"} onChange={e => setPolicy(e.currentTarget.value)}>
                  <option value="all">all</option>
                  <option value="multiple">multiple</option>
                  <option value="one">one</option>
                </Form.Select>
                <Form.Text muted>
                  Affects which edges are kept per pair of aminoacids.
                  Default: all
                </Form.Text>
              </Col>
              <Col sm={3}>
                <Form.Label><mark>Hydrogen bond (Å)</mark></Form.Label>
                <Form.Control
                  id="hydrogen_bond"
                  name="hydrogen_bond"
                  type="text"
                  placeholder="FLOAT:POSITIVE=3.5"
                  onChange={e => setHydrogenBond(e.currentTarget.value)}
                />
                <Form.Text muted>
                  Query distance for hydrogen bonds
                </Form.Text>
              </Col>
              <Col sm={3}>
                <Form.Label><mark>Van Der Waals bond (Å)</mark></Form.Label>
                <Form.Control
                  id="vdw_bond"
                  name="vdw_bond"
                  type="text"
                  placeholder="FLOAT=0.5"
                  onChange={e => setVdwBond(e.currentTarget.value)}
                />
                <Form.Text muted>
                  Surface distance for vdw bonds
                </Form.Text>
              </Col>
              <Col sm={3}>
                <Form.Label><mark>Ionic bond (Å)</mark></Form.Label>
                <Form.Control
                  id="ionic_bond"
                  name="ionic_bond"
                  type="text"
                  placeholder="FLOAT:POSITIVE=4"
                  onChange={e => setIonicBond(e.currentTarget.value)}
                />
                <Form.Text muted>
                  Query distance for ionic bonds
                </Form.Text>
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm={3}>
                <Form.Label><mark>π-cation bond (Å)</mark></Form.Label>
                <Form.Control
                  id="pication_bond"
                  name="pication_bond"
                  type="text"
                  placeholder="FLOAT:POSITIVE=5"
                  onChange={e => setPicationBond(e.currentTarget.value)}
                />
                <Form.Text muted>
                  Query distance for cation-π bonds
                </Form.Text>
              </Col>

              <Col sm={3}>
                <Form.Label><mark>π-π stack bond (Å)</mark></Form.Label>
                <Form.Control
                  id="pipistack_bond"
                  name="pipistack_bond"
                  type="text"
                  placeholder="FLOAT:POSITIVE=6.5"
                  onChange={e => setPipistackBond(e.currentTarget.value)}
                />
                <Form.Text muted>
                  Query distance for π-π stackings
                </Form.Text>
              </Col>

              <Col sm={3}>
                <Form.Label><mark>Hydrogen bond angle (deg)</mark></Form.Label>
                <Form.Control
                  id="hydrogen_bond_angle"
                  name="hydrogen_bond_angle"
                  type="text"
                  placeholder="FLOAT:POSITIVE=63"
                  onChange={e => setHydrogenBondAngle(e.currentTarget.value)}
                />
                <Form.Text muted>
                  Angle for hydrogen bonds
                </Form.Text>
              </Col>

              <Col sm={3}>
                <Form.Label><mark>π-cation angle (deg)</mark></Form.Label>
                <Form.Control
                  id="pication_angle"
                  name="pication_angle"
                  type="text"
                  placeholder="FLOAT:POSITIVE=45"
                  onChange={e => setPicationAngle(e.currentTarget.value)}
                />
                <Form.Text muted>
                  Angle for cation-π bonds
                </Form.Text>
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm={3}>
                <Form.Label><mark>π-π stack-normal-normal (deg)</mark></Form.Label>
                <Form.Control
                  id="pipistack_normal_normal"
                  name="pipistack_normal_normal"
                  type="text"
                  placeholder="FLOAT:POSITIVE=30"
                  onChange={e => setPipistackNormalNormal(e.currentTarget.value)}
                />
                <Form.Text muted>
                  Angle range from normal to normal for π-π stackings
                </Form.Text>
              </Col>
              <Col sm={3}>
                <Form.Label><mark>π-π stack-normal-centre (deg)</mark></Form.Label>
                <Form.Control
                  id="pipistack_normal_centre"
                  name="pipistack_normal_centre"
                  type="text"
                  placeholder="FLOAT:POSITIVE=60"
                  onChange={e => setPipistackNormalCentre(e.currentTarget.value)}
                />
                <Form.Text muted>
                  Angle range from normal to centre for π-π stackings
                </Form.Text>
              </Col>
            </Row>
            <br />
            <Row>
              <Stack direction="horizontal" gap={2}>
                <Form.Check
                  type="switch"
                  id="cmap_switch"
                  checked={cmapSwitch}
                  onChange={e => switchChange()}
                />
                <p className="code" style={{ color: "#7828C8", fontSize: 25 }}><b>cmap</b></p>
              </Stack>
              <Form.Text muted>
                Compute the contact map of the protein
              </Form.Text>
            </Row>
            <br />
            <Row>
              <Col sm={6}>
                <Form.Label><mark>Type</mark></Form.Label>
                <Form.Select id="type" name="type" defaultValue={"ca"} onChange={e => setType(e.currentTarget.value)}>
                  <option value="ca">alpha carbon</option>
                  <option value="cb">beta carbon</option>
                </Form.Select>
                <Form.Text muted>
                  Type of contact map (alpha/beta carbon).
                  Default: alpha carbon
                </Form.Text>
              </Col>
              <Col sm={6}>
                <Form.Label><mark>Distance</mark></Form.Label>
                <Form.Control
                  id="distance"
                  name="distance"
                  type="text"
                  placeholder="FLOAT:POSITIVE=6"
                  onChange={e => setDistance(e.currentTarget.value)}
                />
                <Form.Text muted>
                  Query distance between alpha/beta carbons.
                </Form.Text>
              </Col>
            </Row>

            <br /><br />
            <hr />
            <br />

            <Row>
              <Col className="d-flex justify-content-center text-center" sm={4}>
                <Grid>
                  <Button name="generate_xml" shadow onPress={onSubmitButtons} type="submit" color="secondary" auto>
                    Generate XML
                  </Button>
                </Grid>
              </Col>

              <Col className="d-flex justify-content-center text-center" sm={4}>
                <Grid>
                  <Button name="2d_rin" shadow onPress={onSubmitButtons} type="submit" color="secondary" auto>
                    2D RIN
                  </Button>
                </Grid>
              </Col>

              <Col className="d-flex justify-content-center text-center" sm={4}>
                <Grid>
                  <Button name="3d_rin" shadow onPress={onSubmitButtons} type="submit" color="secondary" auto>
                    3D RIN
                  </Button>
                </Grid>
              </Col>
            </Row>

            <br /><br />

            {loading &&
              <Row>
                <p>Please wait...</p>
                <Progress
                  indeterminated
                  value={50}
                  color="secondary"
                  status="secondary"
                />
              </Row>
            }

          </Card.Body>
          {logContent &&
            <Card>
              <Card.Header className="code" style={{ color: "#7828C8", fontSize: 20 }}><b>Log</b></Card.Header>
              <Card.Body>
                <pre>{logContent}</pre>

              </Card.Body>
            </Card>
          }
        </Card>
      </Container>
    </>
  )
}
