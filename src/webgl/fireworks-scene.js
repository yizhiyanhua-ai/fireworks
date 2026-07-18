/**
 * 一支烟花 AI · WebGL2 3D 烟花粒子引擎
 *
 * 零依赖实时烟花秀：透视星空 + 火箭升空拖尾 + 重力爆炸粒子。
 * 坐标系：x/y 为世界单位（y=-1 地面，y≈0.8 天空），z 向后延伸制造景深。
 * 相机只做平移视差，避免矩阵库。
 */

const TAU = Math.PI * 2;

const PALETTES = [
  { name: 'ember', core: [1.0, 0.88, 0.62], rim: [1.0, 0.55, 0.16] },
  { name: 'magenta', core: [1.0, 0.72, 0.78], rim: [1.0, 0.28, 0.52] },
  { name: 'violet', core: [0.86, 0.76, 1.0], rim: [0.55, 0.38, 1.0] },
  { name: 'cyan', core: [0.78, 0.95, 1.0], rim: [0.25, 0.72, 1.0] },
  { name: 'jade', core: [0.82, 1.0, 0.86], rim: [0.28, 0.9, 0.55] },
];

const MAX_PARTICLES = 8000;
const STAR_COUNT = 720;
const FLOATS_PER_PARTICLE = 9; // x y z r g b size alpha seed

const VERTEX_SHADER = `#version 300 es
precision highp float;

layout(location = 0) in vec3 a_pos;
layout(location = 1) in vec3 a_color;
layout(location = 2) in float a_size;
layout(location = 3) in float a_alpha;
layout(location = 4) in float a_seed;

uniform mat4 u_proj;
uniform vec3 u_eye;
uniform float u_time;
uniform float u_dpr;
uniform float u_pixelHeight;
uniform float u_viewHeight;
uniform float u_twinkle;

out vec3 v_color;
out float v_alpha;

void main() {
  vec4 view = vec4(a_pos - u_eye, 1.0);
  gl_Position = u_proj * view;

  float depth = max(0.35, -view.z);
  // 世界尺寸 → 屏幕像素：fractionOfScreen = size / (viewHeightAtDepth)，再乘画布像素高
  gl_PointSize = clamp(a_size * u_pixelHeight / (u_viewHeight * depth), 0.0, 160.0 * u_dpr);

  float flicker = 1.0 - u_twinkle * (0.5 + 0.5 * sin(u_time * (2.0 + a_seed * 6.0) + a_seed * 43.7));
  v_color = a_color;
  v_alpha = a_alpha * flicker;
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec3 v_color;
in float v_alpha;
out vec4 outColor;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float dist = length(uv) * 2.0;
  if (dist > 1.0) discard;

  float glow = pow(1.0 - dist, 1.85);
  float core = pow(max(0.0, 1.0 - dist * 1.9), 2.0);
  vec3 color = mix(v_color, vec3(1.0, 0.98, 0.94), core * 0.75);
  // 预乘 alpha：配合 ONE/ONE 加法混合与画布预乘合成
  float a = v_alpha * glow;
  outColor = vec4(color * a, a);
}
`;

function perspective(out, fovY, aspect, near, far) {
  const f = 1 / Math.tan(fovY / 2);
  out[0] = f / aspect; out[1] = 0; out[2] = 0; out[3] = 0;
  out[4] = 0; out[5] = f; out[6] = 0; out[7] = 0;
  out[8] = 0; out[9] = 0; out[10] = (far + near) / (near - far); out[11] = -1;
  out[12] = 0; out[13] = 0; out[14] = (2 * far * near) / (near - far); out[15] = 0;
  return out;
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`shader compile failed: ${info}`);
  }
  return shader;
}

function createProgram(gl, vertexSource, fragmentSource) {
  const program = gl.createProgram();
  gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, vertexSource));
  gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`program link failed: ${gl.getProgramInfoLog(program)}`);
  }
  return program;
}

