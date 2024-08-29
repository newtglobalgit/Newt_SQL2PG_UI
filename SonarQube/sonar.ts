function  createTcHtml(type,type_count){
    let html = '<tr>' + '<td>' + type + '</td>' + '<td>' + type_count + '</td>' + '</tr>'
	return html
}

function  createTypeHtml(severity,component,message,status){
    let html = '<tr>' + '<td>' + severity + '</td>' + '<td>' + component + '</td>' + '<td>' + message + '</td>' +'<td>' + status + '</td>' + '</tr>'
	return html
}

var myArgs = process.argv.slice(2);
const fs = require('fs') 

var sonarIp = myArgs[0]
var sonarPort = myArgs[1]
var project_Key = 'dmap_UI'
//var sonarTypes = 'VULNERABILITY,BUG,CODE_SMELL'
var sonarTypes = myArgs[2]
var sonarSeverities = myArgs[3]

let overallExecutionStatus = "Passed";
var code_smell_html_str;

var summary_list = [];
var summary_str
var types = sonarTypes.split(",")
var html_content='';
let dup_html_content; 

for (let i = 0; i < types.length; i++) {
	
	let obj;
	let xmlrequest = require("xmlhttprequest").XMLHttpRequest;
	let request = new xmlrequest();
	let severities = sonarSeverities.split(",")
	
	request.open("GET","http://"+sonarIp+":"+sonarPort+"/api/issues/search?componentKeys="+project_Key+"&types="+types[i]+"&severities="+sonarSeverities+"&ps=500&statuses=OPEN,REOPENED");
	request.send();
	request.onload = () => {
		if (request.readyState == 4) {
			obj = JSON.parse(request.responseText);


			if(obj["issues"].length !=0 ){
				summary_list.push(createTcHtml(types[i],obj["issues"].length.toString()));
				summary_str = '\n'+ summary_list.join('')

				overallExecutionStatus = 'Failed';
				let issues = obj["issues"]

				var groupBy = function(xs, key) {
					return xs.reduce(function(rv, x) {
					(rv[x[key]] = rv[x[key]] || []).push(x);
					return rv;
					}, {});
				};
				let groubedByTeam=groupBy(issues, 'severity')
				let issues_html = []
				for(let severity in severities){
					let groupBySev = groubedByTeam[severities[severity]];
					
					for(let issue in groupBySev){
						issues_html.push(createTypeHtml(groupBySev[issue]['severity'],groupBySev[issue]['component'],groupBySev[issue]['message'], groupBySev[issue]['status']));
					}
					
				}
				code_smell_html_str  = '\n' + issues_html.join('');
				dup_html_content =  '<h2> '+types[i]+' Summary:</h2> \
											<table align="center" border="1"><tr> \
											<th width=200>Severity</th> <th width=100>Component</th> <th width=100>Description</th> <th width=100>Status</th> \
											</tr>'+ code_smell_html_str + '</table>' 
				
				html_content = html_content.concat(dup_html_content);
		}
		else{
			summary_list.push(createTcHtml(types[i],obj["issues"].length.toString()));
			summary_str = '\n'+ summary_list.join('')
		}
			operation();
		}
}
}

var operationsCompleted = 0;
function operation() {
    ++operationsCompleted;
    if (operationsCompleted === types.length){
		console.log("SonarQube "+overallExecutionStatus)
		
		let data = ' <html><head><title>Summary of SonarQube Execution</title> \
			<body align="center"> \
			<br><br> \
			<h2> SonarQube Execution Summary</h2> \
			<h4>Overall Quality Gate: ' + overallExecutionStatus + '</h4> \
			<table align="center" border="1"> <tr> \
			<th width=200>Issue Type</th><th width=100>Count</th></tr>'+summary_str+'</table>'+ html_content +'</body></html>' 

			fs.writeFile('sonarAnalysis.html', data, (err) => { 
	
				// In case of a error throw err. 
				if (err) throw err; 
			})
	}

} 
 

