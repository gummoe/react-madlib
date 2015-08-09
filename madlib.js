// The Madlib component
var Madlib = React.createClass({
  render: function() {
    return (
      <div className="madlib">
        {this.props.data}
      </div>
    );
  }
});

// MadlibBlank component is a form for words that have been removed
// from the original madlib text
var MadlibBlank = React.createClass({
  render: function() {
    return (
        <input type="text" className="madlib-blank"/>
    );
  }
});

// MadlibForm component is a form for submitting new Madlib text
var MadlibForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var madlibText = React.findDOMNode(this.refs.madlibText).value.trim();
    var numBlanks = React.findDOMNode(this.refs.numBlanks).value;
    if(!madlibText || !numBlanks) {
      return;
    }
    if(madlibText.toString().split(" ").length <= numBlanks) {
      return;
    }

    this.props.onMadlibSubmit({text: madlibText, numBlanks: numBlanks})
    // Clear the form
    React.findDOMNode(this.refs.madlibText).value = '';
    React.findDOMNode(this.refs.numBlanks).value = '';
  },
  render: function() {
    return (
      <div className="madlibForm" id="madlib-form-container">
        <h2>Submit your madlib</h2>
        <p>Enter text and the number of blanks that you would like into the form below.
        <strong> Note:</strong> The number of blanks must be greater than the number of words</p>
        <form id="madlib-form" onSubmit={this.handleSubmit}>
          <textarea className="form-textarea" ref="madlibText" /><br />
          Number of blanks: <input type="number" min="1" ref="numBlanks" /><br />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
});

// Parent component for madlib - the 'holder', basically
var MadlibBox = React.createClass({
  handleMadlibSubmit: function (newMadlib) {
    var newMadlib = {
      text: newMadlib.text,
      numBlanks: newMadlib.numBlanks
    };
    this.setState({data: newMadlib});
    this.prepareMadlib();
  },
  getInitialState: function() {
    return {data: null};
  },
  componentDidMount: function() {
    this.setState({data: data});
  },
  // Dissects the madlib text into an array, replacing randomly selected
  // words with MadlibComponents
  prepareMadlib: function() {
    madlibText = this.state.data.text;
    numBlanks = this.state.data.numBlanks;

    // Get the madlib text and split into an array
    var madlibTextArray = madlibText.toString().split(" ");

    // Replace words in array with a MadlibComponent n number of times
    for(var i = 0; i < numBlanks; i++) {
      var chunkNum = Math.floor(Math.random() * (madlibTextArray.length + 1));
      madlibTextArray[chunkNum] = <MadlibBlank />;
    }

    // Just to be nice, split the master array into array of strings and
    // MadlibComponents where each index contains a string or a MadlibComponent
    var bunches = [];
    var tempString = '';
    for(item in madlibTextArray){
      if(typeof(madlibTextArray[item]) == 'string'){
        tempString = tempString + ' ' + madlibTextArray[item];
      } else {
        bunches.push(tempString);
        bunches.push(madlibTextArray[item]);
        tempString = '';
      }
    }
    // Make sure to add the leftovers
    bunches.push(tempString);
    return bunches;
  },
  render: function() {
    preparedMadlib = null;
    if(this.state.data) {
      preparedMadlib = this.prepareMadlib();
    }
    return (
      <div className="madlibBox" id="madlib-box-container">
        <h1>Madlib Maker</h1>
        <h3>Get started with the Madlib below or submit your own!</h3>
        <Madlib data={preparedMadlib} />
        <MadlibForm onMadlibSubmit={this.handleMadlibSubmit}/>
      </div>
    );
  }
});

// Initial demo data
var data = {
  text: "Now this is a story all about how My life got flipped turned upside down And I'd like to take a minute just sit right there I'll tell you how I became the prince of a town called Bel-Air In west Philadelphia born and raised On the playground is where I spent most of my days Chillin' out maxin' relaxin' all cool And all shootin' some b-ball outside of the school When a couple of guys who were up to no good Started makin' trouble in my neighborhood I got in one little fight and my mom got scared And said you're movin' with your auntie and uncle in Bel-Air",
  numBlanks: 5
}

React.render(
  <MadlibBox data={data}/>,
  document.getElementById('content')
);
