/**
 * Transforma os campos que possuírem os atributos abaixo:
 *    data-type="text" - Para campos contendo letras e números, bloqueando os caracteres especiais.
 *    data-type="integer" - Para campos contendo apenas números. 
 *    data-type="currency" - Para campos contendo valores monetários que podem ser positivos(+), negativos(-) e conter separador de milhar(.) e decimais(,).
 */
function inicializarPluginDataTypes() {
	var padrao = {
		'currency': /^[+-]?[0-9]{1,3}(?:\.?[0-9]{3})*(?:\,[0-9]+)?$/
		, 'integer': /^\d*?$/
		, 'text': /^[\dA-Za-z]*$/
		, 'email': /^[\._A-Za-z0-9-+@]$/
	};
	
	var caracteresIlegaisEmail = /[\(\)\<\>\,\;\:\\\/\"\[\]]/;
	
	var caracteresPermitidos = {
		BACKSPACE: 8, COMMAND_LEFT: 91, COMMAND_RIGHT: 93, CONTROL: 17, DELETE: 46, 
		DOWN: 40, END: 35, ENTER: 13, ESCAPE: 27, HOME: 36, LEFT: 37, 
		RIGHT: 39, SHIFT: 16, SPACE: 32, TAB: 9, UP: 38
	}
	
	function permiteCaractere(caractere) {
		var encontrou = false;
		$.each(caracteresPermitidos, function(key, value){
			if(caractere == value) {
				encontrou = true;
				return;
			}
		});
		return encontrou;
	}
	
	$('input[data-type]').each(function() {
		var input = $(this);
		var pattern = input.attr('data-type');
		input.bind('keypress', function(event) {
			event = event || window.event;
			var letter = event.which || event.charCode || event.keyCode;
			if(event.ctrlKey || event.altKey || event.metaKey || permiteCaractere(letter)) {
				return true;
			}
			
			letter = String.fromCharCode(letter);
			 
			if ($.trim(letter) != '' && !padrao[pattern].test(letter)) {
				// se o campo for currency, permite os caracteres ",.-"
				if (pattern == 'currency') {
					if (letter == ',') {
						// não permite mais de um caracter ,
						if (input.val().indexOf(',') == -1) { 
							return true;
						}
					} else if (letter == '.') { 
						// permite quantos separadores de milhar forem necessários
						return true;
					} else if (letter == '-') { 
						// permite valores negativos
						if (input.val().indexOf('-') == -1) {
							return true;
						}
					}
				}
				event.preventDefault();
				return false;
			}
			
			//valida se o e-mail é valido
			if(input.val() || input.val() > 5 && pattern == 'email'){
				var value = input.val();
				var emailFilter=/^[_A-Za-z0-9-+]([._A-Za-z0-9-]+)*@[A-Za-z0-9-]+([A-Za-z0-9]+)(\.[A-Za-z]{2,}){1,2}$/;
				var label = $("label[for="+input.attr('name')+"]");
				var idError = 'required-'+input.attr('name');
				var spanError = "<span id='"+idError+"' class='span-required'><br/>Preenchimento obrigatório</span>";
				var spanInvalido = "<span id='"+idError+"' class='span-required'><br/>"+label.text().replace(":", "").replace("*", "")+" inválido</span>";
				
				if(!emailFilter.test(value)){
					input.addClass('required');	
					$("#"+idError).remove();
					input.after(spanInvalido);
				} else {
					input.removeClass('required');
					$("#"+idError).remove();
				}
			}
		});
		
		// Apaga o valor digitado caso não esteja válido
		input.bind('blur', function() {
			var original = input.val();
			// não faz nada se estiver vazio e for diferente do e-mail (ATENÇÃO: e-mail tem uma validação a parte)
			if (original != "" && pattern != 'email') {
				var value = $.trim(original);
				if (pattern == 'currency') {
					// remove os separadores de milhar para evitar erros desnecessários (ATENÇÃO: verificar se realmente é interessante fazer isso)
					value = value.replace(/\./g, '');
				}
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
			} else if(pattern == 'email'){ //valida se o e-mail é valido
				var value = input.val();
				var emailFilter=/^[_A-Za-z0-9-+]([._A-Za-z0-9-]+)*@[A-Za-z0-9-]+([A-Za-z0-9]+)(\.[A-Za-z]{2,}){1,2}$/;
				var label = $("label[for="+input.attr('name')+"]");
				var idError = 'required-'+input.attr('name');
				var spanError = "<span id='"+idError+"' class='span-required'><br/>Preenchimento obrigatório</span>";
				var spanInvalido = "<span id='"+idError+"' class='span-required'><br/>"+label.text().replace(":", "").replace("*", "")+" inválido</span>";
				
				if(value && !emailFilter.test(value)){
					input.addClass('required');	
					$("#"+idError).remove();
					input.after(spanInvalido);
				} else {
					input.removeClass('required');
					$("#"+idError).remove();
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
		, 'telefone': {mask: '(99) 9999-9999'}
		, 'celular': {mask: '(99) 9999-9999'}
		, 'celular-nono-digito': {mask: '(99) 99999-9999'}
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
		
		if(mascara == 'celular' && $.trim($input.val()) != '') {
			if($input.val().length > 8) {
				opcoesMascara = mascaras['celular-nono-digito'];
			}
		}
		
		$input.inputmask(opcoesMascara.mask, opcoesMascara);
		
		if(!$input.inputmask("isComplete")) {
			$input.val('');
		}
		
		$input.bind('keyup', function(){
			if(mascara == 'celular') {
				var value = $input.val();
				var ddd = "";
				
				if(value.length >= 2){
					ddd = value.substring(0,2);
				}
				
				if(ddd == "11"){
					opcoesMascara = mascaras['celular-nono-digito'];
					$input.inputmask(opcoesMascara.mask, opcoesMascara);
				} else {
					opcoesMascara = mascaras['celular'];
					$input.inputmask(opcoesMascara.mask, opcoesMascara);
				}
			}
		});
	});
	
	function right(value, size) {
		return value.substring(value.length - size);
	}
	
	function format(pattern, value) {
		return pattern.replace("dd", right("00" + value.getDate(), 2))
					  .replace("mm", right("00" + (value.getMonth() + 1), 2))
					  .replace("yy", right("00" + value.getFullYear(), 4));
	}
	
	var dateTypes = {
		'botao-calendario': {showOn: 'button', buttonImage: 'css/images/calendar.gif', buttonImageOnly: true}
		, 'nascimento': {yearRange: 'c-100:c+50'} // Data de nascimento (-100 anos / +50 anos a partir da data atual)
		, 'pesquisa-futura': {yearRange: 'c-100:c+10'} // Pesquisa futura (-100 anos / +10 anos a partir da data atual)
	};

	$('input[data-date-type]').each(function() {
		var input$ = $(this);
		var dateType = input$.attr('data-date-type') || 'default';
		
		var dateConfig = { showButtonPanel: false, changeMonth: true, changeYear: true, onClose: function() {
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
		
		$.extend(dateConfig, dateTypes[dateType]);
		
		switch (dateType) {
			case "nascimento":
				$.extend(dateConfig, {});
				break;
			case "pesquisa-futura":
				$.extend(dateConfig, {changeMonth: true, changeYear: true, showButtonPanel: false, });
				break;
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



/**
 * MÉTODO PARA MASCARAR OS CAMPOS TYPE FILE
 */
function mascararInputFile(){
	$("input[type=file]").each(function(){
		var input = $(this);
		var name = input.attr('name');
		var nameFake = name+"Fake";
		var value = input.val();
		var inputFake = "<input name='"+nameFake+"' value='"+value+"' /><a href='#' onclick='return false;' id='"+nameFake+"'><img src='css/images/folder.png' height='20' /></a>";
		
		input.attr('onkeypress', 'return false;');
		input.bind('keypress', function(e){
			e.preventDefault();
			return false;
		}).bind('keydown', function(){
			return false;
		});
		
		input.after(inputFake);
		input.hide();
		
		input.bind('change', function(){
			$("input[name='"+nameFake+"']").val($(this).val());
		});
		
		$("input[name='"+nameFake+"'], a#"+nameFake+" ").bind('click', function(){
			input.click();
		});
		
		$("input[name='"+nameFake+"']").attr('onkeypress', 'return false;');
		$("input[name='"+nameFake+"']").bind('keypress', function(e){
			e.preventDefault();
			return false;
		}).bind('keydown', function(){
			return false;
		});
	});
}


$(document).ready(function(){
	inicializarPluginDataTypes();
	
	mascararInputFile();
});