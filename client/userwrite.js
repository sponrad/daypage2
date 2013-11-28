Entries = new Meteor.Collection('entries')
Days = new Meteor.Collection('days') //Why have this if there is a datestamp on entries

if (Meteor.isClient) {    

    Template.sideBar.date = function(){
	var d = new Date().toLocaleDateString();
	return d;
    }

    Template.editor.rendered = function(){
	var editor = new wysihtml5.Editor("writingbox", {
	    toolbar:      "toolbar",
	    stylesheets:  "wysihtml5-stylesheet.css",
	    parserRules:  wysihtml5ParserRules
	});	

/*	editor.on('load', function() {
	    // The wysiwyg editor is in the DOM. It's safe to make the plugin call
	    $(editor.composer.iframe).wysihtml5_size_matters();
	}); */

    }

////////////////////////////////stuff below may not stay

    function setEntry(date){
	entry = Entries.findOne({user: Meteor.userId(), date: date});
	//console.log(entry);
	if (entry){
	    localStorage.setItem("entry-id", entry._id);
	    localStorage.setItem("selected-date", date);
	    Session.set("entry-id", entry._id);
	    Session.set("selected-date", date);
	}
	else {
	    entry = Entries.insert({
		user: Meteor.userId(), 
		date: date, 
	    });
	    localStorage.setItem("entry-id", entry._id);
	    localStorage.setItem("selected-date", date);
	    Session.set("entry-id", entry._id);
	    Session.set("selected-date", date);
	}
	return entry
    }

    Template.userwrite.rendered = function(){
	var editor = new wysihtml5.Editor("writingbox", {
	    toolbar: "wysihtml5-toolbar",
	    parserRules: wysihtml5ParserRules
	    });
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
	date = localStorage.getItem("selected-date");
//	date = Session.get("selected-date");
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
