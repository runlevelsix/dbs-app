/**
 * Main Document Application
 *
 * @author John Dyer (http://j.hn/)
 */

jQuery(function($) {
	
	if (typeof window.console == 'undefined')
		window.console = {log:function() {}};
		
	// updates languages
	docs.Localizer.localize();
	
	// setup main site areas
	docs.DocManager.init($('#header'), $('#footer'), $('#content'), $(window));
	
	// test for AJAX capabilities
	$.ajax({
		url: 'mobile.html',
		
		dataType: 'text',
		
		error: function(e) {
			
			var modal = docs.createModal('error', '<strong>Error</strong>: Browser doesn\'t support local files').size(500,300).center();
			
			modal.content.html(
					'<p>Windows, Start, Run</p>' +
					'<code>"%UserProfile%\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe" --allow-file-access-from-files</code>' +				
					'<p>Mac, Terminal</p>' +
					'<code>/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --allow-file-access-from-files</code>'		
			);
			modal.show();
			
			//alert('Your browser does not support loading local files. If you are using Chrome, you need to launch it with --allow-file-access-from-files ')
		},
		
		success: function() {
			
			// load versions, then start doing other stuff
			bible.versions.getVersions(function(versions) {
		
				//console.log('versions', versions);
				
				if (bible.versions.versionKeys.length == 0) {
					var modal = docs.createModal('error', '<strong>Error</strong>: No Bibles installed').size(500,300).center();
					
					modal.content.html(
							'<p>No Bibles were found on this installation.</p>' +
							'<p> To get started, go to <a href="https://github.com/digitalbiblesociety/browserbible/" target="_blank">github.com/digitalbiblesociety/browserbible</a> to download publicly available texts, and install them in the following folder:</p> <code>/app/content/bibles/</code>'		
					);
					modal.show();				
				
					return;
				}
		
				var defaultDocSettings = (docs.Features.hasTouch) ?
				{
					docs: [
					{
						version: 'eng_nasb',
						location: 'John.3.1',
						linked: true
					}
					]
				}
				:
				{
					docs: [
					{
						version: 'eng_nasb',
						location: 'John.3.1',
						linked: true
					},
					{
						version: 'eng_sblgnt',
						location: 'John.3.1',
						linked: true
					}		
					]
				};
				
				// load cookie/localStorage settings
				var docSettings = $.jStorage.get('docs-settings', defaultDocSettings);	
				
				
				
				// get from URL
				function parseQuerystring(querystring) {
					// remove any preceding url and split
					querystring = querystring.substring(querystring.indexOf('?')+1).split('&');
					var params = {}, pair, d = decodeURIComponent;
					// march and parse
					for (var i = querystring.length - 1; i >= 0; i--) {
					pair = querystring[i].split('=');
					params[d(pair[0])] = d(pair[1]);
					}
					
					return params;
				};
				
				function convertQuerystringToSettings( querystringParams, max) {
					
					var queryDocs = [];
					
					if (querystringParams['location1'] != 'undefined') {
					
						for (var i=1; i<=max; i++) {
							var 
								version = querystringParams['document' + i.toString()],
								location = querystringParams['location' + i.toString()], 
								linked = querystringParams['linked' + i.toString()];
								
							if (typeof version != 'undefined' && typeof location != 'undefined') {
								queryDocs.push({
									version: version,
									location: location,
									linked: linked
								});
							}		
						}
					}
					
					return queryDocs;				
				}
			
				// test ?location=1		
				if (window.location.search.length > 0) {
		
					var querystringParams = parseQuerystring( window.location.search.substring(1) );
					var queryDocs = convertQuerystringToSettings( querystringParams , 3);					
												
					if (queryDocs.length > 0) {
						docSettings.docs = queryDocs;
					}
				}
				
				// test #location=1
				if (window.location.href.indexOf('#') > -1) {
					var hashParams = parseQuerystring( window.location.href.substring( window.location.href.indexOf('#') + 1) );
					var hashDocs = convertQuerystringToSettings( hashParams , 3);					
												
					if (hashDocs.length > 0) {
						docSettings.docs = hashDocs;
					}
				}	
				
				// ensure all versions exists
				for (var i=0, il=docSettings.docs.length; i<il; i++) {
					var versionKey = docSettings.docs[i].version;
					
					// check if this version exists
					if (typeof bible.versions.versionsByKey[versionKey] == 'undefined') {

						// get first english one
						if (typeof bible.versions.versionData['eng'] != 'undefined') {

							var engVersions = bible.versions.versionData['eng'].versions;
							for (var eng in engVersions) {
								docSettings.docs[i].version = eng;
								break;
							}
														
						} else {
							// first available
							docSettings.docs[i].version = bible.versions.versionKeys[0];
						}
					
						
					}
					//console.log('checking: ' + docSettings.docs[i].version + ' - ', bible.versions.versionsByKey[versionKey]);
				}
				
				
				// LOAD interface
				docs.DocManager.loadSettings(docSettings);
				
							
				
				
				
				docs.DocManager.addEventListener('navigation', function(e) {		
					docs.DocManager.saveSettings();
				});
				
				// startup plugins
				for (var i=0, il=docs.plugins.length; i<il; i++) {
					docs.plugins[i].init( docs.DocManager);
				}
				
				// search
				docs.Search = (function() {
										
					var searchWindow = docs.createModal('search', 'Search'),
						
						searchInput = $('<input type="text" class="search-text" />').appendTo(searchWindow.menu),
						searchVersion = $('<select class="search-version">' + bible.BibleNavigator.getOptions() + '</select>').appendTo(searchWindow.menu),
						searchButton = $('<input type="button" class="search-button" value="Search" />').appendTo(searchWindow.menu),
						cancelButton = $('<input type="button" class="cancel-button" value="Cancel" disabled />').appendTo(searchWindow.menu),
						printButton = $('<input type="button" class="print-button" value="Print" />').appendTo(searchWindow.menu);
												
						
					searchWindow.footer.html('&nbsp;-');
					searchWindow.size(580,400).center();
					searchWindow.content.css({'overflow': 'auto'});
					
					$(window).on('resize', function() {
						searchWindow.center();
					});
					
					searchInput.on('keyup', function(e) {
						if (e.keyCode === 13)
							doSearch();
					});
					searchButton.on('click', function() {
						doSearch();	
					});
					cancelButton.on('click', function() {
						bible.BibleSearch.cancelSearch();	
					});

					
					printButton.on('click', function() {
						
						var printWin = window.open('','','letf=0,top=0,width=1,height=1,toolbar=0,scrollbars=0,status=0');
						printWin.document.write('<!DOCTYPE html><html><head>' +
													'<link href="css/studybible.css" rel="stylesheet">' +
												'</head><body>' + searchWindow.content[0].innerHTML + '</body></html>');
						printWin.document.close();
						printWin.focus();
						printWin.print();
						printWin.close();
					});					
					
					searchWindow.content.on('click', 'span.verse', function() {		
						
						docs.DocManager.documents[0].navigateById($(this).attr('data-osis') , true);
				
						//searchWindow.hide();
					});
				
					
					function doSearch() {
						
						if (window.location.href.indexOf('file:') == -1) {
							
							console.warn('this will be slow');
							
						}
						
						var input = searchInput.val(),
							version = searchVersion.val();
							
						console.log(input, version);
							
						searchWindow.content.empty();
						cancelButton.prop('disabled', false);						
						
						bible.BibleSearch.search( input, version,
							
							// chapter progress
							function(bookOsisID, chapterIndex, resultsCount, startDate) {
								
								//if (showFeedback) {
									searchWindow.footer.html('found: ' + resultsCount + '; time: ' + ((	new Date() - startDate)/1000) + '; searching: ' + bible.BOOK_DATA[ bookOsisID ].names['eng'][0] + ' ' + (chapterIndex+1).toString() )
									//searchProgress.width( (bookIndex+1)/66 * sbw );
								//}
								
							},
							
							// ended
							function(resultHtml, resultsCount, startDate) {
								
								searchWindow.content.html(resultHtml);
								
								searchWindow.footer.html('found: ' + resultsCount + '; time: ' + ((	new Date() - startDate)/1000) + '');
								
								cancelButton.prop('disabled', true);
								
								//searchButton.prop('disabled', false);
								//searchText.prop('disbled', false);	
							}
						);	
					}
					
					return {
						searchVersion: searchVersion,
						searchWindow: searchWindow,
						searchInput: searchInput,
						doSearch: doSearch
					}
					
				})(); // search function creation
				
			}); // getversions callback
	
		} // main AJAX test success callback
	});
	
});