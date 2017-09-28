import React from 'react';

function NavButton(props) {
	return (
		<button className="btn navButton" onClick={props.onClick}> 
			 {props.children}
		</button> 
	)
}

export default NavButton;