"use strict";

function Hangman(user_id) {
    this.user_id = user_id;
    this.result = false;
    this.attempts_made = 0;
    this.attempts_left = 5;
    this.answer = null;
    //TODO: figure out a better way to initialize messages
    this.messages = {
        "correct": "Your guess was correct. Good going!!",
        "invalid": "Please guess between A-Z",
        "lost": "You lost :-(",
        "try_other": "Repeated character. Try again.",
        "won": "Bravo! You won!",
        "wrong": "Your guess was wrong. Please try again."
    };
}

Hangman.prototype = {
    init: function () {
        var self = this;
        self.attachHandlers();
    },
    attachHandlers: function () {
        var self = this;
        $(document).ready(function () {
            self.createGame();
        });
    },
    createGame: function () {
        var self = this;
        /*$.ajax({
           url: "http://hangman.coursera.org/hangman/game/?callback=processData",
           data: {
                email : self.user_id
           },
           crossDomain: true,
           type: "GET",
           success: function(data) {
            console.log(data);
           }
        });*/

        /*$.ajax({
            url: "http://hangman.coursera.org/hangman/game/?callback=processData",
            type: "POST",
            crossDomain: true,
            data: {email: 'abcd@gmail.com'},
            dataType: "json",
            success: function (result) {
                console.log(result);
            },
            error: function (xhr, status, error) {
                console.log(status);
            }
        });*/
        self.answer = 'MEENAKSHI';
        self.processData("____A_S_I");
    },
    processData: function (str) {
        var self = this,
            str_length = str.length;
        self.buildBlocks(str, str_length);
    },
    buildBlocks: function (str, length) {
        var self = this,
            valid_char = $("<span class = 'valid_char'></span>"),
            input_field_box = $("#input_fields");
        for (var i = 0; i < length; i++) {
            //TODO: remove hard-coding
            input_field_box.append(valid_char.clone().text(str[i]));
        }
        self.single_char = $(".single_char");
        self.single_char.change(self.checkInput.bind(self));
        self.attempts_left_txt = $(".attempts_left .number");
        self.attempts_left_txt.text(self.attempts_left);
    },
    checkInput: function (e) {
        var self = this,
            target = $(e.target),
            val = target.val(),
            code,
            blank_spots,
            last_try = $(".last_try"),
            position = self.answer && self.answer.indexOf(val);
        
        last_try.prepend("<span class='valid_char'>" + val + "</span>");
        //TODO: check the input validity over here. Make the AJAX call here
        if (position > -1) {
            if ($(".valid_char:eq(" + position + ")").text() === val) {
                self.insertMessage("try_other");
            } else {
                //replace _ with the guess
                for (var i = 0; i < self.answer.length; i++) {
                    if (self.answer[i] === val)
                        $(".valid_char:eq(" + i + ")").text(val);
                }
                
                //empty the guess
                self.single_char.val("").removeClass("red");
                self.insertMessage("correct");
                blank_spots = $(".valid_char:contains('_')");
                if (blank_spots && blank_spots.length === 0) {
                    self.result = true;
                    self.checkGameStatus();
                }                
            }
        } else {
            code = val.charCodeAt(0);
            if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
                self.insertMessage("wrong");
            } else {
                self.insertMessage("invalid");
            }
            self.attempts_left--;
            self.attempts_left_txt.text(self.attempts_left);
            self.single_char.addClass("red");
        }
        if(self.attempts_left === 0) {
            //TODO: show correct value instead of _ when the user failed to guess the answer
            self.checkGameStatus();
        }
    },
    insertMessage: function (status) {
        var self = this,
            message = $("<li class='message'></li>"),
            message_board = $(".messages"),
            display_message = self.messages[status];
        message_board.prepend(message.clone().text(display_message).addClass(status));
    },
    checkGameStatus: function () {
        var self = this;
        self.single_char.val("").attr("disabled", "disabled").removeClass("red");
        if (self.result) {
            self.insertMessage("won");
        } else {
            self.insertMessage("lost");
        }
    }
};

var game = new Hangman('abcd');
game.init();