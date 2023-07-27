var maxSamples = 100;    // passes
var epsilon    = 0.000001; // accuracy
var iw,ih; // image width and height
	// camera
var cam;
var cx;
var cy;
var p5img;
var img;


// RGB color of a single pixel

class Color {
	constructor(r, g, b) { this.r = r; this.g = g; this.b = b; }
	toString()  { return 'rgb('+this.r+','+this.g+','+this.b+')'; }
	scaled(s)   { return new Color(this.r*s,   this.g*s,   this.b*s  ); }
	plus(c)     { return new Color(this.r+c.r, this.g+c.g, this.b+c.b); }
	minus(c)    { return new Color(this.r-c.r, this.g-c.g, this.b-c.b); }
	filtered(c) { return new Color(this.r*c.r, this.g*c.g, this.b*c.b  ); }
	clamp(s)    { if (s < 0) return 0; if (s > 1) return 1; return s; }
	clamped()   { return new Color(this.clamp(this.r), this.clamp(this.g), this.clamp(this.b)); }
  gamma(s)    { var inv = 1/s; return new Color(Math.pow(this.r, inv),
                        Math.pow(this.g, inv),Math.pow(this.b, inv)); }
}
// 3D vector
class Vector {
	constructor(x, y, z) { this.x = x; this.y = y; this.z = z; }
	toString() { return 'v('+this.x+','+this.y+','+this.z+')'; }
	length()   { return Math.sqrt (this.x*this.x + this.y*this.y + this.z*this.z); }
	reverse()  { return new Vector(-this.x, -this.y, -this.z); }
	scaled(s)  { return new Vector(this.x*s,   this.y*s,   this.z*s  ); }
	plus(v)    { return new Vector(this.x+v.x, this.y+v.y, this.z+v.z); }
	minus(v)   { return new Vector(this.x-v.x, this.y-v.y, this.z-v.z); }
	cross(v)   { return new Vector(this.y*v.z - this.z*v.y,
              this.z*v.x-this.x*v.z, this.x*v.y - this.y*v.x); }
	dot(v)     { return this.x*v.x + this.y*v.y + this.z*v.z ; }
	normalized()  { return this.scaled(1 / this.length()); }
}

// some often used constants
var Black;
var CoordX;
var CoordY;

// ray class, must have origin and direction, can have distance
class Ray {
	constructor(origin, direction){ this.origin = origin; this.direction = direction; this.distance = 0;}
	hitPoint() { return this.origin.plus(this.direction.scaled(this.distance)); }
}

// sphere class
class Sphere {
	constructor(radius, center, color, emission){
  	if (emission == null)
    	emission = Black;
  	this.radius     = radius;      // real
  	this.center     = center;      // Vector
  	this.color      = color;       // Color
  	this.emission   = emission;    // Real
	}
	normal(hitPoint) { return hitPoint.minus(this.center).normalized(); }
	intersect(ray){
  	// returns distance, 0 if no hit
  	// by solving t^2*d.d + 2*t*(o-p).d + (o-p).(o-p)-R^2 = 0
  	var op  = this.center.minus(ray.origin);
	  var b   = op.dot(ray.direction);
 		var det = b*b - op.dot(op) + this.radius*this.radius;
  	if (det < 0) return 0;
  	// sphere/ray-intersection gives two solutions
  	var t;
  	det = Math.sqrt(det);
  	t = b - det;
  	if (t > epsilon) return t;
  	t = b + det;
  	if (t > epsilon) return t;
  	// no hit
  	return 0;
	}
	reflection(ray,depth,scale){}
}
class Diffuse extends Sphere {
	reflection(ray, depth, scale){
  	// ray/sphere intersection
  	var hitPoint = ray.hitPoint();
  	var normal   = this.normal(hitPoint);
  	var forward  = normal.dot(ray.direction) < 0 ? normal : normal.reverse();
  	// generate new random ray
  	var r1  = 2*Math.PI*Math.random();
  	var r2  = Math.random();
  	var r2s = Math.sqrt(r2);
  	var w = forward;
  	var u = (Math.abs(w.x)>0.3 ? CoordX : CoordY).cross(w).normalized();
  	var v = w.cross(u);
  	var d = u.scaled(Math.cos (r1)*r2s) .plus(
    	      v.scaled(Math.sin (r1)*r2s)).plus(
      	    w.scaled(Math.sqrt(1-r2))).normalized();
		return {scale: scale, ray:new Ray(hitPoint, d)};
	}
}
class Specular extends Sphere {
	
