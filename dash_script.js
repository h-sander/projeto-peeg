var nav = $('#vid_frame');
if (nav.length) {
  var contentNav = nav.offset().top +100;
}

var nav1 = $('#gforms');
if (nav1.length) {
  var contentNav1 = nav1.offset().top +100;
}

function clickOnTag1(){
  document.getElementById('maisInformacoes').click();
}

function clickOnTag2(){
  document.getElementById('voltarAoTopo').click();
}

function notText(array) {
  let regex4 = /\d:\d/;
  for (let j = 0; j < array.length; j++){
    let result4 = regex4.exec(array[j]);
    if (result4 === null) {
      array[j] = "";
    }
  }
}

function myfunc(id, N) {
  localStorage.setItem('storedVidId', '"' + id + '"');
  localStorage.setItem('numVideo', N);
  window.location.reload();
}

if (typeof varRead === "undefined") {
  window.nomeCurso = localStorage.getItem('courseName');
  window.videoID = localStorage.getItem('storedVidId').substring(1, localStorage.getItem('storedVidId').length - 1);
  window.url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoID}&key=AIzaSyAlz0tMpkgRIQsZcWK9F7iz3vWpMziyNzg`;
  window.passedUrl = localStorage.getItem("playlistRequestUrl"); 
  window.url2 = passedUrl;
  window.numVideos = localStorage.getItem('numVideos');
  window.quizUrl = [];
  window.idVideo = [];
  window.titleVideo = [];
  window.matAula = [];
  window.matAulaPass = [];
  for (let i = 0; i < numVideos; i++) {
    quizUrl[i] = localStorage.getItem(`quizAula${i}`);
    quizUrl[i] =  '"' + quizUrl[i] + '"';
    idVideo[i] = localStorage.getItem(`vidId${i}`);
    titleVideo[i] = localStorage.getItem(`vidTit${i}`);
    matAula[i] = localStorage.getItem(`materialAula${i}`);
    matAulaPass[i] = '"' + matAula[i] + '"';
  }
  // console.log(idVideo);
  // console.log(titleVideo);
  // console.log(quizUrl);
}

if (localStorage.getItem('numVideo') === null) {
  window.nVideo = 0;
  console.log('estou aqui');
} else {
  console.log('ou aqui');
  // console.log(localStorage.getItem('numVideo'));
  window.nVideo = localStorage.getItem('numVideo');
}

let idVideoCorr = [];

for (let i = 0; i < idVideo.length; i++){
  idVideoCorr[i] = idVideo[i].substring(1, idVideo[i].length - 1);
}

url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${idVideoCorr[`${nVideo}`]}&key=AIzaSyAlz0tMpkgRIQsZcWK9F7iz3vWpMziyNzg`;
console.log('1socorr');
document.getElementById('gforms').src = quizUrl[nVideo].substring(1, quizUrl[nVideo].length - 1);
document.getElementById("mainHeaderId").innerHTML += nomeCurso;
const videoConfig = '&autoplay=1&rel=0'; //CONFIGURAÇÕES DO VÍDEO
const playlistId = 'PLEQweGGiJjCQzU5TCvVg6XY1WM0MkUeJZ';
document.getElementById('apoioId').href = matAula[nVideo];
document.getElementById('vid_frame').src += idVideoCorr[nVideo]; //ADICIONA O ID DO VÍDEO AO IFRAME NO HTML
document.getElementById('vid_frame').src += "?start=1&rel=0"; //INICIA O VÍDEO NO SEGUNDO 1 
let Http = new XMLHttpRequest();
let Http2 = new XMLHttpRequest();

Http.responseType = "text";
Http.open("GET", url);
Http.send();
Http2.responseType = "text";
Http2.open("GET", url2);
Http2.send();

$("#newTxt").click(function() { 
  console.log(matAula);
  var blob = new Blob([`const matAula = [${matAulaPass}]; const quizUrl = [${quizUrl}]; const idVideo = [${idVideo}]; const titleVideo = [${titleVideo}]; const url2 = "${url2}"; const nomeCurso = "${nomeCurso}"; let varRead = "lido";`], {type: "text/javascript"});
  saveAs(blob, "varFile.js");
  var downloading = browser.downloads.download({
    url : "./dash.html",
    filename : 'index.html',
    conflictAction : 'uniquify'
  });
});

