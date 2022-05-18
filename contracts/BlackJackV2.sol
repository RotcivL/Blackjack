// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "hardhat/console.sol";

contract BlackJack {

  bool gameStart = false;

  address dealer;
  address player;

  uint dealerBalance;
  uint playerBalance;

  uint[] dealerHand; // store the card indexes in dealer's hand
  uint[] playerHand; // store the card indexes in player's hand

  uint minBet;
  uint maxBet; // minBet and maxBet for each round, defined by dealer when he deploy the contract.

  // the whole deck of the game, cards are drawn in this deck.
  // length = 52 * 3, meaning we are using 3 decks of cards.
  // this is to store whether a specifc card still exists.
  uint[] deck = new uint[](52*3);

  // CONSTRUCTOR
  constructor(uint _minBet, uint _maxBet) payable {

    require(msg.value > _maxBet * 10);
    minBet = _minBet;
    maxBet = _maxBet;
    dealer = msg.sender;
    dealerBalance = msg.value;

  }


  // change the number of cards as 1,
  // deck from [0, 0, 0, ... , 0]
  //        to [1, 1, 1, ... , 1].
  function defaultCardDeck() private {
    for (uint i = 0; i < deck.length; i++) {
      deck[i] = 1;
    }
  }


  // generate a random number, we need to figure out a better way maybe?
  // we need to ensure the random number cannot be guessed given the params
  // in keccak within a block mining round time
  function randomNumber() private view returns(uint) {
    return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, dealer, player))) % (52 * 3);
  }


  // anyone can join this game, once (s)he's in, the player can only be him/her.
  // only admit players to join in if no other player is in the game.
  // *** CALLABLE
  function joinGame() public payable {
    console.log(minBet);
    console.log(maxBet);
    require (player == address(0));
    require (msg.value >= minBet && msg.value <= maxBet);
    require (msg.value % 10 == 0);
    player = msg.sender;
    playerBalance += msg.value;

  }

  // *** CALLABLE
  // function putBet() public payable onlyPlayer {
  //   require (msg.value >= minBet && msg.value <= maxBet);
  //   require (msg.value % 10 == 0);
  //   playerBalance += msg.value;
  // }


  // randomly draw a card from deck, if the card drawn is drawn before, draw again,
  // if the card drawn is never drawn before, set deck[index] => 0.
  // *** CALLABLE
  function hitCard() private returns(uint) {
    uint randomCardIndex = randomNumber() % (52 * 3);
    while (deck[randomCardIndex] == 0) {
      randomCardIndex = randomNumber() % (52 * 3);
    }
    deck[randomCardIndex] = 0;
    return randomCardIndex;
  }

  // *** CALLABLE
  function playerHitCard() public onlyPlayer {
    require (gameStart == true);
    uint newCard = hitCard();
    playerHand.push(newCard);
    uint[2] memory playerCardValues = getSumInHand(playerHand);
    if (check21(playerCardValues) == true) {
      // transfer the balance to the player
      gameStart = false;
    }
    if (checkOver21(playerCardValues) == true) {
      // transfer the balance to the dealer
      gameStart = false;
    }
  }

  // *** CALLABLE
  function playerStand() public {
    // dealer call when time out
    require (msg.sender == player || msg.sender == dealer);
    require (gameStart == true);
    uint[2] memory dealerCardValues = getSumInHand(dealerHand);
    uint dealerLargerValue = dealerCardValues[1];
    while (dealerLargerValue < 17) {
      dealerHand.push(hitCard());
      dealerCardValues = getSumInHand(dealerHand);
      if (dealerCardValues[1] > 21) {
        dealerLargerValue = dealerCardValues[0];
      }
    }
    if (dealerLargerValue > 21) {
      // transfer money to player
    }
    uint[2] memory playerCardValue = getSumInHand(playerHand);
    uint playerLargerValue = 0;
    if (playerCardValue[1] > 21) {
      playerLargerValue = playerCardValue[0];
    } else {
      playerLargerValue = playerCardValue[1];
    }
    if (dealerLargerValue >= playerLargerValue) {
      // deduct player balance, add to dealer's balance;
    } else {
      // transfer money to player, same amount as player's balance
    }
    gameStart = false;
  }


  // returns the sum of the card values in player/dealers hand
  // array because we at most have two values in hand (considering Ace)
  // for example,
  // cardInHand = [A, J] => [11, 21]
  // cardInHand = [A, A] => [2, 12]
  // cardInHand = [A, A, A] => [3, 13]
  // cardInHand = [1, 2, 3] => [6, 6]
  // cardInHand = [J, K, Q] => [30, 30]
  // cardInHand = [A, A, 10] => [12, 22]
  function getSumInHand(uint[] storage hand) private view returns(uint[2] memory) {
    uint[2] memory cardValues = [uint(0), uint(0)];
    for (uint i = 0; i < hand.length; i++) {
      uint cardIndex = hand[i];
      uint cardValue = cardIndex % 52 % 13 + 1;
      if (cardValue > 10) {
        cardValues[0] += 10;
        cardValues[1] += 10;
      } else if (cardValue == 1) {
        if (cardValues[1] >= 11) {
          cardValues[0] += 1;
          cardValues[1] += 1;
        } else {
          cardValues[0] += 1;
          cardValues[1] += 11;
        }
      } else {
        cardValues[0] += cardValue;
        cardValues[1] += cardValue;
      }
    }
    return cardValues;
  }


  // get the possible sums of card in hand.
  // if any is 21, return true, else return false
  // only trigger at the initial stage.
  function check21(uint[2] memory cardValues) private pure returns(bool){
    if (cardValues[0] == 21 || cardValues[1] == 21) {
      return true;
    }
    return false;
  }


  // check if the player/dealer can still hit cards, if both possible sum in his/her hand > 21
  // return true, else return false.
  function checkOver21(uint[2] memory cardValues) private pure returns(bool) {
    if (cardValues[0] > 21){
      return true;
    }
    return false;
  }


  // start game, only dealer can call.
  // *** CALLABLE
  function startGame() public onlyDealer() {
    require (dealer != address(0) && player != address(0));
    gameStart = true;
    defaultCardDeck();

    // send the initial two cards to both
    uint playerCard1 = hitCard();
    playerHand.push(playerCard1);
    uint dealerCard1 = hitCard();
    dealerHand.push(dealerCard1);
    uint playerCard2 = hitCard();
    playerHand.push(playerCard2);
    uint dealerCard2 = hitCard();
    dealerHand.push(dealerCard2);

    // check if cardValue of player is == 21
    uint[2] memory playerCardValues = getSumInHand(playerHand);
    if (check21(playerCardValues) == true) {
      // transfer players balance * 2
      gameStart = false;
    }
    // increase bet size
    // check if cardValue of dealerCard2 is == 1, if yes, insurance
    // check if cardValue of playerCard1 == playerCard2, if yes, split. This part is hard because i cant figure out a way to store multiple hands of a single player.
  }


  // a player can only quit a game if the game is not on.
  // CALLABLE ***
  function quitGame() public onlyPlayer {
    require(gameStart == false);
    player = address(0);
  }


  // MODIFIERs

  modifier onlyPlayer() {
    require (msg.sender == player);
    _;
  }


  modifier onlyDealer() {
    require (msg.sender == dealer);
    _;
  }
}

// END OF THE FILE
