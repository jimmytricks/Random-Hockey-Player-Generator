const config = {
  apiInfo: 'https://statsapi.web.nhl.com/api/v1/teams/?expand=team.roster&teamId=',
}

/* set event listeners */
let leftInitElement = document.getElementById('left-init');
let rightInitElement = document.getElementById('right-init');
leftInitElement.addEventListener("click", init);
rightInitElement.addEventListener("click", init);

// Set arrays for left and right
let usedNumbersLeft = [];
let usedNumbersRight = [];

function init(e) {

  // Set left or right based on target button
  let leftOrRight;
  let isLeftSelectedBoolean = false;
  if (e.target.id == "left-init") {
    leftOrRight = 'left';
    isLeftSelectedBoolean = true;
  } else {
    leftOrRight = 'right';
  }

  // Set team selector and name to use in DOM
  let setTeamSelectorID = `team-selector-${leftOrRight}`;
  let setNameID = `name-${leftOrRight}`;

  // check if left or right team array should be set
  let specificUsedNumberArray = isLeftSelectedBoolean ? usedNumbersLeft : usedNumbersRight;

  let teamToGet = Number(
    document.getElementById(setTeamSelectorID).value);

  let nameOfPerson = document.getElementById(setNameID).value;

  fetch(`${config.apiInfo}${teamToGet}`)
    .then(
      function (response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }

        // Examine the text in the response
        response.json()
          .then(pushToArray)
          .then(getRandomPlayer)
          .then(showInDom);
      }
    )
    .catch(function (err) {
      console.log('Fetch Error :-S', err);
    });

  function pushToArray(teamArray) {
    let teamArrayRoster = teamArray.teams[0].roster.roster;
    return teamArrayRoster;
  }

  function getRandomPlayer(teamArray) {
    let arrayLength = teamArray.length;
    let randomSelection = calcRandomNumber(arrayLength - 1);
    specificUsedNumberArray.push(randomSelection);
    let selectedPlayer = teamArray[randomSelection];
    return selectedPlayer;
  }

  function calcRandomNumber(amountOfPlayers) {
    let counter = 0;
    let randomSelection = Math.floor(Math.random() * Math.floor(amountOfPlayers));
    if (specificUsedNumberArray.includes(randomSelection) && counter <= amountOfPlayers) {
      console.log(randomSelection + ' looping recursion' + counter);
      counter += 1;
      calcRandomNumber(amountOfPlayers);
    } else {
      counter = 0;
      console.log('done with recursion' + counter)
      return randomSelection;
    }
  }

  function showInDom(selectedPlayer) {
    let textOutput = `${nameOfPerson}: ${selectedPlayer.person.fullName} #${selectedPlayer.jerseyNumber} - ${selectedPlayer.position.name}`;

    let specificSectionDOM = `main-${leftOrRight}-side`;

    let mainSectionDOM = document.getElementById(specificSectionDOM);
    let newUl = document.createElement('ul');
    let newLi = document.createElement('li');

    mainSectionDOM.appendChild(newUl);
    newUl.appendChild(newLi);

    let newTextNode = document.createTextNode(textOutput);
    newLi.appendChild(newTextNode);
  }
}