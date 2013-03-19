$(document).ready(function() {

	/**
	 * Conecta um campo SELECT � uma fonte dados atrav�s de JSON
	 * Recebe os par�metros:
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
		var userOptions = $.extend({defaultOptions: $.Options.Default // Op��es fixas na combo ap�s retorno do AJAX
								  , loadingOption: $.Options.Loading  // Texto de aguarde durante o AJAX
								  , codeAttribute: 'codigo'
								  , labelAttribute: 'descricao'}, opts);
		
		// Para cada elemento encontrado tenta conectar a fonte de dados ao SELECT
		return this.each(function connect() {
			var $me = $(this);
			
			// Obt�m as configura��es para este elemento caso j� existam
			var options = $me.data('connect-options');
			// Caso n�o exista nenhuma configura��o significa que � a primeira vez que executa essa fun��o 
			var firstTime = options == null;
			// Caso as configura��es n�o existam, cria as configura��es e armazena como "connect-options" para a pr�xima execu��o dessa fun��o.
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
			
			// Tenta montar a URL completa substituindo todos os par�metros entre chaves {...}
			var newURL = url.replace(paramRE, function(match, parameterName) {
				// Se o par�metro come�ar com @@ ent�o ...
				if (parameterName.length > 1 && parameterName[0] == '@' && parameterName[1] == '@') {
					// O nome real do par�metro � sem @@ na frente
					var realParameterName = parameterName.substring(2);
					// Caso o par�metro n�o seja do jQuery, verificar se � uma fun��o ou se � um valor
					var param = options.params && options.params[realParameterName];
					var value = $.type(param) == 'function' ? param(url, realParameterName, parameterName) : param;
					// Verificar se conseguiu obter este valor
					resolvedParameters &= $.type(value) != 'undefined';
					// Retorna o valor correto
					return value;
				} else { // Se o primeiro caracter do par�metro for # ou ., considerar que seja um elemento do jQuery que eu dependo
					// Se for a primeira vez...
					if (firstTime) {
						// Faz o bind nesse campo para quando for alterado me chamar (esta fun��o) novamente para verificar se a url foi alterada...
						$(parameterName).bind('change keyup', $.proxy(connect, $me))
					}
					// Obt�m o valor selecionado no campo que eu dependo
					var value = $(parameterName).val();
					// Indica se conseguiu obter o valor do campo que eu dependo
					resolvedParameters &= value != null && value != "";
					// Retorna o valor correto para montar na url
					return value;
				}
			});
			
			// Se for a primeira vez e possui mais de uma op��o na tela, confiar que n�o precisa fazer o AJAX nesse momento.
			if (firstTime && hasOptions) {
				return;
			}
			
			// Se todos os par�metros foram encontrados para montar a URL, ent�o...
			if (resolvedParameters) {
				console.log("try connection #" + $me.attr('id'), "to", newURL);
				// Guarda o valor da op��o que est� selecionada no elemento
				var selectedValueBeforeAjax = $me.val();
				
				// Limpa o select e adiciona a op��o com o texto de aguarde/carregando...  
				$me[0].options.length = 0;
				$me.append(options.loadingOption);
				
				// Chama o evento "waiting.connect" (aguardando conex�o com fonte de dados)
				$me.trigger('waiting.connect');
				
				// Chama o AJAX para carregar as novas op��es
				$.getJSON(newURL, function(list) {
					// Cria os elementos options numa string
					var optionsHtmlString = $.map(list, function(object, index) {
						return "<option value='" + object[options.codeAttribute] + "'>" + object[options.labelAttribute] + "</option>";
					}).join("");
					
					// Apaga as opcoes do select box
					$me[0].options.length = 0;
					
					// Cria as op��es defaults
					$me.append($(options.defaultOptions));
					
					// Cria as op��es retornadas pelo AJAX
					$me.append($(optionsHtmlString));
					
					// Seleciona a op��o que estava marcada antes do AJAX
					$me.val(selectedValueBeforeAjax);
					
					// Se o valor anterior n�o for igual ao valor retornado (for�ar on change neste campo)
					if (selectedValueBeforeAjax != $me.val()) {
						$me.trigger('change');
					}
					
					// Executa o evento "loaded.connect" (conex�o com fonte de dados carregada)
					$me.trigger('loaded.connect');
					$me.trigger('change.connect');
				});
			} else {
				console.log("connection not ready #" + $me.attr('id'), "to", options.url, "as", newURL);
				
				// Apaga as opcoes do select box
				$me[0].options.length = 0;
				
				// Cria as op��es defaults
				$me.append($(options.defaultOptions));
				
				// Executa o evento "not.ready.connect" (as depend�ncias ainda n�o est�o prontas para conectar com a fonte de dados)
				$me.trigger('not.ready.connect');
				$me.trigger('change.connect');
			}
		});
	}
	
	 
});