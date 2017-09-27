import React, { Component } from 'react'
import CommentField from './commentField.js';

class ShowDrinks extends Component {

	render(){
					/* New array to hold and display the data depending on which API call was made */
    const list = [];
    console.log(this.props)
    if(this.props.data.length > 0){
    for(let i = 0; i < this.props.data.length; i ++){
      list.push(
        <div className="col-lg-3 col-md-4 col-sm-6 col-xs-6" key={i}>
          <div className="card" style={ {maxWidth: "22em", marginTop: 60, marginBottom: 60}}>
            <img className="card-img-top img-thumbnail" src={this.props.data[i].strDrinkThumb} alt="Drink"/>
            <div className="card-block">
              <h4 className="card-title">{this.props.data[i].strDrink}</h4>
              <ul>
                {this.props.data[i].strIngredient1 && <li>{this.props.data[i].strIngredient1} - {this.props.data[i].strMeasure1}</li> }
                {this.props.data[i].strIngredient2 && <li>{this.props.data[i].strIngredient2} - {this.props.data[i].strMeasure2}</li> }
                {this.props.data[i].strIngredient3 && <li>{this.props.data[i].strIngredient3} - {this.props.data[i].strMeasure3}</li> }
                {this.props.data[i].strIngredient4 && <li>{this.props.data[i].strIngredient4} - {this.props.data[i].strMeasure4}</li> }
                {this.props.data[i].strIngredient5 && <li>{this.props.data[i].strIngredient5} - {this.props.data[i].strMeasure5}</li> }
                {this.props.data[i].strIngredient6 && <li>{this.props.data[i].strIngredient6} - {this.props.data[i].strMeasure6}</li> }
                {this.props.data[i].strIngredient7 && <li>{this.props.data[i].strIngredient7} - {this.props.data[i].strMeasure7}</li> }
                {this.props.data[i].strIngredient8 && <li>{this.props.data[i].strIngredient8} - {this.props.data[i].strMeasure8}</li> }
                {this.props.data[i].strIngredient9 && <li>{this.props.data[i].strIngredient9} - {this.props.data[i].strMeasure9}</li> }
                {this.props.data[i].strIngredient10 && <li>{this.props.data[i].strIngredient10} - {this.props.data[i].strMeasur10}</li> }
              </ul>
              <p className="card-text">{this.props.data[i].strInstructions}</p>
              {!this.props.data[i].strIngredient1 && <button className="btn btn-warning m-3" onClick={ () => this.getHowTo(this.props.data[i].idDrink)}>Recipe</button>}
              <button className="btn btn-outline-warning" onClick={ () => this.props.addFavorite(this.props.data[i].idDrink, this.props.data[i].strDrink, this.props.data[i].strDrinkThumb)}>Add to favorites</button>
              <br />
              <CommentField onChange={this.props.onChange} onSubmit={ () => this.props.addComment(this.props.data[i].idDrink)} value={this.props.value} />
              <br />
              <button className="btn btn-outline-primary" onClick={ () => {this.props.getComments(this.props.data[i].idDrink)} }>Get comments</button>
              {this.props.comments.length > 0 && 
                <div>
                  <p>{this.props.comments[0].value.text} <i> - by: {this.props.comments[0].value.createdBy}</i></p>
                  {this.props.comments[1] && <p>{this.props.comments[1].value.text} <i> - by: {this.props.comments[1].value.createdBy}</i></p>}
                  {this.props.comments[2] && <p>{this.props.comments[2].value.text} <i> - by: {this.props.comments[2].value.createdBy}</i></p>}
                </div>
              }
            </div>
          </div>  
        </div>
      ); 
    } }
		return (
 		 {list}
		)
	}
}

export default ShowDrinks;
