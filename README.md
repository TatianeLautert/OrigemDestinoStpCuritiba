# Protótipo de visualização dos Dados Abertos de Saúde de Curitiba
<img src="https://github.com/TatianeLautert/dadosAbertosSaudeCuritiba/blob/master/images/PrototipoDadosSaudeCuritiba.PNG">

https://youtu.be/47KMZO-N91A

## Principais arquivos da aplicação
+ **index.php**: é o arquivo inicial da aplicação. É responsável por dividir a interface de usuário verticalmente ao meio, estabelecendo à direita da tela a região do mapa e do menu, e à esquerda da tela a região dos gráficos.

+ **tela_inicial.php**: é o arquivo responsável pela construção do menu de busca da aplicação

+ **bd_quantidade_mes_ano**: contém o script escrito em linguagem PHP responsável por montar sentença SQL responsável buscar na view materializada 'qtd_atendimento_mes_ano' os dados por mês e ano referentes aos atendimentos médicos nas unidades de saúde de Curitiba.

+ **bd_atendimentos_hora_dia_semana.php**: contém o script escrito em linguagem PHP responsável por montar sentença SQL responsável buscar na view materializada 'qtd_atendimento_hora_dia_semana' os dados por hora e por dia da semana referentes aos atendimentos médicos nas unidades de saúde de Curitiba.

+ **bd_genero_faixa_etaria.php**: contém o script escrito em linguagem PHP responsável por montar sentença SQL responsável buscar na tabela 'qtd_atendimento_faixa_etaria_genero' os dados por gênero e faixa etária referentes aos atendimentos médicos nas unidades de saúde de Curitiba.

+ **bd_qtde_doenca_semana.php**: contém o script escrito em linguagem PHP responsável por montar sentença SQL responsável buscar na view materializada 'qtd_doenca_semana_ano' os dados por doenças infecciosas selecionadas e por número da semana do ano referentes aos atendimentos médicos nas unidades de saúde de Curitiba.

+ **bd_unidades**: contém o script escrito em linguagem PHP responsável por montar sentença SQL responsável buscar na tabela 'unidade_de_saude' os dados geográficos da localização das unidades de saúde públicas de Curitiba. 

+ **bd_bairros.php**: contém o script escrito em linguagem PHP responsável por montar sentença SQL responsável buscar na tabela divisa_de_bairros os dados geográficos referentes aos bairros de Curitiba.

+ **index_main.php**: é arquivo mais importante da aplicação. Nele está contida toda a lógica de programação referente a criação dos gráficos, criação do mapa e também das camadas que podem ser adicionadas e removidas do mapa. As consultas quando disparadas são realizadas via chamada _Query.ajax_, a qual requisita os arquivos _bd_XXXXXX.php_ para obter os dados armazenados na base.
