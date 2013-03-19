$(document).ready(function() {

	/**
	 * Conecta um campo SELECT à uma fonte dados através de JSON
	 * Recebe os parâmetros:
		{
			url: "http://url-xyz/@{#id-do-input}/@{.class-do-input}/xx/@{paramName1}/yy/@{paramName2}"
			, params: { 
				"paramName1": "paramValue1"
				, "paramName2": function() {
					return "paramValue2"
				}
			}
		}
	**/
	var paramRE = /@\{([#\.\w\d-_]+)\}/g;
	
	$.Options = {
		Loading: "<option value=''>Aguarde ...</option>"
		, Default: ""
		, All: "<option value=''>Todos</option>"
		, Select: "<option value=''>Selecione</option>"
	}
	$.fn.connect = function(opts) {
		// Configura as opcoes default
		var userOptions = $.extend({defaultOptions: $.Options.Default // Opções fixas na combo após retorno do AJAX
								  , loadingOption: $.Options.Loading  // Texto de aguarde durante o AJAX
								  , codeAttribute: 'codigo'
								  , labelAttribute: 'descricao'}, opts);
		
		// Para cada elemento encontrado tenta conectar a fonte de dados ao SELECT
		return this.each(function connect() {
			var $me = $(this);
			
			// Obtém as configurações para este elemento caso já existam
			var options = $me.data('connect-options');
			// Caso não exista nenhuma configuração significa que é a primeira vez que executa essa função 
			var firstTime = options == null;
			// Caso as configurações não existam, cria as configurações e armazena como "connect-options" para a próxima execução dessa função.
			options = options || $.extend({}, userOptions);
			$me.data('connect-options', options);
			
			var url = options.url;
			var resolvedParameters = true;
			var hasOptions = $me[0].options.length > 0;
			
			// Adiciona os default options pela primeira vez
			if (firstTime && !hasOptions && options.defaultOptions) {
				$me[0].options.length = 0;
				$me.append(options.defaultOptions);
			}
			
			// Tenta montar a URL completa substituindo todos os parâmetros entre chaves {...}
			var newURL = url.replace(paramRE, function(match, parameterName) {
				// Se o parâmetro começar com @@ então ...
				if (parameterName.length > 1 && parameterName[0] == '@' && parameterName[1] == '@') {
					// O nome real do parâmetro é sem @@ na frente
					var realParameterName = parameterName.substring(2);
					// Caso o parâmetro não seja do jQuery, verificar se é uma função ou se é um valor
					var param = options.params && options.params[realParameterName];
					var value = $.type(param) == 'function' ? param(url, realParameterName, parameterName) : param;
					// Verificar se conseguiu obter este valor
					resolvedParameters &= $.type(value) != 'undefined';
					// Retorna o valor correto
					return value;
				} else { // Se o primeiro caracter do parâmetro for # ou ., considerar que seja um elemento do jQuery que eu dependo
					// Se for a primeira vez...
					if (firstTime) {
						// Faz o bind nesse campo para quando for alterado me chamar (esta função) novamente para verificar se a url foi alterada...
						$(parameterName).bind('change keyup', $.proxy(connect, $me))
					}
					// Obtém o valor selecionado no campo que eu dependo
					var value = $(parameterName).val();
					// Indica se conseguiu obter o valor do campo que eu dependo
					resolvedParameters &= value != null && value != "";
					// Retorna o valor correto para montar na url
					return value;
				}
			});
			
			// Se for a primeira vez e possui mais de uma opção na tela, confiar que não precisa fazer o AJAX nesse momento.
			if (firstTime && hasOptions) {
				return;
			}
			
			// Se todos os parâmetros foram encontrados para montar a URL, então...
			if (resolvedParameters) {
				console.log("try connection #" + $me.attr('id'), "to", newURL);
				// Guarda o valor da opção que está selecionada no elemento
				var selectedValueBeforeAjax = $me.val();
				
				// Limpa o select e adiciona a opção com o texto de aguarde/carregando...  
				$me[0].options.length = 0;
				$me.append(options.loadingOption);
				
				// Chama o evento "waiting.connect" (aguardando conexão com fonte de dados)
				$me.trigger('waiting.connect');
				
				// Chama o AJAX para carregar as novas opções
				$.getJSON(newURL, function(list) {
					// Cria os elementos options numa string
					var optionsHtmlString = $.map(list, function(object, index) {
						return "<option value='" + object[options.codeAttribute] + "'>" + object[options.labelAttribute] + "</option>";
					}).join("");
					
					// Apaga as opcoes do select box
					$me[0].options.length = 0;
					
					// Cria as opções defaults
					$me.append($(options.defaultOptions));
					
					// Cria as opções retornadas pelo AJAX
					$me.append($(optionsHtmlString));
					
					// Seleciona a opção que estava marcada antes do AJAX
					$me.val(selectedValueBeforeAjax);
					
					// Se o valor anterior não for igual ao valor retornado (forçar on change neste campo)
					if (selectedValueBeforeAjax != $me.val()) {
						$me.trigger('change');
					}
					
					// Executa o evento "loaded.connect" (conexão com fonte de dados carregada)
					$me.trigger('loaded.connect');
					$me.trigger('change.connect');
				});
			} else {
				console.log("connection not ready #" + $me.attr('id'), "to", options.url, "as", newURL);
				
				// Apaga as opcoes do select box
				$me[0].options.length = 0;
				
				// Cria as opções defaults
				$me.append($(options.defaultOptions));
				
				// Executa o evento "not.ready.connect" (as dependências ainda não estão prontas para conectar com a fonte de dados)
				$me.trigger('not.ready.connect');
				$me.trigger('change.connect');
			}
		});
	}
	
	 
});