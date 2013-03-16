/**
 * Transforma os campos que possuírem os atributos abaixo:
 *    data-type="text" - Para campos contendo letras e números, bloqueando os caracteres especiais.
 *    data-number-type="..."
 *         "integer" - Para campos contendo apenas números. 
 *         "currency" - Para campos contendo valores monetários que podem ser positivos(+), negativos(-) e conter separador de milhar(.)
 *                      e decimais(,).
 */
function inicializarPluginDataTypes() {
	var padrao = {
		'currency': /^[+-]?[0-9]{1,3}(?:\.?[0-9]{3})*(?:\,[0-9]+)?$/
		, 'integer': /^\d*?$/
		, 'text': /^[\dA-Za-z]*$/
	};
	
	$('input[data-type]').each(function() {
		var input = $(this);
		var pattern = input.attr('data-type');
		input.bind('keypress', function(e) {
			var letter = null;
			 if (event.which == null) { // Referência http://unixpapa.com/js/key.html
				 letter = String.fromCharCode(event.keyCode);    // old IE
			 } else if (event.which != 0 && event.charCode != 0) {
				  letter = String.fromCharCode(event.which);	  // All others
			 }
			 if (!padrao[pattern].test(letter)) {
				 e.preventDefault();
				 return false;
			 }
		});
		
		// Apaga o valor digitado caso não esteja válido
		input.bind('blur', function() {
			var original = input.val();
			// não faz nada se estiver vazio
			//console.log(original);
			if (original != "") {
				// remove os separadores de milhar para evitar erros desnecessários (ATENÇÃO: verificar se realmente é interessante fazer isso)
				var value = $.trim(original).replace(/\./, '');
				// verifica se a expressão está no formato monetário correto
				var valid = padrao[pattern].test(value);
				if (valid) {
					// se o valor tratado estiver válido mas for diferente do valor digitado pelo usuário
					if (original != value) {
						// altera o campo e coloca o valor tratado
						input.val(value);
					}
				} else {
					// apagar se estiver inválido
					input.val("");
				}
			}
		});
	});
	
	$('input[data-number-type]').each(function() {
		var input = $(this);
		var numberType = input.attr('data-number-type');
		input.bind('keypress', function(e) {
			var letter = null;
			
			if (event.which == null) { // Referência http://unixpapa.com/js/key.html
				letter = String.fromCharCode(event.keyCode);    // old IE
			} else if (event.which != 0 && event.charCode != 0) {
				letter = String.fromCharCode(event.which);	  // All others
			}
			
			if (/[^0-9]/.test(letter)) {
				// se o campo for currency, permite os caracteres ",.-"
				if (numberType == 'currency') {
					if (letter == ',') {
						// não permite mais de um caracter ,
						if (input.val().indexOf(',') == -1) { 
							return true;
						}
						 
					// permite quantos separadores de milhar forem necessários
					} else if (letter == '.') { 
						return true;
					
					// permite valores negativos
					} else if (letter == '-') { 
						if (input.val().indexOf('-') == -1) {
							return true;
						}
					}
				}
				
				e.preventDefault();
				return false;
			}
		});
		
		// Apaga o valor digitado caso não esteja válido
		input.bind('blur', function() {
			var original = input.val();
			// não faz nada se estiver vazio
			
			if (original != "") {
				// remove os separadores de milhar para evitar erros desnecessários (ATENÇÃO: verificar se realmente é interessante fazer isso)
				var value = $.trim(original).replace(/\./, '');
				// verifica se a expressão está no formato monetário correto
				var valid = padrao[numberType].test(value);
				
				if (valid) {
					// se o valor tratado estiver válido mas for diferente do valor digitado pelo usuário
					if (original != value) {
						// altera o campo e coloca o valor tratado
						input.val(value);
					}
				} else {
					// apagar se estiver inválido
					input.val("");
				}
			}
		});
	});
	
	// Opcoes default
	$.extend($.inputmask.defaults, {
		autoUnmask: true
		, clearIncomplete: true
		, showMaskOnHover: false
	});

	var mascaras = {
		'data': {mask: '99/99/9999', autoUnmask: false}
		, 'cpf': {mask: '999.999.999-99'}
		, 'cep': {mask: '99999-999'}
		, 'telefone': {mask: '9999-9999'}
		, 'telefone-nono-digito': {mask: '99999-9999'}
	};
	
	function boolean(value, defaultValue) {
		if (value == null) {
			return defaultValue || false;
		}
		return ($.trim(value) === "true" || $.trim(value) === "yes" || value === true);
	}
	
	$('input[data-mask]').each(function() {
		var $input = $(this);
		var mascara = $input.attr('data-mask');
		
		var opcoesMascara = mascaras[mascara]; 
		
		if (!opcoesMascara) {
			opcoesMascara = {mask: mascara, autoUnmask: boolean($input.attr('data-autounmask'), true) };
		}
		
		if(mascara == 'telefone' && $.trim($input.val()) != '') {
			if($input.val().length > 8) {
				opcoesMascara = mascaras['telefone-nono-digito'];
			}
		}
		
		$input.inputmask(opcoesMascara.mask, opcoesMascara);
		
		if(!$input.inputmask("isComplete")) {
			$input.val('');
		}
	});
	
	function right(value, size) {
		return value.substring(value.length - size);
	}
	
	function format(pattern, value) {
		return pattern.replace("dd", right("00" + value.getDate(), 2))
					  .replace("mm", right("00" + (value.getMonth() + 1), 2))
					  .replace("yy", right("00" + value.getFullYear(), 4));
	}

	$('input[data-date-type]').each(function() {
		var input$ = $(this);
		var dateType = input$.attr('data-date-type') || 'default';
		
		var dateConfig = { showButtonPanel: true, onClose: function() {
			var date = input$.datepicker("getDate");
			if (date == null 
				  // contornar o bug do jQuery UI http://bugs.jqueryui.com/ticket/8009
				  || $.trim(input$.val()) != $.datepicker.formatDate(input$.datepicker("option", "dateFormat"), date)
				) {
				input$.val("");
			}
		}};
		
		// fix para o bug do enter não validar uma data inválida
		input$.blur(function() {
			var date = null;
			try {
				date = $.datepicker.parseDate(input$.datepicker("option", "dateFormat"), input$.val());
			} catch (e) {}
			if (date == null) {
				input$.val("");
			}
		});
		
		switch (dateType) {
			case "default":
				$.extend(dateConfig, {changeMonth: true, changeYear: true, showButtonPanel: false});
				break;
			case "nascimento":
				$.extend(dateConfig, {changeMonth: true, changeYear: true, showButtonPanel: false, yearRange: "c-100:c+50"});
				break;
			case "pesquisa-futura":
				$.extend(dateConfig, {changeMonth: true, changeYear: true, showButtonPanel: false, yearRange: "c-100:c+10"});
				break;
			default:
				throw new Error("Tipo de data '" + dateType + "' desconhecido'");
		}
					
		input$.datepicker(dateConfig);
		
		input$.keypress(function(event) {
			var keyCode = null;
			
			if (event.which == null) {
				keyCode = event.keyCode;
			} else if (event.which != 0) {
				keyCode = event.which;
			} else if (event.charCode != 0) {
				keyCode = event.charCode;
			}
			
			// Bloqueia o Enter
			if(keyCode == 13) {
				event.preventDefault();
				return false;
			}
		});
    });
}

$(document).ready(inicializarPluginDataTypes);