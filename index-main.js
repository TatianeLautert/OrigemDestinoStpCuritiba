


//inicializa gráficos
const ctx1 = document.getElementById("tres").getContext('2d');
const ctx2 = document.getElementById("dois").getContext('2d');
const ctx3 = document.getElementById("um").getContext('2d');
const ctx4 = document.getElementById("quatro").getContext('2d');
const ctx5 = document.getElementById("cinco").getContext('2d');

function randomColor() {
	return '#' + Math.floor(Math.random()*16777215).toString(16);
}
//cria um mapa e adiciona as camadas OSM e markercluster
var map = new L.Map('map', {
  center: {lat: -25.4909541, lng: -49.315137},
  zoom: 12
});

//define informações para buscar camada de fotos do OSM
var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', osmAttrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
//cria camada de imagens do OSM
var camada_OSM = L.tileLayer(osmUrl, {opacity: 1});
//adiciona camada no mapa
map.addLayer(camada_OSM);
//adiciona escala no mapa
L.control.scale({metric: true, imperial: false}).addTo(map);
const LAYER_CONTROL = L.control.layers({"OSM": camada_OSM}, {});
LAYER_CONTROL.addTo(map);

let unidadesSaude = [];
let layerUnidadeSaudeSelecionada;

function adicionaCamadasEstaticas() {
	$.ajax({
		type:'get',
		url:'bd_rois.php',
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		data: {"tipo_roi": 'bairro'},
		success: function(contornos){
			adicionaPoligonosNoMapa(contornos, 'Bairros', true);
		}
	});
	$.ajax({
		type:'get',
		url:'bd_rois.php',
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		data: {"tipo_roi": 'regiao'},
		success: function(regioes) {
			adicionaPoligonosNoMapa(regioes, 'Região', false);
		}
	});

	$.ajax({
		type:'get',
		url:'api/bd_unidades.php',
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		success: function(unidades) {
			unidadesSaude = unidades;
			criarComboUnidades(unidades);
			adicionarMarcadorNoMapa(unidades, 'UMS');
		}
	});
}

adicionaCamadasEstaticas();

function criarComboUnidades(aux_contornos) {
	$.each(aux_contornos, function (index, unidade) {
		$('#unidade').append($('<option/>', {
			value: unidade.id,
			text : unidade.nome
		}));
	});
}

function adicionarMarcadorNoMapa(aux_contornos, nome_camada, nome_icone = "blue.png") {
	var poligonos_da_camada = [];
	console.debug(aux_contornos);
	var icone_azul = L.icon({
		iconUrl: "images/" + nome_icone//,		iconSize: [10, 10]
	});

	$.each(aux_contornos, function (i, aux_contorno) {
		contorno = JSON.parse(aux_contorno.contorno)[0];
		if (contorno == null) {
			return;
		}
		let poligono = L.marker([contorno.lat, contorno.lng], { icon: icone_azul });
		poligono.bindPopup(aux_contorno.nome);
		poligonos_da_camada.push(poligono);
		if (nome_camada == null) {
			nome_camada = aux_contorno.nome;
		}
	});
	let grupo = L.layerGroup(poligonos_da_camada);
	LAYER_CONTROL.addOverlay(grupo, nome_camada);
	return grupo;
}


grafico_qtde_atendimentos_ao_ano = new Chart(ctx4, {
	type: 'bar',
	options: {
		title: {
			display: true,
			text: 'QUANTIDADE DE ATENDIMENTOS MENSAL'
		},
		legend: {
			display: false
		},
		scales: {
			yAxes: [{
				ticks: {
					suggestedMin: 0
				}
			}]
		}
	}
});

function pesquisarAtendimentos() {
	let dados = [];
	let ano = $('#ano').val();
	let unidade = $('#unidade').val();

	marcarUnidadeDeSaudeNoMapa(unidade);

	$.ajax({
		type: 'get',
		url: 'api/bd_quantidade_mes_ano.php',
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		data: {
			"unidade": unidade,
			"ano": ano
		},
		success: function (atendimentos) {
			console.debug(atendimentos);
			$.each(atendimentos, function (i, atendimento) {
				dados[atendimento.month] = atendimento.count;
			});
			pintaGraficosQtdeAtendimentos(dados, ano, $('#unidade option:selected').text());
		}
	});
}

