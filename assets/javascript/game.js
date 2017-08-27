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
var charactersLoaded = false;
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
function gameReset() {
    $("#message").html("Choose your character by clicking on an image.");

    $("#user-name").html("&nbsp;");
    $("#user-image").attr("src", "assets/images/black.jpg");
    $("#user-image").css("border", "none");
    $("#user-hp").html("&nbsp;");

    $("#defender-name").html("&nbsp;");
    $("#defender-image").attr("src", "assets/images/black.jpg");
    $("#defender-image").css("border", "none");
    $("#defender-hp").html("&nbsp;");

    $("#c1-container").html(firstCharacter);
    $("#c2-container").html(secondCharacter);
    $("#c3-container").html(thirdCharacter);
    $("#c4-container").html(fourthCharacter);

    charactersClicked = 0;
    enemiesDefeated = 0;
    activeBattle = false;
    gameOver = false;

    user.name = "";
    user.healthPoints = 0;
    user.attackPower = 0;
    user.counterAttackPower = 0;

    defender.name = "";
    defender.healthPoints = 0;
    defender.attackPower = 0;
    defender.counterAttackPower = 0;

    $("#gameReset-button").remove();
}

function removeCharacterFromGroup(character)
{
    $(character).remove();
}

function moveCharacterToUserArea(character) {

    $("#user-name").html(character.children[0].innerHTML);
    $("#user-image").attr("src", character.children[1].attributes[2].value);
    $("#user-hp").html(character.children[2].innerHTML);
    $("#user-image").css("border", "1px solid #777777");
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
    $("#defender-image").css("border", "1px solid #777777");   
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
    $("#defender-image").css("border", "none");
    $("#defender-hp").html("&nbsp;");
    $("#defender-image").css("border", "none");
}


function doBattle() {

    defender.healthPoints -= user.attackPower;
    $("#defender-hp").html(defender.healthPoints);

    // if defender is defeated
    if(defender.healthPoints <= 0) {

        removeDefender();
        activeBattle = false;
        enemiesDefeated++;
        
        if(enemiesDefeated < 3) {

            $("#message").html("<p>You have defeated <b>" + defender.name +
                "</b>.</p><p>You may choose to fight another character.</p>");
        }

        // if all 4 characters have been clicked...WINNER!!!
        else {
            $("#message").html("<b>You won!  GAME OVER!!!</b>");
            gameOver = true;
            $("#reset-button").css("display", "block");
        }
    }

    else {

        user.healthPoints -= defender.counterAttackPower;
        $("#user-hp").html(user.healthPoints);

        if(user.healthPoints <= 0) {

            $("#message").html("You have been defeated.  <b>Game Over</b>.");
            gameOver = true;
            $("#reset-button").css("display", "block");
        }

        else {

            $("#message").html("<p>You attacked <b>" + defender.name +
                                "</b> for <b>" +
                user.attackPower + "</b> damage.</p><p><b>" + defender.name +
                "</b> attacked you back for <b>" + defender.counterAttackPower +
                " damage.</p>")

            user.attackPower += originalUserAttackPower;
        }
    }
}

function loadAllCharacters(character) {

    firstCharacter = $(character.parentElement.parentElement.children[0].children[0]);
    secondCharacter = $(character.parentElement.parentElement.children[1].children[0]);
    thirdCharacter = $(character.parentElement.parentElement.children[2].children[0]);
    fourthCharacter = $(character.parentElement.parentElement.children[3].children[0]);
}

$(document).ready(function() {

    // Start game when a character image is clicked
    $("#image-row").on("click", ".star-wars-image", function() {
        
        if(!charactersLoaded) {

        loadAllCharacters(this.parentElement);

            // Make sure we only do this once.
            charactersLoaded = true;
        }

        charactersClicked++;
        
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
                doBattle();

                if(!gameOver && !activeBattle) {

                    // reset charactersClicked to 1 get next defender 
                    charactersClicked = 1;                
                }
            }
        }
    })

    $("#reset-button").click(function() {

        if(gameOver) {
            gameReset();
        }
    })
});