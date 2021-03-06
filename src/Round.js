const Turn = require('../src/Turn')
const Card = require('../src/Card');
const data = require('./data');
const prototypeQuestions = data.prototypeData;

class Round {
  constructor(deck, round = 1) {
    this.turns = 0;
    this.deck = deck.cards;
    this.currentCard = this.deck[0];
    this.incorrectGuesses = [];
    this.correctGuesses = [];
    this.round = round;
    this.start = 0;
  }

  takeTurn(guess) {
    this.turns++
    var turn = new Turn(guess, this.currentCard)
    if (!turn.evaluateGuess()) {
      this.incorrectGuesses.push(this.currentCard.id)
      // this.rotateCards()
      this.returnCurrentCard()
    } else {
      this.correctGuesses.push(this.currentCard.id)
      this.deck.shift()
      this.currentCard = this.deck[0]
    }
    return turn.giveFeedback()
  }

  returnCurrentCard() {
    this.deck.shift(this.currentCard)
    this.deck.push(this.currentCard)
    this.currentCard = this.deck[0]
    return this.currentCard
  }

  calculatePercentCorrect() {
    return (this.correctGuesses.length /
      (this.incorrectGuesses.length + this.correctGuesses.length)) * 100;
  }

  endRound() {
    console.log('')
    console.log(`**Round Over!** You answered ${this.calculatePercentCorrect()}% of the questions correctly!`)
    this.round++;
    this.displayTime()
    this.displayReportCard()
  }

  displayReportCard() {
    console.log('')
    console.log('~~~REPORT CARD~~~')
    console.log('')
    if (this.calculatePercentCorrect() === 100) {
      console.log('GREAT JOB! You got every question correct on the first attempt!')
    }
    let allCards = []
    prototypeQuestions.forEach(el => {
      const indexPos = prototypeQuestions.indexOf(el)
      var newCard =
         new Card(prototypeQuestions[indexPos].id,
           prototypeQuestions[indexPos].question,
           prototypeQuestions[indexPos].answers,
           prototypeQuestions[indexPos].correctAnswer)
      allCards.push(newCard)
    })
    let incorrectTracker = {};
    this.incorrectGuesses.forEach(el => {
      if (!incorrectTracker[el]) {
        incorrectTracker[el] = 1
      } else {
        incorrectTracker[el] += 1
      }
    })
    for (let i = 1; i <= allCards.length; i++) {
      let attempts = incorrectTracker[i] + 1
      if (incorrectTracker[i] === undefined) {
        attempts = 1
      }
      if (attempts > 1) {
        console.log(`!!!Question #${i} Needs More Practice!!!`)
        console.log(`You needed ${attempts} attempts to get it correct...`)
        console.log(`Question #${i}: ${allCards[i - 1].question}`)
        console.log(' ')
      }
    }
  }

  displayTime() {
    let seconds = ((Date.now() - this.start) / 1000)
    console.log('')
    console.log(`Total time: ${seconds} seconds`)
  }
  startTimer() {
    this.start = Date.now();
  }

}



module.exports = Round;
