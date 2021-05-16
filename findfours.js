var playedWords = [];

var inputWord;
var currentWord = null;
txtbox = null;

sos = 5;
playCount = 5;

window.onload = function() {
    setUpEnter();
}

function setUpEnter() {
    if(!txtbox) {
        txtbox = document.getElementById("input");
        txtbox.addEventListener("keyup", function(event) {
            event.preventDefault();
            if(event.keyCode===13) {
                document.getElementById("submit").click();
            }
        })
    }
}

function compareWords(newWord) {
    count = 0;
    for(let i=0; i<4; i++) {
        a = newWord[i];
        b = currentWord[i];
        if(a!=b) {
            count++;
        }
    }

    if(count==1) return true;
    return false;
}

function pushAndRemove(pushWord) {
    playedWords.push(pushWord);
    let i = words.indexOf(pushWord);
    if(i>-1) words.splice(i, 1);
}

function checkWord(wordToBeChecked) {
    for(let i=0; i<words.length; i++) {
        if(words[i]===wordToBeChecked) return true;
    }
    return false;
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

function computePossibilites() {

    if(!currentWord) return words;

    possibilities = [];

    for(let i=0; i<4; i++) {
        asciiValue = currentWord[i].charCodeAt();
        for(let j=0; j<26; j++) {
            newAsciiValue = (asciiValue+j)%26+"A".charCodeAt();

            constructedWord = currentWord.replaceAt(i, String.fromCharCode(newAsciiValue));

            if(checkWord(constructedWord)) {
                possibilities.push(constructedWord);
            }
        }
    }

    return possibilities;
}

function computerPlay() {
    possibleValues = computePossibilites();
    if(possibleValues.length!=0) {
        chosenWord = possibleValues[Math.floor(Math.random()*possibleValues.length)];
        return chosenWord;
    }
    return null;
}

function mainGameFunction () {
    inputElement = document.getElementById("input");
    outputElement = document.getElementById("output");
    playedElement = document.getElementById("played");
    inputWord = inputElement.value.toUpperCase();

    special = false;

    if(inputWord==="SEE") {
        if(currentWord!=null) {
            outputElement.innerHTML += "\nThere are " + computePossibilites().length+" valid words from " + currentWord;
        } else {
            outputElement.innerHTML += "\nPlease type a four letter word first.";
        }
        special = true;
    } else if (inputWord==="SOS" && sos>=0) {
        if(sos===0) {
            outputElement.innerHTML += "\nYou have no SOSs left.";
            special = true;
        } else {
            inputWord = computerPlay();
            sos--;
            outputElement.innerHTML += "\nYou used 1 SOS. You have "+ sos + " SOSs left.";
        }
    } else if (inputWord==="RANDOM") {
        if(!currentWord) {
            inputWord = words[Math.floor(Math.random()*words.length)];
        } else {
            outputElement.innerHTML += "\nYou can use 'random' only at the beginning of the game.";
            special = true;
        }
    }

    var regex = /[A-Za-z]{4}/g;

    if(special) return scrollDownAndClear(inputElement, outputElement);

    if(regex.test(inputWord) && inputWord.length===4 && !special) {
        if(checkWord(inputWord)) {
            if(!currentWord) {
                currentWord = inputWord;
                outputElement.innerHTML += "\nYou played: "+inputWord;
                playedElement.innerHTML += "\n" + inputWord;
                pushAndRemove(inputWord);

                if(--playCount===0) {
                    sos++;
                    playCount = 5;
                    outputElement.innerHTML += "\n You got 1 SOS, You have "+sos+" SOSs.";
                }
                computerWord = computerPlay();
                if(computerWord) {
                    pushAndRemove(computerWord);
                    currentWord = chosenWord;
                    outputElement.innerHTML += "\nComputer played: "+computerWord;
                    playedElement.innerHTML += "\n" + computerWord;

                    if(computePossibilites().length===0) {
                        outputElement.innerHTML = "\nYou lost! There are no more valid words from "+currentWord;
                    }
                } else {
                    outputElement.innerHTML += "\nCongratulations! You beat the computer! Refresh to play again";
                }
            } else if (compareWords(inputWord)) {
                currentWord = inputWord;
                outputElement.innerHTML += "\nYou played: "+inputWord;
                playedElement.innerHTML += "\n" + inputWord;
                pushAndRemove(inputWord);

                if(--playCount===0) {
                    sos++;
                    playCount = 5;
                    outputElement.innerHTML += "\n You got 1 SOS, You have "+sos+" SOSs.";
                }
                computerWord = computerPlay();
                if(computerWord) {
                    pushAndRemove(computerWord);
                    currentWord = chosenWord;
                    outputElement.innerHTML += "\nComputer played: "+computerWord;
                    playedElement.innerHTML += "\n" + computerWord;

                    if(computePossibilites().length===0) {
                        outputElement.innerHTML = "\nYou lost! There are no more valid words from "+currentWord;
                    }
                } else {
                    outputElement.innerHTML += "\nCongratulations! You beat the computer! Refresh to play again";
                }
            } else {
                outputElement.innerHTML += "\nTry again! Only one letter cant be changed. You typed: "+inputWord;
            }
        } else {
            outputElement.innerHTML += "\nTry again! The word " + inputWord + " is nonexistent or has been played before.";
        }
    } else {
        outputElement.innerHTML += "\nTry again! The word should have 4 alphabets only. You typed: " + inputWord;
    }

    scrollDownAndClear(inputElement, outputElement);
}

function scrollDownAndClear(inputElement, outputElement) {
    outputElement.scrollTop = outputElement.scrollHeight;
    inputElement.value = '';
}