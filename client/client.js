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
    this.props.arr(event, document.querySelector(`#${this.props.name}`).value);
    this.handleCancel(event);
  }

  handleCancel(event) {
    this.props.clicked();
    const overlay = document.getElementsByClassName("overlay")[0];
    overlay.style.visibility = "hidden";
    event.preventDefault();
  }

  render() {
    return (
      <form id="categoryForm" action="/addColumn" method="post">
        <label for={this.props.name}>{this.props.name}</label>
        <input type="text" id={this.props.name} name={this.props.name} placeholder={this.props.placeholder} />
        <input type="submit" value="Submit" onClick={this.handleSubmit}></input>
        <input type="submit" value="Cancel" onClick={this.handleCancel} style={{ backgroundColor: "red" }}></input>
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
    let data = [];
    data.push(document.querySelector("#Item").value);
    data.push(document.querySelector("#Amount").value);
    data.push(document.querySelector("#Date").value);
    data.push(document.querySelector("#Notes").value);
    this.props.arr(event, data);
    this.handleCancel(event);
  }

  handleCancel(event) {
    this.props.clicked();
    const overlay = document.getElementsByClassName("overlay")[0];
    overlay.style.visibility = "hidden";
    event.preventDefault();
  }

  render() {
    return (
      <form id="categoryForm" action="/addExpense" method="post">
        {/* item name */}
        <label for="Item">Item</label>
        <input type="text" id="Item" name="Item" placeholder="eg. Taco Bell" />
        {/* amount */}
        <label for="Amount">Amount</label>
        <input type="text" id="Amount" name="Amount" placeholder="eg. 14.50" />
        {/* date */}
        <label for="Date">Date</label>
        <input type="date" style={{ fontSize: "1.5em" }} id="Date" name="Date"  />
        {/* notes */}
        <label for="Notes">Notes</label>
        <input type="text" id="Notes" name="Notes" placeholder="eg. paid for Peter, got quesadillas" />

        {/* submit / cancel buttons */}
        <input type="submit" value="Submit" onClick={this.handleSubmit}></input>
        <input type="submit" value="Cancel" onClick={this.handleCancel} style={{ backgroundColor: "red" }}></input>
      </form>
    )
  }
}

class ColumnButton extends React.Component {
  constructor(props) {
    super(props);
    this.addColumn = this.addColumn.bind(this);
    this.state = {
      clicked: false,
      statusCode: this.props.statusCode
    };
  }

  addColumn() {
    this.setState(state => ({
      clicked: !state.clicked
    }));
    this.setState({ statusCode: this.props.statusCode })
  }

  render() {
    return (
      <div id="columnButton">
        <div style={{ backgroundColor: "grey" }} >
          <h1 style={{ visibility: "hidden" }}>text</h1>
          <button id="newColumn" onClick={this.addColumn}>+</button>
        </div>
        {
          this.state.clicked ?
            <div className="overlay" style={{ visibility: "visible" }}>
              <div className="module">
                <NameForm name={"Category"} placeholderExpense={"eg. Food"} arr={this.props.arr} clicked={this.addColumn} statusCode={this.state.statusCode} />
              </div>
            </div>
            : null
        }
      </div>
    )
  }
}

class ExpenseItem extends React.Component {
  constructor() {
    super()
    this.state = {
      flipped: false,
    }
  }
  render() {
    return (
      <Flipcard flipped={this.state.flipped} type="horizontal" onClick={e => this.setState({ flipped: !this.state.flipped })}>
        <div className="Card">
          <div className="date">
            {this.props.data[2]}
          </div>
          <div className="number">
            {this.props.data[1]}
          </div>
        </div>
        <div className="Card" >
          <div className="itemTitle">
            {this.props.data[0]}
          </div>
          <div>
            {this.props.data[3]}
          </div>
        </div>
      </Flipcard>
    )
  }
}

class ExpenseList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      statusCode: this.props.statusCode
    };
    this.createNodes = this.createNodes.bind(this);
    this.expenseNodes = [];
  }

  shouldComponentUpdate(nextProps, nextState){
    return (nextProps.data != this.props.data);
  }

  createNodes() {
    switch (this.props.statusCode) {
      case 201:
        console.dir(`${this.props.statusCode}: Created expense!`)
        const expenseNode = <ExpenseItem data={this.props.data} />;
        this.expenseNodes.push(expenseNode);
        return this.expenseNodes;
      case 400:
        return;
      default:
        return this.expenseNodes;
    }
  }

  render() {
    return <div id="node-cards">{this.createNodes()}</div>
  }
}

class ExpenseCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
      data: [],
      statusCode: ''
    }
    this.addExpenseItem = this.addExpenseItem.bind(this);
    this.postNewExpense = this.postNewExpense.bind(this);
  }

  addExpenseItem() {
    this.setState(state => ({
      clicked: !state.clicked
    }));
  }

  postNewExpense(event, val) {
    const form1 = document.querySelector("#categoryForm");
    const method = form1.getAttribute('method');
    const action = form1.getAttribute('action');

    console.log(method + " " + action);

    const xhr = new XMLHttpRequest();
    xhr.open(method, action);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onload = () => {
      this.state.data = [];
      let obj = "";
      if (xhr.response != '') {
        obj = JSON.parse(xhr.response);
      }
      for (var i = 0; i < val.length; i++) {
        this.state.data.push(val[i]);
      }
      if(xhr.status === 400){
        alert("Please enter required items: " + obj.message);
        console.log(obj);
      }
      
      this.setState({ data: this.state.data, statusCode: xhr.status })
    };

    xhr.send(`item=${val[0]}&amount=${val[1]}&date=${val[2]}&notes=${val[3]}`);

    event.preventDefault();
    return false;

  }

  render() {
    return (
      <div id="columnData">
        <div id="category" style={{ backgroundColor: colors[this.props.color], borderTop: `10px solid ${colors[this.props.color]}` }} >
          <h1>{this.props.categoryName}</h1>
          <ExpenseList data={this.state.data} statusCode={this.state.statusCode} previousDataCards={this.props.previousDataCards} />
          <div id="bottom">
            <button id="add" onClick={this.addExpenseItem}>+</button>
          </div>

        </div>
        {
          this.state.clicked ?
            <div className="overlay" style={{ visibility: "visible" }}>
              <div className="module">
                <ExpenseForm clicked={this.addExpenseItem} arr={this.postNewExpense} />
              </div>
            </div>
            : null
        }
      </div>
    )
  }
}

class CategoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.listprop,
      statusCode: this.props.statusCode
    };
    this.createNodes = this.createNodes.bind(this);
    this.display = "none";
    this.colorArray = [];
    this.expenseNodes = [];
    if (this.state.data != undefined && this.state.data.length > 0) {
      for (var i = 0; i < this.state.data.length; i++) {
        this.colorArray.push(Math.floor(Math.random() * 5));
        const expenseNode = <ExpenseCategory color={this.colorArray[i]} categoryName={this.state.data[i]} previousDataCards={this.props.previousDataCards} />;
        this.expenseNodes.push(expenseNode);
      }
      this.display = "inline-block"
    }
  }

  createNodes() {
    this.display = "inline-block";
    switch (this.props.statusCode) {
      case 204:
        alert("Category already exists!");
        console.dir(`${this.props.statusCode}: Already exists!`);
        return this.expenseNodes;
      case 201:
        console.dir(`${this.props.statusCode}: Created!`)
        const data = this.state.data;
        this.colorArray.push(Math.floor(Math.random() * 5));
        const expenseNode = <ExpenseCategory color={this.colorArray[data.length - 1]} categoryName={data[data.length - 1]} />;
        this.expenseNodes.push(expenseNode);
        return this.expenseNodes;
      default:
        return this.expenseNodes;
    }
  }

  render() {
    return <div id="nodes" style={{ display: `${this.display}` }}>{this.createNodes()}</div>;
  }
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      statusCode: ''
    };

    this.postNewColumn = this.postNewColumn.bind(this);
    this.resetColumns = this.resetColumns.bind(this);

    this.resetColumns();
  }

  postNewColumn(event, val) {
    const form1 = document.querySelector("#categoryForm");
    const method = form1.getAttribute('method');
    const action = form1.getAttribute('action');

    console.log(method + " "+action);

    const xhr = new XMLHttpRequest();
    xhr.open(method, action);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onload = () => {
      let obj = "";
      if (xhr.response != '') {
        obj = JSON.parse(xhr.response);
      }
      if (xhr.status === 201) {
        this.state.data.push(val)
      }
      if(xhr.status === 400){
        alert(obj.message);
        console.dir(obj.message);
      }
      this.setState({ data: this.state.data, statusCode: xhr.status })
    };

    xhr.send(`name=${val}`);

    event.preventDefault();
    return false;

  }

  resetColumns() {
    if (this.props.previousDataColumns != undefined && this.props.previousDataColumns.length > 0) {
      for (var i = 0; i < this.props.previousDataColumns.length; i++) {
        this.state.data.push(this.props.previousDataColumns[i].name);
      }
      this.setState({ data: this.state.data, statusCode: this.props.statusCode });
    }
  }

  render() {
    return (
      <div id="main">
        <ColumnButton color={Math.floor(Math.random() * 5)} categoryName={"Other"} arr={this.postNewColumn} statusCode={this.state.statusCode} />
        <CategoryList listprop={this.state.data} statusCode={this.state.statusCode} previousDataCards={this.props.previousDataCards} />
      </div>
    )
  }
}

const init = () => {
  const method = '/getPage';
  const xhr = new XMLHttpRequest();
  xhr.open("GET", method);
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.onload = () => {
    const obj = JSON.parse(xhr.response);
    var arrayColumns = [];
    if (Object.keys(obj.columns).length > 0) {
      arrayColumns = Object.keys(obj.columns).map(function (key) {
        return obj.columns[key];
      });
    }
    console.dir("GET " + method);
    switch (xhr.status) {
      case 200:
        console.dir(xhr.status + " OK")
      case 404:
        alert(obj.message);
    }
    ReactDOM.render(
      <Page previousDataColumns={arrayColumns} previousDataCards={obj.cards} statusCode={xhr.status} />,
      document.getElementById('app')
    );
  }

  xhr.send();
}

window.onload = init;

// ReactDOM.render(
//   <Page previousDataColumns={null} previousDataCards={null}/>,
//   document.getElementById('app')
// );  