Entries = new Meteor.Collection('entries')
Days = new Meteor.Collection('days') //Why have this if there is a datestamp on entries

if (Meteor.isClient) {    
    Template.sideBar.date = function(){
	var d = new Date().toLocaleDateString();
	return d;
    }
	
	Template.sideBar.entries = function(){
		date = Session.get("selectedDate");
		if (!date)
			return {};
		return Entries.find({date: date});
	}
	
	Template.sideBar.events({
		'blur #thisday': function(event){
			//console.log("thisday blurred");
		},
		'click .entryListItem': function(event){
			console.log("clicked");
			console.log( this._id );
			entry = Entries.findOne( this._id);
			console.log(entry);
			$("writingbox").val( entry.content );
		}
		
	});

    Template.editor.rendered = function(){
		var editor = new wysihtml5.Editor("writingbox", {
			toolbar:      "toolbar",
			stylesheets:  "wysihtml5-stylesheet.css",
			parserRules:  wysihtml5ParserRules
		});
		$("#thisday").datepicker({
		onSelect: function(selectedDate){
		    thisday = new Date(selectedDate)
		    tdatestring =  thisday.getMonth()+1 + "/" + thisday.getDate() + "/" + thisday.getFullYear();
		    $('#thisday').val(tdatestring);
			Session.set("selectedDate", $("#thisday").val() );
			}
		});
    }

    Template.editor.events({
	'keydown': function(e){
	    if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)){
		e.preventDefault();
		console.log("save event");
		console.log( $('#writingbox').val() );
		date = $("#thisday").val();
		entry = setEntry(date);
		Meteor.setTimeout( function(){
/*		    Entries.update(
			entry._id, 
			{$set: {content: $('#writingbox').val()}}
		    ); */
		    console.log(entry);
		    $("#entry-saved").show();
		    $("#entry-save").hide();
		}, 100);
	    }
	},
	
	'blur #writingbox': function(e){
	    console.log("writingbox changed");
	    $("#entry-saved").hide();
	    $("#entry-save").show();
	},
	
	'click #entry-save': function(e){
	    console.log("save event");
	    date = $("#thisday").val();
	    entry = setEntry(date);
	    Meteor.setTimeout( function(){
		Entries.update(
		    entry._id, 
		    {$set: {content: $('#writingbox').val()}}
		);
		console.log(entry);
		//$("#entry-saved").show();
		//$("#entry-save").hide();
		$('#writingbox').focus();
	    }, 100);
	    
	}
    });
    
////////////////////////////////stuff below may not stay

    function setEntry(date){
	entry = Entries.findOne({user: Meteor.userId(), date: date});
	//console.log(entry);
	if (entry){
	    localStorage.setItem("entryId", entry._id);
	    localStorage.setItem("selectedDate", date);
	    Session.set("entryId", entry._id);
	    Session.set("selectedDate", date);
	}
	else {
	    entry = Entries.insert({
		user: Meteor.userId(), 
		date: date, 
	    });
	    localStorage.setItem("entryId", entry._id);
	    localStorage.setItem("selectedDate", date);
	    Session.set("entryId", entry._id);
	    Session.set("selectedDate", date);
	}
	return entry
    }

    Template.userwrite.rendered = function(){
	thisday = new Date()
	datestring =  thisday.getMonth()+1 + "/" + thisday.getDate() + "/" + thisday.getFullYear();
	entry = setEntry(datestring);
	$('#writingbox').focus();
	$("#writingbox").val( entry.content );
	
	$(document).click( function(){
	    $("#entrylist").hide();	    
	});

	Meteor.setTimeout(function(){
	    $("#thisday").datepicker({
		onSelect: function(selectedDate){
		    thisday = new Date(selectedDate)
		    tdatestring =  thisday.getMonth()+1 + "/" + thisday.getDate() + "/" + thisday.getFullYear();
		    $('#thisday').val(tdatestring);
		    console.log(tdatestring);
		    $('#writingbox').focus();
		    entry = setEntry(tdatestring);
		    $('#writingbox').val( entry.content );
		    //$('#writingbox').autosize();
		    //$('#writingbox').trigger('autosize.resize');

		    Countable.live(document.getElementById("writingbox"), function(counter){
			//console.log(this, counter);
			//{ all: 0, characters: 0, paragraphs: 0, words: 0 }
			$("#characters").html("Characters: " + counter.characters);
			$("#words").html(" Words: " + counter.words);			
			
		    });
		}
	    });


	    //$('#writingbox').autosize();
	    //$('#writingbox').trigger('autosize.resize');

	    Countable.live(document.getElementById("writingbox"), function(counter){
		//console.log(this, counter);
		//{ all: 0, characters: 0, paragraphs: 0, words: 0 }
		$("#characters").html("Characters: " + counter.characters);
		$("#words").html(" Words: " + counter.words);			
		
	    });

	    $('#below-writingbox').click( function(e){
		e.preventDefault();
		$('#writingbox').focus();
	    });

	}, 100);
	
    }

  
    Template.userwrite.events({
	'keydown #writingbox': function(e){	    
	    if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)){
		e.preventDefault();
		console.log("save event");
		date = $("#thisday").val();
		entry = setEntry(date);
		Meteor.setTimeout( function(){
		    Entries.update(
			entry._id, 
			{$set: {content: $('#writingbox').val()}}
		    );
		    console.log(entry);
		    $("#entry-saved").show();
		    $("#entry-save").hide();
		}, 100);
	    }
	},

	'keypress #writingbox': function(e){
	    $("#entry-saved").hide();
	    $("#entry-save").show();
	},

	'click #entryselect': function(e){
	    e.stopPropagation();
	    $("#entrylist").show();
	}
    });

    Template.entrysave.events({
	'click #entry-save': function(e){
	    console.log("save event");
	    date = $("#thisday").val();
	    entry = setEntry(date);
	    Meteor.setTimeout( function(){
		Entries.update(
		    entry._id, 
		    {$set: {content: $('#writingbox').val()}}
		);
		console.log(entry);
		$("#entry-saved").show();
		$("#entry-save").hide();
		$('#writingbox').focus();
	    }, 100);
	    
	}
    });

    Template.entryselect.events({
	'click #entrylist': function(e){
	    e.stopPropagation();
	},

	'click .entryitem': function(e){
	    console.log( e.currentTarget.id );
	}
    });

    Template.entryselect.entries = function(){
	date = localStorage.getItem("selectedDate");
//	date = Session.get("selectedDate");
	entries = new Array();
	Entries.find({user: Meteor.userId(), date: date}).forEach(function(entry){
	    entries.push({
		"_id": entry._id,
		"content": entry.content
	    });
	}); 	
	return entries;
    }
}
