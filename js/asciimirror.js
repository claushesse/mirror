/*****************************************************************************\
      _____    __________________ .___.___     _____ _____________________
     /  _  \  /   _____/\_   ___ \|   |   |   /  _  \\______   \__    ___/
    /  /_\  \ \_____  \ /    \  \/|   |   |  /  /_\  \|       _/ |    |   
   /    |    \/        \\     \___|   |   | /    |    \    |   \ |    |   
   \____|__  /_______  / \______  /___|___| \____|__  /____|_  / |____|   
           \/        \/         \/                  \/       \/           
           
***************************   A S C I I   A R T   *****************************
*******************************************************************************

  p5.asciiart 0.2.4a by Paweł Janicki, 2017-2019
    https://tetoki.eu/asciiart | https://paweljanicki.jp

*******************************************************************************

  ASCIIART by Paweł Janicki is licensed under a Creative Commons
  Attribution-ShareAlike 4.0 International License
  (http://creativecommons.org/licenses/by-sa/4.0/). Based on a work at:
  https://tetoki.eu.

*******************************************************************************

  ASCII art is a graphic design technique that uses computers for presentation
  and consists of pictures pieced together from the printable characters
  defined by the ASCII Standard. Most examples of ASCII art require a
  fixed-width font.

  There is also a slightly more technically advanced ASCII art mutation called
  ANSI art. ANSI art is a computer art form that was widely used at one time on
  BBSes. It is similar to ASCII art, but constructed from a larger set of 256
  letters, numbers, and symbols — all codes found in IBM code page 437, often
  referred to as extended ASCII and used in MS-DOS and Unix environments. ANSI
  art also contains special ANSI escape sequences that color text with the 16
  foreground and 8 background colours offered by ANSI.SYS, an MS-DOS device
  driver loosely based upon the ANSI X3.64 standard for text terminals. Some
  ANSI artists take advantage of the cursor control sequences within ANSI X3.64
  in order to create animations, commonly referred to as ANSImations - however,
  there are also examples of ASCII art using animation.

  ASCII art technique is widely used by artists, hobbysts, hackers. Especially
  interesting example of use and creative development of the ASCII art are
  works created by the "ASCII Art Ensemble" group. The group, formed by Walter
  van der Cruijsen, Luka Frelih, Vuk Cosic, was founded in 1998. Members of
  the "ASCII Art Ensemble" created a software to "code" moving images into
  animated (sequential) ASCII art pieces. Most recognizable work by the group
  is "Deep ASCII" - an ASCII version of the famous pornographic film "Deep
  Throat" from 1972.

  ASCII art is also a descendant of the concrete and vsual poetry and so called
  "typewriter art": a pre-computer technique of creating images from characters
  available in typewriters (the first known piece of typewriter art — an image
  of a butterfly composed of brackets, dashes, slashes, and an asterisk, made
  by Flora Stacey, a British secretary, in 1898 [https://bit.ly/2t5IC1N]).

\*****************************************************************************/

/*
  The object that will be responsible for generating ASCII art graphics. The
  object will be derived from the AsciiArt pseudo-class from the p5.asciiart
  library, so remember to add the p5.asciiart library to the project in the
  appropriate html file.
*/
var myAsciiArt;

var ancho = window.innerWidth;
var alto = window.innerHeight;


/*
  The size of generated ASCII graphics expressed in characters and lines.
*/
var asciiart_width = 120; var asciiart_height = 90;

/*
  Video capture device.
*/
var myCapture

/*
  Buffer for processed graphics, simplifying some operations. This will be an
  object derived from the p5.Graphics class
*/
var gfx;

/*
  This variable will store a two-dimensional array - "image" in the form of
  ASCII codes.
*/
var ascii_arr;

/*
  And this flag will inform the program whether to display the source image
  from the camera. We will switch the flag with taps/clicks.
*/
var showOryginalImageFlag = false;

/*
  Here we are trying to get access to the camera.
*/



function initCaptureDevice() {
  try {
    myCapture = createCapture(VIDEO);
    myCapture.size(window.width, window.height);
    myCapture.elt.setAttribute('playsinline', '');
    myCapture.hide();
    /*console.log(
      '[initCaptureDevice] capture ready. Resolution: ' +
      myCapture.width + ' ' + myCapture.height
    );*/
  } catch(_err) {
    /*console.log('[initCaptureDevice] capture error: ' + _err);*/
  }
}

