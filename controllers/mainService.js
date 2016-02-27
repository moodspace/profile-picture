'use strict';

exports.getPicture = function(args, res, next) {
  /**
   * parameters expected in the args:
  * hex (String)
  * name (String)
  **/

  var color = args.hex.value;
  var name = args.name.value;

  if (color.length != 6 || color.match(/[^0-9A-F]/gi)) {
    res.statusCode = 401;
    res.statusMessage = 'Invalid color';
    res.end();
    return;
  } else if (name.length > 2) {
    res.statusCode = 401;
    res.statusMessage = 'Invalid name';
    res.end();
    return;
  }

  var canvas = require('canvas')
    , Image = canvas.Image
    , canvas = new canvas(420, 420)
    , ctx = canvas.getContext('2d');

  var height = 133.7 + 69;

  name = name[0].toUpperCase() + (name.length===2 ? name[1].toLowerCase() : "");
  ctx.fillStyle = "#"+color;
  ctx.fillRect(0, 0, 420, 420);
  ctx.font = height + "px Roboto";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#FFF";
  var size = ctx.measureText(name);
  ctx.fillText(name, 210 - size.width / 2, 210);

  var download_link = canvas.toBuffer();
  res.setHeader('Content-Type', 'image/png');
  res.end(download_link, null, 2);

}

