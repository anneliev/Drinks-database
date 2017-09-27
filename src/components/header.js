import React from 'react';

function Header(props){
	return(
		<header className="jumbotron jumbotron-fluid">
			<h1 className="display-3">
				{props.children}
			</h1>
		</header>
	);
}

export default Header;