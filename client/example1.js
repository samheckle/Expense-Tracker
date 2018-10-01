import './style.css';
import Flipcard from '@kennethormandy/react-flipcard';
import '@kennethormandy/react-flipcard/dist/Flipcard.css'

const colors = ["#1B998B", "#32021F", "#08415C", "#95190C", "#E3B505"];

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleSubmit(event) {
    this.props.arr(event,  document.querySelector(`#${this.props.name}`).value);
    this.handleCancel(event);
  }

  handleCancel(event){
    this.props.clicked();
    const overlay = document.getElementsByClassName("overlay")[0];
    overlay.style.visibility = "hidden";
    event.preventDefault();
  }

  render(){
    return(
      <form id="categoryForm" action="/addColumn" method="post">
        <label for={this.props.name}>{this.props.name}</label>
        <input type="text" id={this.props.name} name={this.props.name} placeholder={this.props.placeholder}/>
        <input type="submit" value="Submit" onClick={this.handleSubmit}></input>
        <input type="submit" value="Cancel" onClick={this.handleCancel} style={{backgroundColor: "red"}}></input>
      </form>
    )
  }
}

class ExpenseForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleSubmit(event) {
    this.props.arr(event,  document.querySelector(`#${this.props.name}`).value);
    this.handleCancel(event);
  }

  handleCancel(event){
    this.props.clicked();
    const overlay = document.getElementsByClassName("overlay")[0];
    overlay.style.visibility = "hidden";
    event.preventDefault();
  }

  render(){
    return(
      <form id="categoryForm" action="/addExpense" method="post">
        <label for={this.props.name}>{this.props.name}</label>
        <input type="text" id={this.props.name} name={this.props.name} placeholder={this.props.placeholderExpense}/>
        <input type="submit" value="Submit" onClick={this.handleSubmit}></input>
        <input type="submit" value="Cancel" onClick={this.handleCancel} style={{backgroundColor: "red"}}></input>
      </form>
    )
  }
}

class ColumnButton extends React.Component {
  constructor(props){
    super(props);
    this.addColumn = this.addColumn.bind(this);
    this.state = {
      clicked: false,
      statusCode: this.props.statusCode
    };
  }

  addColumn () {
    this.setState(state => ({
      clicked: !state.clicked
    }));
    this.setState({statusCode: this.props.statusCode})
  }

  render(){
    return(
      <div id="columnButton">
        <div style={{backgroundColor: "grey"}} >
          <h1 style={{visibility: "hidden"}}>text</h1>
          <button id="newColumn" onClick={this.addColumn}>+</button>
        </div>
        {
          this.state.clicked  ?
            <div className="overlay" style={{visibility: "visible"}}>
              <div className="module">
                <NameForm name={"Expense"} placeholderExpense={"eg. Groceries"} arr={this.props.arr} clicked={this.addColumn} statusCode={this.state.statusCode}/>
              </div>
            </div>
          :null
        }
      </div>
    ) 
  }
}

class ExpenseItem extends React.Component{
  constructor() {
    super()
    this.state = {
      flipped: false,
    }
  }
  render(){
    return(
         <Flipcard flipped={this.state.flipped} type="horizontal" onClick={e => this.setState({ flipped: !this.state.flipped })}>
          <div className="Card" >1</div>
          <div className="Card" >2</div>
        </Flipcard>
    )
  }
}

class ExpenseList extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <div>
        <ExpenseItem />
      </div>
    )
  }
}

class ExpenseCategory extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      clicked: false,
      data: [],
      statusCode: ''
    }
    this.addExpenseItem = this.addExpenseItem.bind(this);
  }

  addExpenseItem(){
    this.setState(state => ({
      clicked: !state.clicked
    }));
  }

  postNewExpense(event, val){
    const form1 = document.querySelector("#categoryForm");
    const method = form1.getAttribute('method');
    const action = form1.getAttribute('action');

    console.log(action);

    const xhr = new XMLHttpRequest();
    xhr.open(method, action);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onload = () => {
      let obj ="";
      if(xhr.response != ''){
        obj = JSON.parse(xhr.response);
      }
      if(xhr.status === 201){
        this.state.data.push(val)
      }
      this.setState({data: this.state.data, statusCode: xhr.status})
    };
    
    xhr.send(`name=${val}`);

    event.preventDefault();
    return false;

  }

  render() {
    return (
      <div id="columnData">
        <div id="category" style={{backgroundColor: colors[this.props.color], borderTop: `10px solid ${colors[this.props.color]}`}} >
          <h1>{this.props.categoryName}</h1>
          <ExpenseList />
          <div id="bottom">
            <button id="add" onClick={this.addExpenseItem}>+</button>
          </div>

        </div>
          {
            this.state.clicked  ?
              <div className="overlay" style={{visibility: "visible"}}>
                <div className="module">
                  <NameForm name={"Category"} placeholder={"eg. Groceries"} clicked={this.addColumn}/>
                </div>
              </div>
            :null
          }
        </div>
    )
  }
}

class CategoryList extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        data: this.props.listprop,
        statusCode: this.props.statusCode
      };
      this.createNodes = this.createNodes.bind(this);
      this.display = "none";
      this.colorArray = [];
      this.expenseNodes = [];
    }

    createNodes(){
      this.display = "inline-block";
      switch (this.props.statusCode){
        case 204:
          alert("Category already exists!");
          console.dir(`${this.props.statusCode}: Already exists!`);
          return this.expenseNodes;
        case 201:
          console.dir(`${this.props.statusCode}: Created!`)
          const data = this.state.data;
          this.colorArray.push(Math.floor(Math.random()*5));
          const expenseNode = <ExpenseCategory color={this.colorArray[data.length-1]} categoryName={data[data.length-1]}/>;
          this.expenseNodes.push(expenseNode);
          return this.expenseNodes;
        default:
          return this.expenseNodes;
      }
    }

    render(){
      return <div id="nodes" style={{display: `${this.display}`}}>{this.createNodes()}</div>;
    }
}

class Page extends React.Component {
  constructor(props){
    super(props);
    this.state = { 
      data: [],
      statusCode: '' 
    };

    this.postNewColumn=this.postNewColumn.bind(this);
  }

  postNewColumn(event, val){
    const form1 = document.querySelector("#categoryForm");
    const method = form1.getAttribute('method');
    const action = form1.getAttribute('action');

    console.log(action);

    const xhr = new XMLHttpRequest();
    xhr.open(method, action);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onload = () => {
      let obj ="";
      if(xhr.response != ''){
        obj = JSON.parse(xhr.response);
      }
      if(xhr.status === 201){
        this.state.data.push(val)
      }
      this.setState({data: this.state.data, statusCode: xhr.status})
    };
    
    xhr.send(`name=${val}`);

    event.preventDefault();
    return false;

  }

  render(){
    return (
      <div id="main">
        
        <ColumnButton color={Math.floor(Math.random() * 5)} categoryName={"Other"} arr={this.postNewColumn} statusCode={this.state.statusCode}/> 
        <CategoryList listprop={this.state.data}  statusCode={this.state.statusCode} />
      </div>
    )
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('app')
);  