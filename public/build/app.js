(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
  Copyright (c) 2015 Jed Watson.
  
  Licensed under the MIT License (MIT), see
  https://github.com/JedWatson/classnames/blob/master/LICENSE
*/

function classNames() {
	var classes = '';
	var arg;

	for (var i = 0; i < arguments.length; i++) {
		arg = arguments[i];
		if (!arg) {
			continue;
		}

		if ('string' === typeof arg || 'number' === typeof arg) {
			classes += ' ' + arg;
		} else if (Object.prototype.toString.call(arg) === '[object Array]') {
			classes += ' ' + classNames.apply(null, arg);
		} else if ('object' === typeof arg) {
			for (var key in arg) {
				if (!arg.hasOwnProperty(key) || !arg[key]) {
					continue;
				}
				classes += ' ' + key;
			}
		}
	}
	return classes.substr(1);
}

// safely export classNames for node / browserify
if (typeof module !== 'undefined' && module.exports) {
	module.exports = classNames;
}

// safely export classNames for RequireJS
if (typeof define !== 'undefined' && define.amd) {
	define('classnames', [], function() {
		return classNames;
	});
}

},{}],2:[function(require,module,exports){
Box = require('./box');

React.render(React.createElement(Box, null), $('#content').get(0))
},{"./box":3}],3:[function(require,module,exports){
var SymbolsList = require('./symbolslist');
var RatesList = require('./rateslist');
var ChangeTime = require('./changetime');

var Box = React.createClass({displayName: "Box",
	getInitialState: function(){
		return {
			period: 10000,
			ratesPairs: [ 'EUR/USD']
		};
	},
	componentDidMount: function(){
		//setInterval(this.loadCommentsFromServer, this.props.pollInterval);
	},
	handleSymbolClick: function(name){
		this.addInRatesPairs(name);
	},
	handleRemoveClick: function(name){
		this.deleteFromRatesPairs(name);

	},
	addInRatesPairs:function(name){
		var pairs = this.state.ratesPairs;
		if(pairs.indexOf(name)<0){
			pairs = pairs.concat([name]);
			this.setState({ratesPairs: pairs});
		}else{
			alert('This pair is already in the list');
		}
	},
	deleteFromRatesPairs:function(name){
		var pairs = this.state.ratesPairs,
		ind = pairs.indexOf(name);
		pairs.splice(ind, 1);
		this.setState({ratesPairs: pairs});
	},
	handlePeriodChange:function(period){
		this.setState({period: period});
	},
	render : function(){
		return (
			React.createElement("div", {className: "exchangeBox"}, 
				React.createElement("h1", null, "Realtime Exchange Rates"), 
				React.createElement(ChangeTime, {onPeriodChange: this.handlePeriodChange}), 
				React.createElement(RatesList, {period: this.state.period, ratesPairs: this.state.ratesPairs, onRemoveClick: this.handleRemoveClick}), 
				React.createElement(SymbolsList, {ratesPairs: this.state.ratesPairs, onSymbolClick: this.handleSymbolClick}), 
				React.createElement("div", {className: "clear"})
			)
		);
	}
});
module.exports = Box;
},{"./changetime":4,"./rateslist":5,"./symbolslist":7}],4:[function(require,module,exports){
var ChangeTime = React.createClass({displayName: "ChangeTime",
	handlePeriodChange:function(e){
		this.props.onPeriodChange(e.target.value);
	},
	render: function(){
		return(
			React.createElement("div", {className: "changeTime"}, 
				React.createElement("h2", null, "Settings"), 
				React.createElement("div", null, 
					React.createElement("span", null, "Data refresh period:"), 
					React.createElement("select", {onChange: this.handlePeriodChange}, 
						React.createElement("option", {value: "1000"}, "1 sec"), 
						React.createElement("option", {value: "2000"}, "2 sec"), 
						React.createElement("option", {value: "3000"}, "3 sec"), 
						React.createElement("option", {value: "4000"}, "4 sec"), 
						React.createElement("option", {selected: true, value: "10000"}, "10 sec")
					)
				)
			)
		);
	}
});

module.exports = ChangeTime;
},{}],5:[function(require,module,exports){

var RatesListItem = require('./rateslistitem');

var RatesList = React.createClass({displayName: "RatesList",
	getInitialState: function(){
		return{
			pairs: []
		}
	},
	componentDidMount: function(){
		this.updatePairs(this.props.ratesPairs);
		this.setTimer(this.props.period);
	},
	componentWillReceiveProps:function(props){
		this.updatePairs(props.ratesPairs);
		this.setTimer(props.period);
	},
	timer : null,
	setTimer: function(period){
		var that = this;
		clearInterval(that.timer);
		that.timer = setInterval(function(){
			that.updatePairs(that.props.ratesPairs)
		}, period);
	},
	updatePairs: function(pairs){
		var that = this;
		$.ajax({
			url:'/bids',
			dataType: "json",
			type: 'GET',
			data:{
				pairs:pairs
			}
		}).always(function(res){
			that.setState({
				pairs: res
			});
		});
	},
	render: function(){
		var i = 0, 
			rates = [], 
			//data = this.props.data;
			data = this.state.pairs;

		for(;i<data.length;i++){
			rates.push(
				React.createElement(RatesListItem, {
					key: data[i].name, 
					name: data[i].name, 
					ask: data[i].ask, 
					bid: data[i].bid, 
					onRemoveClick: this.props.onRemoveClick})
			)
		}

		return(
			React.createElement("div", {className: "ratesList"}, 
				React.createElement("h2", null, "Rates"), 
				React.createElement("table", null, 
					React.createElement("tr", null, 
						React.createElement("th", null, "Symbol"), React.createElement("th", null, "Ask"), React.createElement("th", null, "Bid"), React.createElement("th", null)
					), 
					rates
				)
			)
		);
	}
});

module.exports = RatesList;
},{"./rateslistitem":6}],6:[function(require,module,exports){
var classNames = require('classNames');

var RatesListItem = React.createClass({displayName: "RatesListItem",
	getInitialState: function(){
		return{
			loading: false
		}
	},
	handleClick:function(){
		this.props.onRemoveClick(this.props.name);
		this.setState({loading:true})
	},
	render: function(){
		
		var classes = classNames({
			'rateItem': true,
			'rateItem_disabled': this.state.loading
		});
		return(
			React.createElement("tr", {className: classes}, 
				React.createElement("td", null, this.props.name), 
				React.createElement("td", null, this.props.ask), 
				React.createElement("td", null, this.props.bid), 
				React.createElement("td", null, React.createElement("span", {className: "btn", onClick: this.handleClick}, "Remove"))
			)
		)
	}
});

module.exports = RatesListItem;
},{"classNames":1}],7:[function(require,module,exports){

var SymbolsListDefaultItem = require('./symbolslistdefaultitem');

var SymbolsListLastItem = require('./symbolslistlastitem');

var SymbolsList = React.createClass({displayName: "SymbolsList",
	getInitialState: function(){
		return{
			defaultSymbols: [
				{
					name:'EUR/USD',
					enabled:false
				},
				{
					name:'USD/RUB',
					enabled:false
				},
				{
					name:'EUR/RUB',
					enabled:false
				}
			]
		}
	},
	componentDidMount: function(){
		this.updateSymbols(this.props.ratesPairs)
	},
	componentWillReceiveProps:function(props){
		this.updateSymbols(props.ratesPairs)
	},
	updateSymbols: function(pairs){
		var i = 0,
			defaultSymbols = this.state.defaultSymbols;

		for(;i<defaultSymbols.length;i++){
			if(pairs.indexOf(defaultSymbols[i].name) < 0){
				defaultSymbols[i].enabled = false;
			}else{
				defaultSymbols[i].enabled = true;
			}
		}
		this.setState({
			defaultSymbols: defaultSymbols
		});

	},
	handleSymbolClick:function(name){
		var defaultSymbols = this.state.defaultSymbols,
			i = 0;

		this.props.onSymbolClick(name);
		for(;i<defaultSymbols.length;i++){
			if(defaultSymbols[i].name===name){
				defaultSymbols[i].enabled = true;
				break;
			}
		}
		this.setState({defaultSymbols: defaultSymbols});
	},
	render: function(){
		var i = 0, 
			symbols = [], 
			defaultSymbols = this.state.defaultSymbols;

		for(;i<defaultSymbols.length;i++){
			symbols.push(React.createElement(SymbolsListDefaultItem, {name: defaultSymbols[i].name, enabled: defaultSymbols[i].enabled, onSymbolClick: this.handleSymbolClick}))
		}
		symbols.push(React.createElement(SymbolsListLastItem, {enabled: false, onSymbolClick: this.handleSymbolClick}))
		
		return(
			React.createElement("div", {className: "symbolsList"}, 
				React.createElement("h2", null, "Symbols"), 
				React.createElement("table", null, 
					symbols
				)
			)
		);
	}
});

module.exports = SymbolsList;
},{"./symbolslistdefaultitem":8,"./symbolslistlastitem":9}],8:[function(require,module,exports){
var SymbolsListDefaultItem = React.createClass({displayName: "SymbolsListDefaultItem",
	handleClick:function(){
		this.props.onSymbolClick(this.props.name);
	},
	render: function(){
		return(
			React.createElement("tr", {className: "symbolItem"}, 
				React.createElement("td", null, this.props.name), 
				React.createElement("td", null, !this.props.enabled ? React.createElement("span", {className: "btn", onClick: this.handleClick}, "Add"): React.createElement("span", {className: "btn btn_disabled"}, "Add"))
			)
		)
	}
});

module.exports = SymbolsListDefaultItem;
},{}],9:[function(require,module,exports){
var SymbolsListLastItem = React.createClass({displayName: "SymbolsListLastItem",
	handleClick:function(e){
		var $this = $(e.target),
			$selects = $this.closest('tr').find('select'),
			name=$selects.eq(0).val()+'/'+$selects.eq(1).val();
		this.props.onSymbolClick(name);
	},
	render: function(){
		return(
			React.createElement("tr", {className: "symbolItem"}, 
				React.createElement("td", null, 
					React.createElement("select", null, 
						React.createElement("option", {selected: true}, "EUR"), 
						React.createElement("option", null, "USD"), 
						React.createElement("option", null, "GBP"), 
						React.createElement("option", null, "RUB")
					), 
					React.createElement("select", null, 
						React.createElement("option", null, "EUR"), 
						React.createElement("option", {selected: true}, "USD"), 
						React.createElement("option", null, "GBP"), 
						React.createElement("option", null, "RUB")
					)
				), 
				React.createElement("td", null, !this.props.enabled ? React.createElement("span", {className: "btn", onClick: this.handleClick}, "Add"): '')
			)
		)
	}
});

module.exports = SymbolsListLastItem;
},{}]},{},[2]);
