$(document).ready(function() {
	
	if (checkIfNullToken()) {
		navigateToLoginScreen()
	}

	$('#logout').click(function() {
		clearToken()
		navigateToLoginScreen()
    })

    function navigateToLoginScreen() {
		window.location.href = "/auth"
	}

	function checkIfNullToken() {
		return localStorage.getItem("email") == null ||
			localStorage.getItem("password") == null
	}

	function clearToken() {
		localStorage.clear()
	}

})