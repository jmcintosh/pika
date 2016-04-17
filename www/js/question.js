/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var Question = function(game,question,answers){
    this.game = game;
    this.question = question;
    this.answers = answers;
    
};

Question.prototype.draw = function(position,height,width){
    // ask the question
    this.game.add.text();
    
    // add buttons
    
    // define button behavior
};