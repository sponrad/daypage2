Entries = new Meteor.Collection('entries')
Days = new Meteor.Collection('days')

if (Meteor.isClient) {    

    function setEntry(date){
	entry = Entries.findOne({user: Meteor.userId(), date: date});
	if (entry){
	    localStorage.setItem("entry-id", entry._id);
	    localStorage.setItem("selected-date", date);
	}
	else {
	    entry = Entries.insert({
		user: Meteor.userId(), 
		date: date, 
		content: "",
		length: 0		
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
//		    $('#writingbox').autogrow();
		    $("#writingbox").xautoresize({
//			force: force, //if true, change overflow to scroll to get correct size, then change back to previous overflow.
			autoHeightUp: true, //auto increase height to fit content. Use css max-height to set maximum height.
			autoHeightDown: true, //auto reduce height to fit content. Use css min-height to set minimum height.
			keyup: true, //enable auto resize for keyup event
			keydown: true, //enable auto resize for keydown event
			focus: true, //enable auto resize for focus event
			change: true //enable auto resize for change event
		    });

		    Countable.live(document.getElementById("writingbox"), function(counter){
			//console.log(this, counter);
			//{ all: 0, characters: 0, paragraphs: 0, words: 0 }
			$("#characters").html("Characters: " + counter.characters);
			$("#words").html(" Words: " + counter.words);			
			
		    });
		}
	    });

//	    $('#writingbox').autogrow();
	    $("#writingbox").xautoresize({
//                force: force, //if true, change overflow to scroll to get correct size, then change back to previous overflow.
                autoHeightUp: true, //auto increase height to fit content. Use css max-height to set maximum height.
                autoHeightDown: true, //auto reduce height to fit content. Use css min-height to set minimum height.
                keyup: true, //enable auto resize for keyup event
                keydown: true, //enable auto resize for keydown event
                focus: true, //enable auto resize for focus event
                change: true //enable auto resize for change event
            });

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
	'change .writingbox': function(e) {
	    console.log(e.which);
	    date = $("#thisday").val();
	    entry = setEntry(date);
	    console.log(localStorage.getItem("selected-date"));
	    entry = Entries.update(
		entry._id, 
		{$set: {content: $('#writingbox').val()}}
	    );
	},
	'keypress .writingbox': function(e){
	    date = $("#thisday").val();
	    entry = setEntry(date);
	    entry = Entries.update(
		entry._id, 
		{$set: {length: $('#writingbox').val().length}}
	    );
	    
	}
    });

    Template.userwrite.count = function(){
	date = $("#thisday").val();
	return Entries.find({user: Meteor.userId(), date: date}).count();
    }
}
