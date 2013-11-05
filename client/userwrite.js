Entries = new Meteor.Collection('entries')
Days = new Meteor.Collection('days') //Why have this if there is a datestamp on entries

if (Meteor.isClient) {    

    function setEntry(date){
	entry = Entries.findOne({user: Meteor.userId(), date: date});
	//console.log(entry);
	if (entry){
	    localStorage.setItem("entry-id", entry._id);
	    localStorage.setItem("selected-date", date);
	}
	else {
	    entry = Entries.insert({
		user: Meteor.userId(), 
		date: date, 
	    });
	    localStorage.setItem("entry-id", entry._id);
	    localStorage.setItem("selected-date", date);
	}
	return entry
    }

    function countWords(str){
	var count = 0,
	i,
	foo = str.length;

	for (i = 0; i <= foo; i++) {
	    if (str.charAt(i) == " ") {
		count ++;
	    }

	}
	return (count + 1);  
    }

    Template.userwrite.rendered = function(){
	thisday = new Date()
	datestring =  thisday.getMonth()+1 + "/" + thisday.getDate() + "/" + thisday.getFullYear();
	entry = setEntry(datestring);
	$('#writingbox').focus();
	$("#writingbox").val( entry.content );

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
		    $('#writingbox').autosize();
		    $('#writingbox').trigger('autosize.resize');

		    Countable.live(document.getElementById("writingbox"), function(counter){
			//console.log(this, counter);
			//{ all: 0, characters: 0, paragraphs: 0, words: 0 }
			$("#characters").html("Characters: " + counter.characters);
			$("#words").html(" Words: " + counter.words);			
			
		    });
		}
	    });


	    $('#writingbox').autosize();
	    $('#writingbox').trigger('autosize.resize');

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

    Template.userwrite.date = function(){
	var d = new Date().toLocaleDateString();
	return d;
    }
    
    Template.userwrite.events({
	'keydown #writingbox': function(e){	    
	    if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)){
		e.preventDefault();
		console.log("save event");
		date = $("#thisday").val();
		entry = setEntry(date);
		console.log(localStorage.getItem("selected-date"));
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
	    $("#entrylist").toggle();
	}
    });

    Template.userwrite.entrycount = function(){
	date = $("#thisday").val();
	count = Entries.find({user: Meteor.userId(), date: date}).count(); 
	return count;
    }

    Template.entrysave.events({
	'click #entry-save': function(e){
	    console.log("save event");
	    date = $("#thisday").val();
	    entry = setEntry(date);
	    console.log(localStorage.getItem("selected-date"));
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
    });

    Template.entryselect.entries = function(){
	date = localStorage.setItem("selected-date", date);
	entries = new Array();
	tempentries =  Entries.find({user: Meteor.userId(), date: date}).map(function(){
	    entries.push([this._id, this.content]);
	    }); 	
	return entries;
    }
}