function marcarUnidadeDeSaudeNoMapa(unidade) {
	if (unidade !== "" && unidadesSaude.length !== 0) {
		let nome_camada_unidade_selecionada = "Unidade Selecionada";
		if(map.hasLayer(layerUnidadeSaudeSelecionada)){
			map.removeLayer(layerUnidadeSaudeSelecionada);
		}
		unidadesSaude.forEach((us) => {
			if (us.id === unidade) {
				layerUnidadeSaudeSelecionada = adicionarMarcadorNoMapa([us], nome_camada_unidade_selecionada, "marker-icon.png");
				map.addLayer(layerUnidadeSaudeSelecionada);
				LAYER_CONTROL.removeLayer(layerUnidadeSaudeSelecionada);
			}
		});
	}
}


function pintaGraficosQtdeAtendimentos(dados, ano, unidade) {
	console.debug(dados);
	grafico_qtde_atendimentos_ao_ano.data = {
		labels: Object.keys(dados),
		datasets: [
			{
				label: 'Quantidade de atendimentos',
				data: Object.values(dados),
				backgroundColor: Array.from(Array(12), (e,i)=> randomColor()),
				//borderColor: ["rgb(255,0,0)", "rgb(0,0,255)", "rgb(0,255,0)"],
				borderWidth: 1,
				fill: false
			}
		]
	};
	grafico_qtde_atendimentos_ao_ano.options.title.text = 'QUANTIDADE DE ATENDIMENTOS MENSAL ' + ano + ' ' + unidade;

	grafico_qtde_atendimentos_ao_ano.update();
}

pesquisarAtendimentos();



//cria uma camada de heatmap
var heatmap = L.heatLayer().setOptions({
	max: 1,
	radius: 25,
	blur: 15
});

//cria uma camada de heatmap
var heatmapEmbDesembA = L.heatLayer().setOptions({
	max: 0.5,
	radius: 25,
	blur: 5
});

var heatmapEmbDesembB = L.heatLayer().setOptions({
	max: 0.5,
	radius: 25,
	blur: 5
});


//cria uma camada para o marker clusterer
var markerClusterEmbDesemb = L.markerClusterGroup({
	//número de marcadores para virar um cluster
	maxClusterRadius: 25,
	//permite explorar os clusters até visualizar todos os marcadores que os compõem
	spiderfyOnMaxZoom: true,
	//mostrar área de clusterização
	showCoverageOnHover: false,
	//abre o cluster clicado e ajusta o zoom
	zoomToBoundsOnClick: true,
});

//cria uma camada para o marker clusterer
var markerCluster_pontos = L.markerClusterGroup({
	//número de marcadores para virar um cluster
	maxClusterRadius: 50,
	//permite explorar os clusters até visualizar todos os marcadores que os compõem
	spiderfyOnMaxZoom: true,
	//mostrar área de clusterização
	showCoverageOnHover: false,
	//abre o cluster clicado e ajusta o zoom
	zoomToBoundsOnClick: true,
});

//inicializa variáveis para visualização de polígonos e terminais
var poligonos = [];
var terminais = [];
var marcadores_pontos_onibus = [];

//inicializa variáveis para uso em 'pesquisar' e em gráficos
var sum, origens_selecionadas, destinos_selecionados;
var grafico;

//cria os vetores que guardarão a lista de pontos de embarques e de desembarque
var ponto;
var pontos_embarque = [];
var pontos_desembarque = [];
var marcadores_embarque = [];
var marcadores_desembarque = [];

//inicializa variáveis de sessão
sessionStorage.setItem('origens_selecionadas', '[]');
sessionStorage.setItem('destinos_selecionados', '[]');


