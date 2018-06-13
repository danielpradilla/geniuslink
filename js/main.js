let gl = {};

gl.url = 'api/public/';
gl.getListUrl = gl.url + 'list';
gl.postUrl = gl.url + 'link';

gl.listData = [];

gl.fetchList = function(){
	const url = `${this.getListUrl}`;
	return fetch(url)
		.then(response=>response.json())
		.then(data=> data["Results"].filter(gl.filter).sort(gl.sort));
}

gl.fetchInit = function(){
	gl.showFader();
	gl.fetchList()
	.then(list => {
		gl.appendToList(list);
		gl.fillList();
		gl.hideFader();
		gl.initSearch();
	})
	.catch(err => {
		console.log(err);
	});

}

gl.initSearch = function() {
	// Declare variables 
	var input, filter, table, tr, td, i;
	input = document.getElementById("search");
	table = document.getElementById("links_table");
	tr = table.getElementsByTagName("tr");

	input.addEventListener('keyup', function(evt){
		console.log('hola')
		filter = input.value.toUpperCase();
		// Loop through all table rows, and hide those who don't match the search query
		for (i = 0; i < tr.length; i++) {
			td = tr[i].getElementsByTagName("td") ; 
			for(j=0 ; j<td.length ; j++){
			  let tdata = td[j] ;
			  if (tdata) {
			    if (tdata.innerHTML.toUpperCase().indexOf(filter) > -1) {
			      tr[i].style.display = "";
			      break ; 
			    } else {
			      tr[i].style.display = "none";
			    }
			  } 
			}
		}

	});
}

gl.post = function(){
	const formData = new FormData(document.getElementById('link_form'));
	const opts = {
		method: "POST",
		body: formData
	}
	const url = `${this.postUrl}`;
	return fetch(url, opts)
		.then(response=>response.json())
		.then(data=> data);
}


gl.appendToList = function(list){
	//expecting [{},{}...]
	gl.listData = gl.listData.concat(list);	
}


gl.fillList = function(){
	const list = document.querySelector(`#links_table tbody`);
	let oldRows = [... list.querySelectorAll('.link-row')];
	// let newRows =  this.listData[op].map(this.getRowHTML);
	let newRows=[];
	this.listData.forEach((row, i) => {
		newRows.push(this.getRowHTML(row));
		// if (i>0 && i%adspot===0) {
		// 	newRows.push(this.getAdHtml());
		// }		
	})
	list.innerHTML = newRows.join('');
	new ClipboardJS('.clipboard-btn');

}

gl.getRowHTML = function(row){
	return `<tr class="link-row" data-id="${row.ShortUrlCode}">
				<td><a href=${row.DestinationUrl}><img src="${row.ProductArtworkThumbnailUrl}"/></a></td>
				<th class="text-left"><img src="https://my.geni.us${row.AdvertiserIcon}"/><a href=${row.DestinationUrl}>${row.ProductDisplayName1}</a></th>
				<td><button class="btn btn-info btn-sm clipboard-btn" data-clipboard-text="https://${row.Domain}/${row.ShortUrlCode}">
    				Copiar<br />https://${row.Domain}/${row.ShortUrlCode}</button></td>
				<td>${gl.getDateFromEpoch(gl.getEpoch(row.CreatedUserTime))}</td>
		    </tr>`;
}

gl.submitPost = function(evt){
	evt.preventDefault();
	document.querySelector('#link_form button').disabled = !document.querySelector('#link_form button').disabled;
	gl.showFader();
	this.post()
	.then(gl.processResponse)
	.catch(gl.errorResponse);
}

gl.processResponse = function(post){
	window.location.reload(false); 
	// gl.listData = [];
	// gl.fetchInit();
	// gl.resetForm();
	gl.hideFader();
	document.querySelector('#link_form button').disabled = !document.querySelector('#link_form button').disabled;
}

gl.errorResponse = function(err){
	console.log(err);
}

gl.showFader = function(op){
	const element = document.querySelector('.container');
	element.classList.add('loading');
}

gl.hideFader = function(op){
	const element = document.querySelector('.container');
	element.classList.remove('loading');
}

gl.resetForm = function(){
	const el = document.querySelector('#link_form').reset();
}

gl.sort = function(a, b){
	return gl.getEpoch(b.CreatedUserTime) - gl.getEpoch(a.CreatedUserTime);
}

gl.filter = function(item){
	return item.IsArchivedInt == 0;
}

gl.getEpoch = function(dateString){
	//extracts epoch from "/Date(1504995334000-0000)/" 
	return parseInt(dateString.match(/\((\d*)-/)[1]);
}

gl.getDateFromEpoch = function(epoch){
	var d = new Date(epoch);

	var options = {   
	    day: 'numeric',
	    month: 'short', 
	    year: 'numeric'
	};
	return d.toLocaleDateString('es-ES', options);
}



gl.onload = function(){
	this.fetchInit();
}

