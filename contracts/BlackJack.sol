// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;


contract BlackJack {

    address[5] players;
    mapping(address => Card[]) playerHands;
    mapping(address => uint) balances;
    address dealer;
    uint minBet;
    uint maxBet;


    Suits[4] suits = [Diamonds, Hearts, Spades, Clubs];
    Ranks[13] ranks = [Ace, Two, Three, Four, Five, Six, Seven, Eight, Night, Ten, Jack, Queen, King];
    uint[13] values = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
    Card[52] cardList;
    uint[52] cardsIndex;

    // constructor
    constructor(uint _minBet, uint _maxBet) payable {
      require (msg.value >= _maxBet * 1000); // consider math later
      dealer = msg.sender;
      minBet = _minBet;
      maxBet = _maxBet;
      createDeck();
    }

    enum Suits { Diamonds, Hearts, Spades, Clubs }
    enum Ranks { Ace, Two, Three, Four, Five, Six, Seven, Eight, Night, Ten, Jack, Queen, King }
    struct Card {
      Suits suits;
      Ranks rank;
      uint[] values; // array because ace can be 1 || 11
    }

    function createDeck() private {
      for (uint noOfDecks = 0; noOfDecks < 3; noOfDecks ++){
        for (uint i = 0; i < 4; i ++) {
          for (uint j = 0; j < 13; j ++) {
            uint[] cardValue;
            if (j == 0) {
              cardValue.put(1);
              cardValue.put(11);
            } else {
              cardValue.put(values[j]);
            }
            Suits cardSuits = suits[i];
            Ranks cardRanks = ranks[j];
            cardList.put(cardSuits, cardRanks, cardValue);
          }
        }
      }
    }

    function shuffle() private {
      for (uint i = 0; i < 52; i ++) {
        cardsIndex[i] = 3;
      }
    }

    function hitCard() private view returns(Card){
      while (true) {
        uint cardIndex = randomNumber() % 52;
        if (cardsIndex[cardIndex] != 0) {
          cardsIndex[cardIndex] -= 1;
          return cardList[cardIndex];
        }
      }
    }

    function randomNumber() private view returns(uint) {
      return uint(keccak256(block.difficulty, now, players));
      // or whatever, we can decide later on.
    }

    function joinGame() public{
      players.put(msg.sender);
    }

    function putBet() public payable onlyPlayers {
      require (msg.value >= minBet && msg.value <= maxBet);
      require (msg.value % 10 == 0);
      balances[msg.sender] += msg.value;
    }

    function sumValueInHand(address playerAddress) private view returns(uint[]) {
      uint[2] sumValue;

      // to implement: dont return value greater than 21.

      Card[] playerHand = playerHands[playerAddress];
      for (uint i = 0; i < playerHand.length; i ++) {
        if (playerHand[i].values.length == 1){
          sumValue[0] += playerHand[i].values[0];
          sumValue[1] += playerHand[i].values[0];
        } else {
            if (sumValue[1] >= 11) {
              sumValue[0] += playerHand[i].values[0];
              sumValue[1] += playerHand[i].values[0];
            } else {
              sumValue[0] += playerHand[i].values[0];
              sumValue[1] += playerHand[i].values[1];
            }
        }
      }
      return sumValue;
    }

    function startGame() public onlyDealer {
      require(players[0] != address(0));
      shuffle();
      for (uint i = 0; i < players.length; i ++) {
        if (players[i] != address(0)) {
          Card playerCard = hitCard();
          playerHands[players[i]].put(playerCard);
        }
      }
      Card dealerCard = hitCard();
      playerHands[dealer].put(hitCard());

      for (uint i = 0; i < players.length; i ++) {
        if (players[i] != address(0)) {
          Card playerCard = hitCard();
          playerHands[players[i]].put(playerCard);
        }
      }
      dealerCard = hitCard();
      playerHands[dealer].put(hitCard());


    }


    modifier onlyPlayers() {
      for (uint index = 0; index < players.length; index++) {
        if (players[index] == msg.sender) {
          _;
          return;
        }
      }
      revert();
    }

    modifier onlyDealer() {
      require (msg.sender == dealer);
      _;
    }
