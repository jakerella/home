(function($) {
    'use strict';

    var saveStatesKey = 'conwayStartingStates';
    var INTERVAL = 1;  // in seconds
    var dayCounter = 0;
    var gameLoopHandle = null;
    var cells = [];
    var size = {
        rows: 30,
        cols: 30
    };


    createWorld(size.rows, size.cols);
    displaySavedStates();
    addControls();

    function aDayInTheLife() {
        var i, l,
            state = [];

        // A "neighbor" is any adjacent cell, including diagonals (so most cells have 8 neighbors)
        // Any live cell with < 2 live neighbors dies
        // Any live cell with 2 || 3 live neighbors lives
        // Any live cell with > 3 live neighbors dies
        // Any dead cell with exactly 3 live neighbors becomes a live cell

        // Clone the state to use during alive/dead detection, otherwise as we
        // alter the cells we'll change what the next iteration uses as its state
        for (i=0, l=cells.length; i<l; i++) {
            state.push(cells[i].slice());
        }

        $('.departed').removeClass('departed');
        $('.game .alive')
            .removeClass('new')
            .forEach(function processCell(elem) {
                checkLiveCell(elem, state);
            });
    }

    function checkLiveCell(elem, state) {
        var loc = getElementCell(elem);
        var count = getNeighborCount(loc, state);
        if (count < 2 || count > 3) {
            // lonely or overpopulated cells die
            cells[loc.row][loc.col] = 0;
            $(elem).removeClass('alive').addClass('departed');
        }

        neighborLoop(loc, state, function(cell, neighborLoc) {
            if (cell === 0 && getNeighborCount(neighborLoc, state) === 3) {
                    // adequately surrounded dead cells spring to life
                cells[neighborLoc.row][neighborLoc.col] = 1;
                $('[data-loc="' + neighborLoc.row + '-' + neighborLoc.col + '"]')
                    .addClass('alive')
                    .addClass('new');
            }
        });
    }

    function getNeighborCount(loc, state) {
        var neighborCount = 0;
        neighborLoop(loc, state, function(cell) {
            if (cell === 1) {
                neighborCount++;
            }
        });
        return neighborCount;
    }

    function neighborLoop(loc, state, cb) {
        var i, j;

        for (i=-1; i<2; i++) {
            for (j=-1; j<2; j++) {
                if (i === 0 && j === 0) {
                    continue;
                } else if (typeof(state[loc.row + i] && state[loc.row + i][loc.col + j]) === 'number') {
                    cb(state[loc.row + i][loc.col + j], { row: (loc.row + i), col: (loc.col + j) });
                }
            }
        }
    }


    function createWorld(rows, cols) {
        var i, j;
        var html = [];

        for (i=0; i<rows; i++) {
            html.push('<tr>');
            cells.push([]);
            for (j=0; j<cols; j++) {
                html.push('<td data-loc="' + i + '-' + j + '"></td>');
                cells[i].push(0);
            }
            html.push('</tr>');
        }

        $('.game tbody').append(html.join(''));
    }

    function getElementCell(elem) {
        var loc = elem.getAttribute('data-loc').split(/\-/);
        return {
            col: Number(loc[1]),
            row: Number(loc[0])
        };
    }

    function addControls() {
        $('.start').on('click', startTime);
        $('.stop').on('click', stopTime);
        $('.reset').on('click', function() {
            stopTime();
            resetWorld();
        });
        $('.saved ul').on('click', 'li', function() {
            var index = Number(this.getAttribute('data-index'));
            useSavedState(index);
        });

        $('.game tbody').on('click', 'td', function() {
            if (!gameLoopHandle) {
                $('.game').removeClass('fromSaved');
                $(this).toggleClass('alive');
                var loc = getElementCell(this);
                cells[loc.row][loc.col] = (this.classList.contains('alive')) ? 1 : 0;
            }
        });
    }

    function resetWorld() {
        $('.game td')
            .removeClass('alive')
            .removeClass('departed')
            .removeClass('new');
        dayCounter = 0;
        $('time')[0].innerText = '';

        var i, j;
        cells = [];
        for (i=0; i<size.rows; i++) {
            cells.push([]);
            for (j=0; j<size.cols; j++) {
                cells[i].push(0);
            }
        }
    }

    function stopTime() {
        console.info('Stopping time after %d days', dayCounter);
        window.clearInterval(gameLoopHandle);
        gameLoopHandle = null;
        $('.start')[0].disabled = false;
        $('.stop')[0].disabled = true;
        $('.game').removeClass('running');
        $('.game').removeClass('fromSaved');
    }

    function startTime() {
        console.info('Starting time...');
        $('.game').addClass('running');
        if (dayCounter === 0 && !$('.game')[0].classList.contains('fromSaved')) {
            console.log('Saving start state');
            saveStartState();
        }

        gameLoopHandle = window.setInterval(function() {
            dayCounter++;
            $('time')[0].innerText = 'Day ' + dayCounter;

            aDayInTheLife();

        }, (INTERVAL * 1000));

        $('.start')[0].disabled = true;
        $('.stop')[0].disabled = false;
    }

    function saveStartState() {
        var states = getSavedStates();
        states.unshift(cells);
        if (states.length > 10) {
            states.pop();
        }
        localStorage.setItem(saveStatesKey, JSON.stringify(states));
        displaySavedStates();
    }

    function getSavedStates() {
        var states;
        try {
            states = JSON.parse(localStorage.getItem(saveStatesKey));
        } catch(err) { /* don't care... */ }
        states = (states instanceof Array) ? states : [];
        return states;
    }

    function displaySavedStates() {
        $('.saved ul')[0].innerHTML = '';
        var states = getSavedStates();
        states.forEach(function(state, index) {
            var html = ['<li data-index="' + index + '" style="width: ' + (state[0].length * 5) + 'px;">'];
            var i, j;

            for (i=0; i<state.length; i++) {
                html.push('<div>');
                for (j=0; j<state[i].length; j++) {
                    html.push('<span class="' + ((state[i][j] === 1) ? 'alive': '' ) + '"></span>');
                }
                html.push('</div>');
            }

            html.push('</li>');

            $('.saved ul').append(html.join(''));
        });
    }

    function useSavedState(index) {
        var states = getSavedStates();

        if (states[index]) {
            stopTime();
            resetWorld();
            cells = states[index];
            $('.game').addClass('fromSaved');
            $('.game td').forEach(function(elem) {
                var loc = getElementCell(elem);
                if (cells[loc.row][loc.col] === 1) {
                    elem.classList.add('alive');
                }
            });
        }
    }


})(window.jkq);