export function createFireworksScene(canvas, options = {}) {
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance',
    premultipliedAlpha: true,
  });
  if (!gl) throw new Error('WebGL2 unavailable');

  const reducedMotion = options.reducedMotion === true;

  // ---------- GPU resources ----------
  const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
  gl.useProgram(program);

  const uniforms = {
    proj: gl.getUniformLocation(program, 'u_proj'),
    eye: gl.getUniformLocation(program, 'u_eye'),
    time: gl.getUniformLocation(program, 'u_time'),
    dpr: gl.getUniformLocation(program, 'u_dpr'),
    pixelHeight: gl.getUniformLocation(program, 'u_pixelHeight'),
    viewHeight: gl.getUniformLocation(program, 'u_viewHeight'),
    twinkle: gl.getUniformLocation(program, 'u_twinkle'),
  };

  const stride = FLOATS_PER_PARTICLE * 4;

  function makeVao(data, usage) {
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, stride, 12);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 1, gl.FLOAT, false, stride, 24);
    gl.enableVertexAttribArray(3);
    gl.vertexAttribPointer(3, 1, gl.FLOAT, false, stride, 28);
    gl.enableVertexAttribArray(4);
    gl.vertexAttribPointer(4, 1, gl.FLOAT, false, stride, 32);
    gl.bindVertexArray(null);
    return { vao, buffer };
  }

  // ---------- Stars ----------
  const starData = new Float32Array(STAR_COUNT * FLOATS_PER_PARTICLE);
  for (let i = 0; i < STAR_COUNT; i += 1) {
    const o = i * FLOATS_PER_PARTICLE;
    const depth = rand(-3.4, -1.1);
    starData[o] = rand(-3.4, 3.4) * -depth * 0.62;
    starData[o + 1] = rand(-0.55, 1.9) * -depth * 0.5;
    starData[o + 2] = depth;
    const warmth = Math.random();
    starData[o + 3] = 0.75 + warmth * 0.25;
    starData[o + 4] = 0.78 + warmth * 0.16;
    starData[o + 5] = 0.92 - warmth * 0.18;
    starData[o + 6] = rand(0.016, 0.042); // size
    starData[o + 7] = rand(0.35, 0.95); // alpha
    starData[o + 8] = Math.random(); // seed
  }
  const stars = makeVao(starData, gl.STATIC_DRAW);

  // ---------- Particles ----------
  const particleData = new Float32Array(MAX_PARTICLES * FLOATS_PER_PARTICLE);
  // CPU mirror of simulation state (not uploaded): vx vy vz age life kind grav drag palette
  const SIM_STRIDE = 9;
  const sim = new Float32Array(MAX_PARTICLES * SIM_STRIDE);
  const SIM_VX = 0; const SIM_VY = 1; const SIM_VZ = 2; const SIM_AGE = 3;
  const SIM_LIFE = 4; const SIM_KIND = 5; const SIM_GRAV = 6; const SIM_DRAG = 7;
  const SIM_PAL = 8;
  const KIND_ROCKET = 1;
  const KIND_SPARK = 2;
  const KIND_EMBER = 3;
  let cursor = 0;
  const particles = makeVao(particleData, gl.DYNAMIC_DRAW);

  function spawn() {
    const index = cursor;
    cursor = (cursor + 1) % MAX_PARTICLES;
    return index;
  }

  function kill(index) {
    particleData[index * FLOATS_PER_PARTICLE + 7] = 0;
    sim[index * SIM_STRIDE + SIM_LIFE] = 0;
  }

  function spawnRocket(targetX, targetY, z, palette, paletteIdx) {
    const index = spawn();
    const o = index * FLOATS_PER_PARTICLE;
    const s = index * SIM_STRIDE;
    const startX = targetX + rand(-0.16, 0.16);
    particleData[o] = startX;
    particleData[o + 1] = -1.04;
    particleData[o + 2] = z;
    particleData[o + 3] = palette.core[0];
    particleData[o + 4] = palette.core[1];
    particleData[o + 5] = palette.core[2];
    particleData[o + 6] = 0.040;
    particleData[o + 7] = 1.0;
    particleData[o + 8] = Math.random();

    const flightTime = rand(0.9, 1.35);
    const gravity = 1.35;
    sim[s + SIM_VX] = (targetX - startX) / flightTime;
    sim[s + SIM_VY] = (targetY + 1.04 + 0.5 * gravity * flightTime * flightTime) / flightTime;
    sim[s + SIM_VZ] = 0;
    sim[s + SIM_AGE] = 0;
    sim[s + SIM_LIFE] = flightTime;
    sim[s + SIM_KIND] = KIND_ROCKET;
    sim[s + SIM_GRAV] = gravity;
    sim[s + SIM_DRAG] = 0;
    sim[s + SIM_PAL] = paletteIdx;
  }

  function spawnSpark(x, y, z, palette, inner) {
    const index = spawn();
    const o = index * FLOATS_PER_PARTICLE;
    const s = index * SIM_STRIDE;
    particleData[o] = x;
    particleData[o + 1] = y;
    particleData[o + 2] = z;
    const color = inner ? palette.core : palette.rim;
    particleData[o + 3] = color[0];
    particleData[o + 4] = color[1];
    particleData[o + 5] = color[2];
    particleData[o + 6] = inner ? rand(0.030, 0.052) : rand(0.024, 0.044);
    particleData[o + 7] = 1;
    particleData[o + 8] = Math.random();

    // 高斯球面方向，比均匀随机更像真实烟花
    const theta = Math.random() * TAU;
    const u = rand(-1, 1);
    const ring = Math.sqrt(Math.max(0, 1 - u * u));
    const speed = (inner ? rand(0.10, 0.34) : rand(0.34, 0.95)) * (z < -1.6 ? 1.25 : 1);
    sim[s + SIM_VX] = ring * Math.cos(theta) * speed;
    sim[s + SIM_VY] = (ring * Math.sin(theta) * speed * 0.96) + 0.06;
    sim[s + SIM_VZ] = u * speed * 0.55;
    sim[s + SIM_AGE] = 0;
    sim[s + SIM_LIFE] = inner ? rand(1.4, 2.2) : rand(2.0, 3.6);
    sim[s + SIM_KIND] = KIND_SPARK;
    sim[s + SIM_GRAV] = inner ? 0.34 : 0.5;
    sim[s + SIM_DRAG] = inner ? 1.5 : 1.05;
    return index;
  }

  function spawnEmber(x, y, z, vx, vy, vz, r, g, b, size) {
    const index = spawn();
    const o = index * FLOATS_PER_PARTICLE;
    const s = index * SIM_STRIDE;
    particleData[o] = x;
    particleData[o + 1] = y;
    particleData[o + 2] = z;
    particleData[o + 3] = r;
    particleData[o + 4] = g;
    particleData[o + 5] = b;
    particleData[o + 6] = size;
    particleData[o + 7] = 0.5;
    particleData[o + 8] = Math.random();
    sim[s + SIM_VX] = vx;
    sim[s + SIM_VY] = vy;
    sim[s + SIM_VZ] = vz;
    sim[s + SIM_AGE] = 0;
    sim[s + SIM_LIFE] = rand(0.3, 0.6);
    sim[s + SIM_KIND] = KIND_EMBER;
    sim[s + SIM_GRAV] = 0.28;
    sim[s + SIM_DRAG] = 1.8;
  }

  function explode(x, y, z, palette, scale = 1) {
    const count = Math.round((150 + Math.random() * 130) * scale);
    for (let i = 0; i < count; i += 1) {
      spawnSpark(x, y, z, palette, i % 4 === 0);
    }
    // 中心闪光
    for (let i = 0; i < 10; i += 1) {
      spawnEmber(x, y, z, rand(-0.05, 0.05), rand(-0.02, 0.08), rand(-0.03, 0.03),
        1, 0.97, 0.9, rand(0.12, 0.2));
    }
  }

  // ---------- Launch control ----------
  let paletteIndex = Math.floor(Math.random() * PALETTES.length);
  let nextAutoLaunch = 0.4;
  let elapsed = 0;

  function pickPalette() {
    paletteIndex = (paletteIndex + 1 + (Math.random() < 0.3 ? 1 : 0)) % PALETTES.length;
    return PALETTES[paletteIndex];
  }

  function visibleHalfWidth(z) {
    // 该深度平面的可见半宽 = aspect * tan(fov/2) * 到相机距离
    return aspect * 0.4877 * (eye[2] - z);
  }

  function launch(nx = null) {
    pickPalette();
    const palette = PALETTES[paletteIndex];
    const z = rand(-2.1, 0.15);
    const halfWidth = visibleHalfWidth(z);
    const targetX = nx === null ? rand(-halfWidth * 0.78, halfWidth * 0.78) : nx * halfWidth;
    const targetY = rand(0.12, 0.86);
    spawnRocket(targetX, targetY, z, palette, paletteIndex);
    return palette;
  }

  // ---------- Camera / viewport ----------
  const eye = [0, 0.08, 2.6];
  const eyeTarget = [0, 0.08, 2.6];
  const proj = new Float32Array(16);
  let aspect = 1;
  let dpr = 1;
  let width = 0;
  let height = 0;

  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    const nextWidth = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const nextHeight = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (nextWidth === width && nextHeight === height) return;
    width = nextWidth;
    height = nextHeight;
    canvas.width = width;
    canvas.height = height;
    aspect = width / height;
    perspective(proj, (52 * Math.PI) / 180, aspect, 0.1, 30);
    gl.viewport(0, 0, width, height);
  }

  // ---------- Interaction ----------
  function setPointer(nx, ny) {
    // nx/ny ∈ [-1, 1]，来自 hero 区域的归一化坐标
    eyeTarget[0] = nx * 0.22;
    eyeTarget[1] = 0.08 + ny * 0.12;
  }

  // ---------- Simulation ----------
  function step(dt) {
    elapsed += dt;

    if (!reducedMotion && elapsed >= nextAutoLaunch) {
      launch();
      if (Math.random() < 0.26) {
        // 小高潮：连发
        setTimeout(() => launch(), 180);
        setTimeout(() => launch(), 390);
      }
      nextAutoLaunch = elapsed + rand(0.55, 1.2);
    }

    for (let i = 0; i < MAX_PARTICLES; i += 1) {
      const s = i * SIM_STRIDE;
      const life = sim[s + SIM_LIFE];
      if (life <= 0) continue;

      sim[s + SIM_AGE] += dt;
      const age = sim[s + SIM_AGE];
      const o = i * FLOATS_PER_PARTICLE;

      if (age >= life) {
        if (sim[s + SIM_KIND] === KIND_ROCKET) {
          const palette = PALETTES[sim[s + SIM_PAL] % PALETTES.length];
          explode(particleData[o], particleData[o + 1], particleData[o + 2], palette);
        }
        kill(i);
        continue;
      }

      const drag = sim[s + SIM_DRAG];
      if (drag > 0) {
        const decay = Math.max(0, 1 - drag * dt);
        sim[s + SIM_VX] *= decay;
        sim[s + SIM_VY] *= decay;
        sim[s + SIM_VZ] *= decay;
      }
      sim[s + SIM_VY] -= sim[s + SIM_GRAV] * dt;

      particleData[o] += sim[s + SIM_VX] * dt;
      particleData[o + 1] += sim[s + SIM_VY] * dt;
      particleData[o + 2] += sim[s + SIM_VZ] * dt;

      const kind = sim[s + SIM_KIND];
      const fade = 1 - age / life;
      if (kind === KIND_ROCKET) {
        particleData[o + 7] = 0.55 + 0.45 * fade;
        // 火箭拖尾
        if (Math.random() < 0.6) {
          spawnEmber(
            particleData[o], particleData[o + 1], particleData[o + 2],
            rand(-0.05, 0.05), rand(-0.3, -0.08), rand(-0.03, 0.03),
            1.0, 0.72, 0.35, rand(0.014, 0.024),
          );
        }
      } else if (kind === KIND_SPARK) {
        particleData[o + 7] = Math.pow(fade, 1.5);
        if (age > 0.08 && Math.random() < 0.13) {
          spawnEmber(
            particleData[o], particleData[o + 1], particleData[o + 2],
            sim[s + SIM_VX] * 0.06, sim[s + SIM_VY] * 0.06, sim[s + SIM_VZ] * 0.06,
            particleData[o + 3], particleData[o + 4], particleData[o + 5],
            particleData[o + 6] * 0.55,
          );
        }
      } else {
        particleData[o + 7] = 0.5 * fade;
      }
    }

    // 相机缓动
    eye[0] += (eyeTarget[0] - eye[0]) * Math.min(1, dt * 3.2);
    eye[1] += (eyeTarget[1] - eye[1]) * Math.min(1, dt * 3.2);
  }

  // ---------- Render loop ----------
  let rafId = 0;
  let running = false;
  let lastTime = 0;
  let uploaded = false;

  function frame(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - lastTime) / 1000 || 0.016);
    lastTime = now;

    resize();
    step(dt);

    gl.bindVertexArray(particles.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, particles.buffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, particleData);
    uploaded = true;

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniformMatrix4fv(uniforms.proj, false, proj);
    gl.uniform3fv(uniforms.eye, eye);
    gl.uniform1f(uniforms.time, elapsed);
    gl.uniform1f(uniforms.dpr, dpr);
    gl.uniform1f(uniforms.pixelHeight, height);
    gl.uniform1f(uniforms.viewHeight, 2 * Math.tan((52 * Math.PI) / 360));

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);

    // 星空
    gl.uniform1f(uniforms.twinkle, 0.55);
    gl.bindVertexArray(stars.vao);
    gl.drawArrays(gl.POINTS, 0, STAR_COUNT);

    // 烟花粒子
    gl.uniform1f(uniforms.twinkle, 0.22);
    gl.bindVertexArray(particles.vao);
    gl.drawArrays(gl.POINTS, 0, MAX_PARTICLES);

    gl.bindVertexArray(null);
    rafId = window.requestAnimationFrame(frame);
  }

  return {
    start() {
      if (running) return;
      running = true;
      lastTime = performance.now();
      if (!uploaded) {
        gl.bindBuffer(gl.ARRAY_BUFFER, particles.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, particleData, gl.DYNAMIC_DRAW);
      }
      if (elapsed === 0 && !reducedMotion) {
        // 首屏即有一束在空中，避免冷启动空场
        explode(rand(-0.45, 0.45), rand(0.3, 0.68), rand(-1.5, -0.2), PALETTES[paletteIndex], 1.15);
      }
      rafId = window.requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = 0;
    },
    resize,
    setPointer,
    stats() {
      let rockets = 0; let sparks = 0; let embers = 0;
      for (let i = 0; i < MAX_PARTICLES; i += 1) {
        const s = i * SIM_STRIDE;
        if (sim[s + SIM_LIFE] <= 0) continue;
        const kind = sim[s + SIM_KIND];
        if (kind === KIND_ROCKET) rockets += 1;
        else if (kind === KIND_SPARK) sparks += 1;
        else embers += 1;
      }
      return { elapsed, rockets, sparks, embers, aspect, width, height };
    },
    launchAt(nx) {
      launch(nx);
    },
    burst() {
      const palette = pickPalette();
      explode(rand(-0.6, 0.6), rand(0.25, 0.75), rand(-1.4, 0), palette, 1.35);
    },
    destroy() {
      this.stop();
      gl.deleteBuffer(stars.buffer);
      gl.deleteBuffer(particles.buffer);
      gl.deleteVertexArray(stars.vao);
      gl.deleteVertexArray(particles.vao);
      gl.deleteProgram(program);
      const lose = gl.getExtension('WEBGL_lose_context');
      if (lose) lose.loseContext();
    },
  };
}
