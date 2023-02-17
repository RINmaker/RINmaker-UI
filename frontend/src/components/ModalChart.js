import { Text } from "@nextui-org/react";
import { Modal, Container, Button } from "react-bootstrap";

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import pdfMake from "pdfmake";
import html2canvas from "html2canvas";
import Logo from "./Logo";
import { docDefinitionDefault } from "./DocDefinition";

import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);


export default function ModalChart(props) {

    const res_list = ["ARG", "LYS", "ASN", "GLN", "HIS", "CYS", "ILE", "LEU", "MET", "PHE", "PRO", "TRP", "TYR", "VAL", "ALA", "GLY", "SER", "THR", "ASP", "GLU"];
    const res_cols = ["#0000ff", "#0000ff", "#ff00ff", "#ff00ff", "#ff00ff", "#008000", "#008000", "#008000", "#008000", "#008000", "#008000", "#008000", "#008000", "#008000", "#ffa500", "#ffa500", "#ffa500", "#ffa500", "#ff0000", "#ff0000"];
    const bond_list = ['IONIC', 'HBOND', "VDW", "SSBOND", "PIPISTACK", "PICATION", "IAC"];
    const bond_cols = ["#0000ff", "#87cefa", "#ffd700", "#9C31F9", "#ff0000", "#9acd32", "#dcdcdc"];
    const ext = ["main-chain main-chain", "side-chain side-chain", "main-chain side-chain", "side-chain main-chain"];

    const hbondData = {
        labels: ext,
        datasets: [
            {
                label: "Total in %",
                data: props.hbond_ext_count,
                backgroundColor: ["#FF5733", "#FFE633", "#33A8FF", "#87FC53"],
            },
        ],
    };

    const residueData = {
        labels: res_list,
        datasets: [
            {
                data: props.res_count,
                backgroundColor: res_cols,
            },
        ],
    }

    const bondsCountData = {
        labels: bond_list,
        datasets: [
            {
                label: "Total",
                backgroundColor: bond_cols,
                data: props.bond_count
            }
        ]
    }

    const energyBond = {
        labels: bond_list,
        datasets: [
            {
                label: "AVG kj/mol",
                backgroundColor: bond_cols,
                data: props.avg_e_bond,
            }
        ]
    }

    const distanceBond = {
        labels: bond_list,
        datasets: [
            {
                label: "AVG: ",
                backgroundColor: bond_cols,
                data: props.avg_dist_bond
            }
        ]
    }

    const downloadPDF = async () => {
        const logo = Logo();

        const h_bond_chart_canvas = await html2canvas(document.getElementById("h_bond_chart"));
        const h_bond_chart_image = h_bond_chart_canvas.toDataURL();

        const res_count_canvas = await html2canvas(document.getElementById("res_count"));
        const res_count_image = res_count_canvas.toDataURL();

        const bonds_count_canvas = await html2canvas(document.getElementById("bonds_count"));
        const bonds_count_image = bonds_count_canvas.toDataURL();

        const avg_e_type_canvas = await html2canvas(document.getElementById("avg_e_type"));
        const avg_e_type_image = avg_e_type_canvas.toDataURL();

        const avg_dist_type_canvas = await html2canvas(document.getElementById("avg_dist_type"));
        const avg_dist_type_image = avg_dist_type_canvas.toDataURL();

        const documentDefinition = docDefinitionDefault(
            props.pdbname,
            props.log,
            logo,
            props.num_links,
            props.num_nodes,
            res_list,
            bond_list,
            ext,
            props.hbond_ext_count,
            props.bond_count,
            props.res_count,
            props.avg_e_bond,
            props.avg_dist_bond,
            h_bond_chart_image,
            res_count_image,
            bonds_count_image,
            avg_e_type_image,
            avg_dist_type_image
        );

        const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
        pdfDocGenerator.download(props.pdbname.split('.').slice(0, -1).join('.'));
    }


    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header style={{ backgroundColor: "#F1E8FB" }} closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <Text
                        h3
                        size={30}
                        css={{
                            p: 2,
                            textGradient: "45deg, $blue600 -20%, $purple600 70%",
                        }}
                    >
                        Statistics
                    </Text>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Container>
                    <p>#Nodes: <b>{props.num_nodes}</b></p>
                    <p>#Links: <b>{props.num_links}</b></p>
                    <br />

                    <Button variant="warning" onClick={downloadPDF}>Download Report</Button>

                    <br />
                    <h5 className="text-center">Hydrogen bonds per type (in %)</h5>
                    <hr />


                    <Container id="h_bond_chart" style={{ width: "60%" }}>
                        <Pie
                            options={{
                                maintainAspectRatio: true,
                                responsive: true,
                            }}
                            data={hbondData}
                        />
                    </Container>

                    <br />
                    <h5 className="text-center">Residue Count</h5>
                    <hr />

                    <Container id="res_count" style={{ width: "90%" }}>
                        <Bar
                            options={{
                                plugins: {
                                    legend: { display: false }
                                },
                                maintainAspectRatio: true,
                                responsive: true,
                            }}
                            data={residueData}
                        />

                    </Container>

                    <br />
                    <h5 className="text-center">Bonds Count</h5>
                    <hr />

                    <Container id="bonds_count" style={{ width: "60%" }}>
                        <Doughnut
                            data={bondsCountData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: true
                            }}
                        />
                    </Container>

                    <br />
                    <h5 className="text-center">Average energy per type of bond (kj/mol)</h5>
                    <hr />

                    <Container id="avg_e_type" style={{ width: "90%" }}>
                        <Bar
                            options={{
                                indexAxis: 'y',
                                plugins: {
                                    legend: { display: false }
                                },
                                maintainAspectRatio: true,
                                responsive: true,
                            }}
                            data={energyBond}
                        />
                    </Container>

                    <br />
                    <h5 className="text-center">Average distance per type of bond</h5>
                    <hr />

                    <Container id="avg_dist_type" style={{ width: "90%" }}>
                        <Bar
                            options={{
                                indexAxis: 'y',
                                plugins: {
                                    legend: { display: false }
                                },
                                maintainAspectRatio: true,
                                responsive: true,
                            }}
                            data={distanceBond}
                        />
                    </Container>


                </Container>
            </Modal.Body>
        </Modal>
    );
}