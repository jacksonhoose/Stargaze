/* helper function for creating HTML elements */
function createElement(element, classes, styles){
   var el = document.createElement(element);
   
   if(classes){
      el.className = Array.isArray(classes) 
         ? classes.join(' ') 
         : classes;
   }

   if(styles){
      for(var k in styles){
         el.style[k] = styles[k];
      }
   }
   return el;
}

/* Star class */
function Star(value){
   this.value = value;
   this.el = null;
   this.createHTML();
   this.setCharacter(value);
}

Star.prototype.set = function(key, value){
   if(this[key]){
      this[key] = value;
   }
};

Star.prototype.resetCharacter = function(){
   this.setCharacter(this.value);
};

Star.prototype.get = function(key){
   return this[key] ? this[key] : null;
};

Star.prototype.setCharacter = function(value){
   this.el.innerHTML = value < 1 ? String.fromCharCode(9734) : String.fromCharCode(9733);
};

Star.prototype.getEl = function(){
   return this.el;
};

Star.prototype.createHTML = function(){
   /* returns */
   if(this.el === null){
      /* make the element */
      var element = createElement('span', null, { color: 'gold' });
      /* save the element on the object */
      this.el = element;
   }
};

Star.prototype.addEvent = function(e, cb){
   this.el.addEventListener(e, cb.bind(this), false);
};

Star.prototype.removeEvent = function(event, cb){
   this.el.removeEventListener(e, cb.bind(this), false);
};

/* Main class for creating star lists */
function StarGaze(value, options){
   /* the configured options for the class */
   this.options = this.extendDefaults({
      el: null,
      minValue: 0,
      maxValue: 5,
      target: null,
      containerTag: 'ul',
      starTag: 'span',
      colors: {
         filledColor: 'gold',
         emptyColor: 'white'
      },
      classes: {
         containerClass: 'starList',
         emptyStarClass: 'emptyStar',
         fullStarClass: 'fullStar',
         commonStarClass: 'star'
      }
   }, options || {});

   /* the current value of the star list */
   this.value = value === undefined ? 0 : value;

   /* an array of stars */
   this.stars = null;
   
   /* the dom node container to append the stars to */
   this.options.el = typeof this.options.el === 'string' 
      ? document.querySelector(this.options.el) 
      : this.options.el;
  
   /* save a jquery wrapped element if jQuery is on the page */
   if(window.jQuery !== undefined){
      this.$el = $(this.options.el);
   }

   this.createStars();
}

StarGaze.prototype.extendDefaults = function(obj, extender){
   /* extend */
   for(var k in extender){
      if(obj.hasOwnProperty(k)){
         if(typeof extender[k] === 'object' 
            && !Array.isArray(extender[k]) 
            && typeof obj[k] === 'object' 
            && !Array.isArray(obj[k])){
            /* recurse nested objects */
            obj[k] = this.extendDefaults(obj[k], extender[k]);
         } else {
            obj[k] = extender[k];
         }
      }
   }
   return obj;
};

StarGaze.prototype.get = function(key){
   return this[key] ? this[key] : null;
};

StarGaze.prototype.set = function(key, value){
   this[key] = value; 
};

StarGaze.prototype.getTargetDomNode = function(){
   if(typeof this.target === 'string'){
      this.target = document.querySelector(this.target);
   }
};

StarGaze.prototype.createStars = function(value){
   var i = this.options.minValue;
   var max = this.options.maxValue;
   value = value === undefined ? this.value : value;
   var stars = this.get('stars');

   /* if stars are null they've never been created */
   if(stars === null){
      stars = [];
      for(; i < max; i++){
         var val = i < value ? 1 : 0;
         stars.push(this.createStar(val));
      }
   } else {
      /* iterate over child child stars and set their value */
      for(; i < max; i++){
         var val = i < value ? 1 : 0;
         stars[i].value = val;
         stars[i].setCharacter(val);
      }
   }

   this.stars = stars;
};

StarGaze.prototype.getHTML = function(){
   /* create container */
   var container = createElement(this.options.containerTag, this.options.classes.containerClass, {
      display: 'inline-block'
   });
   
   /* append child nodes to container */
   this.get('stars').forEach(function(star){

      /* make an li */
      var li = createElement('li', null, {
         display: 'inline-block',
         'margin-right': '2px'
      });

      /* append stars to LI's */
      li.appendChild(star.getEl());

      container.appendChild(li);
   });

   return this.container = container;
};

StarGaze.prototype.createStar = function(starValue){
   var star = new Star(starValue);
   var self = this;

   /* bind events to each star node */
   star.addEvent('mouseenter', function(e){
      var index = self.get('stars').indexOf(this);
      self.get('stars').forEach(function(star, i){
         var val = i <= index ? 1 : 0;
         star.setCharacter(val);
      });
   });

   star.addEvent('mouseleave', function(e){
      self.get('stars').forEach(function(star){
         star.resetCharacter();
      });
   });

   star.addEvent('click', function(e){
      var value = self.get('stars').indexOf(this);
      value = value + 1;
      self.value = value;
      self.createStars();
   });

   return star;
};

StarGaze.prototype.render = function(target){
   var stars = this.getHTML();
   target = target || this.options.el;
   if(this.options.$el){
      this.options.$el.append(stars);
   } else {
      target.appendChild(stars)
   }
};













