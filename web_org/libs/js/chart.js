var Chart = function(){
    this.width   = 600;
    this.height  = 400;
    this.series  = [];
    this.dom     = null;
    this.ctx     = null;
    this.sum     = [];
    this.isDonut = false;
    this.title   = {
        name : '',
        x    : 5,
        y    : 30
    };
    this.legend  = {
        enable  : true,
        offsetX : 0,
        offsetY : 0
    };
    this.border  = {
        enable : false
    };
    this.circle  = {
        cx     : 0,
        cy     : 0,
        radius : 0
    };
    this.bar = {
        width : 0,
        amount: 0
    };
}
/*
    初始化配置数据
 */
Chart.prototype.initPieSettings =  function (dom, config) {
    this.dom        = dom;
    this.width      = config.width;
    this.height     = config.height;
    this.series     = config.series;
    this.isDonut    = config.isDonut;
    if(config.title !== undefined){
        this.title.name = config.title;
    }else{
        this.title.x = this.title.y = 0;
        radiusPercent = 0.8;
    }
    if(config.border != undefined) {
        this.border.enable = config.border.enable;          
    }
    if(config.legend !=   undefined) {
        this.legend.enable = config.legend.enable;          
    }
    /*
        设置圆的半径、中心坐标、图例的水平偏移
     */
    var radiusPercent  = 0.9;
    this.circle.radius = Math.min(this.width/2, this.height/2) * radiusPercent;
    this.circle.cx     = this.width * 0.02 + this.circle.radius;
    this.circle.cy     = this.height * 0.5;
    this.radius        = this.circle.radius;
    this.circle.r      = this.circle.radius / (this.series.length * 2 +1);
    this.legend.offsetX= this.circle.cx + this.circle.radius + 10;
    this.legend.offsetY= this.title.y;
    this.title.x       = this.circle.cx + this.circle.radius + 19;
};
/*
    画饼图
 */
Chart.prototype.renderPie = function(dom, config) {
    this.initPieSettings(dom, config);
    /*
        初始化canvas画布,初始化画图环境对象
     */
    this.initCanvas();
    /*
        判断是否需要显示边框
     */
    if(this.border.enable){
        /*
            画边框
         */
        this.drawBorder();
    }
    /*
        如果半径小于1，提示错误,并返回
     */
    if(this.circle.radius <= 0) {
        /*
            显示错误信息
         */
        this.renderError();
        return;
    }
    /*
        画标题
     */
    //if(this.title.name){
        this.drawTitle();
    //}
    /*
        画饼图
     */
    this.drawPies();
    /*
        画图例
     */
    if(this.legend.enable){
        this.drawLegend();
    }
};
/*
    画柱状图
 */
Chart.prototype.renderBar = function(dom, config){
    this.initBarSettings(dom, config);
    /*
        初始化canvas画布,初始化画图环境对象
     */
    this.initCanvas();
    /*
        判断是否需要显示边框
     */
    if(this.border.enable){
        /*
            画边框
         */
        this.drawBorder();
    }
    this.drawBar();
};
Chart.prototype.initBarSettings = function(dom, config){
    this.dom = dom;
    this.width = config.width;
    this.height = config.height;
    this.series = config.series.data;
    this.bar.amount = config.series.amount;
    this.bar.width  = /*this.width/(3 * this.series.length + 1);*/ 30 // 柱状图宽度
    if(config.border != undefined) {
        this.border.enable = config.border.enable;          
    }
    if(config.legend !=   undefined) {
        this.legend.enable = config.legend.enable;          
    }
};
Chart.prototype.drawBar = function(){
    var ctx = this.ctx;
    var series = this.series;
    var width = this.bar.width;
    var amount = this.bar.amount;
    var canvaswidth = this.width;
    var canvasHeight = this.height;
    var titleHeight = 10;
    var barHeight = canvasHeight - titleHeight-18;
    //this.drawLine(width/2, 3, width/2, barHeight);
    /* 柱状图底边线 */
    this.drawLine(0, barHeight, canvaswidth, barHeight);
    series.forEach(function(seriesData, index){
        var value = seriesData["value"],
            title = seriesData["name"],
            color = seriesData["color"],
            bgcolor = seriesData["bgcolor"];
        var x = ((canvaswidth-(series.length*30))/(series.length+1))*(Number(index)+1)+Number(index)*30 -15/*width * (3 * index + 1)*/;
        
        var y = barHeight * (1 - value/amount);
        var rectwidth = 2 * width;
        var rectHeight = barHeight - y;
        ctx.save();
         /* 柱状图灰色背景 */
        ctx.fillStyle = bgcolor;
        ctx.beginPath();
        ctx.rect(x, 20, rectwidth, barHeight-20);
        ctx.closePath();
        ctx.fill();
        /* 柱状图 */
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(x, y, rectwidth, rectHeight);
        ctx.closePath();
        ctx.fill();
       
        ctx.restore();
        
        ctx.font="16px '微软雅黑',Georgia";
        ctx.fillText(title, (index == '2'?x + width/2 -20:x + width/2), canvasHeight-4);
        ctx.fillText(Math.round(value/amount * 100) + '%', x + width/2, 14);
    });
};
Chart.prototype.drawLine = function(sx, sy, ex, ey){
    var ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = '#d3d5d4';
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    ctx.restore();
}
/*
    初始化一个canvas画布
 */
