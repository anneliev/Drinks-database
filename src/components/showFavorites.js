import React, { Component } from 'react';

class ShowFavorites extends Component{
  render (){

    const showFavs = [];
    if(this.props.myFavs === [] ){
    for(let i = 0; i < this.props.myFavs.length; i ++){
      showFavs.push(
        <div className="col-lg-3 col-md-4 col-sm-6 col-xs-6" key={i}>
          <div className="card" style={ {maxWidth: "22em", marginTop: 60, marginBottom: 60}}>
            <img className="card-img-top img-thumbnail" src={this.props.myFavs[i].drinkThumb} alt="Drink"/>
            <div className="card-block">
              <h4 className="card-title">{this.props.myFavs[i].drinkName}</h4>
              <button className="btn btn-warning m-3" onClick={ () => this.getHowTo(this.props.myFavs[i].drinkId)}>Recipe</button>
            </div>
          </div>
        </div>
      );
    }
  }
    return (
    <div>
        {showFavs}
    </div>
    )
  }
}

export default ShowFavorites;
