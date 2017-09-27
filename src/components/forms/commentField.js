import React, { Component } from 'react';

class CommentField extends Component{
	comment = (e) =>{
	    e.preventDefault();
	    this.props.onSubmit()
	  }
	render() {
		return(
			<form onSubmit={this.comment}>
				<div className="form-group commentField">
				<br />
            <label htmlFor="comment">
              Leave a comment!
            </label>
            <input 
              type="text" 
              className="form-control" 
              name="newComment"
              placeholder="..."
              onChange={this.props.onChange}
              value={this.props.newComment}  
            />
          	<input 
      	     	type="submit" 
       		    className="btn btn-primary m-3" 
         	    value="Send" 
          	/> 
          </div>
        </form>


		)
	}
}


export default CommentField;