grafico_linhas_embarque_sexo_hora = new Chart(ctx1, {
	type: 'line',
	options: {
		title: {
			display: true,
			text: 'EMBARQUES POR SEXO AO LONGO DO PERIODO'
		},
		scales: {
			xAxes: [{
				ticks: {
					callback: function(dataLabel, index) {
						return index % 2 === 0 ? dataLabel : '';
					},
					fontSize: 8
				}
			}],
			yAxes: [{
				ticks: {
					suggestedMin: 0
				}
			}]
		}
	}
});

grafico_linhas_embarque_faixa_etaria_hora = new Chart(ctx5, {
	type: 'line',
	options: {
		title: {
			display: true,
			text: 'EMBARQUES POR FAIXA ETÁRIA AO LONGO DO PERIODO'
		},
		scales: {
			xAxes: [{
				ticks: {
					callback: function(dataLabel, index) {
						return index % 2 === 0 ? dataLabel : '';
					},
					fontSize: 8
				}
			}],
			yAxes: [{
				ticks: {
					suggestedMin: 0
				}
			}]
		}
	}
});

grafico_barras_idade = new Chart(ctx2, {
	type: 'bar',
	options: {
		title: {
			display: true,
			text: 'TOTAL DE EMBARQUES POR IDADE'
		},
		scales: {
			xAxes: [{
				ticks: {
					callback: function(dataLabel, index) {
						return index % 2 === 0 ? dataLabel : '';
					}
				}
			}],
			yAxes: [{
				ticks: {
					suggestedMin: 0
				}
			}]
		}
	}
});;

grafico_barras_faixa_etaria = new Chart(ctx3, {
	type: 'horizontalBar',
	options: {
		title: {
			display: true,
			text: 'TOTAL DE EMBARQUES POR FAIXA ETÁRIA'
		},
		legend: {
			display: false
		},
		scales: {
			yAxes: [{
				ticks: {
					suggestedMin: 0
				}
			}]
		}
	}
});


function mudaPoligonos() {
		
	var tipo_roi = $('#tipo_roi').val();
	
	//se o tipo_roi for equivalente a nenhum, remove todos os polígonos do mapa
	if (tipo_roi == 0){
		removePoligonosDoMapa();
		return 0;
	}
	
	$.ajax({
		type:'get',
		url:'bd_rois.php',
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		data: {"tipo_roi": tipo_roi},
		success: function(contornos){
			
			//remove poligonos que estejam no mapa
			removePoligonosDoMapa();
			
			//adiciona os poligonos recem retornados do banco
			adicionaPoligonosNoMapa(contornos);
			
			//define acoes para cada poligono
			defineAcoesNosPoligonos();
		}
	});
}

function removePoligonosDoMapa(){
	
	//limpa listas armazenadas na sessão
	sessionStorage.setItem('origens_selecionadas', '[]');
	sessionStorage.setItem('destinos_selecionados', '[]');
	
	//remove rois do mapa
	$.each(poligonos, function (i, poligono) {
		map.removeLayer(poligono);
	});	
	
	//limpa o array
	poligonos = [];
}

function adicionaPoligonosNoMapa(aux_contornos, nome_camada, habilitar) {
	var poligono;
	var poligonos_da_camada = [];
	console.log(aux_contornos);

	aux_contornos.forEach((aux_contorno) => {
		let randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
		//cria poligono
		poligono = L.polygon(eval(aux_contorno.contorno),{
			stroke: true,
			color: randomColor,
			opacity: true,
			opacity: 0.8,
			weight: 2,
			fillColor: randomColor,
			fillOpacity: 0.35,
			id: aux_contorno.id,
			descricao: aux_contorno.nome,
			tipo_selecao: 0 //se está selecionado como origem (1), como destino (2) ou como ambos (3)
		});
		//adiciona poligono no mapa
		if (habilitar == null || habilitar) {
			map.addLayer(poligono);
		}
		//adiciona o poligono na lista de rois
		poligonos.push(poligono);
		poligonos_da_camada.push(poligono);
		if (nome_camada == null) {
			nome_camada = aux_contorno.nome;
		}
	})
	LAYER_CONTROL.addOverlay(L.layerGroup(poligonos_da_camada), nome_camada);
}

