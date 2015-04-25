
var RatesListItem = require('./rateslistitem');

var RatesList = React.createClass({
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
				<RatesListItem 
					key={item.name} 
					name={item.name} 
					ask={item.ask} 
					bid={item.bid} 
					onRemoveClick={that.handleRemoveClick} />
			);
		});
		time = new Date();
		timeString = time.toLocaleTimeString();

		return(
			<div className="ratesList">
				<h2>Rates</h2>
				<table>
					<tr>
						<th>Symbol</th><th>Ask</th><th>Bid</th><th></th>
					</tr>
					{rates} 
				</table>
				{/*<span>Last update:{timeString}</span>*/}
			</div>
		);
	}
});

module.exports = RatesList;