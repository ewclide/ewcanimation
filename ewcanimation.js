(function(){
	
var winHeight = window.innerHeight;
var winWidth = window.innerWidth;

function switchMove(parms)
{
	var pos = [];
	if(parms.length == 3)
	{
		switch(parms[1])
		{
			case 'top': pos[0] = 'translate(0px,'+ -parms[2] +'px)'; break;
			case 'bottom': pos[0] = 'translate(0px,'+ parms[2] +'px)'; break;
			case 'left': pos[0] = 'translate('+ -parms[2] +'px, 0px)'; break;
			case 'right': pos[0] = 'translate('+ parms[2] +'px, 0px)'; break;
		}
	}
	else if (parms.length == 2){
		var val = parms[1].split(',');
		pos[0] = 'translate('+ val[0] +'px,'+ val[1] +'px)';
	}
	else alert('error move method notation');
	
	pos[1] = 'translate(0)';
	
	return pos;
}

function switchScale(parms)
{
	var scale = [];
	if(parms.length == 3)
	{
		switch(parms[1])
		{
			case 'x': scale[0] = 'scale('+parms[2]+', 0)'; break;
			case 'y': scale[0] = 'scale(0, '+parms[2]+')'; break;
		}
	}
	else if (parms.length == 2)
	{
		scale[0] = 'scale('+ parms[1] +','+ parms[1] +')';
	}
	else alert('error scale method notation');
	
	scale[1] = 'scale(1)';
	
	return scale;
}

function switchRotate(parms)
{
	var rotate = [];

	rotate[0] = 'rotate('+parms[1]+'deg)';
	rotate[1] = 'rotate(0)';

	return rotate;
}

function switchRotate3D(parms)
{
	var rotate = [];
	if(parms.length == 3)
	{
		switch(parms[1])
		{
			case 'x': rotate[0] = 'rotateX('+parms[2]+'deg)'; break;
			case 'y': rotate[0] = 'rotateY('+parms[2]+'deg)'; break;
			case 'z': rotate[0] = 'rotateZ('+parms[2]+'deg)'; break;
		}
		rotate[1] = 'rotateX(0)';
	}
	else alert('error rotate method notation');
	return rotate;
}

function routSwitches(elem, parm)
{
	if(!elem.hidden)
	{
		elem.transform.transform[0] += parm[0];
		elem.transform.transform[1] += parm[1];
		elem.css.transform = parm[1];
	}
	else
	{
		elem.transform.transform[0] += parm[1];
		elem.transform.transform[1] += parm[0];
		elem.css.transform = parm[0];
	}
}

function Chunk(elem)
{
	this.drawComplete = false;
	this.hidden = false;
	this.elem = elem;
	this.settings = {};
	this.css = {};
	this.settings.delay = 0;
	this.settings.duration = 1000;
	this.transform = {};
	this.transform.easing = 'ease-in-out';
	this.transform.transform = ['', ''];
	this.getTransform();
};

function parseTimeFunc(func_str)
{
	var timeFunc = 'linear';
	switch(func_str)
	{
		case 'linear': timeFunc = func_str; break;
		case 'ease': timeFunc = func_str; break;
		case 'ease-in': timeFunc = func_str; break;
		case 'ease-out': timeFunc = func_str; break;
		case 'ease-in-out': timeFunc = func_str; break;
		case 'resist': timeFunc = 'cubic-bezier(0,0.75,1,0.28)'; break;
		case 'slowly': timeFunc = 'cubic-bezier(0.05,0.62,0.38,0.94)'; break;
		case 'heavy': timeFunc = 'cubic-bezier(1,1.08,0,1.1)'; break;
		case 'pen': timeFunc = 'cubic-bezier(1,1,0.55,0.14)'; break;
	}
	return timeFunc;
}

Chunk.prototype.getTransform = function()
{
	if($(this.elem).attr('animation')){
		var parms = $(this.elem).attr('animation').split(' ');
		for(var i in parms)
		{
			var the_parm = parms[i].split('=');
			switch (the_parm[0])
			{
				case 'show': this.hidden = false; this.transform.opacity = ['0', '1']; this.css.opacity = '1'; break;
				case 'hide': this.hidden = true; this.transform.opacity = ['1', '0']; this.css.opacity = '0'; break;
				case 'move':
					var pos = switchMove(the_parm);
					routSwitches(this, pos);
					break;
				case 'rotate':
					var rotate = switchRotate(the_parm);
					routSwitches(this, rotate);
					break;
				case 'rotate3d':
					var rotate = switchRotate3D(the_parm);
					routSwitches(this, rotate);
					break;
				case 'scale':
					var scale = switchScale(the_parm);
					routSwitches(this, scale);
					break;
				case '3d':
					$(this.elem).parent().css('perspective', the_parm[1]+'px');
					break;
				case 'auto':
					Autos.push(this);
					break;
				case 'scrolled':
					this.height = $(this.elem).innerHeight();
					Scrolled.push(this);
					break;
				case 'delay': 
					this.settings.delay = parseInt(the_parm[1]);
					break;
				case 'speed': 
					this.settings.duration = parseInt(the_parm[1]);
					break;
				case 'func': 
					this.settings.easing = parseTimeFunc(the_parm[1]);
					break;
			}
		}
		
		$(this.elem).removeAttr('animation');
		$(this.elem).removeClass('animation');
	}
}

Chunk.prototype.draw = function(){
	var the_chunk = this;
	if(!the_chunk.drawComplete)
	{
		the_chunk.elem.animate(the_chunk.transform, the_chunk.settings).addEventListener('finish', function() {
			$(the_chunk.elem).css(the_chunk.css);
		});
		the_chunk.drawComplete = true;
	}
}

function drawAutos()
{
	for(var i in Autos)
	{
		Autos[i].draw();
	};
}

function drawScrolled()
{
	for(var i in Scrolled){
		var offsetTop = Scrolled[i].elem.getBoundingClientRect().top;
		
		if(offsetTop <= (winHeight - Scrolled[i].height))
			Scrolled[i].draw();
	}
}
	
$(document).ready(function(){
	
	Scrolled = [];
	Autos = [];
	ChunkArray = [];
	
	$('.animation').each(function(i, elem){
		ChunkArray[i] = new Chunk(elem);
	});

	drawAutos();
	
	window.onscroll = function()
	{
		drawScrolled();
	};
});
})();