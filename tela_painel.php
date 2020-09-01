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
                    <option value="0">Todos</option>
                    <option value="1">Janeiro</option>
                    <option value="2">Fevereiro</option>
                    <option value="3">Março</option>
                </select>
            </div>
        </div>

        <div class="row">
            <div class="input-group custom"
                 title="Caso queira filtrar os dados por sexo, escolha uma das opções aqui disponíveis.">
                <span class="input-group-addon">Gênero</span>
                <select class="form-control" id="sexo">
                    <option value="0">Todos</option>
                    <option value="1">Feminino</option>
                    <option value="2">Masculino</option>
                    <option value="3">Não informado</option>
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