/*  function changeSize() {
  var elem = document.getElementById('defaultCanvas0');
  elem.style.width = window.width;
  elem.style.height = window.height;
  console.log("acaestoy");
}*/

function setup() {
  //console.log(ancho, alto);
  
  createCanvas(ancho, alto); // we need some space...
  initCaptureDevice(); // and access to the camera
  canvas.setAttribute("id", "canvasId");

  /*var goFS = document.getElementById("goFS");
  goFS.addEventListener("click", function() {
      document.body.requestFullscreen();
  }, false);*/

  var goFS = document.getElementById("goFS");
  goFS.addEventListener("click", function() {
      toggleFullScreen();
  }, false);

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.body.requestFullscreen();
        goFS.style.display = "none";
    } 
  }

  document.addEventListener("fullscreenchange", function() {
   if((window.fullScreen) ||
   (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
    console.log("estoy fullscreeneado");
    goFS.style.display = "none";
   } else {
    console.log("ya no estoy fullscreeneado");
    goFS.style.display = "inline";
   }
  });

  /*
    In this particular case the gfx helper should have dimensions the same as
    the target graphic.
  */
  gfx = createGraphics(asciiart_width, asciiart_height);
  gfx.pixelDensity(1);
  /*
    Here we create an object derived from the AsciiArt pseudo-class from the
    p5.asciiart library. We do not have to give the constructor any parameters
    because the standard values are ok for us. However, if we want, we can use
    any of the four versions of the constructor:
      new AsciiArt();
      new AsciiArt(_fontName);
      new AsciiArt(_fontName, _fontSize);
      new AsciiArt(_fontName, _fontSize, _textStyle);
  */
  myAsciiArt = new AsciiArt();
  /*
    After initializing the object, look at (in the console) the listing of the
    array containing the glyphs sorted according to the amount of space
    occupied. This table is the basis for the procedure that converts
    individual image pixels into glyphs.
  */
  myAsciiArt.printWeightTable();
  /*
    Here we set the font family, size and style. By default ASCII Art library
    is using 'monospace' font, so we want to apply the same setting to our
    sketch.
  */
  textAlign(CENTER, CENTER); textFont('monospace', 8); textStyle(NORMAL);
  noStroke(); fill(255);
  /*
    Finally we set the framerate.
  */
  frameRate(30);
}


function draw() {
  asciiart_width = int((mouseX - 0) * (110 - 5) / (window.width - 0) + 5);
  asciiart_height = int((mouseY - 0) * (90 - 5) / (window.height - 0) + 5);

  gfx = createGraphics(asciiart_width, asciiart_height);

  if(myCapture !== null && myCapture !== undefined) { // safety first
    background(0);
    /*
      Let's prepare the image for conversion. Although the object derived from
      the AsciiArt pseudo-class has it's own mechanism of changing the size of
      the image, we will use the external one. Thanks to this we will be able -
      before transferring the image for conversion - to perform the posterize
      effect on it, which will make the final effect better.
    */
    gfx.background(0);
    gfx.image(myCapture, 0, 0, gfx.width, gfx.height);
    /*
      It is worth experimenting with the value of the parameter defining the
      level of posterization. Depending on the characteristics of the image,
      different values may have the best effect. And sometimes it is worth not
      to apply the effect of posterization on the image.
    */
    gfx.filter(POSTERIZE, 5);
    /*
      Here the processed image is converted to the ASCII art. The convert()
      function in this case is used with just one parameter (image we want to
      convert), so the resultant ASCII graphics will have the same resolution
      as the image. If necessary (especially if the resolution of the converted
      image is relatively high), it is possible to use the converter function
      in the version with three parameters: then the second and third
      parameters will be respectively the width and height of the generated
      glyph table. The convert() function returns a two-dimensional array of
      characters containing the representation of the converted graphics in the
      form of the ASCII art. If the conversion fails, the function returns
      null.
    */
    ascii_arr = myAsciiArt.convert(gfx);
    /*
      We can only watch ASCII art or display it against the background of the
      original image from the camera. The flag controlling the display of the
      image coming from the camera is switched by tap/click.
    */
    if(showOryginalImageFlag) image(myCapture, 0, 0, width, height);
    /*
      Now it's time to show ASCII art on the screen. First, we set drawing
      parametrs. Next, we call the function typeArray2d() embedded in the
      ASCII Art library, that writes the contents of a two-dimensional array
      containing (implicitly) text characters (chars) on the screen. In this
      case, we call a function with 2 parameters: the first is the table
      whose contents we want to print, and the second is the destination (an
      object with "canvas" property). If you use the function with two
      parameters (as we do in this example), it will assume that you need to
      fill the entire surface of the target canvass with a drawing. However,
      the function can be called in 3 variants:
        [AsciiArt instance].typeArray2d(_arr2d, _dst);
        [AsciiArt instance].typeArray2d(_arr2d, _dst, _x, _y);
        [AsciiArt instance].typeArray2d(_arr2d, _dst, _x, _y, _w, _h);
      The parameters are as follows:
        _arr2d - 2-dimentional array containing glyphs (chars)
        _dst - destination (typically the sketch itself)
        _x, _y - coordinates of the upper left corner
        _w, _h - width and height
      It is relatively easy to write your own function that formats the contents
      of an array to ASCII graphics. At the end of this example, I glue the
      function code from a non-minimized version of the library - it can be
      used as a base for your own experiments.
    */
    myAsciiArt.typeArray2d(ascii_arr, this);
  }
  else {
    /*
      If there are problems with the capture device (it's a simple mechanism so
      not every problem with the camera will be detected, but it's better than
      nothing) we will change the background color to alarmistically red.
    */
    background(255, 0, 0);
  }
}