function defineAcoesNosPoligonos(){
		
	$.each(poligonos, function (i, poligono) {
		
		//mouse clicando
		poligono.on('click', function (e) {
			
			L.popup().setLatLng(poligono.getBounds().getCenter()).setContent(poligono.options.descricao).openOn(map);
			
			//verifica se o usuario deseja selecionar origens ou destinos
			var acao = sessionStorage.getItem('acao');
			
			switch(acao){
				
				case 'origem':
				
					//busca lista da sessão
					var origens_selecionadas = JSON.parse(sessionStorage.getItem('origens_selecionadas'));
					
					//se a origem selecionada já estiver na lista de origens selecionadas
					if($.inArray(this.options.id, origens_selecionadas) >= 0){
						
						//remove o item da lista
						origens_selecionadas.splice($.inArray(this.options.id, origens_selecionadas),1);

						//verifica qual era o status do polígono
						if (this.options.tipo_selecao == '3'){
							
							//seta cor de destino selecionado
							this.setStyle({color: 'red', fillColor: 'red', tipo_selecao: '2'});
							
						}else{
							
							//seta cor de não selecionado
							this.setStyle({color: 'grey', fillColor: 'grey', tipo_selecao: '0'});
						}
															
					}else{
						
						//não está na lista: adicioná-lo
						origens_selecionadas.push(this.options.id);
						
						//verifica qual era o status do polígono
						if (this.options.tipo_selecao == '2'){
							
							//seta cor de destino selecionado
							this.setStyle({color: 'green', fillColor: 'green', tipo_selecao: '3'});
							
						}else{
							
							//seta cor de não selecionado
							this.setStyle({color: 'blue', fillColor: 'blue', tipo_selecao: '1'});
						}
						
					}
					
					sessionStorage.setItem('origens_selecionadas', JSON.stringify(origens_selecionadas));
					
				break;
				
				case 'destino':
				
					//busca lista da sessão
					var destinos_selecionados = JSON.parse(sessionStorage.getItem('destinos_selecionados'));
					
					//se o destino selecionado já estiver na lista de destinos selecionados
					if($.inArray(this.options.id, destinos_selecionados) >= 0){
						
						//remove o item da lista
						destinos_selecionados.splice($.inArray(this.options.id, destinos_selecionados), 1);
						
						//verifica qual era o status do polígono
						if (this.options.tipo_selecao == '3'){
							
							//seta cor de origem selecionada
							this.setStyle({color: 'blue', fillColor: 'blue', tipo_selecao: '1'});
							
						}else{
							
							//seta cor de não selecionado
							this.setStyle({color: 'grey', fillColor: 'grey', tipo_selecao: '0'});
						}
															
					}else{
						
						//não está na lista: adicioná-lo
						destinos_selecionados.push(this.options.id);
						
						//verifica qual era o status do polígono
						if (this.options.tipo_selecao == '1'){
							
							//seta cor de destino selecionado
							this.setStyle({color: 'green', fillColor: 'green', tipo_selecao: '3'});
							
						}else{
							
							//seta cor de não selecionado
							this.setStyle({color: 'red', fillColor: 'red', tipo_selecao: '2'});
						}
						
					}
					
					sessionStorage.setItem('destinos_selecionados', JSON.stringify(destinos_selecionados));	
					
				break;
					
			}
			
		});
	});
}

function limpaMapa(){
							
	//limpa listas armazenadas na sessão
	sessionStorage.setItem('origens_selecionadas', '[]');
	sessionStorage.setItem('destinos_selecionados', '[]');
	
	//itera a lista de itens já selecionados para todos os contornos de bairros do mapa
	$.each(poligonos, function (i, poligono) {
		this.setStyle({color: 'grey', fillColor: 'grey'});
	});
	
}

function mudaTerminais() {
		
	var opcao_terminais = Number($('#opcao_terminais').val());
	
	switch(opcao_terminais){
		
		case 0:
			//sem terminais
			removeTerminais();
		break;
		
		case 1:
			//com terminais
			adicionaTerminais();
		break;
	}
}

