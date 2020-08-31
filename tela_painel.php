<div id="floating-panel">

	<button id="floating-panel-toggle" class="btn btn-info custom" data-toggle="tooltip" title="Clique aqui para exibir / ocultar o painel de pesquisa">Painel de pesquisa</button>
	
	<div id="todo">

		<div class="row">
			<!--Filtros da quantidade por mês-->
			<div class="input-group custom"
                 title="Caso queira filtrar os dados por ano, escolha uma opção.">
				<span class="input-group-addon">Ano</span>
                <select  class="form-control" id="ano">
                    <option value="">Todos</option>
                    <option value="2019">2019</option>
                    <option value="2018">2018</option>
                    <option value="2017">2017</option>
                    <option value="2016">2016</option>
                </select>
			</div>
        </div>

        <div class="row">
            <!--Filtros da quantidade por mês-->
            <div class="input-group custom"
                 title="Caso queira filtrar os dados por ano, escolha uma opção.">
                <span class="input-group-addon">Unidade</span>
                <select class="form-control" id="unidade">
                    <option value="">Todas</option>
                </select>
            </div>
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