Http2.onreadystatechange = function () {
  if(Http2.readyState === XMLHttpRequest.DONE && Http2.status === 200) {
    const j = JSON.parse(Http2.responseText);
    let vidTitle = [], vidId = [], htmltext2 = "";
    let loopTamanho = j.items.length;
    for (let i = 0; i < loopTamanho; i++) {
      vidTitle[i] = JSON.stringify(j.items[i].snippet.title);
      vidId[i] = JSON.stringify(j.items[i].snippet.resourceId.videoId);
      let vidIdUn = vidId[i];
      vidIdUn =  vidIdUn.substring(1, vidIdUn.length - 1);
      console.log(quizUrl[i]);
      if (i == loopTamanho - 1) {
        htmltext2 += `<tr class="titulo-video"><td><a onclick="myfunc('${vidIdUn}', ${i})">
        Aula ${i+1}: ${vidTitle[`${i}`]}</a></td></tr>`;
      } else {
        htmltext2 += `<tr class="titulo-video"><td><a onclick="myfunc('${vidIdUn}', ${i})">
        Aula ${i+1}: ${vidTitle[`${i}`]}</a></td></tr>
        <tr class="separador"><td>______________</td></tr>`;
      }
    }
    document.getElementById("playlist-2-list").innerHTML = htmltext2;
  }
} 

Http.onreadystatechange = function () {
  if(Http.readyState === XMLHttpRequest.DONE && Http.status === 200) {
    const j = JSON.parse(Http.responseText), desc = JSON.stringify(j.items[0].snippet.description); //DESCRIÇÃO DO VÍDEO
    const title = JSON.stringify(j.items[0].snippet.title); //TÍTULO DO VÍDEO
    const titleLength = title.length; //COMPRIMENTO DO TÍTULO DO VÍDEO
    const titleString = title.substring(1,titleLength-1);

    //encontra todas as correspondências do tipo [NUMERO]:[NUMERO]
    const regex1 = /\d:\d/gi;
    let linha = [], result1;
    while ( (result1 = regex1.exec(desc)) ) {
      linha.push(result1.index);
    }

    //declaração de variáveis
    let min = [], sec = [], hora = [], linhaString = [], capName = [], capIn = [], resultAux = [], auxStringLinha = [],
    startChapterInd, htmltext = "", finalChapterInd;

    //verifica se última correspondência [NUMERO]:[NUMERO] é na última linha
    if (desc.indexOf("\\n", linha[linha.length - 1]) === -1){ //é na última linha
      finalChapterInd = desc.length - 1;
    } else { //não é na última linha
      finalChapterInd = desc.indexOf("\\n", linha[linha.length - 1]);
    }

    //verifica se primeira correspondência [NUMERO]:[NUMERO] é na primeira linha
    switch (linha[0]) {
      case 1: //é na primeira linha ([NUMERO]:[NUMERO])
        startChapterInd = 1;
        break;
      case 2: //é na primeira linha ([NUMERO][NUMERO]:[NUMERO])
        startChapterInd = 2;
        break;
      default: //não é na primeira linha
        let auxString = desc.substring(linha[0]-6);
        startChapterInd = auxString.indexOf("\\n") + linha[0] - 4;
    }

    //pega parte da descrição com timestamps e capítulos
    let chapters = desc.substring(startChapterInd,finalChapterInd);

    //separa cada linha
    let lineNotFiltered = chapters.split("\\n");

    //filtra linhas que não têm [NUMERO]:[NUMERO]
    notText(lineNotFiltered);

    //filtra linhas vazias
    let line = lineNotFiltered.filter(Boolean);


    for (let i = 0; i < line.length; i++) {
      const regex3 = /[^:\d]/; //não é [NUMERO] nem ":"
      const regex5 = /\d/; //[NUMERO]
      let result5 = regex5.exec(line[i]);
      line[i] = line[i].substring(result5.index); //começa linha no primeiro número achado
      let result3 = regex3.exec(line[i]);
      let tempo = line[i].substring(0, result3.index); //string tempo termina no primeiro não número E não ":"
      let tempoSeparado = tempo.split(":"); //separa tempo a cada ":"
      switch (tempoSeparado.length) {
        case 2: //não tem hora
          hora[i] = 0;
          min[i] = Number(tempoSeparado[0]);
          sec[i] = Number(tempoSeparado[1]);
          break;
        case 3: //tem hora
          hora[i] = Number(tempoSeparado[0]);
          min[i] = Number(tempoSeparado[1]);
          sec[i] = Number(tempoSeparado[2]);
          break;
      }
      const regex2 = /[a-z0-9]/i; //número ou letra
      let auxString2 = line[i].substring(result3.index); //string auxiliar começa no primeiro não número E não ":"
      let result2 = regex2.exec(auxString2);

      //nome do capítulo começa no primeiro número ou letra encontrado em auxString2
      capName[i] = auxString2.substring(result2.index);

      //cria html a ser adicionado
      htmltext += `<tr><td class="chapter-name"><a
      onClick="document.getElementById('vid_frame').src='https://youtube.com/embed/' +
      videoID + '?start=' + '${hora[`${i}`]*3600+min[`${i}`]*60+sec[`${i}`]}' +
      videoConfig">${capName[`${i}`]}</a></td><td class="bullet">&#8226</td></tr>`;
    }

    //console.log(hora, min, sec);
    document.getElementById("listajs").innerHTML = htmltext;
    document.getElementById("titulo").innerHTML = titleString;
  }
}