	reflection(ray, depth, scale){
  	// ray/sphere intersection
  	var hitPoint  = ray.hitPoint();
  	var normal    = this.normal(hitPoint);
  	var reflected = new Ray(hitPoint, ray.direction.minus(normal.scaled(2*normal.dot(ray.direction))));
		return {scale:scale, ray:reflected}; 
	}
}
class Refraction extends Sphere {
	reflection(ray, depth, scale){
  	// ray/sphere intersection
  	var hitPoint = ray.hitPoint();
  	var normal   = this.normal(hitPoint);
  	var forward  = normal.dot(ray.direction) < 0 ? normal : normal.reverse();
  	var reflected = new Ray(hitPoint, ray.direction.minus(normal.scaled(2*normal.dot(ray.direction))));
  	var entering = normal.dot(forward) > 0; // ray from outside going in ?
  	var air   = 1;
  	var glass = 1.5;
  	var refraction = entering ? air/glass : glass/air;
  	var angle = ray.direction.dot(forward);
  	var cos2t = 1 - refraction*refraction*(1-angle*angle);
  	if (cos2t < 0) // total internal reflection
    	return {scale: scale*RP, ray:reflected};
  	var tdir = ray.direction.scaled(refraction).minus(
               normal.scaled((entering?+1:-1)*(angle*refraction+Math.sqrt(cos2t)))).normalized();
  	var a  = glass - air;
  	var b  = glass + air;
  	var c  = 1 - (entering ? -angle : tdir.dot(normal));
  	var R0 = a*a/(b*b);
  	var Re = R0 + (1-R0)*c*c*c*c*c;
  	var Tr = 1 - Re;
  	var P  = .25 + 0.5*Re;
  	var RP = Re / P;
  	var TP = Tr / (1-P);
  	depth++;
  	if (Math.random() < P)
  		return {scale: scale*RP, ray:reflected};
		else
			return {scale: scale*TP, ray:new Ray(hitPoint, tdir)};
	}
}

// find nearest intersection by processing all spheres
function intersect(ray) {
  var sphere = null;
  var minDistance = 1e10; // infinity
  for (var i = 0; i < spheres.length; i++) {
    var distance = spheres[i].intersect(ray);
    // no self-intersection and closer than previous hit ?
    if (distance > epsilon && distance < minDistance) {
      minDistance = distance;
      sphere = spheres[i];
    }
  }
  // no intersection ?
  if (sphere == null) return null;
  // adjust ray and return hit object
  ray.distance = minDistance;
  return sphere;
}

// build scene
// var spheres;

var spheres = [
    new Sphere(1e5, new Vector( 1e5+1,40.8,81.6), new Color(.75,.25,.25), .999, 0, new Color()),   //Left
    new Sphere(1e5, new Vector(-1e5+99,40.8,81.6),new Color(.25,.25,.75),.999, 0, new Color()),   //Right
    new Sphere(1e5, new Vector(50,40.8, 1e5),     new Color(.75,.75,.75),.999, 0, new Color()),   //Back
    new Sphere(1e5, new Vector(50,40.8,-1e5+170), new Color(),           .999, 0, new Color()),   //Front
    new Sphere(1e5, new Vector(50, 1e5, 81.6),    new Color(.75,.75,.75),.999, 0, new Color()),   //Bottom
    new Sphere(1e5, new Vector(50,-1e5+81.6,81.6),new Color(.75,.75,.75),.999, 0, new Color()),   //Top
    new Sphere(16.5,new Vector(27,16.5,47),       new Color(1,1,1)*.999, .999, 0, new Color()),   //Mirror
    new Sphere(16.5,new Vector(73,16.5,78),       new Color(1,1,1)*.999, 0, .999, new Color()),   //Glass
    // Here you add your light sources
    new Sphere(1.5, new Vector(50, 81.6-16.5, 81.6), new Color(1,1,1), new Color(4,4,4)),  // bright light
    new Sphere(1.5, new Vector(30, 81.6-16.5, 50), new Color(1,0,0), new Color(4,0,0)),  // red light
    new Sphere(1.5, new Vector(70, 81.6-16.5, 50), new Color(0,1,0), new Color(0,4,0))  // green light
  ];


// get radiance after ray was adjusted by intersection
function radiance2(ray) {
	var stk = [];
	var last=null;
	var maxDepth = 200;
	var depth = 0;
	while(true){
  // find closest sphere intersecting the ray
		var sphere = intersect(ray);
		var scale = 1.0;
		if(sphere==null)   {last = Black;           break;}
		if(maxDepth<depth) {last = sphere.emission; break;}
		if(depth>7){
			// max. reflective color channel
			var maxReflection = Math.max(sphere.color.x, sphere.color.y, sphere.color.z);
    	if (Math.random() < maxReflection)
				scale = 1.0/maxReflection;
    	else {
      	last = sphere.emission;
				break;
			}
		}
		var nxt = sphere.reflection(ray,depth,scale);
		ray = nxt.ray;
		stk.push({sphere:sphere, scale: nxt.scale});
		++depth;
	}
	var rad=last;
	while(stk.length){
		var cur = stk.pop();
		var sp = cur.sphere;
		var sc = cur.scale;
		rad = sp.emission.plus(rad.scaled(sc).filtered(sp.color));
	}
	return rad;
}




