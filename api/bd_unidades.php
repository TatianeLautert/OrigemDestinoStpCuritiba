<?php

$sql = "select gid as id, nome_mapa as nome, replace(replace(replace(ST_AsText( ST_Transform(ST_SetSRID(geom, 29192), 4326)), " .
            " 'POINT(', '[{\"lng\":'), ' ', ', \"lat\":'), ')', '}]') as contorno from saude.unidade_de_saude ums";

$conexao = pg_connect('host=localhost port=5435 dbname=postgiscwb user=postread password=PostRead');
$resultado = pg_query($conexao, $sql);

$rows = [];		
while ($row = pg_fetch_assoc($resultado)) {
	$rows[] = $row;
}

pg_close($conexao);

header('Content-type:application/json;charset=utf-8');
echo json_encode($rows);
