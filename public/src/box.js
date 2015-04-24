var SymbolsList = require('./symbolslist');
var RatesList = require('./rateslist');
var ChangeTime = require('./changetime');
var Storage = require('./utils');

var Box = React.createClass({
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
			<div className="exchangeBox">
				<h1>Realtime Exchange Rates</h1>
				<ChangeTime period={this.state.period} onPeriodChange={this.handlePeriodChange}/>
				<RatesList period={this.state.period} ratesPairs={this.state.ratesPairs} onRemoveClick={this.handleRemoveClick}/>
				<SymbolsList ratesPairs={this.state.ratesPairs} onSymbolClick={this.handleSymbolClick} />
				<div className="clear"></div>
			</div>
		);
	}
});
module.exports = Box;