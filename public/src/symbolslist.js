
var SymbolsListDefaultItem = require('./symbolslistdefaultitem');

var SymbolsList = React.createClass({
	getInitialState: function(){
		return{
			defaultSymbols: [
				{
					name:'usd/eur',
					enabled:false
				},
				{
					name:'usd/rub',
					enabled:false
				},
				{
					name:'eur/rub',
					enabled:false
				}
			]
		}
	},
	componentDidMount: function(){
		this.updateSymbols(this.props.ratesPairs)
	},
	componentWillReceiveProps:function(props){
		this.updateSymbols(props.ratesPairs)
	},
	updateSymbols: function(pairs){
		var i = 0,
			defaultSymbols = this.state.defaultSymbols;

		for(;i<defaultSymbols.length;i++){
			if(pairs.indexOf(defaultSymbols[i].name) < 0){
				defaultSymbols[i].enabled = false;
			}else{
				defaultSymbols[i].enabled = true;
			}
		}
		this.setState({
			defaultSymbols: defaultSymbols
		});

	},
	handleSymbolClick:function(name){
		var defaultSymbols = this.state.defaultSymbols,
			i = 0;
		for(;i<defaultSymbols.length;i++){
			if(defaultSymbols[i].name===name){
				defaultSymbols[i].enabled = !defaultSymbols[i].enabled;
				this.props.onSymbolClick(name);
				break;
			}
		}
		this.setState({defaultSymbols: defaultSymbols});
	},
	render: function(){
		var i = 0, 
			symbols = [], 
			defaultSymbols = this.state.defaultSymbols;

		for(;i<defaultSymbols.length;i++){
			symbols.push(<SymbolsListDefaultItem name={defaultSymbols[i].name} enabled={defaultSymbols[i].enabled} onSymbolClick={this.handleSymbolClick}/>)
		}
		
		return(
			<div className="symbolsList">
				<h3>Symbols</h3>
				<table>
					{symbols}
				</table>
			</div>
		);
	}
});

module.exports = SymbolsList;