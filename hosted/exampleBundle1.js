'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('./style.css');

var _Button = require('@material-ui/core/Button');

var _Button2 = _interopRequireDefault(_Button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var colors = ["#1B998B", "#32021F", "#08415C", "#95190C", "#E3B505"];

var mainStyle = {
  margin: '0px',
  height: "100% !important",
  width: "25%",
  display: "inline-block"
};

var textStyle = {
  margin: '0px',
  color: "white",
  textAlign: "center"
};

var buttonStyle = {
  textAlign: "center",
  margin: "5%",
  borderRadius: "50%",
  color: "white",
  backgroundColor: "#39B54A",
  border: "none",
  fontSize: "18px",
  padding: "4px 9px",
  display: "inline-block",
  boxShadow: "1px 1px 5px black"
};

var FormButton = function (_React$Component) {
  _inherits(FormButton, _React$Component);

  function FormButton() {
    _classCallCheck(this, FormButton);

    return _possibleConstructorReturn(this, (FormButton.__proto__ || Object.getPrototypeOf(FormButton)).apply(this, arguments));
  }

  return FormButton;
}(React.Component);

var ExpenseCategory = function (_React$Component2) {
  _inherits(ExpenseCategory, _React$Component2);

  function ExpenseCategory() {
    _classCallCheck(this, ExpenseCategory);

    return _possibleConstructorReturn(this, (ExpenseCategory.__proto__ || Object.getPrototypeOf(ExpenseCategory)).apply(this, arguments));
  }

  _createClass(ExpenseCategory, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { id: 'thing', style: mainStyle },
        React.createElement(
          'div',
          { id: 'category', style: { backgroundColor: colors[this.props.color] } },
          React.createElement(
            'h1',
            { style: textStyle },
            this.props.categoryName
          ),
          React.createElement(_Button2.default, null)
        )
      );
    }
  }]);

  return ExpenseCategory;
}(React.Component);

var Page = function (_React$Component3) {
  _inherits(Page, _React$Component3);

  function Page() {
    _classCallCheck(this, Page);

    return _possibleConstructorReturn(this, (Page.__proto__ || Object.getPrototypeOf(Page)).apply(this, arguments));
  }

  _createClass(Page, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { id: 'main', style: { height: "100%" } },
        React.createElement(ExpenseCategory, { color: Math.floor(Math.random() * 5), categoryName: "Food" }),
        React.createElement(ExpenseCategory, { color: Math.floor(Math.random() * 5), categoryName: "Other" })
      );
    }
  }]);

  return Page;
}(React.Component);

var init = function init() {
  ReactDOM.render(React.createElement(Page, { style: { height: "100%" } }), document.getElementById('app'));
};

window.onload = init;
