import React, { Component } from 'react';
import './App.css';
import firebase from './components/firebase';
import Header from './components/header';
import Navbar from './components/navbar';
import FilterButton from './components/buttons/filterButton';
import NavButton from './components/buttons/navButton';
import RegisterForm from './components/forms/registerForm';
import SignInForm from './components/forms/signInForm';
import CommentField from './components/forms/commentField';
import googleLogo from './components/images/google-signin.png';

class App extends Component {
  state = {
    data: [],
    user: "",
    usermail: '',
    password: '',
    comments: [],
    currentUserComments: [],
    newComment: '',
    favorites: '',
    error: '',
    hasError: false
  }

  componentDidMount() {
/*Updates state when firebase authenticaion status changes.*/
    firebase.auth().onAuthStateChanged((user) => {
      if(user){
        const newUser = {
          email: user.email,
          userName: user.displayName,
          userId: user.uid
        }
        this.setState({ user : newUser })
        console.log(user);
      }else{
        this.setState({ user : ''})
        console.log("Error. Not logged in");
      }
    })
    /*Displays a random drink when user is signed in*/
    this.getRandomDrink();
  }

/*Function to handle input in forms*/
  onChange = (e) => {
    this.setState({ [e.target.name] : e.target.value })
  }

/*--------------------Sign in/sign out-------------------- */

/*Function to create a new user, with email and password, in firebase authentication and realtime database. Get values from registerForm.
If the creation of new user is successfull a call to function getRandomDrink is made, which will display a drink.
If not successfull, an error message will be displayed. */
  onSubmit = () => {
    firebase.auth().createUserWithEmailAndPassword(this.state.usermail, this.state.password)
    .then ((user) => {
      firebase.database().ref(`users/${user.uid}`).set({ email: user.email, uid: user.uid})
    })
    .then(user => console.log("User created ", user))
    .then(user => this.getRandomDrink())
    .catch(error => {
      this.setState({hasError: true})
      this.setState({error: error.message})
      console.log(error)
    })
  }
/*Function to sign in with existing user created with email and password. Same as create user if success or fail.*/
  signIn = () => {
    firebase.auth().signInWithEmailAndPassword(this.state.usermail, this.state.password)
    .then(user => console.log("User signed in", user))
    .then(user => this.getRandomDrink())
    .catch(error => {
      this.setState({hasError: true})
      if(error.code === "auth/user-not-found"){
        this.setState({error: "No user with that email adress"})
      }else if(error.code === "auth/wrong-password"){
        this.setState({error: "Wrong password"})
      }else{
        this.setState({error: error.message})
      }
      console.log(error)
    })
  }
/*Function to sign in using a Google account. Same as create user if success or fail.*/
  signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result)=> {
    const user = result.user;
    firebase.database().ref(`users/${user.uid}`).set({ email: user.email, uid: user.uid})
    .then(user => this.getRandomDrink())
    }).catch(error => {
      this.setState({hasError: true})
      this.setState({error: error.message})
      console.log(error)
    })
  }
