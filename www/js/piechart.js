var PieChart = function(game,x,y,radius,val1,val2) {
    this.x = x; // x position of center of circle
    this.y = y; // y position of center of circle
    this.radius = radius;
    this.values = [val1,val2]; // array of values, will be normalized to sum to 1.0
    
    this.chart = game.add.graphics(0,0);
    
    var sum = this.values.reduce( (prev, curr) => prev + curr );
    this.normValues = this.values.map( val => val/sum );
};


PieChart.prototype.draw = function() {
    this.chart.clear();
    this.chart.lineStyle(4, 0x2d2d2d);
    this.chart.beginFill(0x00f3f3);
    this.chart.drawCircle(this.x,this.y,2*this.radius);
    
    this.chart.beginFill(0xf30000);
    var startAngle = 0;
    var endAngle = startAngle + this.normValues[1]*2*Math.PI;
    this.chart.arc(this.x,this.y,this.radius,startAngle,endAngle,true);
    
    this.chart.endFill();
};