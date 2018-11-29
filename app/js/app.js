const config = {
  apiInfo: 'https://statsapi.web.nhl.com/api/v1/teams/?expand=team.roster&teamId=',
}

let usedNumbers = [];

function init() {

  let teamToGet = Number(
    document.getElementById("team-selector").value
  );

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
    let randomSelection = calcRandomNumber(arrayLength);
    usedNumbers.push(randomSelection);
    let selectedPlayer = teamArray[randomSelection];
    console.log(selectedPlayer);
    console.log(selectedPlayer.jerseyNumber);
    console.log(selectedPlayer.person.fullName);
    return selectedPlayer;
  }

  function calcRandomNumber(amountOfPlayers) {
    let randomSelection = Math.floor(Math.random() * Math.floor(amountOfPlayers));
    let counter = 0;

    if (usedNumbers.includes(randomSelection) && counter <= amountOfPlayers){
        console.log (randomSelection);
        calcRandomNumber();
    } else {
      return randomSelection;
    }

  }

  function showInDom(selectedPlayer) {
    let mainSectionDOM = document.getElementById('main');
    let newUl = document.createElement('ul');
    let newLi = document.createElement('li');

    mainSectionDOM.appendChild(newUl);
    newUl.appendChild(newLi);

    let newTextNode = document.createTextNode(selectedPlayer.person.fullName);
    newLi.appendChild(newTextNode);
  }


}