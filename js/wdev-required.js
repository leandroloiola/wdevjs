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
		
		if(required != "" && label.text().charAt(label.text().length-1) != "*"){
			label.append(obrigatoriedade);
		}
		
		input.bind('blur', function(){
			if(input.val() == "" || input.val() == 0){
				input.addClass('required');
			} else {
				input.removeClass('required');
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
			
			// Verifica o valor de campos do tipo Radio e Checkbox
			if(type == 'radio' || type == 'checkbox') {
				var checkedValue = $('input[name=' + input.attr('name') + ']:checked').val();
				value = checkedValue == undefined ? '' : checkedValue;
			}
			
			if(required != "") {
				if((value == "" || value == 0)){
					if(listErrors.indexOf(required) < 1){
						input.addClass('required');
						listErrors += "<li>" + required + " é obrigatório</li>";
						hasError = true;
					}
				} else {
					input.removeClass('required');
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
			
			if(value != '') {
				if(!emailFilter.test(value)){
					input.addClass('required');
					listErrors += "<li>Email é inválido.</li>";
					hasError = true;
				} else {
					input.removeClass('required');
				}
			}
		});
		
		if(hasError){
			errors.show();
			errors.html(listErrors);
			return !hasError;
		}
	 });
 });