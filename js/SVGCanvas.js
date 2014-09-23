/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//****** SVGCanvas Object
		
var SVGCanvas = function(interact, width, height, flexiName, analogName, gifName, id, container, selectA, selectB) {
		'use strict';
	this.interact = interact;
	this.flexiName = flexiName;
	this.analogName = analogName;
        this.gifName = gifName;
	this.transformedPoints = [];
	this.rootMatrix;
	this.originalPoints = [];
	this.svg;
	this.id = id;
	this.container = container;	
	this.width = width;
	this.height = height; 
        this.selectA = selectA;
        this.selectB = selectB;
	var svgNS = 'http://www.w3.org/2000/svg',			
		xns="http://www.w3.org/1999/xlink",
		xhtml="http://www.w3.org/1999/xhtml";
        
	this.linearGradient = function(id, x1, y1, offset1, stc1, x2, y2, offset2, stc2) {
            var linearGradient = document.createElementNS(svgNS, "linearGradient");
            linearGradient.setAttribute("id", id);
            linearGradient.setAttribute("x1", x1);            
            linearGradient.setAttribute("y1", y1);
            linearGradient.setAttribute("x2", x2);
            linearGradient.setAttribute("y2", y2);    
            
            var stop1 = document.createElementNS(svgNS, "stop");
            stop1.setAttribute("id", id+'st1');
            stop1.setAttribute("offset", offset1);
            stop1.setAttribute("stop-color", stc1);
            linearGradient.appendChild(stop1);
            
            var stop2 = document.createElementNS(svgNS, "stop");
            stop2.setAttribute("id", id+'st2');
            stop2.setAttribute("offset", offset2);
            stop2.setAttribute("stop-color", stc2);
            linearGradient.appendChild(stop2);            
            
            return linearGradient;
        }
        
	this.polygon = function (points, id, fill, opacity, stroke, width) {
            var shape = document.createElementNS(svgNS,'polygon');
            shape.setAttributeNS(null, "points", points);
            shape.setAttributeNS(null,"id", id);
            shape.setAttributeNS(null,"fill", fill);
            shape.setAttributeNS(null,"fill-opacity", opacity);
            shape.setAttributeNS(null,"stroke", stroke);
            shape.setAttributeNS(null,"stroke-width", width);		
            return shape;
	}
		
	this.polyline = function(points, id, fill, opacity, stroke, width) {
            var shape = document.createElementNS(svgNS, "polyline");
            shape.setAttributeNS(null, "points", points);
            shape.setAttributeNS(null,"id", id);
            shape.setAttributeNS(null,"fill", fill);
            shape.setAttributeNS(null,"fill-opacity", opacity);
            shape.setAttributeNS(null,"stroke", stroke);
            shape.setAttributeNS(null,"stroke-width", width);		
            return shape;
	}
	
	this.circle = function(r, x, y, id, fill, opacity, stroke, width) {
            var shape = document.createElementNS(svgNS, "circle");
            shape.setAttributeNS(null, "cx", x);
            shape.setAttributeNS(null, "cy", y);
            shape.setAttributeNS(null, "r",  r);
            shape.setAttributeNS(null, "fill",fill);
            shape.setAttributeNS(null, "fill-opacity", opacity);	
            shape.setAttributeNS(null,"stroke",stroke);		
            shape.setAttributeNS(null, "stroke-width",width);
            shape.dragX = 0;
            shape.dragY = 0;		
            shape.id = id;
            return shape;
	}
	
	this.rect = function(x, y, width, height, fill, opacity, stroke, swidth, id) {
            var shape = document.createElementNS(svgNS, "rect");
            shape.setAttributeNS(null, "x", x);
            shape.setAttributeNS(null, "y", y);
            shape.setAttributeNS(null, "width",  width);
            shape.setAttributeNS(null, "height", height);
            shape.setAttributeNS(null, "fill",fill);
            shape.setAttributeNS(null, "fill-opacity", opacity);	
            shape.setAttributeNS(null,"stroke",stroke);		
            shape.setAttributeNS(null, "stroke-width",swidth);
            shape.dragX = 0;
            shape.dragY = 0;			
            shape.id = id;

            return shape;
	}
        
	this.path = function(id, trace, opacity, fill, fillRule, stroke, strokeWidth, strokeLineCap, strokeMiterLimit, strokeDashOffset) {
            var shape = document.createElementNS(svgNS, "path");
            shape.setAttributeNS(null, "d", trace);
            shape.setAttributeNS(null, "opacity", opacity);
            shape.setAttributeNS(null, "fill", fill);
            shape.setAttributeNS(null, "fill-rule", fillRule);
            shape.setAttributeNS(null, "stroke", stroke);
            shape.setAttributeNS(null, "stroke-width", strokeWidth);
            shape.setAttributeNS(null, "stroke-linecap", strokeLineCap);
            shape.setAttributeNS(null, "stroke-miterlimit", strokeMiterLimit);
            shape.setAttributeNS(null, "stroke-dashoffset", strokeDashOffset);
            shape.dragX = 0;
            shape.dragY = 0;			
            shape.id = id;            
            return shape;
        }

	this.group = function(id) {
            var group = document.createElementNS(svgNS, 'g');
            group.setAttribute('id',id);
            return group;
	}
		
	this.text = function(id) {
            var text = document.createElementNS(svgNS, 'text');
            text.setAttribute('id',id);
            return text;
	}
	
	this.img = function(id, src, width, height, x, y) {
            var image = document.createElementNS(svgNS, 'image');
            image.setAttribute('id',id);
            image.setAttribute('xlink:href',src);
            image.setAttribute('width',width);
            image.setAttribute('height',height);
            image.setAttribute('x',x);
            image.setAttribute('y',y);            
            return image;
	}
        
        this.image = function(id) {
            var image = document.createElementNS(svgNS, 'image');
            image.setAttribute('id',id);
            return image;
	}
        
	this.foreign = function(id, width, height, x, y) {
            var foreign = document.createElementNS(svgNS, "foreignObject");
            foreign.setAttribute('id',id);
            foreign.setAttributeNS(null,'width',width);
            foreign.setAttributeNS(null,'height',height);
            foreign.setAttributeNS(null,'x', x);
            foreign.setAttributeNS(null,'y', y);
            return foreign;
	}
	
	this.onChangeAction = function(event, clTarget) {
            var target = event.target;
            var id = target.getAttribute('class');
            var group = document.getElementById(id);
            group.setAttribute('data-signal', target.options[target.selectedIndex].value);
            var text = document.getElementById(id+clTarget);
            var selText = target.options[target.selectedIndex].text;
            if  (text) text.textContent = selText;
	}
	
	this.addHtml = function(group, html, width, height, x, y, type, num) {
            var id = group.getAttribute('id');
            var idForeign = '';
            if (num) {
                idForeign = id+'f'+num;
            }
            else {
                idForeign = id+'f';
            }
            var foreign = this.foreign(idForeign,width,height,x,y);
            html.setAttribute('id',id+type);
            html.setAttribute('name',id+type);
            html.setAttribute('class',id);		
            html.setAttribute('xhtml',xhtml);
            foreign.appendChild(html);
            group.appendChild(foreign);
            return foreign;
	}
	
	this.analogBox = function(id, groupRecovered) { 
            var SVGCanvas = this;
            var group;
            if (groupRecovered) {
                group = groupRecovered;
            }
            else {
                id = this.analogName+id;
                group = this.group(id);		
                group.setAttribute('data-signal',0);
                var abox = this.rect(20,20,145,75,"#FFCC99","1","#000000","2",id+'r');
                group.appendChild(abox);
                
                var text = this.text(id+'label');
                text.setAttribute('transform', ['translate(', 28, 35, ')'].join(' '));
                text.textContent = 'seÃ±al';            
                group.appendChild(text);    
                
                var text = this.text(id+'text');
                text.setAttribute('transform', ['translate(', 28, 58, ')'].join(' '));
                text.textContent = 'valor';            
                group.appendChild(text);                
            }
            

            var html = this.selectA.cloneNode(true);
            if (typeof html != "undefined") {
                html.addEventListener('change',function(e) { SVGCanvas.onChangeAction(e,'label') });
                this.addHtml(group, html, 130,20,28,65,'s');
            }	
                            
            this.appendChild(group);
            this.addEvents(group.firstChild);
            return group;
	}
	
	this.digiBox = function(id, groupRecovered) {
            var SVGCanvas = this;
            var group;            
            if (groupRecovered) {
                group = groupRecovered;
            }
            else {
                id = this.digiName + id;
                group = this.group(id);
                group.setAttribute('data-signal-digital',0);
                var digi = this.rect(121,20,21,21,"#ff0000","1","#000000","2",id+'r');
                group.appendChild(digi);
            }
            
            var text = this.text(id+'label');
            text.setAttribute('transform', ['translate(', 100, 16, ')'].join(' '));
            text.textContent = '0';
            text.setAttribute('class','delete'); 
            group.appendChild(text);
            var html = this.selectB.cloneNode(true);
            if (typeof html != "undefined") {
                    html.addEventListener('change',function(e) { SVGCanvas.onChangeAction(e,'label') });			
                    this.addHtml(group, html,100,20,20,20,'s');
            }		
            this.appendChild(group);
            var foreign = document.getElementById(id+'f');
            foreign.setAttribute('transform', ['translate(', 75, -21, ')'].join(' '));
            this.addEvents(group.firstChild);	
            return group;
	}
	
	this.flexyLine = function(id, primaryColor, secundaryColor, groupRecovered) { 
            var SVGCanvas = this;
            var group;                        
            
            if (groupRecovered) {
                group = groupRecovered;
            }
            else {
                id = this.flexiName+id;
                group = this.group(id);
                group.setAttribute('data-signal',0);
                var flex = this.polyline("20, 20, 20,260, 260,260", id+'pl',"none","1",primaryColor, "4");
                flex.setAttributeNS(null,"stroke-linejoin", "round");
                flex.setAttribute('data-primary',primaryColor);
                if (secundaryColor == "") {
                    flex.setAttribute('data-secundary','#C8C8D2');
                }
                else  {
                    flex.setAttribute('data-secundary',secundaryColor);
                }
                flex.angle = 0;
                group.appendChild(flex); 
            }
            var html = this.selectA.cloneNode(true);
            if (typeof html != "undefined") {
                var x=0, y=0;
                html.addEventListener('change',function(e) { SVGCanvas.onChangeAction(e)});
                if (groupRecovered){
                    var point = group.firstChild.points.getItem(0);
                    x= point.x + 5;
                    y = point.y;
                }
                else {
                    x = 25;
                    y = 20;
                }
                this.addHtml(group, html,100,20,x,y,'s');
            }
            this.appendChild(group);
            this.addHandles(group.firstChild, false);
            this.addHandlesEvents(group.firstChild);
            return group;
	}
	
        this.fan = function(id, groupRecovered) {
            var SVGCanvas = this;
            var group;
            
            if (groupRecovered) {
                group = groupRecovered;
            }
            else { 
                id = this.fanName+id;
                group = this.group(id);	            
                group.setAttribute('data-signal',0);   
                
                var fan = document.createElementNS(svgNS, 'use');
                fan.setAttributeNS(xns, 'href', '#molinogradiente');
                fan.setAttribute('id', id+'fan');
                fan.dragX = 0;
                fan.dragY = 0;
                fan.x.baseVal.value = -110;
                fan.y.baseVal.value = -350;
                fan.setAttribute('transform',['scale','(',1.5,')'].join(' '));
                group.appendChild(fan);
            } 
            
            var text = this.text(id+'label');
            text.setAttribute('transform', ['translate(', 70, 40, ')'].join(' '));
            text.textContent = '0'; 
            text.setAttribute('class','delete'); 
            group.appendChild(text);  
            var html = this.selectA.cloneNode(true);
            if (typeof html != "undefined") {
                html.addEventListener('change',function(e) { SVGCanvas.onChangeAction(e,'label') });
                this.addHtml(group, html,100,20,65,25,'s');
            }                        
            this.appendChild(group);
            this.addEvents(group.firstChild);
            return group;            
        }
        
        this.solarPanel = function(id, groupRecovered) {   
            var SVGCanvas = this;
            var group;
            
            if (groupRecovered) {
                group = groupRecovered;
            }
            else { 
                id = this.solarName+id;
                group = this.group(id);	            
                group.setAttribute('data-signal',0);   
                
                var solar = document.createElementNS(svgNS, 'use');
                solar.setAttributeNS(xns, 'href', '#solarpanel');
                solar.setAttribute('id', id+'solar');
                solar.dragX = 0;
                solar.dragY = 0;
                solar.x.baseVal.value = -205;
                solar.y.baseVal.value = -145;                
                group.appendChild(solar);
                var rayos = document.createElementNS(svgNS, 'use');
                rayos.setAttributeNS(xns, 'href', '#rayos');
                rayos.setAttribute('id', id+'rayos');
                rayos.x.baseVal.value = 0;
                rayos.y.baseVal.value = 0;                
                group.appendChild(rayos);                
            } 
            
            var text = this.text(id+'text');
            text.setAttribute('transform', ['translate(', 10, 30, ')'].join(' '));
            text.textContent = '0';
            text.setAttribute('class','delete'); 
            group.appendChild(text);  
            var html = this.selectA.cloneNode(true);
            if (typeof html != "undefined") {
                html.addEventListener('change',function(e) { SVGCanvas.onChangeAction(e,'label') });
                this.addHtml(group, html,100,20,0,20,'s');
            }                        
            this.appendChild(group);
            this.addEvents(group.firstChild);
            return group;            
        }
        
        this.thermometer = function(id, groupRecovered) {  
            var SVGCanvas = this;
            var group;
            
            if (groupRecovered) {
                group = groupRecovered;
            }
            else { 
                id = this.thermometerName+id;
                group = this.group(id);	            
                group.setAttribute('data-signal',0);   
                var thermo = this.path(id+'tm',"M16,30 C18.2091391,30 20,28.2091391 20,26 C20,24.5194342 19.1956017,23.2267458 18,22.5351287 L18,4.00494659 C18,2.89764516 17.1122704,2 16,2 C14.8954305,2 14,2.89702623 14,4.00494659 L14,22.5351287 C12.8043983,23.2267458 12,24.5194342 12,26 C12,28.2091391 13.7908609,30 16,30 Z M16,32 C12.6862913,32 10,29.3137087 10,26 C10,24.2229949 10.7725059,22.6264183 12,21.5277869 L12,4.00552025 C12,1.78708529 13.790861,0 16,0 C18.2046438,0 20,1.7933325 20,4.00552025 L20,21.5277869 C21.2274941,22.6264183 22,24.2229949 22,26 C22,29.3137087 19.3137087,32 16,32 Z M16,32", "1", "#000000")                               
                thermo.setAttribute('transform',['scale','(',3,')'].join(' '));
                thermo.dragX = 0;
                thermo.dragY = 0;                
                group.appendChild(thermo);
                var mercuryOval = this.path(id+'mo',"M16,29 C17.6568543,29 19,27.6568543 19,26 C19,24.3431457 17.6568543,23 16,23 C14.3431457,23 13,24.3431457 13,26 C13,27.6568543 14.3431457,29 16,29 Z M16,29", "1", "#FF0000")                                              
                mercuryOval.setAttribute('transform',['scale','(',3,')'].join(' '));
                group.appendChild(mercuryOval);  
                var mercury = this.path(id+'m',"M16,3 C15.4477153,3 15,3.43945834 15,4.00246167 L15,23.9975383 C15,24.5511826 15.4438648,25 16,25 L16,25 C16.5522847,25 17,24.5605417 17,23.9975383 L17,4.00246167 C17,3.44881738 16.5561352,3 16,3 L16,3 Z M16,3", "1", "#FF0000")                                              
                mercury.setAttribute('transform',['scale','(',3,')'].join(' '));
                group.appendChild(mercury);                  
                var text = this.text(id+'text');
                text.setAttribute('transform', ['translate(', 65, 40, ')'].join(' '));
                text.textContent = 'Grados';
                group.appendChild(text); 
                var gradient = this.linearGradient(id+'g', "0%", "100%", "0%", "#FF0000", "0%", "0%", "0%", "#0000FF")
                group.appendChild(gradient);
            } 
                         
            var html = this.selectA.cloneNode(true);
            if (typeof html != "undefined") {
                html.addEventListener('change',function(e) { SVGCanvas.onChangeAction(e,'text') });
                this.addHtml(group, html,100,20,65,25,'s');
            }                        
            this.appendChild(group);
            this.addEvents(group.firstChild);
            return group;            
        }
        
	this.imageEle = function(id, groupRecovered, src, src2, x, y, width, height, addText) {
            var SVGCanvas = this;
            var group;
            if (groupRecovered) {
                group = groupRecovered;
                var images = document.querySelectorAll('.'+group.id);
                var imagesArray = Array.prototype.slice.call(images,0);
                for (var i=0; i < imagesArray.length; i++) {
                    var image = imagesArray[i];
                    image.setAttribute('xlink:href',group.getAttribute('image-source1'));
                }                
            }
            else {
                id = this.gifName+id;
                group = this.group(id);		
                group.setAttribute('data-signal',0);
                group.setAttribute('image-source1',src);
                if (src2) {
                    group.setAttribute('image-source2',src2);
                }
                else {
                    group.setAttribute('image-source2',src);
                }
                
                var fImag = document.createElement('img');
                fImag.src = src;
                var frgn = this.addHtml(group, fImag, width,height,x,y,'img',1); 
                this.addEvents(frgn);   
                var img = this.img(id+'img', src, width, height, x, y);  
                img.class= id;
                group.appendChild(img); 
                if (addText) {
                    var text = this.text(id+'text');
                    text.setAttribute('transform', ['translate(', 90, 207, ')'].join(' '));
                    text.textContent = 'seÃ±al';  
                    group.appendChild(text);  
                    
                    var text2 = this.text(id+'text2');
                    text2.setAttribute('transform', ['translate(', 75, 258, ')'].join(' '));
                    text2.textContent = 'fecha';  
                    group.appendChild(text2);                     
                }
                var label = this.text(id+'label');
                if (addText) {
                    label.setAttribute('transform', ['translate(', 48, 180, ')'].join(' '));
                }
                else {
                    label.setAttribute('transform', ['translate(', 20, 35, ')'].join(' '));
                    label.setAttribute('class','delete');
                }
                label.textContent = 'seÃ±al';                  
                group.appendChild(label);  
            }
                                   
            var html = this.selectA.cloneNode(true);
            if (typeof html != "undefined") {
                html.addEventListener('change',function(e) { SVGCanvas.onChangeAction(e,'label') });
                this.addHtml(group, html, 162,20,15,0,'s',2);
            }		
            this.appendChild(group);
            this.addEvents(group.firstChild);
            return group;
	}
        
	this.appendChild = function(node) {
		this.svg.appendChild(node);
	}
	
	this.removeChild = function(node) {
		this.svg.removeChild(node);
	}
	
	this.applyTransforms = function (event, SVGObject) {
            SVGObject.rootMatrix = SVGObject.svg.getScreenCTM();

            SVGObject.transformedPoints = SVGObject.originalPoints.map(function(point) {
                return point.matrixTransform(SVGObject.rootMatrix);
            });

            SVGObject.interact('.point-handle').snap({
                anchors: SVGObject.transformedPoints,
                range: 20 * Math.max(SVGObject.rootMatrix.a, SVGObject.rootMatrix.d)
            });
	}
        this.rotateEvent = function(handleRot, radius, elementCenter) {
               var SVGObject = this;
               this.interact(handleRot).draggable({
                        onstart: function (event) {
                            var target = document.getElementById(handleRot.getAttribute('data-parent'));
                            if (target.initAngle == null) {
                                var initX = 0, initY = 0;
                                for (var i = 0; i < target.points.numberOfItems; i++) {
                                    var point = target.points.getItem(i);
                                    if (i==0) {
                                        initX = point.x;
                                        initY = point.y;
                                    }
                                    if (i!=0 && i != Math.floor(target.points.numberOfItems/2)) { 
                                        //rule of the cosenos, given three points, find the angle
                                        var p0c = Math.sqrt(Math.pow(elementCenter.pageX-initX,2)+ Math.pow(elementCenter.pageY-initY,2)); 
                                        var p1c = Math.sqrt(Math.pow(elementCenter.pageX-point.x,2)+Math.pow(elementCenter.pageY-point.y,2));
                                        var p0p1 = Math.sqrt(Math.pow(initX-point.x,2)+ Math.pow(initY-point.y,2));
                                        var initAngle = Math.acos((p1c*p1c+p0c*p0c-p0p1*p0p1)/(2*p1c*p0c));
                                        
                                        var atan1Point = Math.atan2(elementCenter.pageY-initY,elementCenter.pageX-initX);
                                        var atan2Point = Math.atan2(elementCenter.pageY-point.y,elementCenter.pageX-point.x);                                                                                
                                        
                                        var diffAtan = atan2Point - atan1Point;
                                        var absAngle = Math.abs(diffAtan) * 180/Math.PI;
                                        if ((diffAtan < 0 &&  absAngle < 180) || (point.y < elementCenter.pageY && ( atan2Point < atan1Point)) || (point.y < elementCenter.pageY && (atan1Point<0 && atan2Point > 0) && (atan2Point > Math.PI/2))) {                                                                                
                                            initAngle = (2 * Math.PI) - initAngle;
                                        }                                        
                                        target.initAngle = initAngle;
                                    }                                
                                }
                            }
                        },
                        onmove : function (event) {
                            
                            var parent = document.getElementById(handleRot.getAttribute('data-parent'));
                            var center = parent.points.getItem(Math.floor(parent.points.numberOfItems/2));
                            var centerX = center.x;
                            var centerY = center.y;
                            
                            event.target.x.baseVal.value = event.pageX; 
                            event.target.y.baseVal.value = event.pageY;  

                            for (var i = 0; i < parent.points.numberOfItems; i++) {
                                var point = parent.points.getItem(i);
                                var radiusP = Math.sqrt(Math.pow(centerX-point.x,2)+Math.pow(centerY -point.y,2));
                                var useP = document.getElementById(parent.getAttribute('id')+i);                            
                                if (i!=0 && i != Math.floor(parent.points.numberOfItems/2)) { 
                                    parent.angle += parent.initAngle;
                                }                                                                
                                point.x = (centerX + radiusP * Math.cos(parent.angle));
                                point.y = (centerY + radiusP * Math.sin(parent.angle));

                                useP.setAttribute('x', point.x);
                                useP.setAttribute('y', point.y); 
                                
                                if (i == 0) {
                                    var foreign = document.getElementById(parent.parentNode.id+'f');
                                    foreign.setAttribute('x',point.x+5);
                                    foreign.setAttribute('y',point.y);
                                }                                
                            }
                        },
                        onend  : function (event) {
                        }
                    }).snap({
                    mode : 'path',
                    paths: [function (x, y) {
                        var deltaX = x - elementCenter.pageX;
                        var deltaY = y - elementCenter.pageY;
                        var angle = Math.atan2(deltaY, deltaX);                        
                        var parent = document.getElementById(handleRot.getAttribute('data-parent'));
                        parent.angle = angle;
                        return {
                            x: elementCenter.pageX + radius * Math.cos(angle),
                            y: elementCenter.pageY + radius * Math.sin(angle),
                            range: Infinity
                        };
                    }]
                }); 
        }
	this.addHandles = function(item, unclon) {
            var initY = 0, initX = 0;
            for (var i = 0, len = item.points.numberOfItems; i < len; i++) {
                var handle = document.createElementNS(svgNS, 'use'),
                point = item.points.getItem(i),
                newPoint = this.svg.createSVGPoint(),
                id = item.getAttribute('id');					
                handle.setAttributeNS(xns, 'href', '#point-handle');
                handle.setAttribute('class', 'point-handle');
                handle.x.baseVal.value = newPoint.x = point.x;
                handle.y.baseVal.value = newPoint.y = point.y;
                handle.setAttribute('id', id+i);
                handle.setAttribute('data-parent', id);
                handle.setAttribute('data-index',i);
                if (i==0) {
                    initX = point.x;
                    initY = point.y;
                }                
                if (i==1 && item.points.numberOfItems == 3) {
                    var handleRot = document.getElementById(id+'rot');
                    if (!handleRot) {
                        var handleRot = document.createElementNS(svgNS, 'use');
                        handleRot.setAttributeNS(xns, 'href', '#point-rotation');
                        handleRot.setAttribute('class', 'point-rotation');
                        
                        var angle = Math.atan2(point.y-initY,point.x-initX);

                        handleRot.x.baseVal.value = initX - (10 * Math.cos(angle));                    
                        handleRot.y.baseVal.value = initY - (10 * Math.sin(angle));                        
                                    
                        handleRot.setAttribute('id', id+'rot');
                        handleRot.setAttribute('data-parent', id);
                        this.appendChild(handleRot);
                        var elementCenter  = { pageX: point.x, pageY: point.y };
                        var radius =Math.sqrt(Math.pow(elementCenter.pageX-handleRot.x.baseVal.value,2) + Math.pow(elementCenter.pageY-handleRot.y.baseVal.value,2));
                        this.rotateEvent(handleRot,radius, elementCenter);
                    }
                }                

                this.originalPoints.push(newPoint);
                this.appendChild(handle);

            }
            if (unclon) {
                for (var i = 0; i < item.points.numberOfItems; i++) {				
                    var node = document.getElementById(item.getAttribute('id') + i);
                    if (i % 2 == 0) {
                            node.setAttribute('data-unclon','1');
                    }
                }					
            }
	}
	
	this.removeNodes = function(numberOfNodes, parentId) {
            for (var i = 0; i < numberOfNodes; i++) {				
                var node = document.getElementById(parentId + i);
                this.removeChild(node);
            }
	}
		
	this.redoPoints = function() {
            this.originalPoints = [];
            var nodes = document.getElementsByTagName('use');
            var nodesArray = Array.prototype.slice.call(nodes,0);
            for (var i =0; i < nodesArray.length; i++) {
                if (nodesArray[i].class == "point-handle") {
                    var newPoint = this.svg.createSVGPoint();
                    newPoint.x = parseFloat(nodesArray[i].getAttribute('x'));
                    newPoint.y = parseFloat(nodesArray[i].getAttribute('y'));
                    this.originalPoints.push(newPoint);
                }
            }
            this.interact('.point-handle').snap({
                    anchors: this.originalPoints,
                    range: 10
            });					
	}
		
	this.addEvents = function(item) {	
            var SVGObject = this;
            this.interact(item).gestureable = interact(item).draggable({
                onstart : function (event) {
                    SVGObject.svg.setAttribute('class', 'dragging');

                },
                onmove: function (event) {
                    var target = event.target;
                    if (isNaN(target.dragX)) target.dragX = 0;
                    if (isNaN(target.dragY)) target.dragY = 0;
                    
                    target.dragX += event.dx;
                    target.dragY += event.dy;
                    if (target.parentNode.getAttribute('id') != SVGObject.id) {
                            target.parentNode.setAttribute('transform', ['translate(', target.dragX, target.dragY, ')'].join(' '));
                    }
                    else {
                            target.setAttribute('transform', ['translate(', target.dragX, target.dragY, ')'].join(' '));
                    }
                },
                onend: function (event) {
                    SVGObject.svg.setAttribute('class', '');
                }
            });
	}	
		
	this.addHandlesEvents = function(item) {	
            var SVGObject = this;
            this.interact(item).gestureable = this.interact(item).draggable({
                onstart : function (event) {
                    SVGObject.svg.setAttribute('class', 'dragging');

                },
                onmove: function (event) {
                    var target = event.target;
                    var parentId = target.parentNode.getAttribute('id');
                    var fY = 0, fX = 0;
                    if (parentId != SVGObject.id) {
                            var foreign = document.getElementById(parentId+'f');
                            var x = parseFloat(foreign.getAttribute('x'));
                            var y = parseFloat(foreign.getAttribute('y'));
                            x += event.dx;
                            y += event.dy;
                            foreign.setAttribute('x',x);
                            foreign.setAttribute('y',y);
                    }

                    for (var i = 0; i < target.points.numberOfItems; i++) {
                            var point = target.points.getItem(i);
                            var useP = document.getElementById(target.getAttribute('id')+i);

                            point.x += event.dx / SVGObject.rootMatrix.a;
                            point.y += event.dy / SVGObject.rootMatrix.d;

                            useP.setAttribute('x', point.x);
                            useP.setAttribute('y', point.y);                                                             
                         
                    }                    
                    
                    var useRot = document.getElementById(target.getAttribute('id')+'rot');  
                    if (useRot) {
                        var newX = parseFloat(useRot.getAttribute('x'))+ event.dx / SVGObject.rootMatrix.a;
                        var newY = parseFloat(useRot.getAttribute('y'))+ event.dy / SVGObject.rootMatrix.d;

                        useRot.setAttribute('x',newX);
                        useRot.setAttribute('y',newY);
                    }            
                    SVGObject.redoPoints();
                },
                onend: function (event) {
                    SVGObject.svg.setAttribute('class', '');
                    var handleRot = document.getElementById(event.target.getAttribute('id')+'rot');
                    if (handleRot) {
                        var target = event.target;
                        var newY = 0, newX = 0;
                        for (var i = 0; i <= Math.floor(target.points.numberOfItems/2); i++) {
                                var point = target.points.getItem(i);

                                if (i == 0) {
                                    newY = point.y;   
                                    newX = point.x;
                                }

                                if (i == Math.floor(target.points.numberOfItems/2)) {                         
                                    var angle = Math.atan2(point.y-newY,point.x-newX);
                                    var elementCenter  = { pageX: point.x, pageY: point.y };
                                    if ((newY <= point.y) && (newX <= point.x)) {
                                        newX = newX - (10 * Math.cos(angle));                    
                                        newY = newY - (10 * Math.sin(angle));                                
                                    }
                                    else if ((newY > point.y) && (newX <= point.x)) {
                                        newX = newX - (10 * Math.cos(angle));                    
                                        newY = newY + (10 * Math.sin(angle));                               
                                    }
                                    else if ((newY <= point.y) && (newX > point.x)) {
                                        newX = newX + (10 * Math.abs(Math.cos(angle)));                    
                                        newY = newY - (10 * Math.abs(Math.sin(angle)));                             
                                    }
                                    else {
                                        newX = newX + (10 * Math.abs(Math.cos(angle)));                    
                                        newY = newY + (10 * Math.abs(Math.sin(angle)));                               
                                    }
                                
                                    
                                    var radius =Math.sqrt(Math.pow(elementCenter.pageX-newX,2) + Math.pow((elementCenter.pageY - newY),2));
                                    SVGObject.rotateEvent(handleRot,radius, elementCenter);
                                }
                        } 
                    }
                }
            });		
	}

	this.addGeneralEvents = function() {
            var SVGObject = this;
            this.interact(this.svg)
                .on('mousedown', function(e) { SVGObject.applyTransforms(e,SVGObject) })
                .on('touchstart', function(e) { SVGObject.applyTransforms(e,SVGObject) });	

            this.interact('.point-handle').gestureable = interact('.point-handle')
            .draggable({
                onstart: function (event) {
                    SVGObject.svg.setAttribute('class', 'dragging');
                },
                onmove: function (event) {
                    var target = event.target;
                    var i = target.getAttribute('data-index')|0;
                    var parent = target.getAttribute('data-parent');
                    var point = document.getElementById(parent).points.getItem(i);

                    point.x += event.dx / SVGObject.rootMatrix.a;
                    point.y += event.dy / SVGObject.rootMatrix.d;

                    target.x.baseVal.value = point.x;
                    target.y.baseVal.value = point.y ;

                    if (parent.indexOf('A') != -1) {
                        if (i==0) {
                            var foreignId = document.getElementById(parent).parentNode.id + 'f';
                            var foreign = document.getElementById(foreignId);
                            foreign.setAttribute('x',point.x+5);
                            foreign.setAttribute('y',point.y);   
                            
                            var useRot = document.getElementById(target.getAttribute('data-parent')+'rot');  
                            if (useRot) {
                                var target = document.getElementById(useRot.getAttribute('data-parent'));
                                var center = target.points.getItem(Math.floor(target.points.numberOfItems/2));
                                var angle = Math.atan2(center.y-point.y,center.x-point.x);                        
                                var newX = point.x - (10 * Math.cos(angle));                    
                                var newY = point.y - (10 * Math.sin(angle));
                                useRot.setAttribute('x',newX);
                                useRot.setAttribute('y',newY);

                                var radius = Math.sqrt(Math.pow(center.x-newX,2)+Math.pow(center.y -newY,2));
                                var elementCenter  = { pageX: center.x, pageY: center.y };
                                SVGObject.rotateEvent(useRot, radius, elementCenter);
                            }
                        }
                    }

                },
                onend: function (event) {
                    SVGObject.svg.setAttribute('class', '');

                    var index = event.target.getAttribute('data-index')|0,
                        parent = event.target.getAttribute('data-parent'),
                        item = document.getElementById(parent),
                        points = item.points,                        
                        originalNumberOfPoints = points.numberOfItems,
                        point = points.getItem(index),
                        x = 0,
                        y = 0,
                        insertBefore = 0,
                        pointAfter = null,
                        pointBefore = null,
                        unclonable = event.target.getAttribute('data-unclon') || "";

                    if ((item.nodeName == "polyline") && (event.dx != 0) && (event.dy != 0)) {							
                        if (index != 0 && index != (points.numberOfItems -1) && unclonable == "") {
                            pointAfter = points.getItem(index+1);
                            pointBefore = points.getItem(index-1);
                            insertBefore = index+1;	

                            var newPoint = SVGObject.svg.createSVGPoint(), newPoint2 = SVGObject.svg.createSVGPoint();

                            x = (0.5 * (point.x + pointAfter.x));
                            y = (0.5 * (point.y + pointAfter.y));

                            newPoint.x = x;
                            newPoint.y = y;
                            item.points.insertItemBefore(newPoint,insertBefore);

                            x = (0.5 * (point.x + pointBefore.x));
                            y = (0.5 * (point.y + pointBefore.y));

                            newPoint2.x = x;
                            newPoint2.y = y;							
                            item.points.insertItemBefore(newPoint2,index);

                            SVGObject.removeNodes(originalNumberOfPoints,parent);
                            var handleRot = document.getElementById(item.id+'rot');
                            if (handleRot) {
                                SVGObject.svg.removeChild(handleRot);
                            }
                            SVGObject.addHandles(item, true);
                            SVGObject.redoPoints();                            
                        }								
                    }
                    item.initAngle = null;
                }
            })
            .snap({
                    mode: 'anchor',
                    anchors: SVGObject.originalPoints,
                    range: 10
            })
            .styleCursor(true);	
            
        this.interact(SVGObject.svg).on('dblclick',function(event) { 		   
                    var target;
                    if (event.target.correspondingUseElement) {
                        target = event.target.correspondingUseElement;
                    }
                    else {
                         target  = event.target;
                     }
                     if (target.id != SVGObject.id) {
                        if (target.getAttribute('class') == 'point-handle') {
                           var parent = target.getAttribute('data-parent');
                           var item = document.getElementById(parent);
                           var numberOfItems = item.points.numberOfItems;
                           var indice = 0;
                           var indice = target.getAttribute('data-index');
                           if (parseInt(indice) != 0 && parseInt(indice) != (numberOfItems -1)) {
                               SVGObject.removeNodes(numberOfItems, item.id);
                               item.points.removeItem(parseInt(indice));
                               var handleRot = document.getElementById(item.id+'rot');
                               if (handleRot) {
                                   SVGObject.svg.removeChild(handleRot);
                               }
                               SVGObject.addHandles(item);
                               SVGObject.redoPoints();

                           }
                       }
                       else if (target.getAttribute('class') == 'point-rotation') {
                           SVGObject.svg.removeChild(target);
                       }
                       else {
                           if (target.parentNode.id != SVGObject.id) {
                               if (target.parentNode.id.indexOf('A') != -1) {
                                    var parentId = target.parentNode.getAttribute('id');
                                    var flexiLine = document.getElementById(parentId+'pl');
                                    SVGObject.removeNodes(flexiLine.points.numberOfItems, parentId+'pl');
                                    var rot = document.getElementById(parentId+'plrot')
                                    if (rot) {
                                        SVGObject.svg.removeChild(rot);
                                    }
                                    SVGObject.removeChild(target.parentNode);                                
                               }
                               else if (target.parentNode.id.indexOf('B') != -1 || target.parentNode.id.indexOf('H') != -1) {
                                   if (target.parentNode.parentNode.id != SVGObject.id) {
                                       SVGObject.removeChild(target.parentNode.parentNode);
                                   }
                                   else {
                                       SVGObject.removeChild(target.parentNode);
                                   }
                               }
                               else if (target.parentNode.id.indexOf('J') != -1 && target.parentNode.id.indexOf('anchor') != -1) {
                                   SVGObject.removeChild(target.parentNode.parentNode);
                               }
                               else {
                                   SVGObject.removeChild(target.parentNode);
                               }
                           }
                       }
                    }
                    document.body.style.cursor = "default";
                });    
        }
		
        this.toPrint = function(background) {
            var svgToPrint = document.getElementById(this.container).cloneNode(true);
            svgToPrint.firstElementChild.setAttribute('style','');
            if (typeof background != 'undefined') svgToPrint.getElementsByTagName('image')[0].setAttribute('xlink:href','../../images/fondos/' + background);
            
            var nodes = svgToPrint.getElementsByTagName('use');
            var nodesArray = Array.prototype.slice.call(nodes,0);
            for (var i = 0; i < nodesArray.length; i++) {				
                    var node = nodesArray[i];
                    if (node.classList[0]=="point-handle" || node.classList[0]=="point-rotation") node.parentNode.removeChild(node);
            }
            var foreigners = svgToPrint.getElementsByTagName('foreignObject');		
            var foreignersArray = Array.prototype.slice.call(foreigners,0);		
            for (var i = 0; i < foreignersArray.length; i++) {				
                var foreign = foreignersArray[i];
                foreign.parentNode.removeChild(foreign);				
            }
            var texts = svgToPrint.querySelectorAll('.delete');
            var textsArray = Array.prototype.slice.call(texts,0);
            for (var i=0; i < textsArray.length; i++) {
                var text = textsArray[i];
                text.parentNode.removeChild(text);
            }
            return svgToPrint.innerHTML;
        }
		
        //Constructor
        if (!document.getElementById(this.id)) {
            this.svg = document.createElementNS(svgNS, 'svg');
            this.svg.id = this.id;
            this.svg.setAttribute('viewBox', '0 0 1900 974');
            this.svg.setAttribute('width', this.width);
            this.svg.setAttribute('height', this.height);
            this.svg.setAttribute('xmlns', svgNS);
            this.svg.setAttribute('xmlns:xlink',xns);
            if (typeof  this.container == "undefined") { 
                    document.body.appendChild(this.svg);
            }
            else {
                    var container = document.getElementById(this.container);
                    container.appendChild(this.svg);
            }
            var defs = document.createElementNS(svgNS, 'defs');	
            defs.setAttribute('id','definitions');
            var circle = this.circle(2,0,0,"point-handle","#ffffff","0.4","#ffff00","2");
            defs.appendChild(circle);
            var linearGradient = this.linearGradient("redGreen","0%", "0%", "0%", "#FF0000", "100%", "100%", "100%", "#00FF00");  
            defs.appendChild(linearGradient);
            this.appendChild(defs);
        }	
        else {
            this.svg = document.getElementById(this.id);
            var groups = document.getElementsByTagName('g');
            var groupsArray = Array.prototype.slice.call(groups,0); 
            for (var i =0; i < groupsArray.length; i++) {                
                if (groupsArray[i].id.indexOf('A')!= -1) {
                    this.flexyLine(groupsArray[i].id, null, null, groupsArray[i]);
                }
                else  {
                    if (groupsArray[i].id.indexOf('B')!= -1) {
                        this.digiBox(groupsArray[i].id, groupsArray[i]);
                    }
                    else if (groupsArray[i].id.indexOf('C')!= -1) {
                        this.analogBox(groupsArray[i].id, groupsArray[i]);
                    }
                    else if (groupsArray[i].id.indexOf('D')!= -1) {                        
                        this.fan(groupsArray[i].id, groupsArray[i]);                        
                    }
                    else if (groupsArray[i].id.indexOf('E')!= -1) {                        
                        this.solarPanel(groupsArray[i].id, groupsArray[i]);                        
                    } 
                    else if (groupsArray[i].id.indexOf('F')!= -1) {                        
                        this.thermometer(groupsArray[i].id, groupsArray[i]);                        
                    } 
                    else if (groupsArray[i].id.indexOf('G')!= -1) {                        
                        this.imageEle(groupsArray[i].id, groupsArray[i]);                        
                    }                     
                    if (groupsArray[i].transform.baseVal.numberOfItems > 0) {
                        var element = groupsArray[i].firstChild;
                        if (groupsArray[i].transform.baseVal.getItem(0).matrix) {
                            element.dragX = groupsArray[i].transform.baseVal.getItem(0).matrix.e;
                            element.dragY = groupsArray[i].transform.baseVal.getItem(0).matrix.f;
                        }
                        else {
                            element.dragX = groupsArray[i].transform.baseVal[0].matrix.e;
                            element.dragY = groupsArray[i].transform.baseVal[0].matrix.f;
                        }
                    }
                }
            }  

        }					
        this.addGeneralEvents();
		
}

var cline = 0;
var abox = 0;
var imagen = 0;
var svgCnv;
var csele = 0;

function createSelect(id) {
	var sele = document.createElement('select');
	sele.name = 'As'+ id;
	for (i=0; i<8; i++) {
		opt = document.createElement('option');
		opt.value = i;
		if (i == 0) {
			opt.text = '...';
		}
		else {						
			opt.text = 'Señal ' + i;
		}
		sele.appendChild(opt);
	}
	return sele;
}

$(document).ready(function() {
	var selectA = createSelect(csele); 
	var selectB = createSelect(csele); 
	svgCnv = new SVGCanvas(window.interact, 1900, 975,'A','C','B','svg-edit','marco',selectA,selectB)
	$('#svg-edit').css('background-image','url(image/bg1.jpg)');
	$("#add-line").click(function() { 
		cline++; 	
		svgCnv.flexyLine(cline, "#29e",'#00ff00'); 
	});
	
	$("#add-rectangle").click(function() { 
		abox++; 
		svgCnv.analogBox(abox); 
	});
	
	$("#add-image").click(function() { 
		imagen++; 
		svgCnv.imageEle(imagen, false, 'image/character.png', 'image/character.png', 20, 20, 60, 92); 
	});	

});