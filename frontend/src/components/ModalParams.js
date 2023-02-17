import { Text } from "@nextui-org/react";
import { Modal, Container } from "react-bootstrap";

export default function ModalParams(props) {

    return (
        <Modal
            {...props}
            size="xl"
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
                        Log & Parameters
                    </Text>
                    
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <pre>{props.log}</pre>
                </Container>

            </Modal.Body>
        </Modal>
    );
}