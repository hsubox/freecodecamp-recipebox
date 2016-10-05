var React = require('react');
var ReactDOM = require('react-dom');
var $ = require("jquery");

var DisplayIngredients = React.createClass({
  propTypes: function() {
    return {
      ingredients: React.PropTypes.array.isRequired
    };
  },
  iter: function() {
    return this.props.ingredients.map(function(ingredient) {
      return (
        <li>{ingredient}</li>
      );
    });
  },
  render: function() {
    return (
      <div className="container">
        <h4>Ingredients:</h4>
        <ul>
          {this.iter()}
        </ul>
      </div>
    );
  }
});

var DisplayRecipes = React.createClass({
  propTypes: function() {
    return {
      recipe: React.PropTypes.array.isRequired
    };
  },
  handleRecipeEdit: function(recipe) {
    var newRecipes = this.props.recipes.map(function(r) {
      return (r.id == recipe.id ? recipe : r);
    });
    this.props.onRecipeEdit(newRecipes);
  },
  handleRecipeDelete: function(recipe) {
    var newRecipes = this.props.recipes.filter(function(r) {
      return (r.id != recipe.id);
    });
    this.props.onRecipeEdit(newRecipes);
  },
  iter: function() {
    var currentRecipes = this;
    return this.props.recipes.map(function(recipe) {
      return (
        <div className="panel panel-default">
          <div className="panel-heading" role="tab" id={"heading"+recipe.id}>
            <h4 className="panel-title">
              <a role="button" data-toggle="collapse" data-parent="#accordion" href={"#collapse"+recipe.id} aria-expanded="false" aria-controls={"collapse"+recipe.id}>
                {recipe.name}
              </a>
            </h4>
          </div>
          <div id={"collapse"+recipe.id} className="panel-collapse collapse" role="tabpanel" aria-labelledby={"heading"+recipe.id}>
            <div className="panel-body">
              <DisplayIngredients ingredients={recipe.ingredients}/>
              <EditRecipe initialRecipe={recipe} onRecipeEdit={currentRecipes.handleRecipeEdit} onRecipeDelete={currentRecipes.handleRecipeDelete}/>
            </div>
          </div>
        </div>
      );
    });
  },
  render: function() {
    return (
      <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">{this.iter()}</div>
    );
  }
});

