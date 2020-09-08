<?php

//$sql = "select trim(bairro) as bairro, week_number, sum(count) as total from public.qtd_doenca_semana_ano ";
$sql = "select mb.id_bairro_divisa_bairro as gid, week_number, sum(count) as total 
            from public.qtd_doenca_semana_ano join public.mapeamento_bairro mb on nome_bairro_atentimento_saude = trim(bairro) ";
$sqlwhere = "";
$params = array();

$indiceQuery = 1;

if (!empty($_GET['cid'])) {
    $sqlwhere .= ($sqlwhere != "" ? " and ( false " : "( false ");

    $cids = explode(',', $_GET['cid']);

    foreach($cids as $cid) {
        $sqlwhere .= " or cod_cid like $". $indiceQuery . " ";
        array_push($params, $cid);
        $indiceQuery++;
    }

    $sqlwhere .= ") ";
} else {
    echo json_encode([]);
    return;
}

if (!empty($_GET['ano'])) {
    $sqlwhere .= ($sqlwhere != "" ? " and " : "") . " year = $". $indiceQuery . " ";
    array_push($params, $_GET['ano']);
    $indiceQuery++;
}

$sql .=  ($sqlwhere != "" ? " WHERE " . $sqlwhere : "") .  " group by gid, week_number order by week_number, gid";

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