function adicionaTerminais() {
	
	var ponto;
	
	var icone = L.icon({
					iconUrl: "images/blue.png",
					iconSize: [15, 15]
				});
	
	$.ajax({
		type:'get',
		url:'bd_terminais.php',
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		success: function(lista_terminais){
			
			$.each(lista_terminais, function (i, terminal) {
			
				//cria o marcador
				ponto = L.marker({lat: terminal.lat, lng: terminal.lng}, {icon: icone}).addTo(map);
				
				//adiciona na lista de terminais
				terminais.push(ponto);
			});	
		}
	});
}

function removeTerminais(){
	
	//itera a lista de terminais
	$.each(terminais, function (i, terminal) {
			
		//remove o terminal do mapa
		map.removeLayer(terminal);
	});	
}

function mudaPontosOnibus() {
		
	//obtém a opção escolhida
	var opcao_pontos_onibus = Number($('#opcao_pontos_onibus').val());
	
	//remove do mapa quaisquer visualizações de pontos de ônibus
	limpaPontosOnibus();
	
	switch(opcao_pontos_onibus){
		
		case 1: 
			//termal
			adicionaHeatmapPontosOnibus();
		break;
		
		case 2: 
			//marker clusterer
			adicionaMarkerClustererPontosOnibus();
		break;
	}
}

function mudaVisualizacaoPontosEmbarquesDesembarques() {
		
	//remove heatmap
	if(map.hasLayer(heatmapEmbDesembA)){
		map.removeLayer(heatmapEmbDesembA);
	}
	
	if(map.hasLayer(heatmapEmbDesembB)){
		map.removeLayer(heatmapEmbDesembB);
	}
	
	//remove heatmap
	if(map.hasLayer(markerClusterEmbDesemb)){
		//remove os possíveis marcadores do marker cluster
		markerClusterEmbDesemb.removeLayers(marcadores_embarque);
		markerClusterEmbDesemb.removeLayers(marcadores_desembarque);
		
		//remove o marker cluster do mapa
		map.removeLayer(markerClusterEmbDesemb);
	}
	
	//obtém a opção escolhida
	var opcao_embarques_desembarques = parseInt($('#opcao_embarques_desembarques').val());
	
	//executa a solicitação
	switch (opcao_embarques_desembarques) {
		
		//visualizar pontos de embarque termal
		case 1:
			heatmapEmbDesembA.setLatLngs(pontos_embarque);
			heatmapEmbDesembA.addTo(map);
		break;
		
		//visualizar pontos de desembarque termal
		case 2:
			heatmapEmbDesembA.setLatLngs(pontos_desembarque);
			heatmapEmbDesembA.addTo(map);
		break;
		
		//visualizar pontos de embarque e desembarque termal
		case 3:
			heatmapEmbDesembA.setLatLngs(pontos_embarque);
			heatmapEmbDesembA.addTo(map);
			
			heatmapEmbDesembB.setLatLngs(pontos_desembarque);
			heatmapEmbDesembB.addTo(map);
		break;
		
		//visualizar pontos de embarque clusterizados
		case 4:
			markerClusterEmbDesemb.addLayers(marcadores_embarque);						
			map.addLayer(markerClusterEmbDesemb);
		break;
		
		//visualizar pontos de desembarque clusterizados
		case 5:
			markerClusterEmbDesemb.addLayers(marcadores_desembarque);						
			map.addLayer(markerClusterEmbDesemb);
		break;
		
		//visualizar pontos de embarque e desembarque clusterizados
		case 6:
			markerClusterEmbDesemb.addLayers(marcadores_embarque);
			markerClusterEmbDesemb.addLayers(marcadores_desembarque);
			map.addLayer(markerClusterEmbDesemb);
		break;
	}
}

function adicionaHeatmapPontosOnibus() {
	
	$.ajax({
		type:'get',
		url:'bd_pontos_onibus.php',
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		success: function(pontos_onibus){
			
			//console.log(pontos_onibus);
			
			//carrega os dados na camada heatmap
			heatmap.setLatLngs(pontos_onibus);
			
			heatmap.addTo(map);
		}
	});
}

