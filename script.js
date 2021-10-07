let numVideos, vidTitle = [], videoId = [], nextStepBlock = "";

function getPlaylistData (id) {
	let http = new XMLHttpRequest();
	let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${id}&key=AIzaSyAlz0tMpkgRIQsZcWK9F7iz3vWpMziyNzg&maxResults=50`;
	localStorage.setItem('playlistRequestUrl', url);
	http.responseType = "text";
	http.open("GET", url);
	http.send();
	http.onreadystatechange = function (id) {
		if(http.readyState === XMLHttpRequest.DONE && http.status === 200) {
			const resp = JSON.parse(http.responseText);
			console.log(resp);
			numVideos = resp.items.length;
			localStorage.setItem('numVideos', numVideos);
			localStorage.setItem('storedVidId', JSON.stringify(resp.items[0].snippet.resourceId.videoId));
			for (let i = 0; i < numVideos; i++){
				vidTitle[i] = JSON.stringify(resp.items[i].snippet.title);
				localStorage.setItem(`vidTit${i}`, vidTitle[i]);
				videoId[i] = JSON.stringify(resp.items[i].snippet.resourceId.videoId);
				localStorage.setItem(`vidId${i}`, videoId[i]);
			}
		}
	}
}

function insertHtml () {
	for (let i = 0; i < numVideos; i++) {
		console.log("socorro??");
		nextStepBlock += `<h3>Aula ${i}: ${vidTitle[`${i}`]}</h3>
		<label for="formsAula${i}">Link para questionário do e-disciplinas ou forms:</label><br>
		<input type="text" id="formsAula${i}" name="formsAula2" class="text_input_style"
		value="https://edisciplinas.usp.br/acessar/"><br>
		<label for="matAula${i}">Link para material de apoio:</label><br>
		<input type="text" id="matAula${i}" name="matAula${i}" class="text_input_style"
		value="https://edisciplinas.usp.br/acessar/"><br><hr>`;
	}
	document.getElementById("tab2").innerHTML = nextStepBlock;
}

function nextStep () {
	id = document.getElementById("playlist_id").value;
	getPlaylistData(id);
	localStorage.setItem('courseName', document.getElementById("nome_disciplina").value);
	let delayGen = setTimeout(insertHtml, 500);
	document.getElementById("tab1").style.display = "none";
	document.getElementById("tab2").style.display = "block";
	document.getElementById("submit2").style.display = "block";
}

function prevStep () {
	document.getElementById("tab1").style.display = "block";
	document.getElementById("tab2").style.display = "none";
	document.getElementById("submit2").style.display = "none";
	document.getElementById("mainForm").submit();
}

function formComplete () {
	for (let i = 0; i < numVideos; i++) {
		localStorage.setItem(`quizAula${i}`, document.getElementById(`formsAula${i}`).value);
		localStorage.setItem(`materialAula${i}`, document.getElementById(`matAula${i}`).value);
	}
	window.open("./dash.html");
	localStorage.removeItem('numVideo');
}

