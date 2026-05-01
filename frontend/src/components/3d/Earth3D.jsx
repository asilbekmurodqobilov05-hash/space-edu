import { useEffect, useRef } from 'react';

/**
 * Interactive 3D Earth using vanilla Three.js (r128 via CDN).
 * Loaded once into a canvas inside this component — no React Three Fiber needed.
 */
export default function Earth3D({ size = 520 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── load Three.js from CDN if not already present ──
    const loadThree = () =>
      new Promise((resolve) => {
        if (window.THREE) return resolve(window.THREE);
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = () => resolve(window.THREE);
        document.head.appendChild(script);
      });

    let animId;
    let renderer;

    loadThree().then((THREE) => {
      const W = size;
      const H = size;

      // ── Scene ──
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 1000);
      camera.position.z = 2.6;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      mount.appendChild(renderer.domElement);

      // ── Stars ──
      const starGeo = new THREE.BufferGeometry();
      const starCount = 5000;
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
        starPos[i * 3]     = (Math.random() - 0.5) * 600;
        starPos[i * 3 + 1] = (Math.random() - 0.5) * 600;
        starPos[i * 3 + 2] = (Math.random() - 0.5) * 600;
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5, sizeAttenuation: true });
      scene.add(new THREE.Points(starGeo, starMat));

      // ── Textures ──
      const loader = new THREE.TextureLoader();

      // Use local textures (already in /public/textures), fallback to CDN
      const earthMap    = loader.load('/textures/earth_atmos_2048.jpg',   undefined, undefined, () =>
        loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg'));
      const earthBump   = loader.load('/textures/earth_normal_2048.jpg',  undefined, undefined, () =>
        loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_1024.jpg'));
      const earthSpec   = loader.load('/textures/earth_specular_2048.jpg',undefined, undefined, () =>
        loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg'));
      const earthNight  = loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_lights_2048.png');
      const cloudMap    = loader.load('/textures/earth_clouds_1024.png',  undefined, undefined, () =>
        loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png'));

      // ── Earth ──
      const earthGeo = new THREE.SphereGeometry(1, 128, 128);
      const earthMat = new THREE.MeshPhongMaterial({
        map: earthMap,
        bumpMap: earthBump,
        bumpScale: 0.03,
        specularMap: earthSpec,
        specular: new THREE.Color(0x446688),
        shininess: 25,
      });
      const earth = new THREE.Mesh(earthGeo, earthMat);
      earth.rotation.x = 0.41;
      scene.add(earth);

      // ── Night lights (city glow) ──
      const nightMat = new THREE.ShaderMaterial({
        uniforms: {
          nightTexture: { value: earthNight },
          sunDirection: { value: new THREE.Vector3(1, 0.3, 0.5).normalize() },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position * 1.002, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D nightTexture;
          uniform vec3 sunDirection;
          varying vec2 vUv;
          varying vec3 vNormal;
          void main() {
            float sunDot = dot(vNormal, sunDirection);
            float nightFactor = smoothstep(-0.1, -0.3, sunDot);
            vec4 nightColor = texture2D(nightTexture, vUv);
            gl_FragColor = vec4(nightColor.rgb * nightFactor * 1.8, nightFactor * nightColor.r);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const nightMesh = new THREE.Mesh(earthGeo, nightMat);
      nightMesh.rotation.x = 0.41;
      scene.add(nightMesh);

      // ── Clouds ──
      const cloudMat = new THREE.MeshPhongMaterial({
        map: cloudMap,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const clouds = new THREE.Mesh(new THREE.SphereGeometry(1.008, 128, 128), cloudMat);
      clouds.rotation.x = 0.41;
      scene.add(clouds);

      // ── Atmosphere glow ──
      const atmosMat = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
            vec3 color = vec3(0.65, 0.54, 0.98); // #a78bfa (Purple)
            gl_FragColor = vec4(color, 1.0) * intensity * 2.0;
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
      });
      scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.15, 64, 64), atmosMat));

      // ── Lights ──
      const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.8);
      sunLight.position.set(5, 1.5, 2.5);
      scene.add(sunLight);
      scene.add(new THREE.AmbientLight(0x111122, 0.15));
      const fillLight = new THREE.DirectionalLight(0x334466, 0.3);
      fillLight.position.set(-5, -1, -3);
      scene.add(fillLight);
      const rimLight = new THREE.DirectionalLight(0x6644aa, 0.4);
      rimLight.position.set(-3, 2, -4);
      scene.add(rimLight);

      // ── Mouse drag ──
      let isDragging = false;
      let prevMouse = { x: 0, y: 0 };
      let rotVelocity = { x: 0, y: 0 };
      let targetRot = { x: 0.41, y: 0 };

      const canvas = renderer.domElement;

      const onMouseDown = (e) => {
        isDragging = true;
        prevMouse.x = e.clientX;
        prevMouse.y = e.clientY;
        rotVelocity.x = 0;
        rotVelocity.y = 0;
      };
      const onMouseUp = () => { isDragging = false; };
      const onMouseMove = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;
        rotVelocity.x = dy * 0.003;
        rotVelocity.y = dx * 0.003;
        targetRot.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRot.x + rotVelocity.x));
        targetRot.y += rotVelocity.y;
        prevMouse.x = e.clientX;
        prevMouse.y = e.clientY;
      };

      const onTouchStart = (e) => {
        isDragging = true;
        prevMouse.x = e.touches[0].clientX;
        prevMouse.y = e.touches[0].clientY;
      };
      const onTouchEnd = () => { isDragging = false; };
      const onTouchMove = (e) => {
        if (!isDragging) return;
        const dx = e.touches[0].clientX - prevMouse.x;
        const dy = e.touches[0].clientY - prevMouse.y;
        targetRot.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRot.x + dy * 0.003));
        targetRot.y += dx * 0.003;
        prevMouse.x = e.touches[0].clientX;
        prevMouse.y = e.touches[0].clientY;
      };

      canvas.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('mousemove', onMouseMove);
      canvas.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('touchend', onTouchEnd);
      window.addEventListener('touchmove', onTouchMove, { passive: true });

      // ── Animate ──
      const animate = () => {
        animId = requestAnimationFrame(animate);

        if (!isDragging) {
          targetRot.y += 0.0012;
          rotVelocity.x *= 0.95;
          rotVelocity.y *= 0.95;
          targetRot.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRot.x + rotVelocity.x));
          targetRot.y += rotVelocity.y;
        }

        earth.rotation.x    += (targetRot.x - earth.rotation.x) * 0.08;
        earth.rotation.y    += (targetRot.y - earth.rotation.y) * 0.08;
        nightMesh.rotation.x = earth.rotation.x;
        nightMesh.rotation.y = earth.rotation.y;
        clouds.rotation.x    = earth.rotation.x;
        clouds.rotation.y    = earth.rotation.y + Date.now() * 0.000003;

        renderer.render(scene, camera);
      };
      animate();

      // cleanup
      return () => {
        cancelAnimationFrame(animId);
        canvas.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('touchend', onTouchEnd);
        window.removeEventListener('touchmove', onTouchMove);
        renderer.dispose();
        if (mount.contains(canvas)) mount.removeChild(canvas);
      };
    });

    return () => {
      cancelAnimationFrame(animId);
      if (renderer) renderer.dispose();
    };
  }, [size]);

  return (
    <div
      ref={mountRef}
      style={{
        width: size,
        height: size,
        cursor: 'grab',
        borderRadius: '50%',
        overflow: 'hidden',
        // subtle outer glow ring, purple theme
        boxShadow: '0 0 80px rgba(167,139,250,0.18), 0 0 160px rgba(139,92,246,0.12)',
      }}
    />
  );
}
