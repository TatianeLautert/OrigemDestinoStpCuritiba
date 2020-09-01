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
            <div class="input-group custom"
                 title="Caso queira filtrar os dados por ano, escolha uma opção.">
                <span class="input-group-addon">Unidade</span>
                <select class="form-control" id="unidade">
                    <option value="">Todas</option>
                </select>
            </div>
        </div>

        <div class="row">
            <div class="input-group custom"
                 title="Caso queira filtrar os dados por mês, escolha uma opção.">
                <span class="input-group-addon">Mês</span>
                <select class="form-control" id="mes" >
                    <option value="">Todos</option>
                    <option value="1">Janeiro</option>
                    <option value="2">Fevereiro</option>
                    <option value="3">Março</option>
                    <option value="4">Abril</option>
                    <option value="5">Maio</option>
                    <option value="6">Junho</option>
                    <option value="7">Julho</option>
                    <option value="8">Agosto</option>
                    <option value="9">Setembro</option>
                    <option value="10">Outubro</option>
                    <option value="11">Novembro</option>
                    <option value="12">Dezembro</option>
                </select>
            </div>
        </div>

        <div class="row">
            <div class="input-group custom"
                 title="Caso queira filtrar os dados por dia da semana, escolha uma opção.">
                <span class="input-group-addon">Dia</span>
                <select class="form-control" id="dow" >
                    <option value="">Todos</option>
                    <option value="0">Domingo</option>
                    <option value="1">Segunda</option>
                    <option value="2">Terça</option>
                    <option value="3">Quarta</option>
                    <option value="4">Quinta</option>
                    <option value="5">Sexta</option>
                    <option value="6">Sábado</option>
                </select>
            </div>
        </div>

		<div class="row">
			<button class="btn btn-success custom" onclick="pesquisar()" data-toggle="tooltip" title="Após definir os parâmetros de consulta, clique aqui para efetuar a pesquisa">Pesquisar</button>				
		</div>
	</div>
</div>

<script type="text/javascript">

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