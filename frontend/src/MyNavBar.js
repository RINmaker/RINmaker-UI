import { Navbar, Text, Image, Spacer } from "@nextui-org/react";
import { NavLink, Outlet } from "react-router-dom";


const Layout = () => {
    return (

        <div style={{ boxSizing: "border-box" }}>
            <Navbar css={{ $$navbarBlurBackgroundColor: "#F1E8FB" }} variant="floating">
                <Navbar.Brand>
                    <Image css={{ p: 5 }} objectFit="cover" width={50} src="img/navicon.png" />
                    <Text
                        h1
                        size={35}
                        css={{
                            p: 10,
                            textGradient: "45deg, $blue600 -20%, $purple600 70%",
                        }}
                        weight="bold"
                    >
                        RINmaker
                    </Text>
                </Navbar.Brand>

                <Navbar.Content activeColor={"secondary"} hideIn="xs" variant="highlight-rounded">

                    <NavLink
                        to={"/home"}
                        style={({ isActive }) => ({
                            color: isActive ? "#7828C8" : "#BC8EE9",
                            textDecoration: 'none',
                            fontWeight: isActive ? 'bold' : "normal",
                        })}
                    >
                        Home
                    </NavLink>

                    <Spacer x={1}/>

                    <NavLink
                        to={"/help"}
                        style={({ isActive }) => ({
                            color: isActive ? "#7828C8" :"#BC8EE9",
                            textDecoration: 'none',
                            fontWeight: isActive ? 'bold' : "normal",
                        })}
                    >
                        Help
                    </NavLink>

                    <Spacer x={1}/>

                    <NavLink
                        to={"/about"}
                        style={({ isActive }) => ({
                            color: isActive ? "#7828C8" :"#BC8EE9",
                            textDecoration: 'none',
                            fontWeight: isActive ? 'bold' : "normal",
                        })}
                    >
                        About
                    </NavLink>


                </Navbar.Content>

            </Navbar>
            <div css={{ maxW: "100%" }} style={{ boxSizing: "border-box" }}>
                <Outlet />
            </div>
        </div >
    )
};

export default Layout;