import React from 'react';

function NavButton(props) {
	return (
		<button className="btn btn-outline-success m-2 navButton" onClick={props.onClick}> 
			 {props.children}
		</button> 
	)
}

export default NavButton;