function computeBlock(sx,sy,ex,ey,pass_int){
  var weight = 1/pass_int;
	p5img.loadPixels();
	img=p5img.pixels;
  for (var y = sy; y < ey; ++y)
  	for (var x = sx; x < ex; ++x) {
    	// initial ray, based on camera
      var d = cx.scaled((x-1.0+Math.random())/iw - 0.5).plus(cy.scaled((y-1.0+Math.random())/ih - 0.5));
      d = d.plus(cam.direction).normalized();
      // start tracing the ray
      //var color = radiance(new Ray(cam.origin.plus(d.scaled(140)), d), 0);
      var color = radiance2(new Ray(cam.origin.plus(d.scaled(140)), d));
      // add all results (and later divide by number of passes) for averaging / noise elimination
      var offset = y*iw+x;
      accumulate[offset] = accumulate[offset].plus(color);
      // set R, G, B values
      var smooth = accumulate[offset].scaled(weight).gamma(2.2);
      offset *= 4;
      img[offset++] = 255.99*smooth.r;
      img[offset++] = 255.99*smooth.g;
      img[offset  ] = 255.99*smooth.b;
		}
	p5img.updatePixels();
}


// compute one pass
var pass;
var accumulate;
var div = 16;
function compute() {
	iw = p5img.width;
	ih = p5img.height;
	p5img.loadPixels();
	img=p5img.pixels;
	let idx = pass%(div*div);
	let cx  = idx%div;
	let cy  = (idx/div)|0;
	let bx  = p5img.width/div;
	let by  = p5img.height/div;
	
	computeBlock(bx*cx,by*cy,bx*(cx+1),by*(cy+1),((pass+div*div)/div/div)|0);
	pass++;
}


// start rendering
function initpt() {
  // initialize color buffers
  accumulate = new Array();
  for (var i = 0; i < iw*ih; i++)
    accumulate[i] = Black;
  // take care of Alpha channel: 255 => fully opaque
  for (var i = 0; i < iw*ih; i++)
    img[4*i+3] = 255;
  // set first pass
  pass = 0;
}



function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);

	//
	let size = Math.min(windowWidth,windowHeight);
	size -= size % div
	p5img = new p5.Image(size,size);
	iw=p5img.width;
	ih=p5img.height;
	
	// some often used constants
	Black  = new Color (0,0,0);
	CoordX = new Vector(1,0,0);
	CoordY = new Vector(0,1,0);

	// camera
	cam = new Ray(new Vector(50, 52, 295.6), new Vector(0, -0.042612, -1).normalized());	
	cx = new Vector(iw*0.5135/ih, 0, 0);
	cy = cx.cross(cam.direction).normalized().scaled(-0.5135);
  
  

	// build scene
	spheres = new Array(
  	new Diffuse   ( 1e5, new Vector(+1e5+1,  40.8, 81.6), new Color(.75,.25,.25), Black),    // left
 		new Diffuse   ( 1e5, new Vector(-1e5+99, 40.8, 81.6), new Color(.25,.25,.75), Black),    // right
		new Diffuse   ( 1e5, new Vector(50,      40.8, 1e5 ), new Color(.75,.75,.75), Black),    // back
  	new Diffuse   ( 1e5, new Vector(50,      40.8,-1e5+170), Black,               Black),    // front
  	new Diffuse   ( 1e5, new Vector(50,       1e5, 81.6), new Color(.75,.75,.75), Black),    // top
  	new Diffuse   ( 1e5, new Vector(50, -1e5+81.6, 81.6), new Color(.75,.75,.75), Black),    // bottom
		new Diffuse   (16.5, new Vector(73,      16.5, 50  ), new Color(.25,.75,.25), Black),   // green
		new Specular  (16.5, new Vector(27,      16.5, 47  ), new Color(.999,.999,.999), Black),   // mirror
  	new Refraction(16.5, new Vector(50,      16.5, 100  ), new Color(.999,.999,.999), Black), // glass
  	new Diffuse   ( 600, new Vector(70,     681.33,61.6), Black,      new Color(12,12,12))     // light
	);
  


	
	p5img.loadPixels();
	img=p5img.pixels;
	initpt();
	p5img.updatePixels();
	//compute();
}

function draw() {
	background(255);
	compute();
	image(p5img,(width-p5img.width)/2,(height-p5img.height)/2);

	let idx = (pass-1)%(div*div);
	let cx  = idx%div;
	let cy  = (idx/div)|0;
	let bx  = p5img.width/div;
	let by  = p5img.height/div;
	
	stroke(255, 204, 0);
	strokeWeight(4);
	noFill();
	rect((width-p5img.width)/2+bx*cx,(height-p5img.height)/2+by*cy,bx,by);

}