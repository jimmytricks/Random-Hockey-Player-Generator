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

  // Get team name and name of person playing
  let teamToGet = Number(document.getElementById(setTeamSelectorID).value);
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
          .then(pushSelectTeamToNewArray)
          .then(checkIfAllPlayersSelected)
          .then(getRandomPlayer)
          .then(showInDom);
      }
    )
    .catch(function (err) {
      console.log('Fetch Error :-S', err);
    });

  function pushSelectTeamToNewArray(teamArray) {
    let teamArrayRoster = teamArray.teams[0].roster.roster;
    return teamArrayRoster;
  }

  function checkIfAllPlayersSelected(teamArrayRoster){
        // check if all players are used up
        console.log('team array length' + teamArrayRoster.length);
        console.log('specific used number array length' + specificUsedNumberArray.length);
        if (teamArrayRoster.length <= specificUsedNumberArray.length ) {
          console.log('all players used up');
        } else {
          return teamArrayRoster;
        }
  }

  function getRandomPlayer(teamArray) {
    let currentTeamArrayLength = teamArray.length;
    let randomSelection = calcRandomNumber(currentTeamArrayLength);
    specificUsedNumberArray.push(randomSelection);
    let selectedPlayer = teamArray[randomSelection];
    return selectedPlayer;
  }

  function calcRandomNumber(amountOfPlayersInTeam) {
    let numberOfCurrentPlayersAlreadyInArray = specificUsedNumberArray.length;
    console.log('amount of players' + amountOfPlayersInTeam); 
    console.log('counter of current players' + numberOfCurrentPlayersAlreadyInArray); 


    // if the specifid array includes the random number, and coutner of current players is equal to amount of players, end - otherwise add it tot he array
    // Generate random number up to amount of players
    let randomSelection = Math.floor(Math.random() * Math.floor(amountOfPlayersInTeam));
    console.log(randomSelection + ' random');
    if (specificUsedNumberArray.includes(randomSelection) && numberOfCurrentPlayersAlreadyInArray < amountOfPlayersInTeam ) {
      console.log(randomSelection + ' looping recursion');
      return calcRandomNumber(amountOfPlayersInTeam);  
    } else {
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