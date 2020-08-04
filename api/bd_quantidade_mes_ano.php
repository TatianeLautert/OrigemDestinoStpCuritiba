<?php

$sql = "select cod_unidade, desc_unidade, month, year, count from public.qtd_atendimento_mes_ano where year =  2018 and cod_unidade = '0016705'";

$conexao = pg_connect('host=localhost port=5435 dbname=postgiscwb user=postread password=PostRead');

$resultado = pg_query($conexao, $sql);

$rows = [];		
while ($row = pg_fetch_assoc($resultado)) {
	$rows[] = $row;
}

pg_close($conexao);

header('Content-type:application/json;charset=utf-8');
echo json_encode($rows);
