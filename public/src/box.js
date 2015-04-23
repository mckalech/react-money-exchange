var SymbolsList = require('./symbolslist');
var RatesList = require('./rateslist');
var ChangeTime = require('./changetime');

var Box = React.createClass({
	getInitialState: function(){
		return {
			period: 4000,
			ratesPairs: [ 'usd/eur', ]
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
		pairs = pairs.concat([name]);
		this.setState({ratesPairs: pairs});
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
			<div className="exchangeBox">
				<h1>Exchange</h1>
				<ChangeTime onPeriodChange={this.handlePeriodChange}/>
				<SymbolsList ratesPairs={this.state.ratesPairs} onSymbolClick={this.handleSymbolClick} />
				<RatesList period={this.state.period} ratesPairs={this.state.ratesPairs} onRemoveClick={this.handleRemoveClick}/>
			</div>
		);
	}
});
module.exports = Box;