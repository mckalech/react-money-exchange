var SymbolsListLastItem = React.createClass({
	handleClick:function(e){
		var $this = $(e.target),
			$selects = $this.closest('tr').find('select'),
			name=$selects.eq(0).val()+'/'+$selects.eq(1).val();
		this.props.onSymbolClick(name);
	},
	render: function(){
		return(
			<tr className="symbolItem">
				<td>
					<select>
						<option selected>EUR</option>
						<option>USD</option>
						<option>GBP</option>
						<option>RUB</option>
					</select>
					<select>
						<option>EUR</option>
						<option selected>USD</option>
						<option>GBP</option>
						<option>RUB</option>
					</select>
				</td> 
				<td>{!this.props.enabled ? <span onClick={this.handleClick}>add</span>: ''}</td>
			</tr>
		)
	}
});

module.exports = SymbolsListLastItem;