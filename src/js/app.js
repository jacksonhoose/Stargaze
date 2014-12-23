/* helper function for creating HTML elements */
function createElement(element, classes){
   var el = document.createElement(element);
   if(classes){
      el.className = classes;
   }
   return el;
}

/* Star class */
function Star(value){
   this.value = value;
}

Star.prototype.set = function(key, value){
   if(this[key]){
      this[key] = value;
   }
};

Star.prototype.get = function(key){
   return this[key] ? this[key] : null;
};

Star.prototype.getHTML = function(starValue){
   var span = createElement('span');
   
   span.innerHTML = (this.value === 0 || this.value === undefined) 
      ? String.fromCharCode(9734) 
      : String.fromCharCode(9733);
   
   span.style.color = 'gold';
   
   span.addEventListener('click', function(e){
      console.log(e);
      console.log(this.value);
   }.bind(this), false);
   return span;
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
   if(this.target instanceof jQuery) return;
   if(typeof this.target === 'string'){
      this.target = document.querySelector(this.target);
   }
};

StarGaze.prototype.createStars = function(){
   var i = this.options.minValue;
   var max = this.options.maxValue;
   var stars = this.get('stars');

   /* if stars are null they've never been created */
   if(stars === null){
      stars = [];
      for(; i < max; i++){
         var val = i < this.value ? 1 : 0;
         stars.push(this.createStar(val));
      }
   } else {
      /* iterate over child child stars and set their value */
      for(; i < max; i++){
         var val = i < this.value ? 1 : 0;
         stars[i].set('value', val);
      }
   }

   this.set('stars', stars);
};

StarGaze.prototype.getHTML = function(){
   var container = createElement(this.options.containerTag, this.options.classes.containerClass);
   
   container.style.display = 'inline-block';

   this.get('stars').forEach(function(star){
      var li = createElement('li');
      li.style.display = 'inline-block';
      li.style['margin-right'] = '2px';
      li.appendChild(star.getHTML());
      container.appendChild(li);
   })

   return this.container = container;
};

StarGaze.prototype.createStar = function(starValue){
   return new Star(starValue);
};

StarGaze.prototype.mouseenter = function(e){
   console.log('enetered');

};

StarGaze.prototype.mouseleave = function(e){
   console.log('mouseleave');
};

StarGaze.prototype.click = function(e){
   console.log('click');
   console.log(e);
   console.log(this.createStar);
};

StarGaze.prototype.addEvents = function(){
   this.container.addEventListener('mouseenter', this.mouseenter.bind(this), false);
   this.container.addEventListener('mouseleave', this.mouseleave.bind(this), false);
};

StarGaze.prototype.removeEvents = function(){
   this.container.addEventListener('mouseenter', this.mouseenter.bind(this), false);
   this.container.addEventListener('mouseleave', this.mouseleave.bind(this), false);
};

StarGaze.prototype.render = function(target){
   var stars = this.getHTML();
   target = target || this.options.el;
   if(this.options.$el){
      this.options.$el.append(stars);
   } else {
      target.appendChild(stars)
   }
   this.addEvents();
};













