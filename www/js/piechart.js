"use strict";
var colors = ['red','green','yellow'];

var PieChart = function(game,x,y,radius,data) {
    this.x = x; // x position of center of circle
    this.y = y; // y position of center of circle
    this.radius = radius;
    this.dim = radius * 2.2; // the dimensions of the drawing spacing
    this.center = this.dim /2;
    // setup canvas to draw the pie chart
    this.chart = game.make.bitmapData(this.dim*2.5,this.dim);
    this.chart.addToWorld(this.x,this.y,0.5,0.5,1,1);
    
    this.items = data.map( d => d.item );
    this.values = data.map( d => d.count );
    
    var sum = this.values.reduce( (prev, curr) => prev + curr );
    this.normValues = this.values.map( val => val/sum );
};


PieChart.prototype.draw = function() {
    this.chart.cls();
    var ctx = this.chart.context;
    ctx.lineWidth = 3;
    ctx.strokeStyle = "black";
//    ctx.shadowBlur = 3;
//    ctx.shadowOffsetY = 2;
//    ctx.shadowOffsetX = 2;
//    ctx.shadowColor = "black";
    var startAngle = -0.5*Math.PI;
    var squareMargin = 10;
    var squareDim = (this.radius/3)-squareMargin;
    ctx.font = squareDim + "px Helvetica";
    var squareX = 2.5*this.radius;
    var squareY = 0.1*this.radius;
    for(var i = 0, n = this.normValues.length; i < n; i++){
        
        var angle = this.normValues[i]*2*Math.PI;
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
        //ctx.fill();
        //ctx.stroke();
        
        startAngle = toAngle;
        
        // add label
        ctx.rect(squareX,squareY,squareDim,squareDim);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle = "white";
        
        ctx.shadowBlur = 3;
        ctx.shadowOffsetY = 2;
        ctx.shadowOffsetX = 2;
        ctx.shadowColor = "black";
        ctx.fillText(this.items[i], squareX + squareDim + squareMargin, squareY+squareDim-ctx.lineWidth);
        ctx.shadowBlur = null;
        ctx.shadowOffsetY = null;
        ctx.shadowOffsetX = null;
        ctx.shadowColor = null;
        squareY += squareDim + squareMargin;
    }
    
    
};