
var elts = document.getElementsByClassName('test')
Array.from(elts).forEach(function(elt){
  elt.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if ((event.keyCode === 13 || elt.value.length === 1) && elt.nextElementSibling && elt.value.match(/^[A-Za-z]+$/)) {
		// Focus on the next sibling
        elt.nextElementSibling.focus()
    }
  });
  elt.addEventListener("keyup", function(event) {
    // Number 8 is the "Backspace" key on the keyboard
    if (event.keyCode == 8 && elt.value.length == 0 && elt.previousElementSibling) {
		// Focus on the next sibling
		elt.previousElementSibling.focus()
    }
  });
})


/** load points onload**/
let lib;
$(document).ready(function(){
    $.ajax({ 
		type:"GET",
		url: "http://localhost:9090/scrabblePointsService/points",
        success: function(data){
			lib = data.points;
			console.log("Points Loaded Successfully!!");
        },
		error: function(error) {
			console.log("Failed to Load points from Server");
		}
    });
});


/** Clear input box **/
function clearChildren(element) {
   for (var i = 0; i < element.childNodes.length; i++) {
      var e = element.childNodes[i];
      if (e.tagName) switch (e.tagName.toLowerCase()) {
         case 'input': e.value = ''; break;
         default: clearChildren(e);
      }
   }
	document.getElementById("printScore").innerHTML = 0;
}

/** Save Scores to DB **/
function saveScore(score){
	let word;
	for(let i=1;i<=10;i++) {
		if(word === undefined) {
			word = document.getElementById("i"+i.toString()).value;
		} else {
			word = word + document.getElementById("i"+i.toString()).value;
		}
	}

	$.ajax({
		type:"POST",
        contentType: 'application/json; charset=utf-8',
		data: JSON.stringify({word: word, score: score}),
        url:"http://localhost:9090/scrabblePointsService/scores",
        success:function(data) {
			console.log(data);
			alert("Score saved Successfully");
        },
		error: function(error) {
			var err = JSON.parse(error.responseText);
			console.log(err);
			alert(err.information.message);
		}
    });
}

/** Calculate score **/
function calcScore(){
	let score = 0;
	for(let i=1;i<=10;i++) {
		var letter = document.getElementById("i"+i.toString()).value;
		if(letter.match(/^[A-Za-z]+$/)) {
			score += lib[letter.toLowerCase()];
		}
	}
	document.getElementById("printScore").innerHTML = score;
	document.getElementById("printScore").value = score;
}


/** print top scores **/
function topScore(){	
  var x = document.getElementById("scorecardtable");
  if (x.style.display === "none") {
    x.style.display = "block";
	var html = '';
		$.ajax({
		type:"GET",
		dataType:"json",
        url:"http://localhost:9090/scrabblePointsService/scores",
        success:function(data) {
			for(var i = 0; i < data.scores.length; i++) {
				const word = data.scores[i].word
				const score = data.scores[i].score
				const index = i + 1;
				html += '<div class="table-row"><div class="table-data">' + index + '</div>' 
					+ '<div class="table-data">' + word + '</div>'
                    + '<div class="table-data">' + score + '</div></div>';
			}
			document.getElementById("tabledata").innerHTML = html;
        },
		error: function(error) {
			alert("Failed while retreiving top scores");
		}
    });
  } else {
    x.style.display = "none";
  }
}