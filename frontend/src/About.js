import { Spacer } from "@nextui-org/react";
import { Card, Container } from "react-bootstrap";
import { AiOutlineLink } from "react-icons/ai";
import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function About() {
    const location = useLocation();

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <>
            <Container>
                <Spacer y={2}></Spacer>

                <Card className="shadow p-3 mb-5 bg-white rounded" border="light">

                    <Card.Body>

                        <h2>About RINmaker</h2>
                        <hr />
                        <br />
                        <p><b>RINmaker</b> is a cross-platform open source software tool developed at <i>Ca' Foscari University of Venice</i> (DAIS and DSMN departments) by:</p>

                        <ul style={{ listStyle: "disc" }}>
                            <li>Alvise Spanò</li>
                            <li>Lorenzo Fanton</li>
                            <li>Davide Pizzolato</li>
                            <li>Jacopo Moi</li>
                            <li>Francesco Vinci</li>
                            <li>Alberto Pesce</li>
                            <li>Cedrix J. Dongmo Foumthuim</li>
                            <li>Achille Giacometti</li>
                            <li>Marta Simeoni</li>
                        </ul>

                        <p>The source code is available at <a href="https://github.com/RINmaker">github.com/RINmaker</a></p>
                        <br />
                        <hr />
                        <br />
                        <div className="text-center">
                            <p><b>RINmaker paper: </b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque in tincidunt metus.</p>
                            <p><i>Name Lastname, Name Lastname, Name Lastname, Name Lastname, Name Lastname, Name Lastname</i></p>
                            <AiOutlineLink />
                        </div>


                    </Card.Body>
                </Card>
            </Container>

        </>
    )
}
