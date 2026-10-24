/*
 * Satish Wood Works — scroll-driven 3D showroom (plain WebGL2, no libraries).
 * A wood-slat corridor you walk through as you scroll. Every chapter has two portals:
 * heritage design on the left, modern design on the right, with floor reflections, light beams and dust.
 */
(function () {
  'use strict';
  var root = document.documentElement;
  var canvas = document.getElementById('hero-canvas');
  var hero = document.getElementById('hero');
  if (!canvas || !hero) return;
  var gl = null;
  try { gl = canvas.getContext('webgl2', { antialias: true, alpha: false, powerPreference: 'high-performance' }); } catch (e) {}
  window.SWW_HERO = { ok: !!gl };
  if (!gl) { root.classList.add('no-webgl'); return; }

  var REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TEX = window.SWW_HERO_TEX || {};
  var CHAPTERS = [
    { left: 'living-h1', right: 'living-m2' },
    { left: 'bed-m4', right: 'bed-m2' },
    { left: 'wardrobe-h9', right: 'wardrobe-m2' },
    { left: 'kitchen-h1', right: 'kitchen-m3' },
    { left: 'door-h2', right: 'pooja-m2' }
  ];
  var ST = [6, -16, -42, -68, -94, -120];          // camera stops (intro + 5 chapters)
  var PZ = [-26, -52, -78, -104, -130];            // portal depth for each chapter
  var CORR_HALF = 6.5, CORR_H = 7, Z_NEAR = 12, Z_FAR = -146;
  var FOG = [0.035, 0.024, 0.017];

  /* ---------- tiny mat4 ---------- (column-major) */
  var M = {
    ident: function () { return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]); },
    mul: function (a, b) { var o = new Float32Array(16); for (var i = 0; i < 4; i++) for (var j = 0; j < 4; j++) { var s = 0; for (var k = 0; k < 4; k++) s += a[k*4+j] * b[i*4+k]; o[i*4+j] = s; } return o; },
    persp: function (fov, asp, n, f) { var t = 1 / Math.tan(fov / 2), o = new Float32Array(16); o[0] = t / asp; o[5] = t; o[10] = (f + n) / (n - f); o[11] = -1; o[14] = 2 * f * n / (n - f); return o; },
    look: function (e, c, up) {
      var zx = e[0]-c[0], zy = e[1]-c[1], zz = e[2]-c[2], l = Math.hypot(zx,zy,zz); zx/=l; zy/=l; zz/=l;
      var xx = up[1]*zz-up[2]*zy, xy = up[2]*zx-up[0]*zz, xz = up[0]*zy-up[1]*zx; l = Math.hypot(xx,xy,xz); xx/=l; xy/=l; xz/=l;
      var yx = zy*xz-zz*xy, yy = zz*xx-zx*xz, yz = zx*xy-zy*xx;
      return new Float32Array([xx,yx,zx,0, xy,yy,zy,0, xz,yz,zz,0, -(xx*e[0]+xy*e[1]+xz*e[2]), -(yx*e[0]+yy*e[1]+yz*e[2]), -(zx*e[0]+zy*e[1]+zz*e[2]), 1]);
    },
    trs: function (tx, ty, tz, ry, rx, sx, sy) { // translate * rotY * rotX * scale
      var cy = Math.cos(ry), sy_ = Math.sin(ry), cx = Math.cos(rx), sx_ = Math.sin(rx);
      var o = M.ident();
      // R = Ry * Rx
      var r00 = cy, r01 = sy_ * sx_, r02 = sy_ * cx, r10 = 0, r11 = cx, r12 = -sx_, r20 = -sy_, r21 = cy * sx_, r22 = cy * cx;
      o[0] = r00 * sx; o[1] = r10 * sx; o[2] = r20 * sx;
      o[4] = r01 * sy; o[5] = r11 * sy; o[6] = r21 * sy;
      o[8] = r02; o[9] = r12; o[10] = r22;
      o[12] = tx; o[13] = ty; o[14] = tz; return o;
    }
  };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var sstep = function (a, b, x) { x = clamp((x - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };

  /* ---------- shaders ---------- */
  var VS = '#version 300 es\nin vec3 aPos; in vec2 aUv; uniform mat4 uVP; uniform mat4 uM; out vec3 vW; out vec2 vUv;\nvoid main(){ vec4 w=uM*vec4(aPos,1.0); vW=w.xyz; vUv=aUv; gl_Position=uVP*w; }';
  var NOISE = 'float h21(vec2 p){ vec3 p3=fract(vec3(p.xyx)*.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }\n' +
    'float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h21(i),h21(i+vec2(1,0)),f.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x), f.y); }\n';
  var FOGF = 'vec3 applyFog(vec3 c, vec3 w){ float d=length(w-uCam); float f=1.-exp(-(d*d*0.00022 + d*0.0065)); return mix(c, uFog, clamp(f,0.,1.)); }\n';

  var FS_SURF = '#version 300 es\nprecision highp float; in vec3 vW; in vec2 vUv; uniform vec3 uCam; uniform vec3 uFog; uniform float uTime; uniform int uKind; uniform float uPZ[5]; out vec4 o;\n' + NOISE + FOGF +
    'float pools(float z){ float s=0.; for(int i=0;i<5;i++){ float d=(z-uPZ[i])/8.0; s+=exp(-d*d); } return s; }\n' +
    'float line(float x,float c,float w){ return smoothstep(w,0.,abs(x-c)); }\n' +
    'vec3 slats(float u,float v,float per,vec3 dark,vec3 light,out float groove){\n' +
    '  float idx=floor(u/per), s=fract(u/per);\n' +
    '  groove=smoothstep(0.,.10,s)*smoothstep(1.,.90,s);\n' +
    '  float g=vn(vec2(idx*7.3,v*3.))*.55+vn(vec2(idx*3.1,v*26.))*.35+h21(vec2(idx,2.))*.15;\n' +
    '  vec3 base=mix(dark,light,clamp(g,0.,1.));\n' +
    '  float sheen=smoothstep(.12,.45,s)*(1.-smoothstep(.45,.88,s));\n' +
    '  return base*(.5+groove*.55)+sheen*vec3(.30,.17,.07)*.5;\n' +
    '}\n' +
    'void main(){\n' +
    '  vec3 col; float a=1.0; float pl=pools(vW.z);\n' +
    '  if(uKind==1){ // wall\n' +
    '    float groove; vec3 w=slats(vW.z,vW.y,0.34,vec3(.16,.085,.04),vec3(.52,.30,.14),groove);\n' +
    '    float cove=exp(-(6.6-vW.y)*1.5); float wash=exp(-vW.y*1.3);\n' +
    '    float lit=.20+cove*1.15+wash*.25+pl*.55*smoothstep(.2,1.5,vW.y)*(1.-smoothstep(4.,6.2,vW.y));\n' +
    '    col=w*lit; col+=vec3(1.,.64,.28)*cove*.55*groove;\n' +
    '    col+=vec3(.9,.62,.25)*line(vW.y,5.55,.025)*.9*(.4+pl*.6);\n' +
    '    col+=vec3(.9,.62,.25)*line(vW.y,.35,.02)*.5;\n' +
    '  } else if(uKind==2){ // ceiling\n' +
    '    col=vec3(.045,.034,.028);\n' +
    '    float ax=abs(vW.x);\n' +
    '    if(ax<1.9){ float groove; vec3 w=slats(vW.x,vW.z,0.3,vec3(.12,.065,.03),vec3(.40,.23,.11),groove); col=w*.38; }\n' +
    '    float L=line(ax,2.15,.05)+line(ax,5.2,.05)+line(ax,1.78,.03);\n' +
    '    float cross_=smoothstep(.05,0.,abs(fract(vW.z/13.)-.5)*13.-5.8)*step(ax,6.2);\n' +
    '    col+=vec3(1.,.72,.38)*(L*.9+cross_*.5);\n' +
    '    col+=vec3(.5,.3,.12)*pl*.12;\n' +
    '  } else if(uKind==3){ // end wall with glowing doorway\n' +
    '    float groove; vec3 w=slats(vW.x,vW.y,0.34,vec3(.13,.07,.035),vec3(.40,.23,.11),groove); col=w*.7;\n' +
    '    float inx=smoothstep(.06,0.,abs(vW.x)-1.5), iny=smoothstep(.06,0.,vW.y-4.7)*smoothstep(-.06,.06,vW.y);\n' +
    '    float door=inx*iny; vec3 lightc=mix(vec3(1.,.62,.26),vec3(1.,.9,.7),smoothstep(0.,4.7,vW.y)*.8);\n' +
    '    col=mix(col,lightc*1.15,door);\n' +
    '    col+=vec3(1.,.64,.28)*exp(-abs(abs(vW.x)-1.5)*5.)*iny*.5;\n' +
    '  } else { // floor\n' +
    '    float n=vn(vW.xz*vec2(.6,.12))*.5+vn(vW.xz*vec2(3.,.5))*.2;\n' +
    '    col=vec3(.030,.021,.016)+n*.04;\n' +
    '    float seam=smoothstep(.015,0.,abs(fract(vW.z/3.25)-.5)*3.25-1.55)*.25 + smoothstep(.02,0.,abs(fract(vW.x/3.25+.5)-.5)*3.25-1.55)*.0;\n' +
    '    col+=vec3(.5,.32,.14)*seam*.25;\n' +
    '    col+=vec3(.95,.66,.28)*line(vW.x,0.,.035)*.9;\n' +
    '    col+=vec3(.95,.66,.28)*(line(vW.x,-4.3,.02)+line(vW.x,4.3,.02))*.30*(.3+pl);\n' +
    '    col+=vec3(.55,.30,.11)*pl*.45*(1.-abs(vW.x)/7.5);\n' +
    '    col+=vec3(.55,.30,.12)*exp(-(6.5-abs(vW.x))*1.1)*.16;\n' +
    '    float streak=pow(vn(vec2(vW.x*.9,vW.z*.05)),3.);\n' +
    '    col+=vec3(.6,.4,.18)*streak*.06*(1.-abs(vW.x)/7.);\n' +
    '    a=.80;\n' +
    '  }\n' +
    '  col=applyFog(col,vW); o=vec4(col,a);\n' +
    '}';

  var FS_TEX = '#version 300 es\nprecision highp float; in vec3 vW; in vec2 vUv; uniform sampler2D uTex; uniform vec3 uCam; uniform vec3 uFog; uniform float uTime; uniform float uAlpha; uniform float uPulse; uniform int uMode; uniform vec3 uColor; out vec4 o;\n' + FOGF +
    'void main(){\n' +
    '  vec3 c; float a=uAlpha;\n' +
    '  if(uMode==2){ // frame\n' +
    '    float g=.45+.55*pow(1.-abs(vUv.x-.5)*2.,.4); c=uColor*(.35+.65*vUv.y)*g+uColor*.08;\n' +
    '  } else {\n' +
    '    c=texture(uTex,vUv).rgb;\n' +
    '    vec2 q=vUv-.5; float vig=1.-dot(q,q)*.55; c*=vig;\n' +
    '    c*=1.0+uPulse*.12;\n' +
    '    float gl=pow(max(0.,1.-abs(vUv.x+vUv.y*.35-fract(uTime*.06)*2.4+.4)*5.),3.)*.20; c+=vec3(1.,.82,.55)*gl*(1.-float(uMode)*.8);\n' +
    '    if(uMode==1){ a*=pow(1.-vUv.y,1.7); }\n' +
    '  }\n' +
    '  c=applyFog(c,vW); o=vec4(c,a);\n' +
    '}';

  var FS_GLOW = '#version 300 es\nprecision highp float; in vec3 vW; in vec2 vUv; uniform vec3 uCam; uniform vec3 uFog; uniform vec3 uColor; uniform float uInt; uniform int uShape; uniform float uTime; out vec4 o;\n' + FOGF +
    'void main(){\n' +
    '  float a=0.; vec2 p=vUv-.5;\n' +
    '  if(uShape==0){ a=pow(clamp(1.-length(p)*2.,0.,1.),2.2); }\n' +
    '  else if(uShape==1){ float dx=abs(p.x)*2., dy=abs(p.y)*2.; a=(1.-smoothstep(.35,1.,dx))*(1.-smoothstep(.35,1.,dy)); a=a*a; }\n' +
    '  else if(uShape==2){ a=pow(vUv.y,1.5)*(1.-smoothstep(.0,1.,abs(p.x)*2.)); a*=a*1.3; }\n' +
    '  else { float r=length(p)*2.; a=smoothstep(.07,0.,abs(r-.84))*1.3+pow(clamp(1.-r,0.,1.),2.)*.35; a*=(.85+.15*sin(uTime*1.3+vW.z)); }\n' +
    '  vec3 c=uColor*a*uInt; float d=length(vW-uCam); float f=1.-exp(-(d*d*0.00012+d*0.003)); c*=(1.-f*.85);\n' +
    '  o=vec4(c,0.);\n' +
    '}';

  var VS_PTS = '#version 300 es\nin vec4 aP; uniform mat4 uVP; uniform float uTime; uniform vec3 uCam; uniform float uPx; out float vA;\n' +
    'void main(){ vec3 p=aP.xyz; float s=aP.w;\n' +
    '  p.y=mod(p.y+uTime*.12*(.4+s)+sin(uTime*.3+s*20.)*.2,7.);\n' +
    '  p.x+=sin(uTime*.2*s+p.z)*.5; p.z+=cos(uTime*.15+s*9.)*.4;\n' +
    '  vec4 c=uVP*vec4(p,1.); gl_Position=c; float d=max(.1,c.w);\n' +
    '  gl_PointSize=clamp((.05+s*.07)*uPx/d,1.,9.); vA=(.25+s*.6)*smoothstep(1.5,5.,d)*(1.-smoothstep(30.,70.,d)); }';
  var FS_PTS = '#version 300 es\nprecision mediump float; in float vA; out vec4 o; void main(){ vec2 p=gl_PointCoord-.5; float a=clamp(1.-length(p)*2.,0.,1.); a*=a; o=vec4(vec3(1.,.76,.42)*a*vA,0.); }';

  function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(s), src.split('\n').map(function (l, i) { return (i + 1) + ': ' + l; }).join('\n')); } return s; }
  function prog(vs, fs, uniforms) {
    var p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) console.error(gl.getProgramInfoLog(p));
    var u = {}; uniforms.forEach(function (n) { u[n] = gl.getUniformLocation(p, n); }); return { p: p, u: u };
  }
  var P_SURF = prog(VS, FS_SURF, ['uVP', 'uM', 'uCam', 'uFog', 'uTime', 'uKind', 'uPZ']);
  var P_TEX = prog(VS, FS_TEX, ['uVP', 'uM', 'uTex', 'uCam', 'uFog', 'uTime', 'uAlpha', 'uPulse', 'uMode', 'uColor']);
  var P_GLOW = prog(VS, FS_GLOW, ['uVP', 'uM', 'uCam', 'uFog', 'uColor', 'uInt', 'uShape', 'uTime']);
  var P_PTS = prog(VS_PTS, FS_PTS, ['uVP', 'uTime', 'uCam', 'uPx']);

  /* ---------- geometry ---------- */
  function mkBuf(data) { var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW); return b; }
  function mkVAO(prog_, buf, stride, attrs) {
    var v = gl.createVertexArray(); gl.bindVertexArray(v); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    attrs.forEach(function (a) { var loc = gl.getAttribLocation(prog_.p, a.name); if (loc < 0) return; gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, a.size, gl.FLOAT, false, stride * 4, a.off * 4); });
    return v;
  }
  function quad(p0, p1, p2, p3) { // 4 verts as 2 triangles, uv (0,0)(1,0)(1,1)(0,1)
    var v = [p0, p1, p2, p0, p2, p3], uv = [[0,0],[1,0],[1,1],[0,0],[1,1],[0,1]], o = [];
    for (var i = 0; i < 6; i++) o.push(v[i][0], v[i][1], v[i][2], uv[i][0], uv[i][1]);
    return o;
  }
  var unit = mkBuf(quad([-.5,-.5,0],[.5,-.5,0],[.5,.5,0],[-.5,.5,0]));
  var surfBuf = {
    floor: mkBuf(quad([-CORR_HALF, 0, Z_NEAR], [CORR_HALF, 0, Z_NEAR], [CORR_HALF, 0, Z_FAR], [-CORR_HALF, 0, Z_FAR])),
    ceil: mkBuf(quad([-CORR_HALF, CORR_H, Z_FAR], [CORR_HALF, CORR_H, Z_FAR], [CORR_HALF, CORR_H, Z_NEAR], [-CORR_HALF, CORR_H, Z_NEAR])),
    wallL: mkBuf(quad([-CORR_HALF, 0, Z_NEAR], [-CORR_HALF, 0, Z_FAR], [-CORR_HALF, CORR_H, Z_FAR], [-CORR_HALF, CORR_H, Z_NEAR])),
    wallR: mkBuf(quad([CORR_HALF, 0, Z_FAR], [CORR_HALF, 0, Z_NEAR], [CORR_HALF, CORR_H, Z_NEAR], [CORR_HALF, CORR_H, Z_FAR])),
    end: mkBuf(quad([CORR_HALF, 0, Z_FAR], [-CORR_HALF, 0, Z_FAR], [-CORR_HALF, CORR_H, Z_FAR], [CORR_HALF, CORR_H, Z_FAR]))
  };
  var VAO = {
    surf: {}, unitTex: mkVAO(P_TEX, unit, 5, [{ name: 'aPos', size: 3, off: 0 }, { name: 'aUv', size: 2, off: 3 }]),
    unitGlow: mkVAO(P_GLOW, unit, 5, [{ name: 'aPos', size: 3, off: 0 }, { name: 'aUv', size: 2, off: 3 }])
  };
  Object.keys(surfBuf).forEach(function (k) { VAO.surf[k] = mkVAO(P_SURF, surfBuf[k], 5, [{ name: 'aPos', size: 3, off: 0 }, { name: 'aUv', size: 2, off: 3 }]); });
  var NPTS = 520, ptsData = [];
  for (var i = 0; i < NPTS; i++) ptsData.push((Math.random() * 2 - 1) * CORR_HALF * .95, Math.random() * CORR_H, Z_NEAR - Math.random() * (Z_NEAR - Z_FAR), Math.random());
  var ptsBuf = mkBuf(ptsData);
  var VAO_PTS = mkVAO(P_PTS, ptsBuf, 4, [{ name: 'aP', size: 4, off: 0 }]);

  /* ---------- textures ---------- */
  var tex = {}, pending = 0, loadedCount = 0, totalTex = 0;
  var aniso = gl.getExtension('EXT_texture_filter_anisotropic');
  function loadTex(key) {
    totalTex++;
    return new Promise(function (res) {
      var im = new Image();
      im.onload = function () {
        var t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, im);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        if (aniso) gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
        tex[key] = t; loadedCount++; setLoader(loadedCount / totalTex); res();
      };
      im.onerror = function () { loadedCount++; res(); };
      im.src = TEX[key];
    });
  }
  var loaderEl = document.querySelector('.hero-loader'), loaderBar = document.querySelector('.hero-loader i');
  function setLoader(f) { if (loaderBar) loaderBar.style.transform = 'scaleX(' + clamp(f, .04, 1) + ')'; }

  /* ---------- scene state ---------- */
  var W = 1, H = 1, aspect = 1, dpr = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    var r = canvas.getBoundingClientRect(); W = Math.max(2, Math.round(r.width * dpr)); H = Math.max(2, Math.round(r.height * dpr));
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
    aspect = W / H;
  }
  window.addEventListener('resize', resize); resize();

  var prog_ = 0, progTarget = 0, mouse = { x: 0, y: 0, tx: 0, ty: 0 }, lastT = 0, running = true, visible = true, lastZ = null;
  var slides = [].slice.call(hero.querySelectorAll('.hero-slide'));
  var dots = [].slice.call(hero.querySelectorAll('.hero-rail button'));
  var bar = hero.querySelector('.hero-progress i');

  function readScroll() {
    var r = hero.getBoundingClientRect(), total = Math.max(1, r.height - window.innerHeight);
    progTarget = clamp(-r.top / total, 0, 1);
  }
  window.addEventListener('scroll', readScroll, { passive: true }); readScroll();
  window.addEventListener('pointermove', function (e) { mouse.tx = (e.clientX / innerWidth - .5) * 2; mouse.ty = (e.clientY / innerHeight - .5) * 2; }, { passive: true });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) requestAnimationFrame(frame); }, { rootMargin: '100px' }).observe(hero);

  hero.querySelectorAll('.hero-rail button').forEach(function (b, i) {
    b.addEventListener('click', function () {
      var r = hero.getBoundingClientRect(), total = r.height - window.innerHeight, top = window.scrollY + r.top;
      window.scrollTo({ top: top + total * (i / 5) + 2, behavior: REDUCED ? 'auto' : 'smooth' });
    });
  });

  function updateUI(f) {
    for (var i = 0; i < slides.length; i++) {
      var w = i === 0 ? 1 - clamp(f / .42, 0, 1) : 1 - clamp(Math.abs(f - i) / .42, 0, 1);
      w = w * w * (3 - 2 * w);
      var s = slides[i];
      s.style.opacity = w.toFixed(3);
      s.style.transform = 'translate3d(0,' + ((1 - w) * 26).toFixed(1) + 'px,0)';
      s.style.visibility = w < .01 ? 'hidden' : 'visible';
      s.style.pointerEvents = w > .6 ? 'auto' : 'none';
    }
    var active = clamp(Math.round(f), 0, 5);
    dots.forEach(function (d, i) { d.classList.toggle('on', i === active); });
    if (bar) bar.style.transform = 'scaleX(' + clamp(prog_, 0, 1).toFixed(4) + ')';
    hero.classList.toggle('past-intro', f > .5);
    hero.style.setProperty('--hp', prog_.toFixed(4));
  }

  function camAt(p) {
    var f = p * 5, i = Math.min(4, Math.floor(f)), t = f - i;
    var e = REDUCED ? t : sstep(.18, .82, t);
    return { z: lerp(ST[i], ST[i + 1], e), f: f };
  }

  /* draw helpers */
  var VP = M.ident(), camPos = [0, 2.6, 6];
  function setCommon(p) {
    gl.useProgram(p.p); gl.uniformMatrix4fv(p.u.uVP, false, VP);
    if (p.u.uCam) gl.uniform3f(p.u.uCam, camPos[0], camPos[1], camPos[2]);
    if (p.u.uFog) gl.uniform3f(p.u.uFog, FOG[0], FOG[1], FOG[2]);
    if (p.u.uTime) gl.uniform1f(p.u.uTime, time);
  }
  var time = 0, ID = M.ident();
  function drawSurf(kind, vao) { gl.uniform1i(P_SURF.u.uKind, kind); gl.uniformMatrix4fv(P_SURF.u.uM, false, ID); gl.bindVertexArray(VAO.surf[vao]); gl.drawArrays(gl.TRIANGLES, 0, 6); }

  function portalLayout() {
    // scale portals down on narrow screens so both always fit
    var s = clamp(aspect * 0.85, 0.5, 1);
    return { s: s, x: 4.7 * s, w: 3.3 * s, h: 4.4 * s, cy: 2.9 + 0.5 * s };
  }

  function drawPortal(side, k, L, pulse) {
    var key = side < 0 ? CHAPTERS[k].left : CHAPTERS[k].right;
    var z = PZ[k], x = side * L.x, yaw = -side * .2;
    // frame (brass) + picture
    gl.useProgram(P_TEX.p); gl.bindVertexArray(VAO.unitTex);
    gl.uniform1f(P_TEX.u.uPulse, pulse);
    gl.uniform1i(P_TEX.u.uMode, 2); gl.uniform1f(P_TEX.u.uAlpha, 1); gl.uniform3f(P_TEX.u.uColor, .86, .62, .27);
    gl.uniformMatrix4fv(P_TEX.u.uM, false, M.trs(x, L.cy, z - .06, yaw, 0, L.w + .26 * L.s, L.h + .26 * L.s)); gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.uniform1i(P_TEX.u.uMode, 0); gl.uniform1i(P_TEX.u.uTex, 0);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex[key] || null);
    gl.uniformMatrix4fv(P_TEX.u.uM, false, M.trs(x, L.cy, z, yaw, 0, L.w, L.h)); gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  function drawReflection(side, k, L) {
    var key = side < 0 ? CHAPTERS[k].left : CHAPTERS[k].right;
    gl.uniform1i(P_TEX.u.uMode, 1); gl.uniform1f(P_TEX.u.uAlpha, .30); gl.uniform1f(P_TEX.u.uPulse, 0);
    gl.bindTexture(gl.TEXTURE_2D, tex[key] || null);
    // mirrored about y=0: negative y-scale flips the quad below the floor
    var m = M.trs(side * L.x, L.cy, PZ[k], -side * .2, 0, L.w, -L.h); m[13] = -L.cy; // centre mirrored
    gl.uniformMatrix4fv(P_TEX.u.uM, false, m); gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  function glow(shape, color, inten, m) { gl.uniform1i(P_GLOW.u.uShape, shape); gl.uniform3f(P_GLOW.u.uColor, color[0], color[1], color[2]); gl.uniform1f(P_GLOW.u.uInt, inten); gl.uniformMatrix4fv(P_GLOW.u.uM, false, m); gl.drawArrays(gl.TRIANGLES, 0, 6); }

  function render(dt) {
    time += dt;
    resize();
    gl.viewport(0, 0, W, H);
    gl.clearColor(FOG[0], FOG[1], FOG[2], 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL);

    var c = camAt(prog_);
    var speed = lastZ == null ? 0 : Math.abs(c.z - lastZ) / Math.max(dt, .001); lastZ = c.z;
    mouse.x += (mouse.tx - mouse.x) * Math.min(1, dt * 3); mouse.y += (mouse.ty - mouse.y) * Math.min(1, dt * 3);
    var bob = REDUCED ? 0 : Math.sin(time * 1.1) * .025;
    camPos = [mouse.x * .55, 2.55 + bob - mouse.y * .12, c.z];
    var tgt = [mouse.x * 1.4, 2.6 - mouse.y * .35, c.z - 12];
    var fov = (48 + clamp(speed * .12, 0, 7)) * Math.PI / 180;
    if (aspect < 1) fov = (48 + (1 - aspect) * 24) * Math.PI / 180;
    VP = M.mul(M.persp(fov, aspect, .1, 220), M.look(camPos, tgt, [0, 1, 0]));

    var L = portalLayout();
    // 1. corridor shell
    setCommon(P_SURF); gl.uniform1fv(P_SURF.u.uPZ, new Float32Array(PZ));
    gl.disable(gl.BLEND);
    drawSurf(1, 'wallL'); drawSurf(1, 'wallR'); drawSurf(2, 'ceil');
    drawSurf(3, 'end');
    // 2. reflections (before floor so the floor can tint them)
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false);
    setCommon(P_TEX); gl.bindVertexArray(VAO.unitTex);
    for (var k = 0; k < 5; k++) { if (Math.abs(PZ[k] - c.z) < 70 && PZ[k] < c.z + 4) { drawReflection(-1, k, L); drawReflection(1, k, L); } }
    gl.depthMask(true);
    // 3. portals
    gl.disable(gl.BLEND); setCommon(P_TEX);
    for (k = 0; k < 5; k++) {
      if (!(Math.abs(PZ[k] - c.z) < 90 && PZ[k] < c.z + 8)) continue;
      var near = 1 - clamp(Math.abs(PZ[k] - (c.z - 10)) / 8, 0, 1);
      drawPortal(-1, k, L, near); drawPortal(1, k, L, near);
    }
    // 4. floor (semi transparent over reflections)
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    setCommon(P_SURF); gl.uniform1fv(P_SURF.u.uPZ, new Float32Array(PZ)); drawSurf(0, 'floor');
    // 5. additive light: halos, beams, floor pools, lamp rings
    gl.blendFunc(gl.ONE, gl.ONE); gl.depthMask(false);
    setCommon(P_GLOW); gl.bindVertexArray(VAO.unitGlow);
    for (k = 0; k < 5; k++) {
      var z = PZ[k]; if (Math.abs(z - c.z) > 80) continue;
      [-1, 1].forEach(function (side) {
        var x = side * L.x, warm = side < 0 ? [1, .62, .26] : [1, .86, .62];
        glow(1, warm, .34, M.trs(x, L.cy, z - .3, -side * .2, 0, L.w * 1.9, L.h * 1.45));                     // halo
        glow(2, warm, .26, M.trs(x, L.cy + L.h * .5 + 1.8 * L.s, z + .1, 0, 0, L.w * 1.5, 4.2 * L.s));       // beam from ceiling
        glow(1, warm, .6, M.trs(x, .02, z + 1.7, 0, -Math.PI / 2, L.w * 1.7, 3.6 * L.s));                    // floor pool
      });
      var rf = sstep(7, 20, c.z - (z + 4));
      if (rf > .01) { glow(3, [1, .74, .38], .75 * rf, M.trs(0, 6.0, z + 4, 0, 0, 3.6, 3.6)); glow(0, [1, .7, .35], .22 * rf, M.trs(0, 6.0, z + 3.9, 0, 0, 7, 7)); }  // brass lamp ring
    }
    glow(0, [1, .65, .3], .5, M.trs(0, 3.0, Z_FAR + 1.6, 0, 0, 14, 11));
    // dust
    gl.useProgram(P_PTS.p); gl.uniformMatrix4fv(P_PTS.u.uVP, false, VP); gl.uniform1f(P_PTS.u.uTime, time); gl.uniform1f(P_PTS.u.uPx, H * .9);
    gl.bindVertexArray(VAO_PTS); gl.drawArrays(gl.POINTS, 0, NPTS);
    gl.depthMask(true); gl.disable(gl.BLEND);
    return c.f;
  }

  function frame(now) {
    if (!visible || !running) return;
    var dt = lastT ? Math.min(.05, (now - lastT) / 1000) : .016; lastT = now;
    var k = REDUCED ? 1 : 1 - Math.pow(.0009, dt);              // smoothing for buttery scroll
    prog_ += (progTarget - prog_) * k;
    var f = render(dt);
    updateUI(f);
    requestAnimationFrame(frame);
  }
  document.addEventListener('visibilitychange', function () { running = !document.hidden; if (running) { lastT = 0; requestAnimationFrame(frame); } });

  /* debugging / screenshots: window.SWW_HERO.go(0..1) jumps straight to a scroll position */
  window.SWW_HERO.go = function (p) { prog_ = progTarget = clamp(p, 0, 1); };

  var keys = Object.keys(TEX);
  Promise.all(keys.map(loadTex)).then(function () {
    root.classList.add('webgl-ready');
    if (loaderEl) { loaderEl.classList.add('done'); setTimeout(function () { loaderEl.remove(); }, 900); }
    requestAnimationFrame(frame);
  });
  if (!keys.length) { root.classList.add('webgl-ready'); requestAnimationFrame(frame); }
})();
