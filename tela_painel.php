<div id="floating-panel">

	<button id="floating-panel-toggle" class="btn btn-info custom" data-toggle="tooltip" title="Clique aqui para exibir / ocultar o painel de pesquisa">Painel de pesquisa</button>
	
	<div id="todo">

		<div class="row">
			<!--campos de data-->
			<div class="input-group date form_date custom" data-toggle="tooltip" title="Informe a data de início do período a ser analisado">
				<input class="form-control" type="text" id="data_inicio">
				<span class="input-group-addon"><span class="glyphicon glyphicon-th"></span></span>
			</div>
		
			<div class="input-group date form_date custom" data-toggle="tooltip" title="Informe a data de término do período a ser analisado">
				<input class="form-control" type="text" id="data_fim">
				<span class="input-group-addon"><span class="glyphicon glyphicon-th"></span></span>
			</div>
		<!--campos de data-->
		
		<!--campos de hora-->
			<div class="input-group bootstrap-timepicker custom" data-toggle="tooltip" title="Informe o horário de início do período a ser analisado">
				<input class="form-control" type="text" id="hora_inicio">
				<span class="input-group-addon"><i class="glyphicon glyphicon-time"></i></span>
			</div>
			
			<div class="input-group bootstrap-timepicker custom" data-toggle="tooltip" title="Informe o horário de término do período a ser analisado">
				<input class="form-control" type="text" id="hora_fim">
				<span class="input-group-addon"><i class="glyphicon glyphicon-time"></i></span>
			</div>
		<!--campos de hora-->
		</div>

		<div class="row">
			<select class="form-control custom" id="sexo" data-toggle="tooltip" title="Caso queira filtrar os dados por sexo, escolha uma das opções aqui disponíveis.">
				<option value="0">Sexo</option>
				<option value="1">Sexo feminino</option>
				<option value="2">Sexo masculino</option>
				<option value="3">Sexo não informado</option>
			</select>
		</div>
		<div class="row">
			<select class="form-control custom" id="idade" data-toggle="tooltip" title="Caso queira filtrar os dados por faixa etária, escolha uma das opções aqui disponíveis.">
				<option value="0">Faixa etária</option>
				<option value="1">Menores de 5 anos</option>
				<option value="2">Idade de 5 até 12 anos</option>
				<option value="3">Idade de 12 até 18 anos</option>
				<option value="4">Idade de 18 até 65 anos</option>
				<option value="5">Idade de 65 anos em diante</option>
				<option value="6">Idade menor que 0</option>
				<option value="7">Idade não informada</option>
			</select>
		</div>
		<div class="row">
			<button class="btn btn-success custom" onclick="pesquisar()" data-toggle="tooltip" title="Após definir os parâmetros de consulta, clique aqui para efetuar a pesquisa">Pesquisar</button>				
		</div>
	</div>
</div>

<script type="text/javascript">
				
	$('#hora_inicio').timepicker({
		defaultTime: '00:00',
		minuteStep: 1,
		showSeconds: false,
		showMeridian: false
	});
	
	$('#hora_fim').timepicker({
		defaultTime: '23:59',
		minuteStep: 1,
		showSeconds: false,
		showMeridian: false
	});

	$('.form_date').datepicker({
		format: 'dd/mm/yyyy',
		language:  'pt-BR',
		todayBtn:  true,
		autoclose: true,
		todayHighlight: true, 
		showMeridian: false,
	});
	
	$(".form_date").datepicker('setDate', '01/10/2017');
	
	$('[data-toggle="tooltip"]').tooltip({
		placement: 'right',
		delay: { "show": 2000, "hide": 100 }
	});
	
	$.ajaxSetup({
		beforeSend: function(){
			$(".modal").show();
		},
		complete: function(){
			$(".modal").hide();
		}
	});
	
</script>