Chart.prototype.initCanvas = function(){
    var canvas    = document.createElement('canvas');
    canvas.width  = this.width;
    canvas.height = this.height;
    this.ctx      = canvas.getContext("2d");
    this.dom.appendChild(canvas);
};
/*
    画标题
 */
Chart.prototype.drawTitle = function(){
    var ctx  = this.ctx;
    ctx.save();
    ctx.font = '18px Calibri';
    ctx.fillText(this.title.name, this.title.x, this.title.y);
    ctx.restore();
};
/*
    画边框
 */
Chart.prototype.drawBorder = function() {
    var ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle="black";
    ctx.strokeRect(0, 0, this.width, this.height);
    ctx.restore();
};
Chart.prototype.drawPies = function(){
    var This   = this;
    this.initSum();
    var series = this.series;
    var sum    = this.sum;
    series.forEach(function(serieData, index){
        var s = sum[index]
        var deltaArc = 0;
        serieData.forEach(function(data, index){
            var perArc = data.value / s * 2;
            This.drawArc(
                This.circle.cx, 
                This.circle.cy, 
                This.circle.radius, 
                deltaArc, 
                deltaArc+perArc, 
                data.color
            );
            deltaArc += perArc;
        });
        This.circle.radius -= This.circle.r;
        if(series.length == 1){
            if(This.isDonut){
                This.drawWhitePie();
            }
        }else{
//          if(series.length-1 != index){
                This.drawWhitePie();
//          }
        }
    });
};
Chart.prototype.drawWhitePie = function(){
    this.drawArc(
            this.circle.cx, 
            this.circle.cy, 
            this.circle.radius, 
            0, 
            2, 
            'white'
    );
    this.circle.radius -= this.circle.r * 0.3;
};
Chart.prototype.initSum = function(){
    var series = this.series;
    series.forEach(function(serieData){
        var sum  = 0;
        serieData.forEach(function(data){
            sum += data.value;
        });
        this.sum.push(sum);
    }.bind(this));
};
/**
 * 画扇形
 * @author JeremyZhang
 * @date   2016-12-14
 * @param  {[type]}   cx     [description]
 * @param  {[type]}   cy     [description]
 * @param  {[type]}   radius [description]
 * @param  {[type]}   sAngle [description]
 * @param  {[type]}   eAngle [description]
 * @param  {[type]}   color  [description]
 * @return {[type]}          [description]
 */
Chart.prototype.drawArc = function(cx, cy, radius, sAngle, eAngle, color){
    var ctx = this.ctx;
    var PI  = Math.PI;
    var cx     = cx+0.5 || 0,
        cy     = cy+0.5 || 0,
        radius = radius || 10,
        sAngle = sAngle || 0,
        eAngle = eAngle || 2,
        color  = color || 'black';
    var sCoord = this.computeCoord(cx, cy, radius, sAngle);
    var eCoord = this.computeCoord(cx, cy, radius, eAngle);
    ctx.beginPath();
    ctx.arc(cx, cy, radius, sAngle * PI, eAngle * PI);
    /*
     * 打开该方法 导致IE11 下产生写轮眼
     */
     
//  if(window.devicePixelRatio){
//  	 ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
//  }
   
    ctx.moveTo(cx, cy);
    ctx.lineTo(sCoord.x, sCoord.y);
    ctx.lineTo(eCoord.x, eCoord.y);
    ctx.lineTo(cx, cy);
    ctx.closePath();
    
    ctx.fillStyle = color;
    ctx.fill();
//  ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
//  ctx.globalCompositeOperation="source-atop";
};
Chart.prototype.computeCoord = function(x, y, len, angle){
    var PI       = Math.PI;
    var computeX = x + len * Math.cos(PI * angle);
    var computeY = y + len * Math.sin(PI * angle);
    return {
        x : computeX,
        y : computeY
    }
};
/*
    画图例
 */
Chart.prototype.drawLegend = function() {
    var This = this;
    var sum = this.sum;
    var ctx = this.ctx;
    var series = this.series;
    ctx.save();
    var _offsetX = this.legend.offsetX ;
    var _offsetY = this.legend.offsetY + 3;
    var pos = (This.width/2 > (This.radius+50)) ? 50 : (This.circle.cx - This.radius);
    series.forEach(function(seriesData, index){
        var nums = seriesData.length;
        ctx.font = '8pt Calibri';
        for(var i=0; i<nums; i++) {
            if(seriesData[i].legend !== false){
                var x = This.computeByte(seriesData[i].value/8);
                var tipStr =  seriesData[i].name + ": " + x;
                seriesData[i].precent = tipStr;
                ctx.fillStyle = seriesData[i].color;
                ctx.fillRect(pos - 40 + _offsetX,  _offsetY + 10, 10, 10);
                ctx.fillStyle = "black";
                ctx.fillText(tipStr, pos - 25 + _offsetX, _offsetY + 20);
                _offsetY += 20;
            }
        }  
        _offsetY += 3;
    })
    ctx.restore();     
};
Chart.prototype.computeByte = function(byte){
    byte = parseInt(byte);
    var units = ['B', 'KB', 'MB', 'GB', 'TB'];
    var index = 0;
    while(byte >= 1024){
        byte /= 1024;
        index++;
    }
    byte = Math.round(byte * 100)/100;
    byte = byte.toString()
    return byte + units[index] + '/s';
}
Chart.prototype.renderError = function(){
    var warningStr = 'error';
    var ctx = this.ctx;
    ctx.save();
    ctx.strokeText(warningStr);
    ctx.restore();
};
