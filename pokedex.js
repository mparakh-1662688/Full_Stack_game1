// Name: Mohneel Parakh
// TA: Brian Dai
// Assignment-5
// this file will make the pokedex viewable
// and allows the selection of a pokemon to see its details. (Part 1 only)

"use strict";
(function() {

    const url = "https://webster.cs.washington.edu/pokedex/";
    let starters = ["Bulbasaur", "Charmander", "Squirtle"];
    let gameId;
    let playerId;
    let selectedPokemon;
    let opponentPokemon;

    // help make a shortcut for referencing different parts of the web page
    function $(id) {
      return document.getElementById(id);
    }

    // this function help to get designed innitially before the user interacts with the page
    window.onload = function() {
      setup();
      $("start-btn").onclick = gameDisplay;
      $("endgame").onclick = backToDex;
      $("flee-btn").onclick = flee;
    };

    // this will help setup the help pokedex layout by getting data
    function setup() {
      let viewUrl = url + "pokedex.php?pokedex=all";
      fetch(viewUrl, {mode: 'cors'})
        .then(checkStatus)
        .then(pokedexLayout)
        .catch(handleFailure);
    }

    /**this is a helper function the helps the setup of the pokemon the are not found
      and the ones that are found.
      @param {string} responseText - Accepts a string of pokemon
    */
    function pokedexLayout(responseText){
      let pokemonImage = "https://webster.cs.washington.edu/pokedex/sprites/";
      let eachName = responseText.split("\n");
      for (let i = 0; i < eachName.length; i++) {
        let singleData = eachName[i];
        let splitData = singleData.split(":");
        let tempImg = document.createElement("img");
        tempImg.setAttribute("src", pokemonImage + splitData[1]);
        tempImg.setAttribute("id", splitData[0]);
        tempImg.classList.add("sprite");
        if(splitData[0] === starters[0] || splitData[0] === starters[1] ||
                             splitData[0] ===  starters[2]) {
          tempImg.classList.add("found");
        }
        tempImg.onclick = details;
        $("pokedex-view").append(tempImg);
      }
    }

    // helps populate the details page of the pokemon that is choosen
    function details() {
      if(this.className === "sprite found" ) {
        let detailUrl = url + "pokedex.php?pokemon=" + (this.id).toLowerCase();
        fetch(detailUrl, {mode: 'cors'})
          .then(checkStatus)
          .then(JSON.parse)
          .then(function(responseJSON) {
            cardView(responseJSON, "p1");
          })
          .catch(handleFailure);
      }
    }

    /** this is the helper function for making the details card viewable
        @param {JSON} details - has details of the pokemon
        @param {string} player - the player gets passed
      */
    function cardView(details, player) {
      let mainDiv;
      if (player === "p1") {
        selectedPokemon = details.name;
        mainDiv = $("my-card");
        $("start-btn").classList.remove("hidden");
      } else {
        opponentPokemon = details.name;
        mainDiv = $("their-card");
        $("start-btn").classList.add("hidden");
      }
      mainDiv.getElementsByClassName("name")[0].innerText = details.name;
      let photoUrl = url + details.images.photo;
      let typeUrl = url + details.images.typeIcon;
      let weaknessUrl = url + details.images.weaknessIcon;
      mainDiv.getElementsByClassName("pokepic")[0].src = photoUrl;
      mainDiv.getElementsByClassName("type")[0].src = typeUrl;
      mainDiv.getElementsByClassName("weakness")[0].src = weaknessUrl;
      mainDiv.getElementsByClassName("hp")[0].innerText = details.hp + "HP";
      mainDiv.getElementsByClassName("info")[0].innerText = details.info.description;
      let count = 0;
      for (let i = 0; i < 4; i++) {
        $("my-card").getElementsByTagName("button")[i].disabled = false;
        if (count < details.moves.length) {
          mainDiv.getElementsByClassName("move")[i].innerText = details.moves[i].name;
          let typeButton = mainDiv.getElementsByTagName("button")[i];
          typeButton.getElementsByTagName("img")[0].src = url + "icons/" +
                                            details.moves[i].type + ".jpg";
          count++;
          typeButton.classList.remove("hidden");
          if (details.moves[i].dp !== undefined) {
            mainDiv.getElementsByClassName("dp")[i].innerText = details.moves[i].dp + " DP";
          } else {
            mainDiv.getElementsByClassName("dp")[i].innerText = null;
          }
        } else {
          mainDiv.getElementsByTagName("button")[i].classList.add("hidden");
        }

      }
    }

    // the main display of the battlefield where you see the two cards;
    // this function help set it up
    function gameDisplay() {
        $("start-btn").classList.add("hidden");
        $("pokedex-view").classList.add("hidden");
        $("their-card").classList.remove("hidden");
        $("flee-btn").classList.remove("hidden");
        $("flee-btn").disabled = false;

        for (let i = 0; i < 4; i++) {
          $("my-card").getElementsByTagName("button")[i].disabled = false;
          $("my-card").getElementsByTagName("button")[i].onclick = movePlayed;
        }
        $("title").innerText = "Pokemon Battle Mode!";
        let gameUrl = url + "game.php";
        let data = new FormData();
        data.append("startgame", true);
        data.append("mypokemon", selectedPokemon.toLowerCase());
        fetch(gameUrl, {method: "POST", body: data, mode: 'cors'})
         .then(checkStatus)
         .then(JSON.parse)
         .then(otherplayer)
         .catch(handleFailure);
    }

    /** sets the opponents card up with pokemon details
        @param {JSON} details - has details of the pokemon
      */
    function otherplayer(responseText) {
      gameId = responseText.guid;
      playerId = responseText.pid;
      $("my-card").classList.remove("hidden");
      $("my-card").getElementsByClassName("hp-info")[0].classList.remove("hidden");
      cardView(responseText.p2, "p2");
    }

    // this will help the player to make a move of their choice
    function movePlayed() {
      let moveName = this.getElementsByClassName("move")[0].innerText;
      moveName = (moveName.split(" ").join("")).toLowerCase();
      let gameUrl = url + "game.php";
      let data = new FormData();
      data.append("guid", gameId);
      data.append("pid", playerId);
      data.append("movename", moveName);
      $("results-container").classList.remove("hidden");
      $("p1-turn-results").classList.remove("hidden");
      $("p2-turn-results").classList.remove("hidden");
      $("loading").classList.remove("hidden");
      fetch(gameUrl, {method: "POST", body: data, mode: 'cors'})
       .then(checkStatus)
       .then(JSON.parse)
       .then(updatedState)
       .catch(handleFailure);
    }

    // updated the state after every move is played and the
    // user can see the feedback to their move
    function updatedState(responseText){
      cardView(responseText.p1, "p1");
      cardView(responseText.p2, "p2");
      health(responseText.p1, "p1");
      let p1Results = "Player 1 played " + responseText.results["p1-move"] + " and " +
                      responseText.results["p1-result"] + "!";
      $("p1-turn-results").innerText = p1Results;
      health(responseText.p2, "p2");
      let p2Results = "Player 2 played " + responseText.results["p2-move"] + " and " +
                      responseText.results["p2-result"] + "!";
      $("p2-turn-results").innerText = p2Results;
      $("loading").classList.add("hidden");
    }

    // manages the health bar above the card to show an approximate health
    // also add buff and debuff powers if a move has it
    function health(responseText, player) {
      let myDiv;
      let decision;
      let healthCurrent = parseInt(responseText["current-hp"]);
      if (player === "p1") {
        myDiv = $("my-card");
        decision = 1;
      } else if (player === "end") {
        healthCurrent = 0;
        decision = 1;
        myDiv = $("my-card");
      } else {
        myDiv = $("their-card");
      }
      let totalHealth = parseInt(responseText.hp);
      let percentage = parseInt(healthCurrent/totalHealth * 100);
      if (percentage < 20) {
        myDiv.getElementsByClassName("health-bar")[0].classList.add("low-health");
      } else{
        myDiv.getElementsByClassName("health-bar")[0].classList.remove("low-health");
      }
      myDiv.getElementsByClassName("health-bar")[0].style.width = percentage + "%";
      let playerBuffs = responseText.buffs;
      let playerDebuffs = responseText.debuffs;
      if (playerBuffs.length != 0) {
        $("my-card").getElementsByClassName("buffs")[0].classList.remove("hidden");
        $("my-card").getElementsByClassName("buffs")[0].innerHTML = "";
        for (let i = 0; i < playerBuffs.length; i++) {
          let newBuff = document.createElement("div");
          newBuff.className = playerDebuffs[i] + " " + "debuff";
          myDiv.getElementsByClassName("buffs")[0].append(newBuff);
          let new2Buff = document.createElement("div");
          newBuff.className =playerBuffs[i] + " " + "buff" ;
          myDiv.getElementsByClassName("buffs")[0].append(newBuff);
        }
      }
      if (healthCurrent === 0) {
        responseText["current-hp"] = 100;
        gameOver(decision);
      }
    }

    // once the game is over this function will show the results
    // (win/lose)
    function gameOver(decision) {
      if (decision === 1) {
        $("title").innerHTML = "You Lost!";
      } else {
        $("title").innerHTML = "You Won!";
        $(opponentPokemon).classList.add("found");
        $(opponentPokemon).onclick = details;
      }
      $("endgame").classList.remove("hidden");
      $("p2-turn-results").classList.add("hidden");
      $("loading").classList.add("hidden");
      $("flee-btn").disabled = true;
      for (let i = 0; i < 4; i++) {
        $("my-card").getElementsByTagName("button")[i].disabled = true;
      }
    }

    // will reset the game to it innitial state so the user could play again
    function backToDex() {
       $("endgame").classList.add("hidden");
       $("results-container").classList.add("hidden");
       $("their-card").classList.add("hidden");
       $("start-btn").classList.remove("hidden");
       $("pokedex-view").classList.remove("hidden");
       $("title").innerHTML = "Your Pokedex";
       $("my-card").getElementsByClassName("hp-info")[0].classList.add("hidden");
       $("flee-btn").classList.add("hidden");
       $("my-card").getElementsByClassName("buffs")[0].innerHTML = "";
       $("their-card").getElementsByClassName("buffs")[0].innerHTML = "";
       $("my-card").getElementsByClassName("health-bar")[0].classList.remove("low-health");
       $("their-card").getElementsByClassName("health-bar")[0].classList.remove("low-health");
       $("my-card").getElementsByClassName("health-bar")[0].style.width = 100 + "%";
       $("their-card").getElementsByClassName("health-bar")[0].style.width = 100 + "%";
    }

    // if the user decides to leave instantly. Ther this function will
    // help him get back to the pokedex
    function flee () {
      let gameUrl = url + "game.php";
      let data = new FormData();
      data.append("guid", gameId);
      data.append("pid", playerId);
      data.append("movename", "flee");
      $("results-container").classList.remove("hidden");
      $("p1-turn-results").classList.remove("hidden");
      $("p2-turn-results").classList.remove("hidden");
      $("loading").classList.remove("hidden");
      fetch(gameUrl, {method: "POST", body: data, mode: 'cors'})
       .then(checkStatus)
       .then(JSON.parse)
       .then(function(responseText) {
         health(responseText.p1, "end");
         $("p1-turn-results").innerText = "Player 1 played flee and fled!";
       })
       .catch(handleFailure);
    }

    /** checks if the fetch request was valid
        @param {Oject} response - depend on what is being fetched
    */
    function checkStatus(response) {
      if (response.status >= 200 && response.status < 300) {
      return response.text();
      } else {
      return Promise.reject(new Error(response.status + ": " + response.statusText));
      }
    }

    /** In case of an error there will be an alert
        @param {Oject} response - depend on what is being fetched
    */
    function handleFailure(error) {
        alert(error);
    }

})();
