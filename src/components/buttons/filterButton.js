import React from 'react';

function FilterButton(props) {
	return (
		<button className="btn btn-info m-3" onClick={props.onClick}> 
			 {props.children}
		</button> 
	)
}

export default FilterButton;