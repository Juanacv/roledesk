/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//****** SVGCanvas Object
		
function SVGCanvas(interact, width, height, flexiName, analogName, gifName, id, container, selectA, selectB, selectC) {
		'use strict';
		this.interact = interact;
		this.flexiName = flexiName;
		this.analogName = analogName;
        this.gifName = gifName;
		this.rootMatrix;
		this.svg;
		this.id = id;
		this.container = container;	
		this.width = width;
		this.height = height; 
        this.selectA = selectA;
        this.selectB = selectB;
        this.selectC = selectC;
    	var that = this,
		svgNS = 'http://www.w3.org/2000/svg',			
		xns="http://www.w3.org/1999/xlink",
		xhtml="http://www.w3.org/1999/xhtml",
		originalPoints = [],
		transformedPoints = [];
        
 		function linearGradient(id, x1, y1, offset1, stc1, x2, y2, offset2, stc2) {
            var linearGradientEl = document.createElementNS(svgNS, "linearGradient");
            linearGradientEl.setAttribute("id", id);
            linearGradientEl.setAttribute("x1", x1);            
            linearGradientEl.setAttribute("y1", y1);
            linearGradientEl.setAttribute("x2", x2);
            linearGradientEl.setAttribute("y2", y2);    
            
            var stop1 = document.createElementNS(svgNS, "stop");
            stop1.setAttribute("id", id+'st1');
            stop1.setAttribute("offset", offset1);
            stop1.setAttribute("stop-color", stc1);
            linearGradientEl.appendChild(stop1);
            
            var stop2 = document.createElementNS(svgNS, "stop");
            stop2.setAttribute("id", id+'st2');
            stop2.setAttribute("offset", offset2);
            stop2.setAttribute("stop-color", stc2);
            linearGradientEl.appendChild(stop2);            
            
            return linearGradientEl;
        }
        
		function polygon(points, id, fill, opacity, stroke, width) {
            var shape = document.createElementNS(svgNS,'polygon');
            shape.setAttributeNS(null, "points", points);
            shape.setAttributeNS(null,"id", id);
            shape.setAttributeNS(null,"fill", fill);
            shape.setAttributeNS(null,"fill-opacity", opacity);
            shape.setAttributeNS(null,"stroke", stroke);
            shape.setAttributeNS(null,"stroke-width", width);		
            return shape;
		}
		
	    function polyline(points, id, fill, opacity, stroke, width) {
            var shape = document.createElementNS(svgNS, "polyline");
            shape.setAttributeNS(null, "points", points);
            shape.setAttributeNS(null,"id", id);
            shape.setAttributeNS(null,"fill", fill);
            shape.setAttributeNS(null,"fill-opacity", opacity);
            shape.setAttributeNS(null,"stroke", stroke);
            shape.setAttributeNS(null,"stroke-width", width);		
            return shape;
		}
	
		function circle(r, x, y, id, fill, opacity, stroke, width) {
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
	
	 	function rect(x, y, width, height, fill, opacity, stroke, swidth, id) {
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
        
		function path(id, trace, opacity, fill, fillRule, stroke, strokeWidth, strokeLineCap, strokeMiterLimit, strokeDashOffset) {
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

		function group(id) {
            var groupEl = document.createElementNS(svgNS, 'g');
            groupEl.setAttribute('id',id);
            return groupEl;
		}
		
	 	function text(id) {
            var textEl = document.createElementNS(svgNS, 'text');
            textEl.setAttribute('id',id);
            return textEl;
		}
	
		function img(id, src, width, height, x, y) {
            var image = document.createElementNS(svgNS, 'image');
            image.setAttribute('id',id);
            image.setAttribute('xlink:href',src);
            image.setAttribute('width',width);
            image.setAttribute('height',height);
            image.setAttribute('x',x);
            image.setAttribute('y',y);            
            return image;
		}
        
        
	 	function foreign(id, width, height, x, y) {
            var foreignEl = document.createElementNS(svgNS, "foreignObject");
            foreignEl.setAttribute('id',id);
            foreignEl.setAttributeNS(null,'width',width);
            foreignEl.setAttributeNS(null,'height',height);
            foreignEl.setAttributeNS(null,'x', x);
            foreignEl.setAttributeNS(null,'y', y);
            return foreignEl;
		}
	
		function onChangeAction(event, clTarget) {
            var target = event.target;
            var idEl = target.getAttribute('class');
            var groupEl = document.getElementById(idEl);
            groupEl.setAttribute('data-signal', target.options[target.selectedIndex].value);
            var textEl = document.getElementById(idEl+clTarget);
            var selText = target.options[target.selectedIndex].text;
            if (textEl) {
            	textEl.textContent = selText;
            }
		}
	
		function addHtml(group, html, width, height, x, y, type, num) {
            var idEl = group.getAttribute('id');
            var idForeign = '';
            if (num) {
                idForeign = idEl+'f'+num;
            }
            else {
                idForeign = idEl+'f';
            }
            var foreignEl = foreign(idForeign,width,height,x,y);
            html.setAttribute('id',idEl+type);
            html.setAttribute('name',idEl+type);
            html.setAttribute('class',idEl);		
            html.setAttribute('xhtml',xhtml);
            foreignEl.appendChild(html);
            group.appendChild(foreignEl);
            return foreignEl;
		}
	
		function appendChild(node) {
			that.svg.appendChild(node);
		}
	
		function applyTransforms(event) {
            that.rootMatrix = that.svg.getScreenCTM();

            transformedPoints = originalPoints.map(function(point) {
                return point.matrixTransform(that.rootMatrix);
            });

            that.interact('.point-handle').snap({
                anchors: transformedPoints,
                range: 20 * Math.max(that.rootMatrix.a, that.rootMatrix.d)
            });
		}
	
	    function rotateEvent(handleRot, radius, elementCenter) {
            that.interact(handleRot).gestureable = that.interact(handleRot).draggable({
                    onstart: function (event) {
                        var target = document.getElementById(handleRot.getAttribute('data-parent'));
                        if (target.initAngle === null || target.initAngle === undefined) {
                            var initX = 0, initY = 0, i = 0, len = target.points.numberOfItems;
                            while (i < len) {
                                var point = target.points.getItem(i);
                                if (i===0) {
                                    initX = point.x;
                                    initY = point.y;
                                }
                                if (i!==0 && i !== Math.floor(target.points.numberOfItems/2)) { 
                                    //rule of the cosenos, given three points, find the angle
                                    var p0c = Math.sqrt(Math.pow(elementCenter.pageX-initX,2)+ Math.pow(elementCenter.pageY-initY,2)); 
                                    var p1c = Math.sqrt(Math.pow(elementCenter.pageX-point.x,2)+Math.pow(elementCenter.pageY-point.y,2));
                                    var p0p1 = Math.sqrt(Math.pow(initX-point.x,2)+ Math.pow(initY-point.y,2));
                                    var initAngle = Math.acos((p1c*p1c+p0c*p0c-p0p1*p0p1)/(2*p1c*p0c));
                                        
                                    var atan1Point = Math.atan2(elementCenter.pageY-initY,elementCenter.pageX-initX);
                                    var atan2Point = Math.atan2(elementCenter.pageY-point.y,elementCenter.pageX-point.x);                                                                                
                                        
                                    var diffAtan = atan2Point - atan1Point;
                                    var absAngle = Math.abs(diffAtan) * 180/Math.PI;
                                    if ((diffAtan < 0 &&  absAngle < 180) || (point.y < elementCenter.pageY && ( atan2Point < atan1Point)) || (point.y <= elementCenter.pageY && (atan1Point<0 && atan2Point > 0) && (atan2Point >= Math.PI))) {                                                                                
                                        initAngle = (2 * Math.PI) - initAngle;
                                    }                                        
                                    target.initAngle = initAngle;
                                } 
                                i+=1;
                            }
                        }
                    },
                    onmove : function (event) {        
                        var parent = document.getElementById(handleRot.getAttribute('data-parent')),
                        center = parent.points.getItem(Math.floor(parent.points.numberOfItems/2)),
                        centerX = center.x,
                        centerY = center.y;
                            
                        event.target.x.baseVal.value = event.pageX; 
                        event.target.y.baseVal.value = event.pageY;  
						var i = 0, len = parent.points.numberOfItems;
                        while (i < len) {
                            var point = parent.points.getItem(i),
                            radiusP = Math.sqrt(Math.pow(centerX-point.x,2)+Math.pow(centerY -point.y,2)),
                            useP = document.getElementById(parent.getAttribute('id')+i);                            
                            if (i!==0 && i !== Math.floor(parent.points.numberOfItems/2)) { 
                                parent.angle += parent.initAngle;
                            }                                                                
                            point.x = (centerX + radiusP * Math.cos(parent.angle));
                            point.y = (centerY + radiusP * Math.sin(parent.angle));

                            useP.setAttribute('x', point.x);
                            useP.setAttribute('y', point.y); 
                                
                            if (i === 0) {
                                var foreign = document.getElementById(parent.parentNode.id+'f');
                                foreign.setAttribute('x',point.x-30);
                                foreign.setAttribute('y',point.y+5);
                            }
                            i+=1;
                        }
                    },
                    onend  : function (event) {
                    }
                }).snap({
                mode : 'path',
                paths: [function (x, y) {
                    var deltaX = x - elementCenter.pageX,
                    deltaY = y - elementCenter.pageY,
                    angle = Math.atan2(deltaY, deltaX),
                    parent = document.getElementById(handleRot.getAttribute('data-parent'));
                    parent.angle = angle;
                    return {
                        x: elementCenter.pageX + radius * Math.cos(angle),
                        y: elementCenter.pageY + radius * Math.sin(angle),
                        range: Infinity
                    };
                }]
            }); 
        }
        
    	function addHandles(item, unclon) {
            var initY = 0, initX = 0, i = 0, len = item.points.numberOfItems;
            while (i < len) {
                var handle = document.createElementNS(svgNS, 'use'),
                point = item.points.getItem(i),
                newPoint = that.svg.createSVGPoint(),
                id = item.getAttribute('id');					
                handle.setAttributeNS(xns, 'href', '#point-handle');
                handle.setAttribute('class', 'point-handle');
                handle.x.baseVal.value = newPoint.x = point.x;
                handle.y.baseVal.value = newPoint.y = point.y;
                handle.setAttribute('id', id+i);
                handle.setAttribute('data-parent', id);
                handle.setAttribute('data-index',i);
                if (i===0) {
                    initX = point.x;
                    initY = point.y;
                }                
                if (i===1 && item.points.numberOfItems === 3) {
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
                        appendChild(handleRot);
                        var elementCenter  = { pageX: point.x, pageY: point.y };
                        var radius =Math.sqrt(Math.pow(elementCenter.pageX-handleRot.x.baseVal.value,2) + Math.pow(elementCenter.pageY-handleRot.y.baseVal.value,2));
                        rotateEvent(handleRot,radius, elementCenter);
                    }
                }                

                originalPoints.push(newPoint);
                appendChild(handle);
				i+=1;
            }
            if (unclon) {
            	var i = 0;
                while (i < item.points.numberOfItems) {				
                    var node = document.getElementById(item.getAttribute('id') + i);
                    if (i % 2 === 0) {
                            node.setAttribute('data-unclon','1');
                    }
                    i+=1;
                }					
            }
		}
	
		function redoPoints() {
            originalPoints = [];
            var nodes = document.getElementsByTagName('use');
            var nodesArray = Array.prototype.slice.call(nodes,0);
            nodesArray.forEach(function(node) {
                if (node.class === "point-handle") {
                    var newPoint = that.svg.createSVGPoint();
                    newPoint.x = parseFloat(node.getAttribute('x'));
                    newPoint.y = parseFloat(node.getAttribute('y'));
                    originalPoints.push(newPoint);
                }
            });
            that.interact('.point-handle').snap({
                    anchors: originalPoints,
                    range: 10
            });					
		}
	
		function addEvents(item) {	
            that.interact(item).gestureable = that.interact(item).draggable({
                onstart : function (event) {
                    that.svg.setAttribute('class', 'dragging');
                },
                onmove: function (event) {
                    var target = event.target;
                    if (isNaN(target.dragX)) target.dragX = 0;
                    if (isNaN(target.dragY)) target.dragY = 0;
                    
                    target.dragX += event.dx;
                    target.dragY += event.dy;
                    if (target.parentNode.getAttribute('id') !== that.id) {
                        target.parentNode.setAttribute('transform', ['translate(', target.dragX, target.dragY, ')'].join(' '));
                    }
                    else {
                        target.setAttribute('transform', ['translate(', target.dragX, target.dragY, ')'].join(' '));
                    }
                },
                onend: function (event) {
                    that.svg.setAttribute('class', '');
                }
            });
		}
	
		function addHandlesEvents(item) {	
            that.interact(item).gestureable = that.interact(item).draggable({
                onstart : function (event) {
                    that.svg.setAttribute('class', 'dragging');

                },
                onmove: function (event) {
                    var target = event.target;
                    var parentId = target.parentNode.getAttribute('id');
                    var fY = 0, fX = 0;
                    if (parentId !== that.id) {
                        var foreign = document.getElementById(parentId+'f');
                        var x = parseFloat(foreign.getAttribute('x'));
                        var y = parseFloat(foreign.getAttribute('y'));
                        x += event.dx;
                        y += event.dy;
                        foreign.setAttribute('x',x);
                        foreign.setAttribute('y',y);
                    }
					var i = 0;
                    while (i < target.points.numberOfItems) {
                        var point = target.points.getItem(i);
                        var useP = document.getElementById(target.getAttribute('id')+i);

                        point.x += event.dx / that.rootMatrix.a;
                        point.y += event.dy / that.rootMatrix.d;

                        useP.setAttribute('x', point.x);
                        useP.setAttribute('y', point.y);                                                             
                        i +=1;
                    }                    
                    
                    var useRot = document.getElementById(target.getAttribute('id')+'rot');  
                    if (useRot) {
                        var newX = parseFloat(useRot.getAttribute('x'))+ event.dx / that.rootMatrix.a;
                        var newY = parseFloat(useRot.getAttribute('y'))+ event.dy / that.rootMatrix.d;

                        useRot.setAttribute('x',newX);
                        useRot.setAttribute('y',newY);
                    }            
                    redoPoints();
                },
                onend: function (event) {
                    that.svg.setAttribute('class', '');
                    var handleRot = document.getElementById(event.target.getAttribute('id')+'rot');
                    if (handleRot) {
                        var target = event.target;
                        var newY = 0, newX = 0, i = 0;
                        while (i <= Math.floor(target.points.numberOfItems/2)) {
                            var point = target.points.getItem(i);

                            if (i === 0) {
                                newY = point.y;   
                                newX = point.x;
                            }

                            if (i === Math.floor(target.points.numberOfItems/2)) {                         
                                var angle = Math.atan2(point.y-newY,point.x-newX),
                                elementCenter  = { pageX: point.x, pageY: point.y };
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
                                    
                                var radius = Math.sqrt(Math.pow(elementCenter.pageX-newX,2) + Math.pow((elementCenter.pageY - newY),2));
                                rotateEvent(handleRot,radius, elementCenter);
                            }
                            i+=1;
                        } 
                    }
                }
        	});		
		}
	
		function addGeneralEvents() {
            that.interact(that.svg)
                .on('mousedown', function(e) { applyTransforms(e) })
                .on('touchstart', function(e) { applyTransforms(e) });	

            that.interact('.point-handle').gestureable = that.interact('.point-handle')
            .draggable({
                onstart: function (event) {
                    that.svg.setAttribute('class', 'dragging');
                },
                onmove: function (event) {
                    var target = event.target;
                    var i = parseInt(target.getAttribute('data-index'),10) || 0;
                    var parent = target.getAttribute('data-parent');
                    var point = document.getElementById(parent).points.getItem(i);

                    point.x += event.dx / that.rootMatrix.a;
                    point.y += event.dy / that.rootMatrix.d;

                    target.x.baseVal.value = point.x;
                    target.y.baseVal.value = point.y ;

                    if (parent.indexOf(that.flexiName) !== -1) {
                        if (i===0) {
                            var foreignId = document.getElementById(parent).parentNode.id + 'f',
                            foreignEl = document.getElementById(foreignId);
                            foreignEl.setAttribute('x',point.x-30);
                            foreignEl.setAttribute('y',point.y+5);   
                            
                            var useRot = document.getElementById(target.getAttribute('data-parent')+'rot');  
                            if (useRot) {
                                var target = document.getElementById(useRot.getAttribute('data-parent')),
                                center = target.points.getItem(Math.floor(target.points.numberOfItems/2)),
                                angle = Math.atan2(center.y-point.y,center.x-point.x),
                                newX = point.x - (10 * Math.cos(angle)),
                                newY = point.y - (10 * Math.sin(angle));
                                useRot.setAttribute('x',newX);
                                useRot.setAttribute('y',newY);

                                var radius = Math.sqrt(Math.pow(center.x-newX,2)+Math.pow(center.y -newY,2));
                                var elementCenter  = { pageX: center.x, pageY: center.y };
                                rotateEvent(useRot, radius, elementCenter);
                            }
                        }
                    }

                },
                onend: function (event) {
                    that.svg.setAttribute('class', '');

                    var index = parseInt(event.target.getAttribute('data-index'),10)|| 0,
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

                    if ((item.nodeName === "polyline") && (event.dx !== 0) && (event.dy !== 0)) {							
                        if (index !== 0 && index !== (points.numberOfItems -1) && unclonable === "") {
                            pointAfter = points.getItem(index+1);
                            pointBefore = points.getItem(index-1);
                            insertBefore = index+1;	

                            var newPoint = that.svg.createSVGPoint(), newPoint2 = that.svg.createSVGPoint();

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

                            that.removeNodes(originalNumberOfPoints,parent);
                            var handleRot = document.getElementById(item.id+'rot');
                            if (handleRot) {
                                that.svg.removeChild(handleRot);
                            }
                            addHandles(item, true);
                            redoPoints();                            
                        }								
                    }
                    item.initAngle = null;
                }
            })
            .snap({
                    mode: 'anchor',
                    anchors: originalPoints,
                    range: 10
            })
            .styleCursor(true);	
            
        	that.interact(that.svg).on('dblclick',function(event) { 		   
                var target;
                if (event.target.correspondingUseElement) {
                    target = event.target.correspondingUseElement;
                }
                else {
                    target  = event.target;
                }
                if (target.id !== that.id) {
                    if (target.getAttribute('class') === 'point-handle') {
                        var parent = target.getAttribute('data-parent');
                        var item = document.getElementById(parent);
                        var numberOfItems = item.points.numberOfItems;
                        var indice = 0;
                        var indice = target.getAttribute('data-index');
                        if (parseInt(indice) !== 0 && parseInt(indice) !== (numberOfItems -1)) {
                            that.removeNodes(numberOfItems, item.id);
                            item.points.removeItem(parseInt(indice));
                            var handleRot = document.getElementById(item.id+'rot');
                            if (handleRot) {
                                that.svg.removeChild(handleRot);
                            }
                            addHandles(item);
                            redoPoints();

                        }
                    }
                    else if (target.getAttribute('class') === 'point-rotation') {
                        that.svg.removeChild(target);
                    }
                    else {
                        if (target.parentNode.id !== that.id) {
                            if (target.parentNode.id.indexOf(that.flexiName) !== -1) {
                                var parentId = target.parentNode.getAttribute('id');
                                var flexiLine = document.getElementById(parentId+'pl');
                                that.removeNodes(flexiLine.points.numberOfItems, parentId+'pl');
                                var rot = document.getElementById(parentId+'plrot')
                                if (rot) {
                                    that.svg.removeChild(rot);
                                }
                                that.removeChild(target.parentNode);                                
                            }
                            else {
                            	var parentName = target.classList.item(0) || target.class;
                            	if (parentName !== undefined && parentName !== null && parentName !== "") { 
                            		var nodeTargetToRemove = document.getElementById(parentName);
                                	that.removeChild(nodeTargetToRemove);
                                }
                            }
                        }
                    }
                }
                document.body.style.cursor = "default";
            });    
        }
        
        this.removeNodes = function(numberOfNodes, parentId) {
        	var i = 0;
            while (i < numberOfNodes) {				
                var node = document.getElementById(parentId + i);
                that.removeChild(node);
                i +=1;
            }
		}
		
        this.removeChild = function(node) {
			that.svg.removeChild(node);
		}
		
    	this.toPrint = function() {
            var svgToPrint = document.getElementById(that.container).cloneNode(true);
            var nodes = svgToPrint.getElementsByTagName('use');
            var nodesArray = Array.prototype.slice.call(nodes,0);
            nodesArray.forEach(function(node) {				
                    if (node.classList[0]==="point-handle" || node.classList[0]==="point-rotation") {
                    	node.parentNode.removeChild(node);
                    }
            });
            var foreigners = svgToPrint.getElementsByTagName('foreignObject');		
            var foreignersArray = Array.prototype.slice.call(foreigners,0);		
            foreignersArray.forEach(function(foreign) {				
                foreign.parentNode.removeChild(foreign);				
            });
            var texts = svgToPrint.querySelectorAll('.delete');
            var textsArray = Array.prototype.slice.call(texts,0);
            textsArray.forEach(function(text) {
                text.parentNode.removeChild(text);
            });
            return svgToPrint.innerHTML;
        }
        
		this.analogBox = function(id, groupRecovered) { 
            var groupSVG;
            if (groupRecovered) {
                groupSVG = groupRecovered;
            }
            else {
                id = that.analogName+id;
                groupSVG = group(id);		
                groupSVG.setAttribute('data-signal',0);
                var abox = rect(20,20,110,35,"#FFCC99","1","#000000","2",id+'r');
                abox.setAttribute('class',groupSVG.id);
                groupSVG.appendChild(abox);
                               
            }
            
            var html = that.selectB.cloneNode(true);
            if (html !== undefined) {
                html.addEventListener('change',function(e) { onChangeAction(e,'label') });
                addHtml(groupSVG, html, 130,20,28,25,'s');
            }	
                            
            appendChild(groupSVG);
            addEvents(groupSVG.firstChild);
            if (groupRecovered) {
            	var optionNumber = parseInt(groupSVG.getAttribute('data-signal'),10);
            	groupSVG.querySelector('foreignObject').firstChild.options[optionNumber].selected = 'selected';
            }
            return groupSVG;
		}
	
		this.flexyLine = function(id, primaryColor, secundaryColor, groupRecovered) { 
            var groupSVG;                        
            
            if (groupRecovered) {
                groupSVG = groupRecovered;
            }
            else {
                id = that.flexiName+id;
                groupSVG = group(id);
                groupSVG.setAttribute('data-signal',0);
                var flex = polyline("20, 20, 60,20, 100,20", id+'pl',"none","1",primaryColor, "4");
                flex.setAttributeNS(null,"stroke-linejoin", "round");
                flex.setAttribute('data-primary',primaryColor);
                if (secundaryColor === "") {
                    flex.setAttribute('data-secundary','#C8C8D2');
                }
                else  {
                    flex.setAttribute('data-secundary',secundaryColor);
                }
                flex.angle = 0;
                groupSVG.appendChild(flex); 
            }
            var html = that.selectA.cloneNode(true);
            if (html !== undefined) {
                var x=0, y=0;
                html.addEventListener('change',function(e) { onChangeAction(e)});
                if (groupRecovered){
                    var point = groupSVG.firstChild.points.getItem(0);
                    x = point.x - 30;
                    y = point.y + 5;
                }
                else {
                    x = -10;
                    y = 25;
                }
                addHtml(groupSVG, html,100,20,x,y,'s');
            }
            appendChild(groupSVG);
            addHandles(groupSVG.firstChild, false);
            addHandlesEvents(groupSVG.firstChild);
            if (groupRecovered) {
            	var optionNumber = parseInt(groupSVG.getAttribute('data-signal'),10);
            	groupSVG.querySelector('foreignObject').firstChild.options[optionNumber].selected = 'selected';
            }
            return groupSVG;
		}
        
        
		this.imageEle = function(id, groupRecovered, src, src2, x, y, width, height, addText) {
            var groupSVG;
            if (groupRecovered) {
                groupSVG = groupRecovered;
                var images = document.querySelectorAll('.'+group.id);
                var imagesArray = Array.prototype.slice.call(images,0);
                imagesArray.forEach(function(image) {
                    image.setAttribute('xlink:href',group.getAttribute('image-source1'));
                });                
            }
            else {
                id = that.gifName+id;
                groupSVG = group(id);		
                groupSVG.setAttribute('data-signal',0);
                groupSVG.setAttribute('image-source1',src);
                
                var fImag = document.createElement('img');
                fImag.src = src;
                var frgn = addHtml(groupSVG, fImag, width,height,x,y,'img',1); 
                addEvents(frgn);   
                var imgEl = img(id+'img', src, width, height, x, y);  
                imgEl.class= id;
                groupSVG.appendChild(imgEl); 
            }
                                   
            var html = that.selectC.cloneNode(true);
            if (html !== undefined) {
                html.addEventListener('change',function(e) { onChangeAction(e,'label') });
                addHtml(groupSVG, html, 162,20,15,0,'s',2);
            }		
            appendChild(groupSVG);
            if (groupRecovered) {
            	addEvents(groupSVG.children[0]);
            	var optionNumber = parseInt(groupSVG.getAttribute('data-signal'),10);
            	groupSVG.querySelector('foreignObject').firstChild.options[optionNumber].selected = 'selected';
            }
            else {
            	addEvents(groupSVG.children[1]);
            }
            return groupSVG;
		}	
		
		this.refresh = function() {
		    this.svg = document.getElementById(this.id);
            var groups = document.getElementsByTagName('g'),
            groupsArray = Array.prototype.slice.call(groups,0); 
            groupsArray.forEach(function(groupItem) {                
                if (groupItem.id.indexOf(that.flexiName) !== -1) {
                    that.flexyLine(groupItem.id, null, null, groupsArray[i]);
                }
                else  {
					if (groupItem.id.indexOf(that.analogName) !== -1) {
                        that.analogBox(groupItem.id, groupsArray[i]);
                    }
                    else if (groupItem.id.indexOf(that.gifName) !== -1) {                        
                        that.imageEle(groupItem.id, groupItem);                        
                    }                     
                    if (groupItem.transform.baseVal.numberOfItems > 0) {
                        var element = groupItem.firstChild;
                        if (groupItem.transform.baseVal.getItem(0).matrix) {
                            element.dragX = groupItem.transform.baseVal.getItem(0).matrix.e;
                            element.dragY = groupItem.transform.baseVal.getItem(0).matrix.f;
                        }
                        else {
                            element.dragX = groupItem.transform.baseVal[0].matrix.e;
                            element.dragY = groupItem.transform.baseVal[0].matrix.f;
                        }
                    }
                }
            }); 
            addGeneralEvents();
		}
		
        //Constructor
        if (!document.getElementById(this.id)) {
            this.svg = document.createElementNS(svgNS, 'svg');
            this.svg.id = this.id;
            this.svg.setAttribute('viewBox', '0 0 1250 975');
            this.svg.setAttribute('width', this.width);
            this.svg.setAttribute('height', this.height);
            this.svg.setAttribute('xmlns', svgNS);
            this.svg.setAttribute('xmlns:xlink',xns);
            this.svg.setAttribute('preserveAspectRatio','xMinYMax meet');
            if (this.container === undefined) { 
                document.body.appendChild(this.svg);
            }
            else {
                var container = document.getElementById(this.container);
                container.appendChild(this.svg);
            }
            var defs = document.createElementNS(svgNS, 'defs');	
            defs.setAttribute('id','definitions');
            var newCircle = circle(2,0,0,"point-handle","#ffffff","0.4","#ffff00","2");
            defs.appendChild(newCircle);
	    	var rotcircle = circle(3,0,0, "point-rotation", "#FF9E5E", "0.4", "#000000", "2");
	    	defs.appendChild(rotcircle);   
	    	appendChild(defs);
	    	addGeneralEvents();
        }	
        else {
        	this.refresh();
        }			
       
}


