import React from 'react';

function FilterButton(props) {
	return (
		<button className="btn btn-info filterButton" onClick={props.onClick}> 
			 {props.children}
		</button> 
	)
}

export default FilterButton;