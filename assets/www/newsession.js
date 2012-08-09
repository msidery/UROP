function initNewSessionUI() {
	
	//var top = '<div data-role="page" class="type-interior">';
	var top = '<div data-role="header" id="topbar" class="ui-body ui-body-a">';
	top += '<a id="back3" data-role="button" data-inline="true" data-icon="arrow-l" data-mini="true" >Back</a>';
	top += '<span id="sessiontitle"></span>';
	top += '</div>';
	top += '<div data-role="content"><ul data-role="listview" data-theme="d" data-divider-theme="d">';
	top += '</ul></div></div>';
	
	var form = '';
	
	form += '<form action="" method="post" data-ajax="false">';
	
	form += '<div data-role="fieldcontain" >';
	form += '<label for="name">Name:</label>';
	form +=	'<input type="text" name="name" id="name" data-mini="true" value="" />';
	form +=	'</div>';
	
	form +=	'<div data-role="fieldcontain" >';
	form += '<label for="date">Date:</label>';
	form += '</div>';
	
	form += '<div data-role="fieldcontain" >';
	form += '<label for="course">Course/module</label>';
	form +=	'<input type="text" name="course" id="course" data-mini="true" value="" />';
	form += '</div>';
	
	form +=	'<div data-role="fieldcontain" >';
	form +=	'<label for="numstudents">Number of students</label>';
	form +=	'<input type="text" name="numstudents" id="numstudents" data-mini="true" value="" />';
	form +=	'</div>';
	
	form +=	'<div data-role="fieldcontain" class="ui-field-contain ui-body ui-br">';
	
	form +=	'<fieldset data-role="controlgroup" data-type="horizontal" class="ui-corner-all ui-controlgroup ui-controlgroup-horizontal">';
	
	form +=	'<div role="heading" class="ui-controlgroup-label">Year(s):</div>';
	
	form +=	'<div class="ui-controlgroup-controls">';
	
	form +=	'<div class="ui-checkbox">';
	form +=	'<input type="checkbox" name="checkbox-1a" id="checkbox-1a" class="custom">';
	form +=	'<label for="checkbox-1a" data-shadow="false" data-iconshadow="true" data-wrapperels="span" data-icon="checkbox-off" data-theme="c" data-mini="true" data-inline="true" class="ui-btn ui-btn-icon-left ui-checkbox-off ui-btn-hover-c ui-btn-up-c"> 1 </label>';
	form +=	'</div>';
	
	form +=	'<div class="ui-checkbox">';
	form +=	'<input type="checkbox" name="checkbox-2a" id="checkbox-2a" class="custom">';
	form +=	'<label for="checkbox-2a" data-shadow="false" data-iconshadow="true" data-wrapperels="span" data-icon="checkbox-off" data-theme="c" data-mini="true" data-inline="true" class="ui-btn ui-btn-icon-left ui-checkbox-off ui-btn-hover-c ui-btn-up-c"> 2 </label>';
	form +=	'</div>';
	
	form +=	'<div class="ui-checkbox">';
	form +=	'<input type="checkbox" name="checkbox-3a" id="checkbox-3a" class="custom">';
	form +=	'<label for="checkbox-3a" data-shadow="false" data-iconshadow="true" data-wrapperels="span" data-icon="checkbox-off" data-theme="c" data-mini="true" data-inline="true" class="ui-btn ui-btn-icon-left ui-checkbox-off ui-btn-hover-c ui-btn-up-c"> 3 </label>';
	form +=	'</div>';
	
	form +=	'<div class="ui-checkbox">';
	form +=	'<input type="checkbox" name="checkbox-4a" id="checkbox-4a" class="custom">';
	form +=	'<label for="checkbox-4a" data-shadow="false" data-iconshadow="true" data-wrapperels="span" data-icon="checkbox-off" data-theme="c" data-mini="true" data-inline="true" class="ui-btn ui-btn-icon-left ui-checkbox-off ui-btn-hover-c ui-btn-up-c"> 4 </label>';
	form +=	'</div>';
	
	form +=	'<div class="ui-checkbox">';
	form +=	'<input type="checkbox" name="checkbox-5a" id="checkbox-5a" class="custom">';
	form +=	'<label for="checkbox-5a" data-shadow="false" data-iconshadow="true" data-wrapperels="span" data-icon="checkbox-off" data-theme="c" data-mini="true" data-inline="true" class="ui-btn ui-btn-icon-left ui-checkbox-off ui-btn-hover-c ui-btn-up-c"> 5 </label>';
	form +=	'</div>';
	
	form +=	'<div class="ui-checkbox">';
	form +=	'<input type="checkbox" name="checkbox-6a" id="checkbox-6a" class="custom">';
	form +=	'<label for="checkbox-6a" data-shadow="false" data-iconshadow="true" data-wrapperels="span" data-icon="checkbox-off" data-theme="c" data-mini="true" data-inline="true" class="ui-btn ui-btn-icon-left ui-checkbox-off ui-btn-hover-c ui-btn-up-c"> 6 </label>';
	form +=	'</div>';
	
	form +=	'</div>';
	
	form +=	'</fieldset>';
	
	form +=	'</div>';
	
	form +=	'<div data-role="fieldcontain" >';
	form +=	'<label for="dep">Department(s)</label> <!-- MORE BOXES NEEDED -->';
	form +=	'<input type="text" name="dep" id="dep" data-mini=true value="" />';
	form +=	'</div>';
	
	form +=	'<div data-role="fieldcontain">';
	form +=	'<label for="purpose">Broad purpose of session</label>';
	form +=	'<input type="text" name="purpose" id="purpose" value="" />';
	form +=	'</div>';
	
	form +=	'<div data-role="fieldcontain">';
	form +=	'<label for="learnout">Learning Outcomes</label>';
	form +=	'<input type="text" name="learnout" id="learnout" value="" />';
	form +=	'</div>';
	
	$('#newsessionwrapper').html(top+form).trigger('create');
	
	$('#back3').bind('click', function() {
                     showHomeUI();
                     });
	
}

function showNewSessionUI() {
	
	//$.mobile.changePage($('#newsessionwrapper'));
	$('#body').html('');
	$('.wrapper').css('display', 'none');
	$('#newsessionwrapper').css('display', 'block');
}



