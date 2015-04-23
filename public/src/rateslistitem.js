var RatesListItem = React.createClass({
	handleClick:function(){
		this.props.onRemoveClick(this.props.name);
	},
	render: function(){
		return(
			<li className="rateItem">
				<span>{this.props.name}</span> <span>{this.props.ask}</span> <span>{this.props.bid} </span>
				<span onClick={this.handleClick}>remove</span>
			</li>
		)
	}
});

module.exports = RatesListItem;