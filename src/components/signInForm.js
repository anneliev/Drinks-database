import React, { Component } from 'react'

class SignInForm extends Component {
  signIn = (e) =>{
    e.preventDefault();
    this.props.onSubmit()
  }
  render (){
    return(
      <div className="col-md-4">
        <form onSubmit={this.signIn}>
          <div className="form-group">
            <label htmlFor="usermail">
              Email
            </label>
            <input 
              type="text" 
              className="form-control" 
              name="usermail" 
              placeholder="user@usermail.com" 
              onChange={this.props.onChange}                  
              value={this.props.usermail}
            />        
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>
              <input 
                type="password" 
                className="form-control" 
                name="password"
                placeholder="******"
                onChange={this.props.onChange}
                value={this.props.password}  
              />            
            </div>
            <input 
              type="submit" 
              className="btn btn-success m-3" 
              value="Sign In" 
            />      
        </form>
      </div>
    )
  }
}

export default SignInForm;