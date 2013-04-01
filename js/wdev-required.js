/**
 * Adiciona o asteristico para todos os campos obrigatórios e faz sua validação (se foi preenchido):
 */
 $(document).ready(function(){
	/**
	 * Adiciona uma div para a listagem dos erros de validação acima do form.
	 */
	 $("form").before("<div id='list-errors' style='display: none;'></div>");
	
	/**
	 * Adiciona nos campos obrigatórios um * para indicar sua obrigatoriedade.
	 */
	$("[data-required]").each(function(){
		var input = $(this);
		var required = input.attr('data-required');
		var obrigatoriedade = "<span class='obrigatorio'>*</span>";
		var label = $("label[for="+input.attr('name')+"]");
		var width = input.css('width');
		var height = input.css('height');
		var idError = 'required-'+input.attr('name');
		var spanError = "<span id='"+idError+"' class='span-required'><br/>Preenchimento obrigatório</span>";
		var spanInvalido = "<span id='"+idError+"' class='span-required'>"+$("label").text()+"</span>";
		
		if(required != "" && label.text().charAt(label.text().length-1) != "*"){
			label.append(obrigatoriedade);
		}
		
		input.bind('blur', function(){
			if(input.val() == "" || input.val() == 0){
				input.addClass('required');
				$("#"+idError).remove();
				input.after(spanError);
			} else {
				if((input.attr('data-type') && input.attr('data-type') != 'email') || !input.attr('data-type')){
					input.removeClass('required');
					$("#"+idError).remove();
				}
			}
		});
	});
	
	/**
	 * Verifica se os campos com o atributo data-required foram preenchidos.
	 */
	 $("form").submit(function(){
		var hasError = false;
		var listErrors = "";
		var errors = $("div#list-errors");
		
		$("[data-required]").each(function(){
			var input = $(this);
			var type = input.attr('type');
			var required = input.attr('data-required');
			var value = input.val();
			var label = $("label[for="+input.attr('name')+"]");
			var label = $("label[for="+input.attr('name')+"]");
			var idError = 'required-'+input.attr('name');
			var spanError = "<span id='"+idError+"' class='span-required'><br/>Preenchimento obrigatório</span>";
			var spanInvalido = "<span id='"+idError+"' class='span-required'><br/>"+label.text().replace(":", "").replace("*", "")+" inválido</span>";
			
			// Verifica o valor de campos do tipo Radio e Checkbox
			if(type == 'radio' || type == 'checkbox') {
				var checkedValue = $('input[name=' + input.attr('name') + ']:checked').val();
				value = checkedValue == undefined ? '' : checkedValue;
			}
			
			if(required) {
				if((value == "" || value == 0)){
					if(listErrors.indexOf(required) < 1){
						input.addClass('required');
						listErrors += "<li>" + required + " é obrigatório</li>";
						hasError = true;
						console.log(type);
						if(type != "checkbox" && type != "radio" && type != undefined){
							$("#"+idError).remove();
							input.after(spanError);
						}
					}
				} else {
					input.removeClass('required');
					$("#"+idError).remove();
				}
			}
		});
		
		/**
		 * Verifica se os campos com o atributo data-type=email estão com o valor no padrão nome@dominio.com
		 */
		$("[data-type=email]").each(function(){
			var input = $(this);
		
			var value = input.val();
			var valueLength = value.length;
			var emailFilter=/^[_A-Za-z0-9-+]([._A-Za-z0-9-]+)*@[A-Za-z0-9-]+([A-Za-z0-9]+)(\.[A-Za-z]{2,}){1,2}$/;
			var label = $("label[for="+input.attr('name')+"]");
			var idError = 'required-'+input.attr('name');
			var spanError = "<span id='"+idError+"' class='span-required'><br/>Preenchimento obrigatório</span>";
			var spanInvalido = "<span id='"+idError+"' class='span-required'><br/>"+label.text().replace(":", "").replace("*", "")+" inválido</span>";
			
			if(value) {
				if(!emailFilter.test(value)){
					input.addClass('required');
					listErrors += "<li>Email é inválido.</li>";
					hasError = true;
					$("#"+idError).remove();
					input.after(spanInvalido);
				} else {
					input.removeClass('required');
					$("#"+idError).remove();
				}
			} else {
				input.addClass('required');
				$("#"+idError).remove();
				input.after(spanError);
			}
		});
		
		if(hasError){
			errors.show();
			errors.html(listErrors);
			return !hasError;
		}
	 });
 });