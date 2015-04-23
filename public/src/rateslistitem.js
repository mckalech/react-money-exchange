var RatesListItem = React.createClass({
	handleClick:function(e){
		this.props.onRemoveClick(this.props.name);
	},
	render: function(){
		return(
			<tr className="rateItem">
				<td>{this.props.name}</td>
				<td>{this.props.ask}</td>
				<td>{this.props.bid}</td>
				<td onClick={this.handleClick}>remove</td>
			</tr>
		)
	}
});

module.exports = RatesListItem;