/*Signs out the current user from firebase authentication*/
  signOut = () => {
    firebase.auth().signOut();
    console.log("Signed out successfully")
  }

  /*--------------------Handling comments-------------------- */

 /*Function to add a comment in firebase database.
 It will store the id, name and picture of the drink, the comment string and the id and mail adress of the current user.
 Then calls a function to display the comments on the current drink.*/ 
  addComment = (drinkId, drinkName, drinkThumb) => {
    const newComment = {
      text: this.state.newComment,
      userId: this.state.user.userId,
      createdBy: this.state.user.email,
      drinkId: drinkId,
      drinkName : drinkName,
      drinkThumb: drinkThumb
    }
    firebase.database().ref("comments").push(newComment)
    .then(() => {console.log("Comment added")})
    this.setState({newComment: ''})
    firebase.database().ref("comments").orderByChild("drinkId").equalTo(drinkId).limitToLast(3).on('child_added', (snapshot) => {
      const commentsArray = [...this.state.comments];
      const comment = {
        key: snapshot.key,
        value: snapshot.val()
      }
      commentsArray.push(comment);
      this.setState({ comments: commentsArray.reverse() });
    });

  }
  /*Function to display comment on a certain drink. 
  Get the data from firebase realtime database and updates state.*/
  getComments = (idDrink) => {
    firebase.database().ref("comments").orderByChild("drinkId").equalTo(idDrink).limitToLast(3).on('value', (snapshot) => {
      const commentsArray = toArray(snapshot.val())
      this.setState({ comments: commentsArray.reverse() });
    });
  }
  getAllComments = (idDrink) => {
    firebase.database().ref("comments").orderByChild("drinkId").equalTo(idDrink).on('value', (snapshot) => {
      const commentsArray = toArray(snapshot.val())
      this.setState({ comments: commentsArray.reverse() });
    });
  }
  /*Function to display all comment made by the current user.
  Get the data from firebase realtime database and updates state*/
  getUserComments = (userId) => {
    this.setState({favorites: []})
    firebase.database().ref("comments").orderByChild("userId").equalTo(userId).on('value', (snapshot) => {
      const commentsArray = toArray(snapshot.val())
      this.setState({ currentUserComments: commentsArray });
    });
    
  }
  /*Function to remove a comment from the database from the current user*/
  removeComment = (key) => {
    firebase.database().ref(`comments/${key}`).remove();
  }

/*--------------------Handling favorites-------------------- */

 /*Function to add a drink to favorites in firebase database.
 It will store the id, name and picture of the drink as well as the id of the logged in user. */ 
 addFavorite = (drinkId, drinkName, drinkThumb) => {
  const newFavorite = {
    drinkName: drinkName,
    drinkId: drinkId,
    drinkThumb: drinkThumb,
    userId: this.state.user.userId
  }
  firebase.database().ref("favorites").push(newFavorite)
  .then(() => {console.log("Favorite added")})
 }
/*Function to get the favorites matching the current user from firebase database, updates state and displays them*/
 getFavorites = (userId) => {
  this.setState({currentUserComments: []})
  firebase.database().ref("favorites").orderByChild("userId").equalTo(userId).on('value', (snapshot) => {
      const favoritesArray = toArray(snapshot.val())
      this.setState({ favorites: favoritesArray });
    });
 }
 /*Function to remove a favorite from the database, with the userid matching current user.*/
 removeFavorite = (key) => {
  firebase.database().ref(`favorites/${key}`).remove();
 }

