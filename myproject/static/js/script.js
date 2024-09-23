$(document).ready(function() {
	const translations = {
		en: {
			'home': 'Home',
			'event_listing': 'Event Listing',
			'event_details': 'Event Details',
			'statistics': 'Statistics',
			'index': 'Index',
			'show_galaxy_matrix_dashboard': 'Show Galaxy Matrix Dashboard',
			'histogram': 'Histogram',
			'search_ioc': 'Search Ioc',
			'import_ioc': 'Import Ioc',
			'enrichment': 'Enrichment',
			'ioc-automation': 'Ioc Automation',
			'export_urls': 'Export Urls',
			'market-place': 'Market Place',
			'user_listing': 'User Listing',
			'roles': 'Roles',
			'auth_keys_index': 'Auth Keys Index',
			'tag_listing': 'Tag Listing',
			'send-newsletter': 'Newsletter',
			'plugin_config': 'Plugin Config',
			'application_logs': 'Application Logs',
			'feeds': 'Feeds',
			'license': 'License',
			'galaxies': 'Galaxies',
			'jobs': 'Jobs',
			'profile': 'Profile',
			'change-password': 'Change Password'
		},
		fr: {
			'home': 'Accueil',
			'event_listing': 'Liste des Événements',
			'event_details': 'Détails de l\'Événement',
			'statistics': 'Statistiques',
			'index': 'Index',
			'show_galaxy_matrix_dashboard': 'Afficher le tableau de bord de la matrice de la galaxie',
			'histogram': 'Histogramme',
			'search_ioc': 'Recherche d\'Ioc',
			'import_ioc': 'Importer Ioc',
			'enrichment': 'Enrichissement',
			'ioc-automation': 'Automatisation de l\'Ioc',
			'export_urls': 'Exporter des URLs',
			'market-place': 'Place du Marché',
			'user_listing': 'Liste des Utilisateurs',
			'roles': 'Rôles',
			'auth_keys_index': 'Index des Clés d\'Authentification',
			'tag_listing': 'Liste des Tags',
			'send-newsletter': 'Envoyer la Newsletter',
			'plugin_config': 'Configuration du Plugin',
			'application_logs': 'Journaux de l\'Application',
			'feeds': 'Flux',
			'license': 'Licence',
			'galaxies': 'Galaxies',
			'jobs': 'Emplois',
			'profile': 'Profil',
			'change-password': 'Changer le Mot de Passe'
		},
		hi: {
			'home': 'मुख पृष्ठ',
			'event_listing': 'घटना सूची',
			'event_details': 'घटना का विवरण',
			'statistics': 'आंकड़े',
			'index': 'सूची',
			'show_galaxy_matrix_dashboard': 'गैलेक्सी मैट्रिक्स डैशबोर्ड दिखाएं',
			'histogram': 'हिस्टोग्राम',
			'search_ioc': 'Ioc खोजें',
			'import_ioc': 'Ioc आयात करें',
			'enrichment': 'समृद्धि',
			'ioc-automation': 'Ioc स्वचालन',
			'export_urls': 'URLs निर्यात करें',
			'market-place': 'बाजार स्थान',
			'user_listing': 'उपयोगकर्ता सूची',
			'roles': 'भूमिकाएँ',
			'auth_keys_index': 'प्रमाणीकरण कुंजी सूची',
			'tag_listing': 'टैग सूची',
			'send-newsletter': 'समाचार पत्र भेजें',
			'plugin_config': 'प्लगइन कॉन्फ़िगरेशन',
			'application_logs': 'एप्लिकेशन लॉग',
			'feeds': 'फ़ीड्स',
			'license': 'लाइसेंस',
			'galaxies': 'गैलेक्सियों',
			'jobs': 'नौकरियां',
			'profile': 'प्रोफ़ाइल',
			'change-password': 'पासवर्ड बदलें'
		}
		// Add more languages here
	};
	function capitalizeAndFormat(segment) {
		return segment.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
	}
	
	function translateSegment(segment, language) {
		return translations[language] && translations[language][segment] ? translations[language][segment] : capitalizeAndFormat(segment);
	}
	
	async function fetchEventName(eventId) {
		console.log(eventId);
		try {
			const response = await fetch(`/events/${eventId}/`);
			if (response.ok) {
				const data = await response.json();
				return data.name;
			} else {
				console.error('Failed to fetch event name:', response.statusText);
			}
		} catch (error) {
			console.error('Error fetching event name:', error);
		}
		return null;
	}
	
	async function fetchGalaxiesName(galaxyId) {
		console.log("inside galaxy fetch function");
		try {
			const response = await fetch(`/galaxy/${galaxyId}/`);
			console.log(response);
			if (response.ok) {
				const data = await response.json();
				return data.name;
			} else {
				console.error('Failed to fetch galaxy name:', response.statusText);
			}
		} catch (error) {
			console.error('Error fetching galaxy name:', error);
		}
		return null;
	}

	async function fetchTagName(tagId) {
		console.log(tagId);
		try {
			const response = await fetch(`/tag/${tagId}/`);
			if (response.ok) {
				const data = await response.json();
				return data.name;
			} else {
				console.error('Failed to fetch tag name:', response.statusText);
			}
		} catch (error) {
			console.error('Error fetching tag name:', error);
		}
		return null;
	}
	
	async function buildBreadcrumb() {
		const breadcrumbNav = document.getElementById('breadcrumb');
		if (!breadcrumbNav) {
			console.error('Breadcrumb container not found.');
			return;
		}
	
		const pathArray = window.location.pathname.split('/').filter(segment => segment.length > 0);
		const languageCodes = ['en', 'fr', 'hi']; // Add other language codes as needed
		let language = 'en'; // Default language
	
		console.log("Path array:", pathArray);
	
		// Check if the first segment is a language code and set it
		if (languageCodes.includes(pathArray[0])) {
			language = pathArray[0];
			pathArray.shift(); // Remove language code from the path array
		}
	
		let breadcrumbHtml = `<li class="breadcrumb-item"><a href="/${language}/index">${translateSegment('home', language)}</a></li>`;
		let path = `/${language}`;
		let customDashboardAdded = false;
	
		for (let index = 0; index < pathArray.length; index++) {
			const segment = pathArray[index];
	
			// Skip numeric segments that follow 'custom-dashboard'
			if (customDashboardAdded && /^\d+$/.test(segment)) {
				continue;
			}
	
			// Handle 'view' path for galaxies
			if (segment === 'view' && index > 0 && pathArray[index - 1] === 'galaxies') {
				continue; // Skip the 'view' segment
			}
	
			path += '/' + segment;
			const decodedSegment = decodeURIComponent(segment);
			let formattedSegment = translateSegment(decodedSegment, language);
	
			console.log(segment);
	
			// Special handling for custom-dashboard
			if (segment === 'custom-dashboard') {
				breadcrumbHtml += `<li class="breadcrumb-item"><a href="${path}">${formattedSegment}</a></li>`;
				customDashboardAdded = true;
			} else if (path.includes(`/${language}/event_details`)) {
				if (index === pathArray.length - 2) {
					// Add the event listing breadcrumb item
					breadcrumbHtml += `<li class="breadcrumb-item"><a href="/${language}/event_listing">${translateSegment('event_listing', language)}</a></li>`;
				}
				// Fetch and add the event name instead of the event ID
				if (index === pathArray.length - 1) {
					const eventName = await fetchEventName(segment);
					formattedSegment = eventName ? eventName : formattedSegment;
					breadcrumbHtml += `<li class="breadcrumb-item active" aria-current="page">${formattedSegment}</li>`;
				}
			} else if (path.includes(`/${language}/galaxies`)) {
				if (index === pathArray.length - 1) {
					// Fetch and add the galaxy name instead of the galaxy ID
					const galaxyName = await fetchGalaxiesName(segment);
					formattedSegment = galaxyName ? galaxyName : formattedSegment;
					breadcrumbHtml += `<li class="breadcrumb-item active" aria-current="page">${formattedSegment}</li>`;
				} else if (segment !== 'view') {
					breadcrumbHtml += `<li class="breadcrumb-item"><a href="${path}">${formattedSegment}</a></li>`;
				}
			} else if (path.includes(`/${language}/tag_listing`)) {
				if (index === pathArray.length - 1) {
					// Fetch and add the tag name instead of the tag ID
					const tagName = await fetchTagName(segment);
					formattedSegment = tagName ? tagName : formattedSegment;
					breadcrumbHtml += `<li class="breadcrumb-item active" aria-current="page">${formattedSegment}</li>`;
				} else {
					breadcrumbHtml += `<li class="breadcrumb-item"><a href="${path}">${formattedSegment}</a></li>`;
				}
			} else if (path.includes(`/${language}/ioc_listing_based_tag_id`) || path.includes(`/${language}/fetch-correlation-graph-tag`)) {
				if (index === pathArray.length - 2) {
					// Add the event listing breadcrumb item
					breadcrumbHtml += `<li class="breadcrumb-item"><a href="/${language}/tag_listing">${translateSegment('tag_listing', language)}</a></li>`;
				}
				// Fetch and add the event name instead of the event ID
				if (index === pathArray.length - 1) {
					const tagName = await fetchTagName(segment);
					formattedSegment = tagName ? tagName : formattedSegment;
					breadcrumbHtml += `<li class="breadcrumb-item active" aria-current="page">${formattedSegment}</li>`;
				}
			} else {
				if (index === pathArray.length - 1) {
					breadcrumbHtml += `<li class="breadcrumb-item active" aria-current="page">${formattedSegment}</li>`;
				} else {
					breadcrumbHtml += `<li class="breadcrumb-item"><a href="${path}">${formattedSegment}</a></li>`;
				}
			}
		}
	
		console.log('Breadcrumb HTML:', breadcrumbHtml);
		breadcrumbNav.innerHTML = breadcrumbHtml;
	}
	
	// Call the function to build the breadcrumb
	buildBreadcrumb();
	
	

	
	

	// Initialize popovers
	$('[data-toggle="popover"]').popover();   
	console.log('test');
	
	// Handle current path highlighting for navbar items
	var currentPath = window.location.pathname;
	console.log("Current path:", currentPath);
	$('.dropdown-item').each(function() {
        var itemPath = $(this).attr('href');
        var parentCategory = $(this).data('parent');
        var parentTrigger = $('.trigger:contains("' + parentCategory + '")');

        if (currentPath.endsWith(itemPath)) {
            $('.navbar-nav .nav-link').removeClass('visited');
            $(this).closest('.nav-item').find('.nav-link').addClass('visited');
            $(this).closest('.nav-item').find('.nav-link').find('.active').css('display', '');
            $(this).closest('.nav-item').find('.nav-link').find('.inactive').css('display', 'none');
            $(this).addClass('visited');
            console.log("Active class added to parent nav-item");

            // If parentTrigger exists, show its sub-menu
            if (parentCategory) {
                parentTrigger.removeClass('right-caret').addClass('left-caret visited');
                parentTrigger.next('.sub-menu').css('display', 'block'); // Show the sub-menu
            }
        }
    });

	$('.nav-item').each(function() {
		var itemPath = $(this).find('.nav-link').attr('href');
		// Check if the nav-item has a dropdown
		if (!$(this).find('.dropdown-menu').length) {
			var currentPath = window.location.pathname;
			// Check if the current path ends with the item path
			console.log(itemPath)
			if (currentPath.endsWith(itemPath)) {
				// Add 'visited' class to the nav-link
				$('.navbar-nav .nav-link').removeClass('visited');
				$('.navbar-nav .nav-link').removeClass('visited');
				$(this).find('.nav-link').addClass('visited');
				$(this).closest('.nav-item').find('.nav-link').find('.active').css('display','none')
		$(this).closest('.nav-item').find('.nav-link').find('.inactive').css('display','')
				console.log("Active class added to nav-item without dropdown");
			}
		}
	});

	// Handle click event for navbar links
	$('.navbar-nav .nav-link').click(function() {
		// Remove 'visited' class from all navbar links
		$('.navbar-nav .nav-link').removeClass('visited');
		// Add 'visited' class to the clicked navbar link
		$(this).addClass('visited');
	});

	// Handle dropdown menu triggers
	$(".dropdown-menu > li > a.trigger").on("click", function(e){
		var current = $(this).next();
		var grandparent = $(this).parent().parent();
		if ($(this).hasClass('left-caret') || $(this).hasClass('right-caret'))
			$(this).toggleClass('right-caret left-caret');
		grandparent.find('.left-caret').not(this).toggleClass('right-caret left-caret');
		grandparent.find(".sub-menu:visible").not(current).hide();
		current.toggle();
		e.stopPropagation();
	});

	$(".dropdown-menu > li > a:not(.trigger)").on("click", function(){
		var root = $(this).closest('.dropdown');
		root.find('.left-caret').toggleClass('right-caret left-caret');
		root.find('.sub-menu:visible').hide();
	});

	// Handle toggle password visibility
	const togglePassword = document.getElementById('togglePassword');
	console.log(togglePassword);
	const passwordField = document.getElementById('password');
	togglePassword.addEventListener('click', function() {
		if (passwordField.type === 'password') {
			passwordField.type = 'text';
			togglePassword.src = "static/images/visible.png";
		} else {
			passwordField.type = 'password';
			togglePassword.src = "static/images/hide.png";
		}
	});

	
});

// Popup function
function myFunction() {
	var popup = document.getElementById("myPopup");
	popup.classList.toggle("show");
}