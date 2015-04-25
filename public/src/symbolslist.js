
var SymbolsListDefaultItem = require('./symbolslistdefaultitem');

var SymbolsListLastItem = require('./symbolslistlastitem');

var SymbolsList = React.createClass({
	getInitialState: function(){
		
		return{
			defaultSymbols : []
		}
	},
	componentDidMount: function(){
		var that = this;
		$.ajax({
			url:'/defaults',
			dataType: "json",
			type: 'GET',
		}).always(function(res){
			that.setState({
				defaultSymbols: res
			});
			that.updateSymbols(that.props.ratesPairs)
		});
		
	},
	componentWillReceiveProps:function(props){
		this.updateSymbols(props.ratesPairs)
	},
	updateSymbols: function(pairs){
		var i = 0,
			defaultSymbols = this.state.defaultSymbols;

		defaultSymbols.forEach(function(item,ind){
			if(pairs.indexOf(item.name) < 0){
				item.enabled = false;
			}else{
				item.enabled = true;
			}
		});
			
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
			that = this,
			symbols = [], 
			defaultSymbols = this.state.defaultSymbols;

		symbols = defaultSymbols.map(function(item, i){
			return(
				<SymbolsListDefaultItem
					name={item.name} 
					enabled={item.enabled} 
					onSymbolClick={that.handleSymbolClick}/>
			);
		});
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