var SymbolsListDefaultItem = React.createClass({
	handleClick:function(){
		this.props.onSymbolClick(this.props.name);
	},
	render: function(){
		return(
			<tr className="symbolItem">
				<td>{this.props.name}</td> 
				<td>{!this.props.enabled ? <span className="btn" onClick={this.handleClick}>Add</span>: <span className="btn btn_disabled">Add</span>}</td>
			</tr>
		)
	}
});

module.exports = SymbolsListDefaultItem;