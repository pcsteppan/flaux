var TL = new Point(0,0)
var TR = new Point(1,0)
var BR = new Point(1,1)
var BL = new Point(0,1)

var yellow = 'hsl(35,76,70%)'
var blue = 'hsl(251,91, 50%)'
var red = 'hsl(0,100,50%)'

var GU = [TL, TR, BR, BL]
var width = 200
var height = 200
var U_SCALE = width / 2

var rules = new Set()

var scale = function (x, scalar) { return x * U_SCALE * scalar }

var triangle = function(color, blendmode, scalar) {
  var segments = [TL, TR, BR, BL].map(function(x) {return scale(x, scalar)})
  //var segments = [TL, TR, BR, BL]
  //segments[1] = scale(segments[1])
  segments.splice(Math.floor(Math.random() * 4), 1)
  var path = new Path(segments)
  path.fillColor = color
  path.strokeColor = null
  path.blendMode = blendmode
  return path
}

var generateChildren = function () {
  var children = []
  
  for(var x = 0; x < 2; x++) {
    for(var y = 0; y < 2; y++) {
      children.push(triangle(yellow, 'multiply', 1).translate(x*U_SCALE,y*U_SCALE))
      children.push(triangle(blue, 'multiply', 1).translate(x*U_SCALE,y*U_SCALE))
    }
  }
  children.push(triangle(red,'color-dodge', 2).rotate(45))
  
  return children
}

var logomark = new Group()
logomark.removeChildren()
logomark.children = generateChildren()
logomark.children.forEach( function (child) {child.fillColor.hue += 100;})
logomark.children.push(new Path.Rectangle({
  point: [0, 0],
  size: [200, 200],
  fillColor: 'transparent',
  strokeColor: 'white',
  strokeWidth: 0.1
}))
logomark.rotate(45, [U_SCALE, U_SCALE])
logomark.fitBounds(new Path.Rectangle(0,0,200,200).bounds)
logomark
//logomark.scale(1 / Math.sqrt(2))

// function onMouseDown(event) {
function createLogomark( hueShift) {
  // document.body.appendChild(logomark.exportSVG());

  // var container = document.createElement("div")
  // container.appendChild(project.exportSVG())
  var grid_section = document.getElementById("permutation_grid")
  grid_section.appendChild(project.exportSVG())
  grid_section.scrollTo(0,grid_section.scrollHeight);  

  var new_logomark = new Group()
  new_logomark.removeChildren()
  new_logomark.children = generateChildren()
  new_logomark.children.push(new Path.Rectangle({
    point: [0, 0],
    size: [200, 200],
    fillColor: 'transparent',
    strokeColor: 'white',
    strokeWidth: 0.1
  }))
  new_logomark.rotate(45, [U_SCALE, U_SCALE])
  
  // new_logomark.scale(1 / Math.sqrt(2))
  new_logomark.fitBounds(new Path.Rectangle(0,0,200,200).bounds)
  new_logomark.children.forEach( function (child) {child.fillColor.hue += hueShift;})
  new_logomark.visible = false;
  
  var one_child = true;

  for(var i = 0; i < new_logomark.children.length - 1; i++) {
    // console.log(new_.children.length)
    logomark.children[i].tween({
      'segments[0].point': new_logomark.children[i].segments[0].point,
      'segments[1].point': new_logomark.children[i].segments[1].point,
      'segments[2].point': new_logomark.children[i].segments[2].point,
      'fillColor.hue' : new_logomark.children[i].fillColor.hue
    }, {duration: 2500, easing: 'easeInOutCubic'})
      .then(function () {
        if( one_child ) {
          one_child = false;
          console.log('test')
          // logomark = new_logomark.clone()
          new_logomark.remove()
          logomark.visible = true
          createLogomark( (hueShift + 220) % 360 )
        }
      });
  }
  // logomark.remove()
  // new_logomark.remove()
}

// function onFrame(event) {
  
//  }
createLogomark(0)

//  for ( var items = 0; items < 7 * 3; items ++) {
//    createLogomark( items * 10 )
//  }