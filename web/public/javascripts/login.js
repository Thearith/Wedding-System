$(document).ready(function() {

	if (!checkIfNullToken()) {
		navigateToMainPage()
	}

	$('#login .create-account a').click(function() {
		$('#login').addClass('hide')
		$('#signup').removeClass('hide')
	})

	$('#signup .create-account a').click(function() {
		$('#login').removeClass('hide')
		$('#signup').addClass('hide')
	})

	$('#signup-form').submit(function(e) {
		e.preventDefault()
		
		var inputs = $('#signup-form input')
		var email = inputs[1].value
		var password = inputs[2].value

		var formBody = {
			"name": inputs[0].value,
			"email": email,
			"password": password
		}

		$.ajax({
			url: "/api/signUp",
			type: 'POST',
			data: JSON.stringify(formBody),
			dataType: 'json',
			contentType : 'application/json',
			success: function(data) {
				persistToken(email, password)
				navigateToMainPage()
			},
			error: function(errMsg) {
				alert(errMsg)
			}
		})
	})

	$('#login-form').submit(function(e) {
		e.preventDefault()
		
		var inputs = $('#login-form input')
		var email = inputs[0].value
		var password = inputs[1].value

		var formBody = {
			"email": email,
			"password": password
		}

		$.ajax({
			url: "/api/login",
			type: 'POST',
			data: JSON.stringify(formBody),
			dataType: 'json',
			contentType : 'application/json',
			success: function(data) {
				persistToken(email, password)
				navigateToMainPage()
			},
			error: function(errMsg) {
				alert(errMsg)
			}
		})
	})

	function navigateToMainPage() {
		window.location.href = "/"
	}

	function persistToken(email, password) {
		localStorage.setItem("email", email)
		localStorage.setItem("password", password)
	}

	function checkIfNullToken() {
		return localStorage.getItem("email") == null ||
			localStorage.getItem("password") == null
	}

})