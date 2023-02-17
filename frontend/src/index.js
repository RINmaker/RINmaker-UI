import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { NextUIProvider } from '@nextui-org/react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import './style.css';

import MyNavBar from "./MyNavBar"
import Home from './Home';
import Help from './Help';
import About from './About';
import Rin2D from "./Rin2D";

const router = createBrowserRouter([
	{
		path: "/",
		element: <MyNavBar />,
		errorElement: <div>Not found</div>,
		children: [
			{
				index: true,
				element: <Home/>,
			},
			{
				path: "home",
				element: <Home />,
			},
			{
				path: "help",
				element: <Help />,
			},
			{
				path: "about",
				element: <About />,
			},
		],
	},
	{
		path: "rin",
		element: <Rin2D />,
	}

]);


const root = document.getElementById('root');
ReactDOM.render(
	<StrictMode>
		
		<RouterProvider router={router} />
		
	</StrictMode>,
	root
);