function adicionaMarkerClustererPontosOnibus() {
	
	var marcador;
	marcadores_pontos_onibus = [];
	
	$.ajax({
		type:'get',
		url:'bd_pontos_onibus.php',
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		success: function(pontos_onibus){
			
			$.each(pontos_onibus, function (i, ponto_onibus) {
				
				//cria o marcador
				marcador = L.marker({lat: ponto_onibus.lat, lng: ponto_onibus.lng});

				//adiciona o marcador na camada marker cluster
				marcadores_pontos_onibus.push(marcador);
				
			});	
			
			//adiciona marcadores do marker cluster
			markerCluster_pontos.addLayers(marcadores_pontos_onibus);
			
			//adiciona no mapa
			map.addLayer(markerCluster_pontos);
		}
	});
}

function pesquisar() {

	pesquisarAtendimentos();
		// $.ajax({
		// 	type:'get',
		// 	url:'bd_movimentacao.php',
		// 	dataType: 'json',
		// 	//dataType: 'text',
		// 	contentType: "application/json;charset=utf-8",
		// 	data: {
		// 		"origens_selecionadas": origens_selecionadas, "destinos_selecionados": destinos_selecionados,
		// 		"data_inicio": data_inicio, "data_fim": data_fim,
		// 		"hora_inicio": hora_inicio, "hora_fim": hora_fim,
		// 		"tipo_roi": tipo_roi, "sexo" : sexo, "idade": idade},
		// 	success: function(movimentacoes){
		//
		// 		//console.log(movimentacoes);
		//
		// 		var aux_idx;
		//
		// 		//cria o ícone do marcador de embarque
		// 		var icone_embarque = L.icon({
		// 			iconUrl: "images/blue.png",
		// 			iconSize: [10, 10]
		// 		});
		//
		// 		//cria o ícone do marcador de embarque
		// 		var icone_desembarque = L.icon({
		// 			iconUrl: "images/red.png",
		// 			iconSize: [10, 10]
		// 		});
}

