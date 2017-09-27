import React from 'react';

function Navbar(props){
	return(
		<nav className="navbar navbar-inverse navbar-fixed-top justify-content-end">
			
			{props.children}

		</nav>
	);
}

export default Navbar;