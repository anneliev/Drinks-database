import React from 'react';

function NavButton(props) {
	return (
		<button className="btn  m-2 navButton" style={ {backgroundColor: "#71a819"}} onClick={props.onClick}> 
			 {props.children}
		</button> 
	)
}

export default NavButton;