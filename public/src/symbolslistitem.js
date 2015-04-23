var SymbolsListItem = React.createClass({
	handleClick:function(){
		this.props.onSymbolClick(this.props.name);
	},
	render: function(){
		return(
			<li className="symbolItem">
				<span>{this.props.name}</span> {!this.props.enabled ? <span onClick={this.handleClick}>add</span>: ''}
			</li>
		)
	}
});

module.exports = SymbolsListItem;