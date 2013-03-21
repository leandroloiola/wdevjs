/**
 * Controla o valor do input
 */

 
 
 /*
	FUNÇAO PARA CONTROLAR OS CARACTERES DO TEXTAREA
 */
	$("textarea[maxlength]").live('focus', function(){
		var input = $(this);
	
		//cria uma variavel para armazenar o valor
		var value = input.val();
		
		//pega o maxlength
		var maxlength = input.attr('maxlength');
		
		//tamanho do value
		var length = value.length;
		
		//calcula quantidade de caracteres restantes
		var restante = maxlength - length;
		
		//conta os caracteres
		if(restante == 1){
			$('#limit').remove();
			$('#divCountCaracterTextarea').remove();
			input.after("<div id='divCountCaracterTextarea'><span id='countCaracterTextarea'><b>" 
						+ restante + "</span> caracter restante. [Máx: " + maxlength + " caracteres]</b></div>");
		} else if(restante > 1){
			$('#limit').remove();
			$('#divCountCaracterTextarea').remove();
			input.after("<div id='divCountCaracterTextarea'><span id='countCaracterTextarea'><b>" 
					+ restante + "</span> caracteres restantes. [Máx: " + maxlength + " caracteres]</b></div>");
		} else if(restante == 0){
			$('#limit').remove();
			$('#divCountCaracterTextarea').remove();
			input.after("<span style='color:red;font-weight:bold;width:100%;float:left;' id='limit'>Limite de " + maxlength + " caracteres foi atingido.</span>");
		}
	});
	 
	 
	$("textarea[maxlength]").live('keyup', function(){
		var input = $(this);
		
		//cria uma variavel para armazenar o valor
		var value = input.val();
		
		//pega o maxlength
		var maxlength = input.attr('maxlength');
		
		//tamanho do value
		var length = value.length;
		
		//calcula quantidade de caracteres restantes
		var restante = maxlength - length;
		
		//valida se ja atingiu o máximo de caracteres
		if(restante == 0){
			$('#limit').remove();
			$('#divCountCaracterTextarea').remove();
			input.after("<span style='color:red;font-weight:bold;width:100%;float:left;' id='limit'>Limite de " + maxlength + " caracteres foi atingido.</span>");
		}
		
		//conta os caracteres
		if(restante == 1){
			$('#limit').remove();
			$('#divCountCaracterTextarea').remove();
			input.after("<div id='divCountCaracterTextarea'><span id='countCaracterTextarea'><b>" 
						+ restante + "</span> caracter restante. [Máx: " + maxlength + " caracteres]</b></div>");
		} else if(restante > 1){
			$('#limit').remove();
			$('#divCountCaracterTextarea').remove();
			input.after("<div id='divCountCaracterTextarea'><span id='countCaracterTextarea'><b>" 
					+ restante + "</span> caracteres restantes. [Máx: " + maxlength + " caracteres]</b></div>");
		} else if(restante == 0){
			$('#limit').remove();
			$('#divCountCaracterTextarea').remove();
			input.after("<span style='color:red;font-weight:bold;width:100%;float:left;' id='limit'>Limite de " + maxlength + " caracteres foi atingido.</span>");
		}
	});
	$("textarea[maxlength]").live('keydown', function(e){
		var input = $(this);
	
		//recupera a tecla digitada
		var key = e.keyCode;
		
		//cria uma variavel para armazenar o valor
		var value = input.val();
		
		//pega o maxlength
		var maxlength = input.attr('maxlength');
		
		//tamanho do value
		var length = null;
		if(key == 8 || key == 46){
			length = value.length - 1;
		} else if(key == 18 || key == 17 || key == 16 || key == 20 || key == 9 || key == 37 || key == 38 
				|| key == 39 || key == 40 || key == 13){
			length = value.length;
		} else {
			length = value.length + 1;
		}
		
		//monta a variavel com o value caso seja maior que o maxlength
		var newValue = value.substr( 0, maxlength);
		
		//calcula quantidade de caracteres restantes
		var restante = maxlength - length;
		
		//valida se ja atingiu o máximo de caracteres
		if(restante == 0){
			$('#limit').remove();
			$('#divCountCaracterTextarea').remove();
			input.after("<span style='color:red;font-weight:bold;width:100%;float:left;' id='limit'>Limite de " + maxlength + " caracteres foi atingido.</span>");
		} else if(length > maxlength){
			input.val(newValue);
			$('#limit').remove();
			$('#divCountCaracterTextarea').remove();
			input.after("<span style='color:red;font-weight:bold;width:100%;float:left;' id='limit'>Limite de " + maxlength + " caracteres foi atingido.</span>");
			return false;
		}
	});
	
	$("textarea[maxlength]").live('blur', function(){
		var input = $(this);
		
		//cria uma variavel para armazenar o valor
		var value = input.val();
		
		//pega o maxlength
		var maxlength = input.attr('maxlength');
		
		//tamanho do value
		var length = value.length;
		
		//monta a variavel com o value caso seja maior que o maxlength
		var newValue = value.substr( 0, maxlength);
		
		//valida se ja atingiu o máximo de caracteres
		if(length > maxlength){
			input.val(newValue);
		}
		
		//remove as mensagens
		$('#limit').remove();
		$('#divCountCaracterTextarea').remove();
	});