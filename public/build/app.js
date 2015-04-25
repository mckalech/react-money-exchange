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

React.render(React.createElement(Box, null), document.getElementById('content'));
},{"./box":3}],3:[function(require,module,exports){
var SymbolsList = require('./symbolslist');
var RatesList = require('./rateslist');
var ChangeTime = require('./changetime');
var Storage = require('./utils');

var Box = React.createClass({displayName: "Box",
	getInitialState: function(){
		return {
			period: Storage.get('period') || 10000,
			ratesPairs: Storage.get('initialPairs') || []
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
			Storage.set('initialPairs', pairs);
		}else{
			alert('This pair is already in the list');
		}
	},
	deleteFromRatesPairs:function(name){
		var pairs = this.state.ratesPairs,
		ind = pairs.indexOf(name);
		pairs.splice(ind, 1);
		this.setState({ratesPairs: pairs});
		Storage.set('initialPairs', pairs);
	},
	handlePeriodChange:function(period){
		this.setState({period: period});
		Storage.set('period', period);
	},
	render : function(){
		return (
			React.createElement("div", {className: "exchangeBox"}, 
				React.createElement("h1", null, "Realtime Exchange Rates"), 
				React.createElement(ChangeTime, {period: this.state.period, onPeriodChange: this.handlePeriodChange}), 
				React.createElement(RatesList, {period: this.state.period, ratesPairs: this.state.ratesPairs, onRemoveClick: this.handleRemoveClick}), 
				React.createElement(SymbolsList, {ratesPairs: this.state.ratesPairs, onSymbolClick: this.handleSymbolClick}), 
				React.createElement("div", {className: "clear"})
			)
		);
	}
});
module.exports = Box;
},{"./changetime":4,"./rateslist":5,"./symbolslist":7,"./utils":10}],4:[function(require,module,exports){
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
					React.createElement("select", {value: this.props.period, onChange: this.handlePeriodChange}, 
						React.createElement("option", {value: "1000"}, "1 sec"), 
						React.createElement("option", {value: "2000"}, "2 sec"), 
						React.createElement("option", {value: "3000"}, "3 sec"), 
						React.createElement("option", {value: "4000"}, "4 sec"), 
						React.createElement("option", {value: "10000"}, "10 sec")
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
	handleRemoveClick: function(name){
		var pairs = this.state.pairs
		newPairs = [];

		newPairs = pairs.filter(function(pair){
			return pair.name != name;
		});
		this.setState({pairs: newPairs});
		this.props.onRemoveClick(name);
	},
	render: function(){
		var i = 0, 
			rates = [], 
			that = this,
			data = this.state.pairs,
			time,
			timeString;

		rates = data.map(function(item, i){
			return(
				React.createElement(RatesListItem, {
					key: item.name, 
					name: item.name, 
					ask: item.ask, 
					bid: item.bid, 
					onRemoveClick: that.handleRemoveClick})
			);
		});
		time = new Date();
		timeString = time.toLocaleTimeString();

		return(
			React.createElement("div", {className: "ratesList"}, 
				React.createElement("h2", null, "Rates"), 
				React.createElement("table", null, 
					React.createElement("tr", null, 
						React.createElement("th", null, "Symbol"), React.createElement("th", null, "Ask"), React.createElement("th", null, "Bid"), React.createElement("th", null)
					), 
					rates
				)
				/*<span>Last update:{timeString}</span>*/
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
			defaultSymbols : []
		}
	},
	componentDidMount: function(){
		var that = this;
		$.ajax({
			url:'/defaults',
			dataType: "json",
			type: 'GET',
		}).always(function(res){
			that.setState({
				defaultSymbols: res
			});
			that.updateSymbols(that.props.ratesPairs)
		});
		
	},
	componentWillReceiveProps:function(props){
		this.updateSymbols(props.ratesPairs)
	},
	updateSymbols: function(pairs){
		var i = 0,
			defaultSymbols = this.state.defaultSymbols;

		defaultSymbols.forEach(function(item,ind){
			if(pairs.indexOf(item.name) < 0){
				item.enabled = false;
			}else{
				item.enabled = true;
			}
		});
			
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
			that = this,
			symbols = [], 
			defaultSymbols = this.state.defaultSymbols;

		symbols = defaultSymbols.map(function(item, i){
			return(
				React.createElement(SymbolsListDefaultItem, {
					name: item.name, 
					enabled: item.enabled, 
					onSymbolClick: that.handleSymbolClick})
			);
		});
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
		var name=React.findDOMNode(this.refs.select_1).value+React.findDOMNode(this.refs.select_2).value;
		this.props.onSymbolClick(name);
	},
	render: function(){
		return(
			React.createElement("tr", {className: "symbolItem symbolItem_last"}, 
				React.createElement("td", null, 
					React.createElement("select", {ref: "select_1"}, 
						React.createElement("option", {value: "EUR"}, "Euro"), 
						React.createElement("option", {value: "USD"}, "US Dollar"), 
						React.createElement("option", {value: "GBP", selected: true}, "GB Pound"), 
						React.createElement("option", {value: "RUB"}, "Ruble")
					), 
					React.createElement("select", {ref: "select_2"}, 
						React.createElement("option", {value: "EUR"}, "Euro"), 
						React.createElement("option", {value: "USD", selected: true}, "US Dollar"), 
						React.createElement("option", {value: "GBP"}, "GB Pound"), 
						React.createElement("option", {value: "RUB"}, "Ruble")
					)
				), 
				React.createElement("td", null, !this.props.enabled ? React.createElement("span", {className: "btn", onClick: this.handleClick}, "Add"): '')
			)
		)
	}
});

module.exports = SymbolsListLastItem;
},{}],10:[function(require,module,exports){
module.exports = {
	get:function(name) {
		var data;
		if (localStorage[name]){
			data = JSON.parse(localStorage[name]);
		}
		return data;
	},
	set:function(name, props){
		localStorage[name]=JSON.stringify(props);
	}
}
},{}]},{},[2]);
