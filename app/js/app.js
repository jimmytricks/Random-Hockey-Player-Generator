const config = {
    apiInfo: 'https://statsapi.web.nhl.com/api/v1/teams/?expand=team.roster&teamId=',
    // pathToRoster: teams[0].roster.roster
}
    
let teamToGet = 12;

fetch(`${config.apiInfo}${teamToGet}`)
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      // Examine the text in the response
      response.json()
      .then(pushToArray)
      .then(getRandomPlayer);
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });



function pushToArray(teamArray){
    let teamArrayRoster = teamArray.teams[0].roster.roster;
    return teamArrayRoster;
}

function getRandomPlayer(teamArray){
    let arrayLength = teamArray.length;
    let randomSelection = calcRandomNumber(arrayLength);
    let selectedPlayer = teamArray[randomSelection];
    console.log(selectedPlayer);
    console.log(selectedPlayer.jerseyNumber);
    console.log(selectedPlayer.person.fullName);   
}

function calcRandomNumber(amountOfPlayers){
    return Math.floor(Math.random() * Math.floor(amountOfPlayers));
    
}

