/*
 * Star Wars RPG!
 * Michael Stange
 * UCSD Coding Boot Camp - Assignment #4
 */

var user = {
    name: "",
    healthPoints: 0,
    attackPower: 0,
    counterAttackPower: 0,
    isDead: false
};

var defender = {
    name: "",
    healthPoints: 0,
    attackPower: 0,
    counterAttackPower: 0,
    isDead: false
};

var activeBattle = false;
var gameOver = false;
var charactersClicked = 0;
var currentDefender;
var enemiesDefeated = 0;
var originalUserAttackPower;

var firstCharacter;
var secondCharacter;
var thirdCharacter;
var fourthCharacter;

var sound = new Audio();

/* reset()
 * Reset for new game.
 */
function reset() {
    $("#message").html("Choose your character by clicking on an image.");

    $("#user-name").html("&nbsp;");
    $("#user-image").attr("src", "assets/images/black.jpg");
    $("#user-hp").html("&nbsp;");

    $("#defender-name").html("&nbsp;");
    $("#defender-image").attr("src", "assets/images/black.jpg");
    $("#defender-hp").html("&nbsp;");

    $("#c1-container").append(firstCharacter);
    $("#c2-container").append(secondCharacter);
    $("#c3-container").append(thirdCharacter);
    $("#c4-container").append(fourthCharacter);

    charactersClicked = 0;
    enemiesDefeated = 0;
    activeBattle = false;
    gameOver = false;

}

function removeCharacterFromGroup(character)
{
    $(character).remove();
}

function moveCharacterToUserArea(character) {

    $("#user-name").html(character.children[0].innerHTML);
    $("#user-image").attr("src", character.children[1].attributes[2].value);
    $("#user-hp").html(character.children[2].innerHTML);
}

function setUser(character) {
    
    moveCharacterToUserArea(character);

    user.name = character.children[0].attributes[1].nodeValue;
    user.healthPoints = character.children[2].innerHTML;
    user.attackPower = parseInt(character.children[3].attributes[1].nodeValue);

    originalUserAttackPower = user.attackPower;
    user.counterAttackPower = character.children[4].attributes[1].nodeValue

    removeCharacterFromGroup(character);
    $("#message").text("Choose the defender by clicking on an image.");
}

function moveCharacterToDefenderArea(character) {

    $("#defender-name").html(character.children[0].innerHTML);
    $("#defender-image").attr("src", character.children[1].attributes[2].value);
    $("#defender-hp").html(character.children[2].innerHTML);    
}

function setDefender(character) {

    moveCharacterToDefenderArea(character);

    defender.name = character.children[0].attributes[1].nodeValue;
    defender.healthPoints = character.children[2].innerHTML;
    defender.attackPower = character.children[3].attributes[1].nodeValue;
    defender.counterAttackPower = character.children[4].attributes[1].nodeValue;

    removeCharacterFromGroup(character);
    $("#message").text("Attack by clicking the attack button.");
}

function removeDefender() {

    $("#defender-name").html("&nbsp;");
    $("#defender-image").attr("src", "assets/images/black.jpg");
    $("#defender-hp").html("&nbsp;");
}


function doBattle(currentDefender) {

    defender.healthPoints -= user.attackPower;
    $("#defender-hp").html(defender.healthPoints);

    // if defender is defeated
    if(defender.healthPoints <= 0) {

        removeDefender();
        activeBattle = false;
        enemiesDefeated++;
        
        if(enemiesDefeated < 3) {

            $("#message").text("You have defeated " + defender.name + ".");
            $("#message").append("You may choose to fight another character.");
        }

        // if all 4 characters have been clicked...WINNER!!!
        else {
            $("#message").text("You won!  GAME OVER!!!");
            gameOver = true;
        }
    }

    else {

        user.healthPoints -= defender.counterAttackPower;
        $("#user-hp").html(user.healthPoints);

        if(user.healthPoints <= 0) {

            $("#message").text("You have been defeated.  Game over.");
            gameOver = true;
        }

        else {

            $("#message").text("You attacked " + defender.name + " for " +
                user.attackPower + " damage.\n" + defender.name +
                " attacked you back for " + defender.counterAttackPower +
                " damage.")

            user.attackPower += originalUserAttackPower;
        }
    }
}


$(document).ready(function() {

    // Start game when a character image is clicked
    $(".star-wars-image").click(function() {

        charactersClicked++;

        if(charactersClicked == 1) {
            firstCharacter = this.parentElement;
        }

        if(charactersClicked == 2) {
            secondCharacter = this.parentElement;
        }

        if(charactersClicked == 3) {
            thirdCharacter = this.parentElement;
        }

        if(charactersClicked == 4) {
            fourthCharacter = this.parentElement;
        }

        // first character clicked is the user
        if(charactersClicked === 1) {
        
            setUser(this.parentElement);
        }

        else if(charactersClicked === 2) {
            setDefender(this.parentElement);
        }
    });

    $("#attack-button").click(function() {
        
        if(!gameOver) {

            // have we gotten both user and defender?
            if(charactersClicked >= 2) {
                activeBattle = true;
                doBattle(currentDefender);

                if(!gameOver && !activeBattle) {

                    // reset charactersClicked to 1 get next defender 
                    charactersClicked = 1;                
                }
            }
        }
    })

    $("#reset-button").click(function() {

        if(gameOver) {
            reset();
        }
    })
});