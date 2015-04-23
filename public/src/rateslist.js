
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
	render: function(){
		var i = 0, 
			rates = [], 
			//data = this.props.data;
			data = this.state.pairs;

		for(;i<data.length;i++){
			rates.push(
				<RatesListItem 
					name={data[i].name} 
					ask={data[i].ask} 
					bid={data[i].bid} 
					onRemoveClick={this.props.onRemoveClick} />
			)
		}

		return(
			<div className="ratesList">
				<h3>Rates</h3>
				<table>
					<tr>
						<th>Symbol</th><th>Ask</th><th>Bid</th><th></th>
					</tr>
					{rates} 
				</table>
			</div>
		);
	}
});

module.exports = RatesList;