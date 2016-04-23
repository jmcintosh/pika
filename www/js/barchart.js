/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


"use strict";
var colors = ['red','orange','yellow','green','blue','purple'];



var BarChart = function(game,x,y,data) {
    this.game = game;
    this.x = x; 
    this.y = y; 
    this.radius = radius;
    // setup canvas to draw the pie chart
    this.chart = game.make.bitmapData(this.dim*2.5,this.dim);
    this.chart.addToWorld(this.x,this.y,0.5,0.5,1,1);
    
    var max = Math.NEGATIVE_INFINITY;
    this.items = [];
    this.values = [];
    for(var i = 0; i< data.length; i++){
        this.items[i] = data[i].item;
        var value = data[i].count;
        this.values[i] = value;
        if(value > max){
            max = value;
        }
    }
    
    this.normValues = [];
    for(var i = 0; i < this.values.length;i++){
        this.normValues[i]=this.values[i]/max;
    }
    
    this.tween = 1;
};

PieChart.prototype.destroy = function(){
    this.chart.cls();
};


PieChart.prototype.draw = function() {
    this.chart.cls();
    this.chart.update();
    var ctx = this.chart.context;
    ctx.lineWidth = 3;
    ctx.strokeStyle = "black";
    
    
    var startAngle = -0.5*Math.PI;
    var squareMargin = 10;
    var squareDim = (this.radius/3)-squareMargin;
    ctx.font = squareDim + "px Helvetica";
    var squareX = 2.5*this.radius;
    var squareY = 0.1*this.radius;
    for(var i = 0, n = this.normValues.length; i < n; i++){
        
        var angle = this.normValues[i]*2*Math.PI*this.tween;
        var toAngle = startAngle + angle;
        
        ctx.beginPath();
        if(i===0){
            // draw a circle
            ctx.arc(this.center,this.center,this.radius,0,2*Math.PI);
        }else{
            // draw wedges
            ctx.arc(this.center,this.center,this.radius,startAngle,toAngle);
            startAngle = toAngle;
            ctx.lineTo(this.center,this.center);
            ctx.closePath();
        }
        ctx.fillStyle = colors[i%colors.length];
        
        startAngle = toAngle;
        
        // add labels
        ctx.rect(squareX,squareY,squareDim,squareDim);
        ctx.fill();
        ctx.stroke();
        //  text with shadow
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.shadowBlur = 3;
        ctx.shadowOffsetY = 2;
        ctx.shadowOffsetX = 2;
        ctx.shadowColor = "black";
        ctx.fillText(this.items[i],
            squareX + squareDim + squareMargin,
            squareY+squareDim-ctx.lineWidth
        );
        ctx.shadowBlur = null;
        ctx.shadowOffsetY = null;
        ctx.shadowOffsetX = null;
        ctx.shadowColor = null;
        squareY += squareDim + squareMargin;
    }
    
    
};

PieChart.prototype.animate = function (time) {
    if( time=== undefined){
        time = 500;
    }
    this.tween = 0;
    var t = this.game.add.tween(this).to( {tween: 1}, time, "Linear", true );
    t.onUpdateCallback(this.draw,this);
    setTimeout(this.draw,time+1);
};

PieChart.prototype.fadeIn = function(time){
    //fadeInImage(this.chart, time, this.game);
    this.animate(time);
};

PieChart.prototype.fadeOut = function(time){
    //fadeOutImage(this.chart,time,this.game);
    this.destroy();
};