
var SymbolsListDefaultItem = require('./symbolslistdefaultitem');

var SymbolsListLastItem = require('./symbolslistlastitem');

var SymbolsList = React.createClass({
	getInitialState: function(){
		return{
			defaultSymbols: [
				{
					name:'EURUSD',
					enabled:false
				},
				{
					name:'USDRUB',
					enabled:false
				},
				{
					name:'EURRUB',
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

		this.props.onSymbolClick(name);
		for(;i<defaultSymbols.length;i++){
			if(defaultSymbols[i].name===name){
				defaultSymbols[i].enabled = true;
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
		symbols.push(<SymbolsListLastItem enabled={false} onSymbolClick={this.handleSymbolClick}/>)
		
		return(
			<div className="symbolsList">
				<h2>Symbols</h2>
				<table>
					{symbols}
				</table>
			</div>
		);
	}
});

module.exports = SymbolsList;