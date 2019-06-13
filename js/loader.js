window.onload = function() {
	var preloader = document.getElementById('loader');
	var cards = document.getElementsByClassName('card');
	for (var i = 0; i < cards.length; i++) {
		cards[i].classList.add('flip');
	}
	//Prerender all cards
	setTimeout(function() {
		for (var i = 0; i < cards.length; i++) {
			cards[i].classList.remove('flip');
		}
	}, 500);

	setTimeout(function() {
		preloader.style.display = 'none';
	}, 800);
};
