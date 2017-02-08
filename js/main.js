var NARODNAYA_SAJEN = 176.0;
var FI = Math.pow(Math.pow(2, 25), 1.0 / 36.0);
var best_vurf = 1.341669202;
var precision = 0.03;
var vurf_delta = best_vurf * precision; // 3%
var good_quantities = [2, 4, 6, 8];
console.log("NARODNAYA_SAJEN =", NARODNAYA_SAJEN);
console.log("FI =", FI);

function Sajen(x, y) {
  var self = this;
  self.group = "";
  if (Math.abs(x - 1.0) < 0.01) {
    self.group = "Ra"
  }
  if (Math.abs(x - 0.0) < 0.01) {
    self.group = "Svetoch"
  }
  if (Math.abs(x - (-1.0)) < 0.01) {
    self.group = "Ustye"
  }
  self.x = x;
  self.y = y;
  self.length = Math.pow(2.0 / FI, x) * Math.pow(Math.pow(FI, 3) / 4.0, y) * NARODNAYA_SAJEN;

  // console.log("New Sajen:", self)
}

function get_vurf(a, b, c) {
  var arr = [a, b, c];
  arr.sort();
  a = arr[0];
  b = arr[1];
  c = arr[2];
  return (a + b) * (b + c) / b / (a + b + c)
}

function is_good_vurf(a, b, c) {
  if ((Math.abs(get_vurf(a, b, c) - best_vurf) < vurf_delta)) return true;
  return false;
}

function is_good_length(length, sajen_length) {
  if ((length > sajen_length) && (length % sajen_length < length * precision) && (Math.floor(length / sajen_length) <= 4)) {
    console.log('Good:', length, sajen_length, Math.floor(length / sajen_length));
    return true;
  }
  return false;
}

// new Sajen(0,0);
// new Sajen(1,0);
// new Sajen(2,0);
// new Sajen(0,1);
// new Sajen(1,1);
// new Sajen(2,1);

$(function () {
  var ractive = new Ractive({
    // The `el` option can be a node, an ID, or a CSS selector.
    el: '#container',

    // We could pass in a string, but for the sake of convenience
    // we're passing the ID of the <script> tag above.
    template: '#template',

    // Here, we're passing in some initial data
    data: function () {
      var heights = [];
      for (var i=0; i<20; i++){
        heights.push(Math.round(247 * Math.pow(1.05943508, i)));
      }
      return {
        heights: heights,
        height: 247,
        variants: [],
        is_thin_room: false,
        is_high_room: false,
        selected_str: 'Кликнете на комнату чтобы выбрать ее размер.'
      }
    },

    oninit: function () {
      var self = this;
      
      self.observe("height is_thin_room is_high_room", function () {

        var variants = [];
        var height = self.get('height');
        var saj_variants = [[164, 134], [134, 164]];
        var saj_muls = [[1, 2], [2, 3], [4, 4], [4, 5], [4, 6], [4, 7]];
        // 1:2, 2:3, 4:4 или 4:5. Также гармоничными пропорциями считаются 4:6 и 4:7
        for (var saj_var_i in saj_variants) {
          var saj_width = saj_variants[saj_var_i][0];
          var saj_length = saj_variants[saj_var_i][1];
          for (var scale = -5; scale <= 5; scale += 1) {
            saj_width *= Math.pow(1.05943508, scale);
            saj_length *= Math.pow(1.05943508, scale);
            
            for (var saj_scale_height_width_i in saj_muls) {
              var width = 0;
              if (self.get('is_thin_room')){
                width = height * saj_muls[saj_scale_height_width_i][0] / saj_muls[saj_scale_height_width_i][1]; // height is larger than width
              } else {
                width = height * saj_muls[saj_scale_height_width_i][1] / saj_muls[saj_scale_height_width_i][0]; // width is larger than height
              }
              // if (!is_good_length(width, saj_width)) continue;
              for (var saj_scale_width_length_i in saj_muls) {
                var length = 0;
                if (self.get('is_high_room')) {
                  length = height * saj_muls[saj_scale_width_length_i][0] / saj_muls[saj_scale_width_length_i][1]; // height is larger than length
                } else {
                  length = width * saj_muls[saj_scale_width_length_i][1] / saj_muls[saj_scale_width_length_i][0]; // length is larger than width
                }
                // if (!is_good_length(length, saj_length)) continue;
                if (!is_good_vurf(height, width, length)) continue;
                variants.push([height, length, width, get_vurf(height, width, length), scale, saj_muls[saj_scale_height_width_i], saj_muls[saj_scale_width_length_i]])
              }
            }
          }
        }

        variants.sort(function (a, b) {
          if (a[1] == b[1]) return (-a[2] + b[2]);
          return -a[1] + b[1];
        });

        self.set('variants', variants);
      })
    },

  });
});
