
$(document).ready(function(){
  

  $("#remaining-time").hide();
  $("#start").on('click', trivia.startGame);
  $(document).on('click' , '.option', trivia.guessChecker);
  
})

var trivia = {
  // trivia properties
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  currentSet: 0,
  timer: 30,
  timerOn: false,
  timerId : '',
  

// quizz data
  questions: {
    q1: 'Why do we wear costumes and masks for Halloween?',
    q2: 'What is the first horror movie ever made?',
    q3: 'Along has this holiday been around for?',
    q4: 'How much money is spent on Halloween candy in the US?',
    q5: "Why do we carve pumpkins on Halloween ?",
  },
  options: {
    q1: ['To scare the dead', "Because it's fun!", 'Why not?', 'Because my mom told me so'],
    q2: ["Rosemary's Baby", 'Psychose', 'Le Manoir du Diable', 'Nosferatu'],
    q3: ['50 years', '6,000 years', '100 years', '2,000 years'],
    q4: ['$500 million', '#950 millions', '$1.5 billion', '$2.08 billion'],
    q5: ['To make a pumpkin pie', 'To entertain the kids', 'To scare away evil spirits with the light', 'To have some ephemere decorations'],
  },
  answers: {
    q1: 'To scare the dead',
    q2: 'Le Manoir du Diable',
    q3: '6,000 years',
    q4: '2.08 billion',
    q5: 'To scare away evil spirits with the light"',
  },
 
  startGame: function(){
    // reset
    trivia.currentSet = 0;
    trivia.correct = 0;
    trivia.incorrect = 0;
    trivia.unanswered = 0;
    clearInterval(trivia.timerId);
    
   
    $('#game').show();
    
    
    $('#results').html('');
    
    
    $('#timer').text(trivia.timer);
    
   
    $('#start').hide();

    $('#remaining-time').show();
    
    // ask first question
    trivia.nextQuestion();
    
  },
  // display questions and options 
  nextQuestion : function(){
    
    // set timer to 30 seconds each question
    trivia.timer = 30;
     $('#timer').removeClass('last-seconds');
    $('#timer').text(trivia.timer);
    
    // to prevent timer speed up
    if(!trivia.timerOn){
      trivia.timerId = setInterval(trivia.timerRunning, 1000);
    }
    
    
    var questionContent = Object.values(trivia.questions)[trivia.currentSet];
    $('#question').text(questionContent);
    
   
    var questionOptions = Object.values(trivia.options)[trivia.currentSet];
    
   
    $.each(questionOptions, function(index, key){
      $('#options').append($('<button type="button" class="option btn btn-secondary btn-lg">'+key+'</button>'));
    })
    
  },
  // method to decrement counter and count unanswered if timer runs out
  timerRunning : function(){
    // if timer still has time left and there are still questions left to ask
    if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
      $('#timer').text(trivia.timer);
      trivia.timer--;
        if(trivia.timer === 4){
          $('#timer').addClass('last-seconds');
        }
    }
    // the time has run out and increment unanswered, run result
    else if(trivia.timer === -1){
      trivia.unanswered++;
      trivia.result = false;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Out of time! The answer was '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
    }
    // if all the questions have been shown end the game, show results
    else if(trivia.currentSet === Object.keys(trivia.questions).length){
      
      // adds results of game (correct, incorrect, unanswered) to the page
      $('#results')
        .html('<h3>Thank you for playing!</h3>'+
        '<p>Correct: '+ trivia.correct +'</p>'+
        '<p>Incorrect: '+ trivia.incorrect +'</p>'+
        '<p>Unaswered: '+ trivia.unanswered +'</p>'+
        '<p>Please play again!</p>');
      
      // hide game sction
      $('#game').hide();
      
      // show start button to begin a new game
      $('#start').show();
    }
    
  },
  // method to evaluate the option clicked
  guessChecker : function() {
    
    // timer ID for gameResult setTimeout
    var resultId;
    
    // the answer to the current question being asked
    var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
    
    // if the text of the option picked matches the answer of the current question, increment correct
    if($(this).text() === currentAnswer){
      // turn button green for correct
      $(this).addClass('btn-success').removeClass('btn-info');
      
      trivia.correct++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Correct Answer!</h3>');
    }
    // else the user picked the wrong option, increment incorrect
    else{
      // turn button clicked red for incorrect
      $(this).addClass('btn-danger').removeClass('btn-info');
      
      trivia.incorrect++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Try again! '+ currentAnswer +'</h3>');
    }
    
  },
  // method to remove previous question results and options
  guessResult : function(){
    
    // increment to next question set
    trivia.currentSet++;
    
    // remove the options and results
    $('.option').remove();
    $('#results h3').remove();
    
    // begin next question
    trivia.nextQuestion();
     
  }

}
