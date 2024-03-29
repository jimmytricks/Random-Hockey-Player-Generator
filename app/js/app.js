const config = {
  apiInfo: 'https://api-web.nhle.com',
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
  let teamToGet = document.getElementById(setTeamSelectorID).value;
  let nameOfPerson = document.getElementById(setNameID).value;

  // Hide any given class
  function hideClass(classToHide){
    let arrayOfClassToHide = document.getElementsByClassName(classToHide);
      Array.prototype.forEach.call(arrayOfClassToHide,function(className, index){
          className.style.display = 'none';
        }
      );
  }

  // player count hidden after click to make space for player names
  hideClass('player-count');

  fetch(`${config.apiInfo}/v1/roster/${teamToGet}/current`)
    .then(
      function (response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
        response.json()
          .then(flattenAndCombineArrays)
          .then(checkIfAllPlayersSelected)
          .then(getRandomPlayer)
          .then(showInDom)
          .catch(err => {console.log('Selected all players from team: ' + err)});
      }
    )
    .catch(function (err) {
      console.log('Fetch Error :-S', err);
    });

  // function pushSelectTeamToNewArray(teamArray) {
  //   let teamArrayRoster = teamArray.teams[0].roster.roster;
  //   return teamArrayRoster;
  // }

  function flattenAndCombineArrays(data) {
    const flattenedArray = [];
        Object.values(data).forEach(category => {
        category.forEach(player => {
            flattenedArray.push(player);
        });
    });

    return flattenedArray;
}

  // check if all players are used up
  function checkIfAllPlayersSelected(teamArrayRoster){
        if (teamArrayRoster.length <= specificUsedNumberArray.length ) {
          showAllPlayersSelectedMsg();

        } else {
          return teamArrayRoster;
        }
  }

  // Select random player from team
  function getRandomPlayer(teamArray) {
    let currentTeamArrayLength = teamArray.length;
    let randomSelection = calcRandomNumber(currentTeamArrayLength);
    specificUsedNumberArray.push(randomSelection);
    let selectedPlayer = teamArray[randomSelection];
    return selectedPlayer;
  }

  function calcRandomNumber(amountOfPlayersInTeam) {
    let numberOfCurrentPlayersAlreadyInArray = specificUsedNumberArray.length;
    let randomSelection = Math.floor(Math.random() * Math.floor(amountOfPlayersInTeam));

    // if the player array includes the random number already, and counter of current players is less than amount of total players in team then recursively call calcRandomNumber - otherwise add selection to the array
    if (specificUsedNumberArray.includes(randomSelection) && numberOfCurrentPlayersAlreadyInArray < amountOfPlayersInTeam ) {
      return calcRandomNumber(amountOfPlayersInTeam);  
    } else {
      return randomSelection;
    }
  }

  function showInDom(selectedPlayer) {
    // let textOutput = `${nameOfPerson}: ${selectedPlayer.person.fullName} #${selectedPlayer.jerseyNumber} (${selectedPlayer.position.abbreviation})`;
    let textOutput = `${nameOfPerson}: ${selectedPlayer.firstName} ${selectedPlayer.lastName} #${selectedPlayer.sweaterNumber} (${selectedPlayer.positionCode})`;

    let specificSectionDOM = `main-${leftOrRight}-side`;

    let mainSectionDOM = document.getElementById(specificSectionDOM);
    let newUl = document.createElement('ul');
    let newLi = document.createElement('li');

    mainSectionDOM.appendChild(newUl);
    newUl.appendChild(newLi);

    let newTextNode = document.createTextNode(textOutput);
    newLi.appendChild(newTextNode);
  }

  function showAllPlayersSelectedMsg(){
    let allPlayerSelectedElement = document.querySelector(`.${leftOrRight}-full-team-msg`);    allPlayerSelectedElement.style.display = "block";
  }
}