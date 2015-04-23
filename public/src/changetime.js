var ChangeTime = React.createClass({
	handlePeriodChange:function(e){
		this.props.onPeriodChange(e.target.value);
	},
	render: function(){
		return(
			<div className="changeTime">
				<h3>Settings</h3>
				<span>Data refresh period</span>
				<select onChange={this.handlePeriodChange}>
					<option value="1000">1 sec</option>
					<option value="2000">2 sec</option>
					<option value="3000">3 sec</option>
					<option value="4000">4 sec</option>
					<option selected value="10000">10 sec</option>
				</select>
			</div>
		);
	}
});

module.exports = ChangeTime;