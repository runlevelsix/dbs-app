/**
 * Adds any notes about the system
 *
 * @author John Dyer (http://j.hn/)
 */


docs.plugins.push({

	init: function(docManager) {

		$('<a id="config-mobile" class="config-options" target="_blank" href="mobile.html">Mobile</a><a id="config-reader" class="config-options" target="_blank" href="reader.html">Reader</a>')
			.appendTo(docManager.configWindow.content);

			
	}
	
});