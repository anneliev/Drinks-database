import React from 'react';

function NoComments(props){
	return(
		<div className="col-4">
			<p>
				{props.children}
			</p>
		</div>
	);
}

export default NoComments;