/*--------------------API calls based on filter criteria-------------------- */
/*All functions updates state first, setting comments, currentUserComments and favorites to empty arrays. 
Otherwise the chosen drink/drinks wouldn't be shown.
Based on what button the user presses, an API call will be made to the CocktailDB API, state is updated and a list displayed.
One function takes an argument to get a specific drink with more info*/
  getRandomDrink = () => {
    this.setState({comments: []})
    this.setState({currentUserComments: []})
    this.setState({favorites: []})
    fetch('https://cors-anywhere.herokuapp.com/http://www.thecocktaildb.com/api/json/v1/8008/random.php')
    .then(response => response.json())
    .then(data => {
      this.setState({ data : data.drinks });
    }) 
   .catch(error => {
          this.setState({error : error});
    }) 
  }
  getNonAcoholic = () => {
    this.setState({currentUserComments: []})
    this.setState({favorites: []})
    fetch('https://cors-anywhere.herokuapp.com/http://www.thecocktaildb.com/api/json/v1/8008/filter.php?a=Non_Alcoholic')
    .then(response => response.json())
    .then(data => {
      this.setState({ data : data.drinks });
    }) 
   .catch(error => {
          this.setState({error : error});
    }) 
  }
  getGin = () => {
    this.setState({currentUserComments: []})
    this.setState({favorites: []})
    fetch('https://cors-anywhere.herokuapp.com/http://www.thecocktaildb.com/api/json/v1/8008/filter.php?i=Gin')
    .then(response => response.json())
    .then(data => {
      this.setState({ data : data.drinks });
    }) 
   .catch(error => {
          this.setState({error : error});
    }) 
  }
  getCocktail = () => {
    this.setState({currentUserComments: []})
    this.setState({favorites: []})
    fetch('https://cors-anywhere.herokuapp.com/http://www.thecocktaildb.com/api/json/v1/8008/filter.php?c=Cocktail')
    .then(response => response.json())
    .then(data => {
      this.setState({ data : data.drinks });
    }) 
   .catch(error => {
          this.setState({error : error});
    }) 
  }
  getChampagne = () => {
    this.setState({currentUserComments: []})
    this.setState({favorites: []})
    fetch('https://cors-anywhere.herokuapp.com/http://www.thecocktaildb.com/api/json/v1/8008/filter.php?g=Champagne_flute')
    .then(response => response.json())
    .then(data => {
      this.setState({ data : data.drinks });
    }) 
   .catch(error => {
          this.setState({error : error});
    }) 
  }
  getVodka = () => {
    this.setState({currentUserComments: []})
    this.setState({favorites: []})
    fetch('https://cors-anywhere.herokuapp.com/http://www.thecocktaildb.com/api/json/v1/8008/filter.php?i=Vodka')
    .then(response => response.json())
    .then(data => {
      this.setState({ data : data.drinks });
    }) 
   .catch(error => {
          this.setState({error : error});
    }) 
  }
  getRecipeAndComments = (drinkId) => {
    firebase.database().ref("comments").orderByChild("drinkId").equalTo(drinkId).limitToLast(3).on('child_changed', (snapshot) => {
      const commentsArray = toArray(snapshot.val())
      this.setState({ comments: commentsArray });
    });
    this.setState({currentUserComments: []})
    this.setState({favorites: []})
    fetch(`https://cors-anywhere.herokuapp.com/http://www.thecocktaildb.com/api/json/v1/8008/lookup.php?i=${drinkId}`)
    .then(response => response.json())
    .then(data => {
      this.setState({ data : data.drinks });
    }) 
   .catch(error => {
          this.setState({error : error});
    }) 
  }

  render() {

/*Variable to hold a true or false bool. Used to check what should be displayed*/
    const showDrinks = this.state.currentUserComments.length > 0 || this.state.favorites.length > 0;

/* New array to hold and display the data depending on which API call was made */
    const list = [];
    for(let i = 0; i < this.state.data.length; i ++){
        list.push(
          <div className="card" key={i}>
            <img className="card-img-top img-thumbnail" src={this.state.data[i].strDrinkThumb} alt="Drink"/>
            <div className="card-block">
              <h4 className="card-title">{this.state.data[i].strDrink}</h4>
              <ul>
                {this.state.data[i].strIngredient1 && <li>{this.state.data[i].strIngredient1} - {this.state.data[i].strMeasure1}</li> }
                {this.state.data[i].strIngredient2 && <li>{this.state.data[i].strIngredient2} - {this.state.data[i].strMeasure2}</li> }
                {this.state.data[i].strIngredient3 && <li>{this.state.data[i].strIngredient3} - {this.state.data[i].strMeasure3}</li> }
                {this.state.data[i].strIngredient4 && <li>{this.state.data[i].strIngredient4} - {this.state.data[i].strMeasure4}</li> }
                {this.state.data[i].strIngredient5 && <li>{this.state.data[i].strIngredient5} - {this.state.data[i].strMeasure5}</li> }
                {this.state.data[i].strIngredient6 && <li>{this.state.data[i].strIngredient6} - {this.state.data[i].strMeasure6}</li> }
                {this.state.data[i].strIngredient7 && <li>{this.state.data[i].strIngredient7} - {this.state.data[i].strMeasure7}</li> }
                {this.state.data[i].strIngredient8 && <li>{this.state.data[i].strIngredient8} - {this.state.data[i].strMeasure8}</li> }
                {this.state.data[i].strIngredient9 && <li>{this.state.data[i].strIngredient9} - {this.state.data[i].strMeasure9}</li> }
                {this.state.data[i].strIngredient10 && <li>{this.state.data[i].strIngredient10} - {this.state.data[i].strMeasur10}</li> }
              </ul> 
              <p className="card-text">{this.state.data[i].strInstructions}</p>
{/*If no ingredient is displayed, a button 'get recipe and comments' shows. when clicked on calls function to show more info about the drink*/}
              {!this.state.data[i].strIngredient1 && <button className="btn btn-warning m-3" onClick={ () => this.getRecipeAndComments(this.state.data[i].idDrink)}>Recipe and Comments</button>}
              <button className="btn btn-outline-warning" onClick={ () => this.addFavorite(this.state.data[i].idDrink, this.state.data[i].strDrink, this.state.data[i].strDrinkThumb)}>Add to favorites</button>
{/*If ingreidient is displayed, a 'get comments' buttons shows. calls function to get comments on the drink from database */}
              <br />
              {this.state.data[i].strIngredient1 && 
                <div>
                <button className="btn btn-outline-success" onClick={ () => {this.getComments(this.state.data[i].idDrink)}}>Get comments</button>
                  {this.state.comments.length > 0 && 
                    <div>
                      <p>{this.state.comments[0].value.text} <i> - by: {this.state.comments[0].value.createdBy}</i></p>
                      {this.state.comments[1] && <p>{this.state.comments[1].value.text} <i> - by: {this.state.comments[1].value.createdBy}</i></p>}
                      {this.state.comments[2] && <p>{this.state.comments[2].value.text} <i> - by: {this.state.comments[2].value.createdBy}</i></p>}
                      {this.state.comments[2] && <button className="btn btn-outline-success" onClick={ () => {this.getAllComments(this.state.data[i].idDrink)}}>More comments</button>}
                      {this.state.comments[3] && <p>{this.state.comments[3].value.text} <i> - by: {this.state.comments[3].value.createdBy}</i></p>}
                      {this.state.comments[4] && <p>{this.state.comments[4].value.text} <i> - by: {this.state.comments[4].value.createdBy}</i></p>}
                      {this.state.comments[5] && <p>{this.state.comments[5].value.text} <i> - by: {this.state.comments[5].value.createdBy}</i></p>}
                      {this.state.comments[6] && <p>{this.state.comments[6].value.text} <i> - by: {this.state.comments[6].value.createdBy}</i></p>}
                      {this.state.comments[7] && <p>{this.state.comments[7].value.text} <i> - by: {this.state.comments[7].value.createdBy}</i></p>}
                    </div>
                  }
                </div>
              }
              <CommentField onChange={this.onChange} onSubmit={ () => this.addComment(this.state.data[i].idDrink, this.state.data[i].strDrink, this.state.data[i].strDrinkThumb)} newComment={this.state.newComment} />
              <br />
            </div>
          </div>  
      ); 
    } 
/*New array to hold and display current users comments*/
    const userComments = [];
    for(let i = 0; i < this.state.currentUserComments.length; i++){
      userComments.push(
          <div className="card" key={i}>
          <h4 className="card-title">You have commented on</h4>
            <img className="card-img-top img-thumbnail" src={this.state.currentUserComments[i].value.drinkThumb} alt="Drink"/>
            <div className="card-block">
              <h4 className="card-title">{this.state.currentUserComments[i].value.drinkName}</h4>
              <p><i>Your comment: </i>{this.state.currentUserComments[i].value.text}</p>
              <button className="btn btn-warning m-3" onClick={ () => this.getRecipeAndComments(this.state.currentUserComments[i].value.drinkId)}>Recipe and Comments</button>
              <button className="btn btn-outline-danger" onClick={ () => {this.removeComment(this.state.currentUserComments[i].key)}}>Remove comment</button>
            </div>
          </div>
      );
    }
/*New array to hold and display current users favorites*/
    const userFavorites = [];
    for(let i = 0; i < this.state.favorites.length; i++){
      userComments.push(
        <div className="card" key={i}>
        <h4 className="card-title">You have favorized</h4>
            <img className="card-img-top img-thumbnail" src={this.state.favorites[i].value.drinkThumb} alt="Drink"/>
            <div className="card-block">
              <h4 className="card-title">{this.state.favorites[i].value.drinkName}</h4>
              <button className="btn btn-warning m-3" onClick={ () => this.getRecipeAndComments(this.state.favorites[i].value.drinkId)}>Recipe and Comments</button>
              <button className="btn btn-outline-danger" onClick={ () => {this.removeFavorite(this.state.favorites[i].key)}}>Remove favorite</button>
            </div>
        </div>      
      );
    }

/**/
    return (
      <div className="App">
        <Header>
          Drink Database
        </Header>
{/*If no user is signed in, the form will be displayed */}
        {!this.state.user &&
          <main className="container">
            <h1>Welcome to Drink Database</h1>
            <h4>Where you can find an abundance of yummy drinks</h4>
            <br />
            <h3>Please Register or Sign in</h3>
            <br />
{/*If there is an error when user is registring or signing in, an error message will show*/}
            {this.state.hasError ? <div className="errorHandling"><p>{this.state.error}</p></div> : ''}
            <div className="row justify-content-center">
              <RegisterForm onChange={this.onChange} onSubmit={this.onSubmit} value={this.state.value} />
              <SignInForm onChange={this.onChange} onSubmit={this.signIn} value={this.state.value} />
              <img src={googleLogo} className="logo" alt="Sign In with Google" onClick={this.signInWithGoogle} />
            </div>
          </main> 
        }
{/*If a user is signed in, the navbar with user info and a sign out button will be displayed. 
As well as a random drink and buttons to filter and search for more drinks.
*/}
        {this.state.user && 
          <main className="container-fluid">
            <Navbar>
              <NavButton onClick={ () => {this.getFavorites(this.state.user.userId)}}>My Favorites</NavButton>
              <NavButton onClick={ () => {this.getUserComments(this.state.user.userId)}}>My Comments</NavButton>
              <NavButton onClick={this.signOut}>SignOut</NavButton>
            </Navbar>
            <br />
            <h5 className="searchText">Search the database for different drinks by pressing a button</h5>
            <nav className="navbar navbar-inverse navbar-fixed-top justify-content-center">
                <FilterButton onClick={this.getNonAcoholic}>No alcohol</FilterButton>
                <FilterButton onClick={this.getGin}>Gin</FilterButton>
                <FilterButton onClick={this.getVodka}>Vodka</FilterButton>
                <FilterButton onClick={this.getCocktail}>Cocktails</FilterButton>
                <FilterButton onClick={this.getChampagne}>Champagne</FilterButton>
                <FilterButton onClick={this.getRandomDrink}>Random drink</FilterButton>
              </nav>
            <div className="row">
              <a className="navbar-brand" href="#"></a>
{/*If there are user comments in state, those will show and no other drinks*/}
              {this.state.currentUserComments && userComments} 
{/*If there are favorites in state, those will be displayed and no other drinks*/}
              {this.state.favorites > 0 && userFavorites}
{/*If no user comments or favorites are in state, the filtered drink/drinks will be displayed*/}
              {!showDrinks && list} 
            </div> 
            <p className="float-right"><a href="#">Back to top</a></p>
          </main> 
        }

      </div>
    );
  }
}

/*Funtion to make the objects in database to an array*/
function toArray(dbObj) {
  let array = []
  for(let item in dbObj){
    array.push({ key: item, value: dbObj[item] })
  }
  return array;
}

export default App;
