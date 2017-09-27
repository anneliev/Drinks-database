import React from 'react';

function Main(props) {	
	return (		
		<main className="container">
          <div className="row">
			 {props.children} 
          </div>
        </main>
             
	)
}

export default Main;