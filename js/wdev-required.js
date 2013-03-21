/**
 * Adiciona o asteristico para todos os campos obrigatórios e faz sua validação (se foi preenchido):
 */
 
 $(document).ready(function(){
 
	/**
	 * INSERIR DIV DE ERROS ANTES DO FORM
	 */
	 $("form").before("<div id='list-errors' style='display: none;'></div>");
	
	/**
	 * INSERIR SINALIZAÇÃO NOS CAMPOS OBRIGATÓRIOS
	 */
	$("input[data-required], select[data-required]").each(function(){
		var input = $(this);
		var required = input.attr('data-required');
		var obrigatoriedade = "<span class='obrigatorio'>*</span>";
		var label = $("label[for="+input.attr('name')+"]");
		
		if(required != ""){
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
	 * CONTROLAR SE OS CAMPOS OBRIGATÓRIOS FORAM PREENCHIDOS
	 */
	 $("form").submit(function(){
		var hasError = false;
		var listErrors = "";
		var errors = $("div#list-errors");
		
		$("input[data-required], select[data-required]").each(function(){
			var input = $(this);
			var required = input.attr('data-required');
			var value = input.val();
			
			if(required != ""){	
				if(value == "" || value == 0){
					input.addClass('required');
					listErrors += "<li>"+required+" é obrigatório</li>";
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