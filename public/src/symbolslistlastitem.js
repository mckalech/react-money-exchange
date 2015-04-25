var SymbolsListLastItem = React.createClass({
	handleClick:function(e){
		var name=React.findDOMNode(this.refs.select_1).value+React.findDOMNode(this.refs.select_2).value;
		this.props.onSymbolClick(name);
	},
	render: function(){
		return(
			<tr className="symbolItem symbolItem_last">
				<td>
					<select ref="select_1">
						<option value="EUR">Euro</option>
						<option value="USD">US Dollar</option>
						<option value="GBP" selected>GB Pound</option>
						<option value="RUB">Ruble</option>
					</select>
					<select ref="select_2">
						<option value="EUR">Euro</option>
						<option value="USD" selected>US Dollar</option>
						<option value="GBP">GB Pound</option>
						<option value="RUB">Ruble</option>
					</select>
				</td> 
				<td>{!this.props.enabled ? <span className="btn" onClick={this.handleClick}>Add</span>: ''}</td>
			</tr>
		)
	}
});

module.exports = SymbolsListLastItem;