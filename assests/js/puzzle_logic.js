var prev_id = '';
var curr_id = '';
var marbleLeft = 32;
var score = 0;
var marbleArr = [];
//window.onload = function () {
//
//    },
startNewGame = function () {
        var ruleDiv = document.getElementById("ruleDiv");
        var btn = document.getElementById("btn1");
        ruleDiv.style.display = 'none';
        btn.style.display = 'none';
        createScoreBoard();
        createPuzzle();

    },
    createScoreBoard = function () {
        var body = document.getElementsByTagName("body")[0];
        var scoreCard1 = document.createElement("p");
        var scoreCard2 = document.createElement("p");
        body.appendChild(scoreCard1);
        body.appendChild(scoreCard2);
        scoreCard1.setAttribute("id", "scoreCard1");
        scoreCard2.setAttribute("id", "scoreCard2");
        scoreCard1.innerHTML = "Your Score is " + score;
        scoreCard2.innerHTML = "Marbles left " + marbleLeft;
    },

    createPuzzle = function () {
        var grid = document.createElement("table");
        grid.className = "table1";
        var gridBody = document.createElement("tbody");
        var body = document.getElementsByTagName("body")[0];
        for (var i = 0; i < 7; i++) {
            var row = document.createElement("tr");
            row.className = "row";
            for (var j = 0; j < 7; j++) {
                var cell = document.createElement("td");
                if ((i == 0 || i == 1 || i == 5 || i == 6) && (j == 0 || j == 1 || j == 5 || j == 6)) {
                    cell.className = "staticCell";
                    cell.setAttribute("id", i + "id" + j);
                    //var cellText = document.createTextNode("00");
                } else if (i === 3 && j === 3) {
                    cell.className = "emptyCell";
                    cell.setAttribute("id", i + "id" + j);
                    //var cellText = document.createTextNode("--");
                } else {
                    cell.className = "movingCell";
                    cell.setAttribute("id", i + "id" + j);
                    var id = i + "id" + j;
                    marbleArr.push(id);
                    //var cellText = document.createTextNode("11");
                }
                cell.addEventListener('click', onSwap, false);
                row.appendChild(cell);
            }
            gridBody.appendChild(row);
            grid.appendChild(gridBody);
            body.appendChild(grid);
        }
    },
    onSwap = function () {
        var curr_id = this.id;
        if (isCellValid(curr_id) == 0) {
            swal("Oops!", "You Clicked On inValid Block", "error");
        }
        if (prev_id === "") {
            prev_id = curr_id;
            onClickFirstCell(prev_id);
        } else if (prev_id === curr_id) {
            swal("Oops!", "You clicked on Same cell Twice !!", "error");
            document.getElementById(prev_id).className = "movingCell";
            prev_id = curr_id = "";
        } else {
            if (isCellValid(prev_id) == 3 && isCellValid(curr_id) == 2 && isClickPairValid(prev_id, curr_id)) {
                var prevX = parseInt(prev_id.split("id")[0]);
                var prevY = parseInt(prev_id.split("id")[1]);
                var currX = parseInt(curr_id.split("id")[0]);
                var currY = parseInt(curr_id.split("id")[1]);
                var newId;
                document.getElementById(prev_id).className = "emptyCell";
                document.getElementById(curr_id).className = "movingCell";
                if (prevY < currY) {
                    newId = document.getElementById(prev_id).nextElementSibling.getAttribute("id");
                    if (isCellValid(newId) !== 1) {
                        swal("Oops!", "You Clicked On inValid Block", "error");
                    } else {
                        document.getElementById(newId).className = "emptyCell";
                    }
                } else if (prevY > currY) {
                    newId = document.getElementById(prev_id).previousElementSibling.getAttribute("id");
                    if (isCellValid(newId) !== 1) {
                        swal("Oops!", "You Clicked On inValid Block", "error");
                    } else {
                        document.getElementById(newId).className = "emptyCell";
                    }
                } else if (prevX > currX) {
                    newId = (prevX - 1) + "id" + prevY;
                    if (isCellValid(newId) != 1) {
                        swal("Oops!", "You Clicked On inValid Block", "error");
                    } else {
                        document.getElementById(newId).className = "emptyCell";
                    }
                } else {
                    newId = (prevX + 1) + "id" + prevY;
                    if (isCellValid(newId) != 1) {
                        swal("Oops!", "You Clicked On inValid Block", "error");
                    } else {
                        document.getElementById(newId).className = "emptyCell";
                    }
                }
                score = updateScore();
                removeMarble(marbleArr, prev_id);
                removeMarble(marbleArr, newId);
                addMarble(marbleArr, curr_id);
                prev_id = curr_id = "";
                var movesPossible = checkMovesLeft(marbleArr);
                if (movesPossible === 0) {
                    swal("Well Played! Score is " + score, "GAME OVER", "success")
                }
            } else {
                swal("Oops!", "You Clicked On inValid Block", "error");
                var css = document.getElementById(prev_id).className;
                if (css === "selectedMovingCell")
                    document.getElementById(prev_id).className = "movingCell";
                else if (css === "selectedEmptyCell") {
                    document.getElementById(prev_id).className = "emptyCell";
                }
                curr_id = prev_id = "";
            }
        }

    },
    updateScore = function () {
        marbleLeft--;
        var score = 32 - marbleLeft;
        document.getElementById("scoreCard1").innerHTML = "Your Score is " + score;
        document.getElementById("scoreCard2").innerHTML = "Marbles left " + marbleLeft;
        return score;
        //return marbleLeft;
    },
    getNeighboursLevel2 = function (id) {
        var left = (document.getElementById(id).previousElementSibling !== null && document.getElementById(id).previousElementSibling.previousElementSibling !== null) ? document.getElementById(id).previousElementSibling.previousElementSibling.getAttribute("id") : -1;
    
        var right = (document.getElementById(id).nextElementSibling !== null &&
            document.getElementById(id).nextElementSibling.nextElementSibling !== null) ? document.getElementById(id).nextElementSibling.nextElementSibling.getAttribute("id") : -1;
    
        var arr = id.split("id");
        var topX = parseInt(arr[0]) - 2;
        var topY = parseInt(arr[1]);
        var downX = parseInt(arr[0]) + 2;
        var downY = parseInt(arr[1]);
        var top, down;
        if (topX < 0) {
            top = -1;
        } else {
            top = topX + "id" + topY;
        }
        if (downX > 6) {
            down = -1;
        } else {
            down = downX + "id" + downY;
        }
        //    console.log("Top - >" + top);
        //    console.log("Down - > " + down);
        //    console.log("Left - > " + left);
        //    console.log("Right - >" + right);
        return [top, down, left, right];
    },
    getNeighboursLevel1 = function (id) {
        var left = (document.getElementById(id).previousElementSibling !== null) ? document.getElementById(id).previousElementSibling.getAttribute("id") : -1;
    
        var right = (document.getElementById(id).nextElementSibling !== null) ? document.getElementById(id).nextElementSibling.getAttribute("id") : -1;
    
        var arr = id.split("id");
        var topX = parseInt(arr[0]) - 1;
        var topY = parseInt(arr[1]);
        var downX = parseInt(arr[0]) + 1;
        var downY = parseInt(arr[1]);
        var top, down;
        if (topX < 0) {
            top = -1;
        } else {
            top = topX + "id" + topY;
        }
        if (downX > 6) {
            down = -1;
        } else {
            down = downX + "id" + downY;
        }
        //    console.log("Top - >" + top);
        //    console.log("Down - > " + down);
        //    console.log("Left - > " + left);
        //    console.log("Right - >" + right);
        return [top, down, left, right];
    },
    isCellValid = function (id) {
        var x = parseInt(id.split("id")[0]);
        var y = parseInt(id.split("id")[1]);
        var css = document.getElementById(id).className;
        if (css === "staticCell") { // cell is blocled Cell == RED
            return 0;
        } else if (css === "movingCell") { //cell is moving Cell === Green
            return 1;
        } else if (css === "emptyCell") { //cell is Empty Cell === White
            return 2;
        } else if (css === "selectedMovingCell") { //cell is selected moving Cell === Green
            return 3;
        } else if (css === "selectedEmptyCell") { //cell is selected Empty Cell === White
            return 4;
        }

    },
    isClickPairValid = function (prev, curr) {
        var prevX = parseInt(prev.split("id")[0]);
        var prevY = parseInt(prev.split("id")[1]);
        var currX = parseInt(curr.split("id")[0]);
        var currY = parseInt(curr.split("id")[1]);
        if (((prevX === currX) && (Math.abs(prevY - currY) == 2)) || ((prevY === currY) && (Math.abs(prevX - currX) == 2)))
            return 1;
        else
            return 0;
    },
    onClickFirstCell = function (id) {
        var css = document.getElementById(id).className;
        if (css === "movingCell")
            document.getElementById(id).className = "selectedMovingCell";
        else if (css === "selectedEmptyCell") {
            document.getElementById(id).className = "selectedEmptyCell";
        }
    },
    checkMovesLeft = function () {
        var length = marbleArr.length;
        var moves = 0;
        var i, j;
        for (i = 0; i < length; i++) {
            var neighbours1 = getNeighboursLevel1(marbleArr[i]);
            var neighbours2 = getNeighboursLevel2(marbleArr[i]);
            for (j = 0; j < 4; j++) {
                if (neighbours1[j] !== -1 && neighbours2[j] !== -1) {
                    var css1 = document.getElementById(neighbours1[j]).className;
                    var css2 = document.getElementById(neighbours2[j]).className;
                    if (css1 === "movingCell" && css2 === "emptyCell") {
                        moves++;
                    }
                }
            }

        }
        console.log(moves);
        return moves;
    },
    removeMarble = function (marbleArr, id) {
        var index = marbleArr.indexOf(id);
        if (index !== -1) {
            marbleArr.splice(index, 1);
        }
    },
    addMarble = function (marbleArr, id) {
        var index = marbleArr.indexOf(id);
        if (index === -1) {
            marbleArr.push(id);
        }
    }