var AddRecipe = React.createClass({
  getInitialState: function() {
    return {recipeName: '', ingredientsList: ''};
  },
  handleRecipeNameChange: function(e) {
    this.setState({recipeName: e.target.value});
  },
  handleIngredientsListChange: function(e) {
    this.setState({ingredientsList: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var recipeName = this.state.recipeName.toString().trim();
    var ingredientsList = this.state.ingredientsList.toString().trim().split(",");
    if (!recipeName || !ingredientsList) {
      return;
    }
    this.props.onRecipeSubmit({name: recipeName, ingredients: ingredientsList})
    this.setState({recipeName: '', ingredientsList: ''});
  },
  render: function() {
    return (
      <div className="container container-form">
      <h4>New:</h4>
      <form className="recipe-form" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label for="recipename" className="control-label">Recipe Name:</label>
          <input
            type="text"
            id="recipename"
            placeholder="Name"
            value={this.state.recipeName}
            onChange={this.handleRecipeNameChange}
            className="form-control"
            />
        </div>
        <div className="form-group">
          <label for="ingredientslist" className="control-label">Ingredients:</label>
          <input
            type="text"
            id="ingredientslist"
            placeholder="Enter ingredients as comma separated values"
            value={this.state.ingredientsList}
            onChange={this.handleIngredientsListChange}
            className="form-control"
            />
        </div>
        <div className="form-group">
          <input type="submit" className="btn btn-primary" value="Add" />
        </div>
      </form>
      </div>
    );
  }
});

var EditRecipe = React.createClass({
  getInitialState: function() {
    return {
      recipeName: this.props.initialRecipe.name,
      ingredientsList: this.props.initialRecipe.ingredients
    };
  },
  handleRecipeNameChange: function(e) {
    this.setState({recipeName: e.target.value});
  },
  handleIngredientsListChange: function(e) {
    this.setState({ingredientsList: e.target.value});
  },
  handleEdit: function(e) {
    e.preventDefault();
    var recipeName = this.state.recipeName.toString().trim();
    var ingredientsList = this.state.ingredientsList.toString().trim().split(",");
    if (!recipeName || !ingredientsList) {
      return;
    }
    this.props.onRecipeEdit({id: this.props.initialRecipe.id, name: recipeName, ingredients: ingredientsList});
  },handleDelete: function(e) {
    var idToDelete = this.props.initialRecipe.id;
    this.props.onRecipeDelete({id: idToDelete});
  },
  render: function() {
    return (
      <div className="container container-form">
      <form className="recipe-form" onSubmit={this.handleEdit}>
        <h4>Modify:</h4>
        <div className="form-group">
          <label for="recipename" className="control-label">Recipe Name:</label>
          <input
            type="text"
            id="recipename"
            placeholder="Enter name"
            value={this.state.recipeName}
            onChange={this.handleRecipeNameChange}
            className="form-control"
            />
        </div>
        <div className="form-group">
          <label for="ingredientslist" className="control-label">Ingredients:</label>
          <input
            type="text"
            id="ingredientslist"
            placeholder="Enter ingredients as comma separated values"
            value={this.state.ingredientsList}
            onChange={this.handleIngredientsListChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <input type="submit" className="btn btn-primary" value="Edit" />
          <input type="button" className="btn btn-danger" value="Delete" onClick={this.handleDelete}/>
        </div>
      </form>
      </div>
    );
  }
});

var RecipeBox = React.createClass({
  getInitialState: function() {
    if (localStorage.getItem("_jennhsu_recipes")) {
      return { recipes: JSON.parse(localStorage["_jennhsu_recipes"])};
    } else {
      return { recipes:
        [{
          id: "1",
          name: "Moravian Spice Cookies",
          ingredients: ["flour", "light brown sugar", "ground ginger", "ground cinnamon", "ground allspice", "baking soda", "salt", "ground cloves", "unsalted butter", "molasses"]
        }, {
          id: "2",
          name: "Chewy Sugar Cookies",
          ingredients: ["flour", "baking soda", "baking powder", "salt", "sugar", "cream cheese", "unsalted butter", "vegetable oil", "egg", "milk", "vanilla extract"]
        }, {
          id: "3",
          name: "Spritz Cookies",
          ingredients: ["egg yolk", "heavy cream", "vanilla extract", "unsalted butter", "sugar", "salt", "flour"]
        }, {
          id: "4",
          name: "Meringue Cookies",
          ingredients: ["egg whites", "cream of tartar", "sugar", "vanilla extract"]
        }] };
    }
  },
  handleRecipeEdit: function(newRecipes) {
    this.setState({recipes: newRecipes});
    localStorage.setItem("_jennhsu_recipes", JSON.stringify(newRecipes));
  },
  handleRecipeSubmit: function(recipe) {
    var recipes = this.state.recipes;
    recipe.id = new Date().getUTCMilliseconds().toString();
    var newRecipes = recipes.concat([recipe]);
    this.setState({recipes: newRecipes});
    localStorage.setItem("_jennhsu_recipes", JSON.stringify(newRecipes));
  },
  render: function() {
    return (
      <div className="container" id="recipe-box-container">
        <DisplayRecipes recipes={this.state.recipes} onRecipeEdit={this.handleRecipeEdit}/>
        <AddRecipe onRecipeSubmit={this.handleRecipeSubmit}/>
      </div>
    );
  }
});

ReactDOM.render(<RecipeBox />, document.getElementById('react-app'));
