
//inicializa gráficos
const ctx1 = document.getElementById("tres").getContext('2d');
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

//cria uma camada de heatmap
let heatmap = L.heatLayer().setOptions({
	max: 1,
	radius: 25,
	blur: 15
});

let unidadesSaude = [];
let bairros = [];
let layerUnidadeSaudeSelecionada;

function adicionaCamadasEstaticas() {
	$.ajax({
		type:'get',
		url:'bd_rois.php',
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		data: {"tipo_roi": 'bairro'},
		success: function(contornos){
			console.debug(contornos);
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
			let l = adicionarMarcadorNoMapa(unidades, 'UMS');
			map.addLayer(l);
		}
	});

	$.ajax({
		type:'get',
		url:'api/bd_bairros.php',
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		success: function(retorno) {
			bairros = retorno;
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
		let poligono = L.marker([contorno.lat, contorno.lng], { icon: icone_azul })
			.on('click', function(e) {
				if (confirm('Filtrar por ' + aux_contorno.nome + '?')) {
					$("#unidade").val(aux_contorno.id);
					pesquisar();
				}
		}).on('mouseover',function(ev) {
				ev.target.openPopup();
			});
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

grafico_qtde_atendimentos_ao_ano = new Chart(ctx1, {
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

grafico_qtde_atendimentos_genero_faixa_etaria = new Chart(ctx4, {
	type: 'bar',
	options: {
		title: {
			display: true,
			text: 'QUANTIDADES DE ATENDIMENTO POR FAIXA ETÁRIA E GÊNERO'
		},
		legend: {
			position: 'right'
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

grafico_qtde_atendimentos_por_hora_dia_da_semana = new Chart(ctx5, {
	type: 'line',
	options: {
		title: {
			display: true,
			text: 'QUANTIDADE DE ATENDIMENTO POR HORA E DIA DA SEMANA'
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

grafico_qtde_doenca_semana = new Chart(ctx3, {
	type: 'bar',
	options: {
		title: {
			display: true,
			text: 'QUANTIDADE DE CASOS POR SEMANA DO ANO'
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
		},
		annotation: {
			annotations: [{
				type: 'line',
				mode: 'horizontal',
				scaleID: 'y-axis-0',
				value: '26',
				borderColor: 'tomato',
				borderWidth: 1
			}],
			drawTime: "afterDraw" // (default)
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
				borderWidth: 1,
				fill: false
			}
		]
	};
	grafico_qtde_atendimentos_ao_ano.options.title.text = 'QUANTIDADE DE ATENDIMENTOS MENSAL ' + ano + ' ' + unidade;
	grafico_qtde_atendimentos_ao_ano.update();
}

function pesquisarGeneroFaixaEtaria() {
	let dataset = [{
		label: 'M',
		backgroundColor: 'purple',
		data: []
	}, {
		label: 'F',
		backgroundColor: 'orange',
		data: []
	}];
	let labels = new Set();
	let ano = $('#ano').val();
	let mes = $('#mes').val();
	let unidade = $('#unidade').val();

	$.ajax({
		type: 'get',
		url: 'api/bd_genero_faixa_etaria.php',
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		data: {
			"unidade": unidade,
			"ano": ano,
			"mes": mes
		},
		success: function (atendimentos) {
			$.each(atendimentos, function (i, atendimento) {
				labels.add(atendimento.faixa_etaria);
				dataset.forEach(ds => {
					if (ds.label === atendimento.genero) {
						ds.data.push(atendimento.total);
					}
				});
			});

			preencherGraficosFaixaEtariaGenero(Array.from(labels), dataset, ano, mes, $('#unidade option:selected').text());
		}
	});
}

function preencherGraficosFaixaEtariaGenero(labels, dataset, ano, mes, unidade) {
	grafico_qtde_atendimentos_genero_faixa_etaria.data =  {
		labels: labels,
		datasets: dataset
	};
	grafico_qtde_atendimentos_genero_faixa_etaria.options.title.text = 'QUANTIDADES DE ATENDIMENTO POR FAIXA ETÁRIA E GÊNERO '
		+ (mes != '' ? mes + '/' : '') + ano + ' ' + unidade;
	grafico_qtde_atendimentos_genero_faixa_etaria.update();
}

function pesquisarHoraDiaDaSemana() {
	let ano = $('#ano').val();
	let mes = $('#mes').val();
	let unidade = $('#unidade').val();
	let dow = $('#dow').val();

	let dados = [];
	$.ajax({
		type: 'get',
		url: 'api/bd_atendimentos_hora_dia_semana.php',
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		data: {
			"unidade": unidade,
			"ano": ano,
			"mes": mes,
			"dow": dow
		},
		success: function (atendimentos) {
			console.debug(atendimentos);
			$.each(atendimentos, function (i, atendimento) {
				dados[atendimento.hour] = atendimento.total;
			});
			preencherGraficosHoraDiaDaSemana(dados, ano, mes, $('#dow option:selected').text(), $('#unidade option:selected').text());
		}
	});
}

function preencherGraficosHoraDiaDaSemana(dados, ano, mes, dow, unidade) {
	console.debug(dados);
	grafico_qtde_atendimentos_por_hora_dia_da_semana.data = {
		labels: Object.keys(dados),
		datasets: [
			{
				label: 'Quantidade de atendimentos por horário',
				data: Object.values(dados),
				borderWidth: 5
			}
		]
	};

	grafico_qtde_atendimentos_por_hora_dia_da_semana.options.title.text = 'QUANTIDADE DE ATENDIMENTO POR HORÁRIO '
		+ dow + ' '
		+ (mes != '' ? mes + '/' : '') + ano + ' ' + unidade;
	grafico_qtde_atendimentos_por_hora_dia_da_semana.update();
}

function pesquisarDoencaSemana() {
	let dados = [];
	let ano = $('#ano').val();
	let mes = $('#mes').val();
	let cid = $('#cid').val();

	$.ajax({
		type: 'get',
		url: 'api/bd_qtde_doenca_semana.php',
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		data: {
			"cid": cid,
			"ano": ano
		},
		success: function (doencaSemana) {
			console.debug(doencaSemana);
			let total = 0;
			$.each(doencaSemana, function (i, registro) {
				if (dados[registro.week_number] === undefined) {
					dados[registro.week_number] = 0;
				}
				const valor = parseInt(registro.total);
				dados[registro.week_number] += valor;
				total += valor;
			});
			let media = total / (dados.length - 1);
			pintaGraficosQtdeDoencasSemana(dados, media, ano, $('#cid option:selected').text());
			pintaHeatMapCasosPorSemana(doencaSemana, media, cid, (dados.length - 1));
		}
	});
}

function pintaGraficosQtdeDoencasSemana(dados = [], media = 1, ano, cid) {
	if (dados.length === 0) {
		return;
	}
	let cores = Array(dados.length);
	const outbreakThreashold = media + (2 * getStandardDeviation(dados, dados.length, media));
	for (let i = 0; i < dados.length -1; i++) {
		idx = i + 1;
		if (dados[idx] === undefined) {
			dados[idx] = 0;
		}
		cores[i] = dados[idx] >= outbreakThreashold ? 'red' : 'green';
	}

	grafico_qtde_doenca_semana.data = {
		labels: Object.keys(dados),
		datasets: [
			{
				label: 'Quantidade de casos',
				data: Object.values(dados),
				backgroundColor: cores,
				borderWidth: 1,
				fill: false
			}
		]
	};
	grafico_qtde_doenca_semana.options.title.text = 'QUANTIDADE DE CASOS POR SEMANA DO ANO ' + ano + ' ' + cid;
	grafico_qtde_doenca_semana.update();
}

function pintaHeatMapCasosPorSemana(doencaSemana, media, cid, totalSemanas) {
	//bairros
	if(map.hasLayer(heatmap)) {
		map.removeLayer(heatmap);
		LAYER_CONTROL.removeLayer(heatmap);
		//map.removeLayer("Bairros")
	}

	let pontos = Array();
	bairros.forEach(bairro => {
		const indice = calcularIndiceOutbreakParaBairro(bairro, doencaSemana, totalSemanas);
		contorno = JSON.parse(bairro.contorno)[0];
		pontos.push([contorno.lat, contorno.lng, indice]);
	});

	heatmap = L.heatLayer(pontos).setOptions({
		radius: 40,
		//blur: 90,
		max:.1
	});

	LAYER_CONTROL.addOverlay(heatmap, "Outbreak Heat Map");
	heatmap.addTo(map);
}

function calcularIndiceOutbreakParaBairro(bairro, doencaSemana, totalSemanas) {
	const dadosBairro = doencaSemana.filter(ds => ds.gid === bairro.gid);
	console.debug(dadosBairro);
	if (dadosBairro.length === 0) {
		return 0;
	}
	const valores = dadosBairro.map(db => parseInt(db.total));
	const mean = valores.reduce((a, b) => a + b) / totalSemanas;
	const stdDev = getStandardDeviation(valores, totalSemanas, mean);
	const outbreakThreashold = mean + (2 * stdDev);
	return valores.map((valor => valor >= outbreakThreashold ? 1 : 0)).reduce((a, b) => a + b);
}

function getStandardDeviation(valores, len, mean) {
	return Math.sqrt(valores.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / len)
}

function adicionaPoligonosNoMapa(aux_contornos, nome_camada, habilitar) {
	var poligono;
	var poligonos_da_camada = [];
	console.debug(aux_contornos);

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
		poligonos_da_camada.push(poligono);
		if (nome_camada == null) {
			nome_camada = aux_contorno.nome;
		}
	})
	const grupo = L.layerGroup(poligonos_da_camada);
	LAYER_CONTROL.addOverlay(grupo, nome_camada);
	//adiciona poligono no mapa
	if (habilitar == null || habilitar) {
		map.addLayer(grupo);
	}
}

function pesquisar() {
	pesquisarAtendimentos();
	pesquisarGeneroFaixaEtaria();
	pesquisarHoraDiaDaSemana();
	pesquisarDoencaSemana();
}

pesquisar();