function pintaGraficos(){
					
	//embarques por sexo
	grafico_barras_sexo.data = {
		labels: Object.keys(grafico['sexo']),
		datasets: [
			{
				label: 'Embarques por sexo',
				data: Object.values(grafico['sexo']),
				backgroundColor:["rgba(255,0,0, 0.5)", "rgba(0,0,255,0.5)", "rgba(0,255,0, 0.5)"],
				borderColor:["rgb(255,0,0)", "rgb(0,0,255)", "rgb(0,255,0)"],
				borderWidth:1,
				fill: false
			}
		]
	};
	
	grafico_barras_sexo.update();
	
	//embarques por faixa etaria
	grafico_barras_faixa_etaria.data = {
		labels: Object.keys(grafico['faixa_etaria']),
		datasets: [
			{
				data: Object.values(grafico['faixa_etaria']),
				backgroundColor: ["rgba(255, 99, 132, 0.5)","rgba(255, 159, 64, 0.5)","rgba(255, 205, 86, 0.5)","rgba(75, 192, 192, 0.5)","rgba(54, 162, 235, 0.5)","rgba(153, 102, 255, 0.5)", "rgba(201, 203, 207, 0.5)"],
				borderColor: ["rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)", "rgb(201, 203, 207)"],
				borderWidth:1,
				fill: false
			}
		]
	};
	
	grafico_barras_faixa_etaria.update();
	
	
	//embarques por idade
	grafico_barras_idade.data = {
		labels: Object.keys(grafico['idade']),
		datasets: [
			{
				label: 'Embarques por idade',
				data: Object.values(grafico['idade']),
				backgroundColor: "rgba(0, 0, 255, 0.5)",
				borderColor: "rgb(0, 0, 255)",
			}
		]
	};
	
	grafico_barras_idade.update();
	
	
	//embarques por sexo ao longo do período
	var rotulos = Object.keys(grafico['embarque']);;
	var aux = [];
	var i;
	
	var average = Number(sum / rotulos.length).toFixed(2);
	
	for(i = 0; i < rotulos.length; i++){
		aux.push(average);
	}
						
	grafico_linhas_embarque_sexo_hora.data = {
		labels: rotulos,
		datasets: [
			{
				label: 'Média',
				data: aux,
				backgroundColor: "rgba(75, 192, 192, 0.5)",
				borderColor: "rgb(75, 192, 192)",
				cubicInterpolationMode: 'default',
				fill: false
			},
			{
				label: 'Total',
				data: Object.values(grafico['embarque']),
				backgroundColor: "rgba(255, 0, 0, 0.5)",
				borderColor: "rgb(255, 0, 0)",
				cubicInterpolationMode: 'default',
				fill: false
			},
			{
				label: 'Masculino',
				data: Object.values(grafico['sexo_horario_M']),
				backgroundColor: "rgba(0,0,255,0.5)", 
				borderColor: "rgb(0, 0, 255)",
				cubicInterpolationMode: 'default',
				fill: false
			},
			{
				label: 'Feminino',
				data: Object.values(grafico['sexo_horario_F']),
				backgroundColor: "rgba(255, 99, 132, 0.5)",
				borderColor: "rgb(255, 99, 132)",
				cubicInterpolationMode: 'default',
				fill: false
			},
			{
				label: 'Não Informado',
				data: Object.values(grafico['sexo_horario_NI']),
				backgroundColor: "rgba(0, 255, 0, 0.5)",
				borderColor: "rgb(0, 255, 0)",
				cubicInterpolationMode: 'default',
				fill: false
			},
			
		]
	};
	
	grafico_linhas_embarque_sexo_hora.update();
	
	
	//embarques por faixa etária ao longo do período
	var rotulos = Object.keys(grafico['embarque']);;
	var aux = [];
	var i;
	
	var average = Number(sum / rotulos.length).toFixed(2);
	
	for(i = 0; i < rotulos.length; i++){
		aux.push(average);
	}
						
	grafico_linhas_embarque_faixa_etaria_hora.data = {
		labels: rotulos,
		datasets: [
			{
				label: 'Média',
				data: aux,
				backgroundColor: "rgba(255, 0, 0, 0.5)",
				borderColor: "rgb(255, 0, 0)",
				cubicInterpolationMode: 'default',
				fill: false
			},
			{
				label: '0<x<5',
				data: Object.values(grafico['faixa_etaria_0_5']),
				backgroundColor: "rgba(255, 99, 132, 0.5)",
				borderColor: "rgb(255, 99, 132)",
				cubicInterpolationMode: 'default',
				fill: false
			},
			{
				label: '5<=x<12',
				data: Object.values(grafico['faixa_etaria_5_12']),
				backgroundColor: "rgba(255, 159, 64, 0.5)",
				borderColor: "rgb(255, 159, 64)",
				cubicInterpolationMode: 'default',
				fill: false
			},
			{
				label: '12<=x<18',
				data: Object.values(grafico['faixa_etaria_12_18']),
				backgroundColor: "rgba(255, 205, 86, 0.5)",
				borderColor: "rgb(255, 205, 86)",
				cubicInterpolationMode: 'default',
				fill: false
			},
			{
				label: '18<=x<65',
				data: Object.values(grafico['faixa_etaria_18_65']),
				backgroundColor: "rgba(75, 192, 192, 0.5)",
				borderColor: "rgb(75, 192, 192)",
				cubicInterpolationMode: 'default',
				fill: false
			},
			
			{
				label: '>=65',
				data: Object.values(grafico['faixa_etaria_>65']),
				backgroundColor: "rgba(54, 162, 235, 0.5)",
				borderColor: "rgb(54, 162, 235)",
				cubicInterpolationMode: 'default',
				fill: false
			},
			{
				label: '<0',
				data: Object.values(grafico['faixa_etaria_<0']),
				backgroundColor: "rgba(153, 102, 255, 0.5)", 
				borderColor: "rgb(153, 102, 255)",
				cubicInterpolationMode: 'default',
				fill: false
			},
			
			{
				label: 'Não Informada',
				data: Object.values(grafico['faixa_etaria_ninf']),
				backgroundColor: "rgba(201, 203, 207, 0.5)",
				borderColor: "rgb(201, 203, 207)",
				cubicInterpolationMode: 'default',
				fill: false
			},
			
		]
	};
	
	grafico_linhas_embarque_faixa_etaria_hora.update();
}