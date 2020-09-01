<?php

$sql = "select month, sum(count) as count from public.qtd_atendimento_mes_ano ";
$sqlwhere = "";
$params = array();

$indiceQuery = 1;

if (!empty($_GET['ano'])) {
    $sqlwhere = " year = $". $indiceQuery . " ";
    array_push($params, $_GET['ano']);
    $indiceQuery++;
}

if (!empty($_GET['unidade'])) {
    $sqlwhere .= ($sqlwhere != "" ? " and " : "") . " cod_unidade::integer = (select cod_unidade_org_dados_saude from mapeamento_unidade_saude where gid = $". $indiceQuery . ")";
    array_push($params, $_GET['unidade']);
    $indiceQuery++;
}

if (!empty($_GET['mes'])) {
    $sqlwhere = " month = $". $indiceQuery . " ";
    array_push($params, $_GET['mes']);
    $indiceQuery++;
}

if (!empty($_GET['genero'])) {
    $sqlwhere = " genero = $". $indiceQuery . " ";
    array_push($params, $_GET['genero']);
    $indiceQuery++;
}


$sql .=  ($sqlwhere != "" ? " WHERE " . $sqlwhere : "") .  " group by month";

error_log($sql);
$conexao = pg_connect('host=localhost port=5435 dbname=postgiscwb user=postread password=PostRead');
$resultado = pg_query_params($conexao, $sql, $params);

$rows = [];		
while ($row = pg_fetch_assoc($resultado)) {
	$rows[] = $row;
}

pg_close($conexao);

header('Content-type:application/json;charset=utf-8');
echo json_encode($rows);
