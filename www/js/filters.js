/**
* A horizontal blur filter by Mat Groves http://matgroves.com/ @Doormat23
*/
var BLUR_INTENSITY = 512;

Phaser.Filter.BlurX = function (game) {

    Phaser.Filter.call(this, game);

    this.uniforms.blur = { type: '1f', value: 1 / BLUR_INTENSITY };

    this.fragmentSrc = [

      "precision mediump float;",
      "varying vec2 vTextureCoord;",
      "varying vec4 vColor;",
      "uniform float blur;",
      "uniform sampler2D uSampler;",

        "void main(void) {",

          "vec4 sum = vec4(0.0);",

          "sum += texture2D(uSampler, vec2(vTextureCoord.x - 4.0*blur, vTextureCoord.y)) * 0.05;",
          "sum += texture2D(uSampler, vec2(vTextureCoord.x - 3.0*blur, vTextureCoord.y)) * 0.09;",
          "sum += texture2D(uSampler, vec2(vTextureCoord.x - 2.0*blur, vTextureCoord.y)) * 0.12;",
          "sum += texture2D(uSampler, vec2(vTextureCoord.x - blur, vTextureCoord.y)) * 0.15;",
          "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;",
          "sum += texture2D(uSampler, vec2(vTextureCoord.x + blur, vTextureCoord.y)) * 0.15;",
          "sum += texture2D(uSampler, vec2(vTextureCoord.x + 2.0*blur, vTextureCoord.y)) * 0.12;",
          "sum += texture2D(uSampler, vec2(vTextureCoord.x + 3.0*blur, vTextureCoord.y)) * 0.09;",
          "sum += texture2D(uSampler, vec2(vTextureCoord.x + 4.0*blur, vTextureCoord.y)) * 0.05;",

          "gl_FragColor = sum;",

        "}"
    ];

};

Phaser.Filter.BlurX.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.BlurX.prototype.constructor = Phaser.Filter.BlurX;

Object.defineProperty(Phaser.Filter.BlurX.prototype, 'blur', {

    get: function() {
        return this.uniforms.blur.value / (1/7000);
    },

    set: function(value) {
        this.dirty = true;
        this.uniforms.blur.value = (1/7000) * value;
    }

});

/**
* A vertical blur filter by Mat Groves http://matgroves.com/ @Doormat23
*/
Phaser.Filter.BlurY = function (game) {

    Phaser.Filter.call(this, game);

    this.uniforms.blur = { type: '1f', value: 1 / BLUR_INTENSITY };

    this.fragmentSrc = [

      "precision mediump float;",
      "varying vec2 vTextureCoord;",
      "varying vec4 vColor;",
      "uniform float blur;",
      "uniform sampler2D uSampler;",

        "void main(void) {",

          "vec4 sum = vec4(0.0);",

          "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 4.0*blur)) * 0.05;",
          "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 3.0*blur)) * 0.09;",
          "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 2.0*blur)) * 0.12;",
          "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - blur)) * 0.15;",
          "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;",
          "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + blur)) * 0.15;",
          "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 2.0*blur)) * 0.12;",
          "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 3.0*blur)) * 0.09;",
          "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 4.0*blur)) * 0.05;",

          "gl_FragColor = sum;",

        "}"

    ];

};

Phaser.Filter.BlurY.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.BlurY.prototype.constructor = Phaser.Filter.BlurY;

Object.defineProperty(Phaser.Filter.BlurY.prototype, 'blur', {

    get: function() {
        return this.uniforms.blur.value / (1/7000);
    },

    set: function(value) {
        this.dirty = true;
        this.uniforms.blur.value = (1/7000) * value;
    }

});