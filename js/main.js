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
  for (var i in good_quantities) {
    if (Math.abs(length - sajen_length * good_quantities[i]) < length * precision) return true;
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
      return {
        height: 280.0,
        sajeni: [],
        variants: []
      }
    },

    oninit: function () {
      var self = this;


      self.observe("height", function (new_height) {
        var triedinstva = self.get("sajeni");
        var variants = self.get("variants");
        triedinstva.splice(0, triedinstva.length);
        variants.splice(0, variants.length);
        var sajeni_ra = [];
        var sajeni_svetoch = [];
        var sajeni_ustye = [];

        for (var i = -30; i += 1; i < 43) {
          var s1_ra = new Sajen(1, i);
          var s2_svetoch = new Sajen(0, i);
          var s3_ustye = new Sajen(-1, i);
          if (is_good_length(new_height, s1_ra.length)) {
            sajeni_ra.push(s1_ra);
          }
          sajeni_svetoch.push(s2_svetoch);
          sajeni_ustye.push(s3_ustye);
        }

        // console.log(sajeni_ra)
        // console.log(sajeni_svetoch)
        // console.log(sajeni_ustye)

        for (var i1 in sajeni_ra) {
          var s1 = sajeni_ra[i1];
          for (var i2 in sajeni_svetoch) {
            var s2 = sajeni_svetoch[i2];
            for (var i3 in sajeni_ustye) {
              var s3 = sajeni_ustye[i3];
              if (is_good_vurf(s1.length, s2.length, s3.length)) {
                triedinstva.push([s1, s2, s3]);
              }
            }
          }
        }

        // console.log(triedinstva)

        for (var i in triedinstva) {
          var triedinstvo = triedinstva[i];

          for (var i0 in good_quantities) {
            if (Math.abs(new_height - good_quantities[i0] * triedinstvo[0].length) > new_height * precision) continue;
            for (var i1 in good_quantities) {
              for (var i2 in good_quantities) {
                var vurf = get_vurf(good_quantities[i0] * triedinstvo[0].length, good_quantities[i1] * triedinstvo[1].length, good_quantities[i2] * triedinstvo[2].length);
                var svurf = get_vurf(triedinstvo[0].length, triedinstvo[1].length, triedinstvo[2].length);
                if (is_good_vurf(good_quantities[i0] * triedinstvo[0].length, good_quantities[i1] * triedinstvo[1].length, good_quantities[i2] * triedinstvo[2].length)){
                  if (good_quantities[i1] * triedinstvo[1].length > good_quantities[i2] * triedinstvo[2].length) {
                    variants.push([good_quantities[i0] * triedinstvo[0].length, good_quantities[i1] * triedinstvo[1].length, good_quantities[i2] * triedinstvo[2].length, vurf, svurf]);
                  } else {
                    variants.push([good_quantities[i0] * triedinstvo[0].length, good_quantities[i2] * triedinstvo[2].length, good_quantities[i1] * triedinstvo[1].length, vurf, svurf]);
                  }
                }
              }
            }
          }
        }
        console.log(variants)
        variants.sort(function (a, b) {
          if (a[1] == b[1]) return (-a[2] + b[2]);
          return -a[1] + b[1];
        });

        self.set("variants", variants)

        // console.log(get_vurf(s1.length, s2.length, s3.length));
        // console.log(s1.length * 2, s1.length * 4, s1.length * 6);
        //
        // console.log(triedinstva);
      })
    }

  });
});
