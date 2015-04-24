var classNames = require('classNames');

var RatesListItem = React.createClass({
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
			<tr className={classes}>
				<td>{this.props.name}</td>
				<td>{this.props.ask}</td>
				<td>{this.props.bid}</td>
				<td><span className="btn" onClick={this.handleClick}>Remove</span></td>
			</tr>
		)
	}
});

module.exports = RatesListItem;