function mouseReleased() {
  /*
    The flag controlling the display of the image coming from the camera is
    switched by tap/click.
  */
 showOryginalImageFlag;

}


/*
  *****************************************************************************
  ******************************** typeArray2d ********************************
  Slightly reworked part of the oryginal code from the ASCII Art library - you
  can redesign this to suit your needs.
  *****************************************************************************
  A simple function to help us print the ASCII Art on the screen. The function
  prints a two-dimensional array of glyphs and it is used similarly to the
  standard method of displaying images. It can be used in versions with 2, 4 or
  6 parameters. When using the version with 2 parameters, the function assumes
  that the width and height of the printed text block is equal to the width and
  height of the working space (that's mean: equal to the _dst size) and it
  starts drawing from upper left corner (coords: 0, 0). When using the version
  with 4 parameters, the function assumes that the width and height of the
  printed text block is equal to the width and height of the working space
  (that's mean: equal to the _dst size). _arr2d is the two-dimensional array of
  glyphs, _dst is destinetion (basically anything with 'canvas' property, such
  as p5js sketch or p5.Graphics).
*/
typeArray2d = function(_arr2d, _dst, _x, _y, _w, _h) {
  if(_arr2d === null) {
    //console.log('[typeArray2d] _arr2d === null');
    return;
  }
  if(_arr2d === undefined) {
    //console.log('[typeArray2d] _arr2d === undefined');
    return;
  }
  switch(arguments.length) {
    case 2: _x = 0; _y = 0; _w = width; _h = height; break;
    case 4: _w = width; _h = height; break;
    case 6: /* nothing to do */ break;
    default:
      //console.log('[typeArray2d] bad number of arguments: ' + arguments.length);
      return;
  }
  /*
    Because Safari in macOS seems to behave strangely in the case of multiple
    calls to the p5js text(_str, _x, _y) method for now I decided to refer
    directly to the mechanism for handling the canvas tag through the "pure"
    JavaScript.
  */
  if(_dst.canvas === null) {
    //console.log('[typeArray2d] _dst.canvas === null');
    return;
  }
  if(_dst.canvas === undefined) {
    //console.log('[typeArray2d] _dst.canvas === undefined');
    return;
  }
  var temp_ctx2d = _dst.canvas.getContext('2d');
  if(temp_ctx2d === null) {
    //console.log('[typeArray2d] _dst canvas 2d context is null');
    return;
  }
  if(temp_ctx2d === undefined) {
    //console.log('[typeArray2d] _dst canvas 2d context is undefined');
    return;
  }
  var dist_hor = _w / _arr2d.length;
  var dist_ver = _h / _arr2d[0].length;
  var offset_x = _x + dist_hor * 0.5;
  var offset_y = _y + dist_ver * 0.5;
  for(var temp_y = 0; temp_y < _arr2d[0].length; temp_y++)
    for(var temp_x = 0; temp_x < _arr2d.length; temp_x++)
      /*text*/temp_ctx2d.fillText(
        _arr2d[temp_x][temp_y],
        offset_x + temp_x * dist_hor,
        offset_y + temp_y * dist_ver
      );
}

