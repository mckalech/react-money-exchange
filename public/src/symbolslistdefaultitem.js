var SymbolsListDefaultItem = React.createClass({
	handleClick:function(){
		this.props.onSymbolClick(this.props.name);
	},
	render: function(){
		return(
			<tr className="symbolItem">
				<td>{this.props.name}</td> 
				<td>{!this.props.enabled ? <span onClick={this.handleClick}>add</span>: ''}</td>
			</tr>
		)
	}
});

module.exports = SymbolsListDefaultItem;