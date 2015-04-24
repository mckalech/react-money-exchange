module.exports = {
	get:function(name) {
		var data;
		if (localStorage[name]){
			data = JSON.parse(localStorage[name]);
		}
		return data;
	},
	set:function(name, props){
		localStorage[name]=JSON.stringify(props);
	}
}