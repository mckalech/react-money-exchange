var SymbolsListLastItem = React.createClass({
	handleClick:function(e){
		var $this = $(e.target),
			$selects = $this.closest('tr').find('select'),
			name=$selects.eq(0).val()+$selects.eq(1).val();
		this.props.onSymbolClick(name);
	},
	render: function(){
		return(
			<tr className="symbolItem symbolItem_last">
				<td>
					<select>
						<option value="EUR">Euro</option>
						<option value="USD">US Dollar</option>
						<option value="GBP" selected>GB Pound</option>
						<option value="RUB">Ruble</option>
					</select>
					<select>
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