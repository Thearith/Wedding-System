$(document).ready(function() {

	$('#btn-add-wedding').click(function(e) {
		e.preventDefault()

		var inputs = $('#add-wedding-form input')
		var groomName = inputs[0].value
		var brideName = inputs[1].value
		var groomPhotoUrl = inputs[2].value
		var bridePhotoUrl = inputs[3].value
		var location = inputs[4].value
		var date = inputs[5].value

		if (groomName && brideName && location && date) {
			makeAddWeddingRequest(groomName, brideName, location, date, groomPhotoUrl, 
				bridePhotoUrl)
		} else {
			alert("Please add all inputs before submit")
		}
	})

	$(document).on('click', '.view-more', function(){
		var weddingId = $(this).data("id")
		navigateToWeddingDetailScreen(weddingId)
	});

	$("#btn-modal-add-wedding").height($('.wedding-card').height())

	$.ajax({
		url: "/api/weddings",
		type: 'GET',
		headers: {
			email: localStorage.getItem("email"),
			password: localStorage.getItem("password")
		},
		contentType : 'application/json',
		success: function(weddings) {
			var count = weddings.length
			setUpWeddingCount(count)
			setUpWeddingCards(weddings)
		},
		error: function(errMsg) {
			console.error(errMsg)
		}
	})

	function makeAddWeddingRequest(groomName, brideName, location, date, 
		groomPhotoUrl, bridePhotoUrl) {
		var payload = {
			groomName,
			brideName,
			date,
			location,
			groomPhotoUrl,
			bridePhotoUrl
		}
		$.ajax({
			url: "/api/weddings",
			type: 'POST',
			headers: {
				email: localStorage.getItem("email"),
				password: localStorage.getItem("password")
			},
			dataType: 'json',
			contentType : 'application/json',
			data: JSON.stringify(payload),
			success: function(wedding) {
				$('#add-wedding-modal').modal('hide')
				$('#add-wedding-form')[0].reset()

				var weddingCountText = $('#wedding-count p').text()
				var countText = weddingCountText.split(" ")[0]
				var count = parseInt(countText)
				setUpWeddingCount(count + 1)

				createWeddingCard(wedding)
			},
			error: function(errMsg) {
				console.error(errMsg)
			}
		})
			
	}

	function setUpWeddingCount(count) {
		console.log(count)
		var weddingTxt = count == 1 ? "1 wedding" : `${count} weddings`
		var weddingHtml = `<p>${weddingTxt}</p>`
		$('#wedding-count').html("Welcome! You have " + weddingHtml + " to attend.")
	}

	function setUpWeddingCards(weddings) {
		for(i=0; i<weddings.length; i++) {
			createWeddingCard(weddings[i])
		}
	}

	function createWeddingCard(wedding) {
		var weddingCard = $('.wedding-card.hide').clone()
		weddingCard.removeClass('hide')
		weddingCard.find('.wedding-date').text(wedding.date)
		weddingCard.find('.groom-name').text(wedding.groomName)
		weddingCard.find('.bride-name').text(wedding.brideName)
		weddingCard.find('.location').text(wedding.location)
		weddingCard.find('.view-more').data("id", wedding.id)

		if (wedding.groomPhotoUrl != null) {
			weddingCard.find('.groom-photo').attr("src", wedding.groomPhotoUrl)
		}

		if (wedding.groomPhotoUrl != null) {
			weddingCard.find('.bride-photo').attr("src", wedding.bridePhotoUrl)
		}

		weddingCard.insertBefore("#btn-modal-add-wedding")
	}

	function navigateToWeddingDetailScreen(weddingId) {
		window.location.href = "/weddings/" + weddingId
	}
})