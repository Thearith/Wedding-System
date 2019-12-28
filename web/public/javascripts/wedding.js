$(document).ready(function() {

    var weddingId = location.pathname.split("/")[2]
	
	$('#guest-list-textarea').on('input', function(e) {
		var guests = e.target.value.split("\n")
		var nonEmptyGuests = guests.filter((guest) => guest != null && guest != "")
		var numGuests = nonEmptyGuests.length
		var label = $("label[for='" + $(this).attr('id') + "']")
		label.html(`Guest List <i>(Each name per line)</i>: <b>${numGuests} Guest(s)</b>`)
	})

	$('#btn-update-guests').click(function (e) {
		var inputGuestList = $('#guest-list-textarea').val().split("\n")
		var guests = { guests: inputGuestList }
		makeUpdateGuestListRequest(guests)
	})

	$('#btn-get-qr-code').click(function (e) {
		navigateToQrCodeScreen(weddingId)
	})

	$('.qrcode-copy-clipboard').click(function (e) {
		var element = $(this).data("target")
		var text = $(element).clone().find('br').prepend('\r\n').end().text()
		element = $('<textarea>').appendTo('body').val(text).select()
		document.execCommand('copy')
		element.remove()
	})

	$.ajax({
		url: "/api/weddings/" + weddingId,
		type: 'GET',
		headers: {
			email: localStorage.getItem("email"),
			password: localStorage.getItem("password")
		},
		contentType : 'application/json',
		success: function(wedding) {
			updateWedding(wedding)
			updateAdminQrCodes(weddingId)
		},
		error: function(errMsg) {
			console.error(errMsg)
		}
	})

	$.ajax({
		url: "/api/weddings/" + weddingId + "?q=guests",
		type: 'GET',
		headers: {
			email: localStorage.getItem("email"),
			password: localStorage.getItem("password")
		},
		contentType : 'application/json',
		success: function(data) {
			updateGuests(data.guests)
		},
		error: function(errMsg) {
			console.error(errMsg)
		}
	})

	function makeUpdateGuestListRequest(guests) {
		$.ajax({
			url: "/api/weddings/" + weddingId,
			type: 'POST',
			headers: {
				email: localStorage.getItem("email"),
				password: localStorage.getItem("password")
			},
			data: JSON.stringify(guests),
			contentType : 'application/json',
			dataType: 'json',
			success: function(data) {
				$('#update-guest-list-modal').modal('hide')
				$('#update-guest-list-modal form')[0].reset()
				$('.guest-table tbody').empty()
				updateGuests(data.guests)
			},
			error: function(errMsg) {
				alert(errMsg)
			}
		})
	}

	function updateWedding(wedding) {
		$('#groom-name').text(wedding.groomName)
		$('#bride-name').text(wedding.brideName)
		$('#location').text(wedding.location)
		$('#date').text(wedding.date)
	}

	function updateGuests(guests) {
		updateGiftsInfo(guests)
		updateGuestTable(guests)
		updateGuestsQrCode(guests)
	}

	function updateGiftsInfo(guests) {
		var guestCount = guests.length
		var dollarSum = 0
		var rielSum = 0
		for(i=0; i<guestCount; i++) {
			var guest = guests[i]
			dollarSum += parseFloat(guest.dollarAmount) || 0
			rielSum += parseFloat(guest.rielAmount) || 0
		}

		$('#number-guests').text(guestCount + " Guests")
		$('#dollar-gifts').text(dollarSum + " $")
		$('#riel-gifts').text(rielSum + " ៛")
	}

	function updateGuestTable(guests) {
		for(index=0; index<guests.length; index++) {
			var guest = guests[index]
			var row = getGuestRow(index, guest)
			$('.guest-table tbody').append(row)
		}
	}

	function getGuestRow(index, guest) {
		var dollarAmount = guest.dollarAmount || 0
		var rielAmount = guest.rielAmount || 0
		return $(
			`<tr>\
				<th scope='row'>${index+1}</th>\
				<td>${guest.name}</td>
				<td>${dollarAmount} $</td>
				<td>${rielAmount} $</td>
			</tr>`
		)
	}

	function updateGuestsQrCode(guests) {
		var qrCodes = ""
		for(i=0; i<guests.length; i++) {
			var guestName = guests[i].name 
			var qrCode = weddingId + "_" + guestName + "," + guestName
			qrCodes += qrCode + "<br/>"
		}

		console.log(qrCodes)

		$('#qrcode-type1').html(qrCodes)
	}

	function updateAdminQrCodes(weddingId) {
		var qrCodeType2 = weddingId + "_admin,Add Guest"
		$('#qrcode-type2').html(qrCodeType2)

		var qrCodeType3 = weddingId + "_Amount,Show Amount"
		$('#qrcode-type3').html(qrCodeType3)
	}

	function navigateToQrCodeScreen(weddingId) {
		window.location.href = "/qrcode/" + weddingId
	}

})