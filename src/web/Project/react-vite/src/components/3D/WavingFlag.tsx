/**
 * VAULT — 3D Waving American Flag
 * Patriotic silhouette with realistic cloth physics
 *
 * Uses React Three Fiber for WebGL rendering
 * Cloth simulation via vertex manipulation with sin/cos waves
 *
 * VAULT LLC — A Northstar|Insight Inc. Company
 * © 2026 All Rights Reserved
 */

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface WavingFlagProps {
  /** Flag width in 3D units */
  width?: number;
  /** Flag height in 3D units */
  height?: number;
  /** Wind speed (0-1) */
  windSpeed?: number;
  /** Wave intensity (0-1) */
  waveIntensity?: number;
  /** Silhouette tint color */
  color?: string;
  /** Secondary color for stripes */
  secondaryColor?: string;
  /** Show flagpole */
  showPole?: boolean;
  /** Enable camera controls (for debugging) */
  enableControls?: boolean;
  /** Container className */
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FLAG MESH COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface FlagMeshProps {
  width: number;
  height: number;
  windSpeed: number;
  waveIntensity: number;
  color: string;
  secondaryColor: string;
}

function FlagMesh({
  width,
  height,
  windSpeed,
  waveIntensity,
  color,
  secondaryColor
}: FlagMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.PlaneGeometry>(null);

  // Store original positions for wave calculations
  const originalPositions = useRef<Float32Array | null>(null);

  // Segments for cloth detail
  const widthSegments = 40;
  const heightSegments = 30;

  // Create custom shader material for American flag silhouette
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(color) },
        uSecondaryColor: { value: new THREE.Color(secondaryColor) },
        uOpacity: { value: 0.85 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying float vWave;

        void main() {
          vUv = uv;
          vWave = position.z;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uSecondaryColor;
        uniform float uOpacity;
        uniform float uTime;

        varying vec2 vUv;
        varying float vWave;

        void main() {
          // Create American flag pattern (simplified silhouette)
          vec3 finalColor = uColor;

          // Stripes (13 stripes)
          float stripeCount = 13.0;
          float stripeIndex = floor(vUv.y * stripeCount);
          bool isAlternate = mod(stripeIndex, 2.0) < 1.0;

          // Union (blue canton) in top-left
          bool isUnion = vUv.x < 0.4 && vUv.y > 0.538;

          if (isUnion) {
            // Union area - darker tint
            finalColor = uSecondaryColor * 0.7;
          } else if (isAlternate) {
            // Alternate stripes - slightly different shade
            finalColor = mix(uColor, uSecondaryColor, 0.3);
          }

          // Add subtle wave-based shading for depth
          float shade = 0.9 + vWave * 0.5;
          finalColor *= shade;

          // Edge fade for silhouette effect
          float edgeFade = smoothstep(0.0, 0.02, vUv.x) * smoothstep(0.0, 0.02, 1.0 - vUv.x);
          edgeFade *= smoothstep(0.0, 0.02, vUv.y) * smoothstep(0.0, 0.02, 1.0 - vUv.y);

          gl_FragColor = vec4(finalColor, uOpacity * edgeFade);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, [color, secondaryColor]);

  // Animation frame - cloth physics simulation
  useFrame((state) => {
    if (!meshRef.current || !geometryRef.current) return;

    const geometry = geometryRef.current;
    const positions = geometry.attributes.position.array as Float32Array;

    // Store original positions on first frame
    if (!originalPositions.current) {
      originalPositions.current = new Float32Array(positions);
    }

    const time = state.clock.elapsedTime * windSpeed * 2;
    const original = originalPositions.current;

    // Apply wave deformation
    for (let i = 0; i < positions.length; i += 3) {
      const x = original[i];
      const y = original[i + 1];

      // Distance from flagpole (left edge) - more movement further from pole
      const distanceFromPole = (x + width / 2) / width;

      // Multiple wave frequencies for realistic cloth
      const wave1 = Math.sin(x * 2 + time * 3) * 0.1;
      const wave2 = Math.sin(y * 3 + time * 2) * 0.05;
      const wave3 = Math.sin(x * 4 + y * 2 + time * 4) * 0.03;

      // Combine waves with distance falloff
      const totalWave = (wave1 + wave2 + wave3) * waveIntensity * distanceFromPole * distanceFromPole;

      // Apply Z displacement (cloth billowing)
      positions[i + 2] = totalWave;

      // Slight X displacement for more natural movement
      positions[i] = original[i] + Math.sin(time * 2 + y * 2) * 0.02 * distanceFromPole * waveIntensity;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();

    // Update shader time
    material.uniforms.uTime.value = time;
  });

  return (
    <mesh ref={meshRef} position={[width / 4, 0, 0]}>
      <planeGeometry
        ref={geometryRef}
        args={[width, height, widthSegments, heightSegments]}
      />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FLAGPOLE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface FlagpoleProps {
  height: number;
  flagHeight: number;
  color: string;
}

function Flagpole({ height, flagHeight, color }: FlagpoleProps) {
  const poleHeight = height + flagHeight / 2 + 0.3;

  return (
    <group position={[0, -flagHeight / 4, 0]}>
      {/* Main pole */}
      <mesh position={[0, poleHeight / 2 - flagHeight / 2, 0]}>
        <cylinderGeometry args={[0.03, 0.04, poleHeight, 16]} />
        <meshStandardMaterial
          color={color}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Pole cap (finial) */}
      <mesh position={[0, poleHeight - flagHeight / 2 + 0.1, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Base */}
      <mesh position={[0, -flagHeight / 2 - 0.05, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.1, 16]} />
        <meshStandardMaterial
          color={color}
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface FlagSceneProps {
  width: number;
  height: number;
  windSpeed: number;
  waveIntensity: number;
  color: string;
  secondaryColor: string;
  showPole: boolean;
  enableControls: boolean;
}

function FlagScene({
  width,
  height,
  windSpeed,
  waveIntensity,
  color,
  secondaryColor,
  showPole,
  enableControls,
}: FlagSceneProps) {
  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.4} />

      {/* Key light from top-right */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.6}
        castShadow
      />

      {/* Fill light from left */}
      <directionalLight
        position={[-3, 2, 3]}
        intensity={0.3}
        color="#b4c4d9"
      />

      {/* Rim light from behind */}
      <directionalLight
        position={[0, 0, -5]}
        intensity={0.2}
        color="#c9a227"
      />

      {/* Flag group */}
      <group rotation={[0, -0.1, 0]}>
        {showPole && (
          <Flagpole
            height={1.5}
            flagHeight={height}
            color="#4a5568"
          />
        )}

        <FlagMesh
          width={width}
          height={height}
          windSpeed={windSpeed}
          waveIntensity={waveIntensity}
          color={color}
          secondaryColor={secondaryColor}
        />
      </group>

      {/* Camera controls for debugging */}
      {enableControls && <OrbitControls enableZoom={false} />}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function WavingFlag({
  width = 2.4,
  height = 1.5,
  windSpeed = 0.5,
  waveIntensity = 0.8,
  color = '#1a202c',
  secondaryColor = '#c9a227',
  showPole = true,
  enableControls = false,
  className = '',
}: WavingFlagProps) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '300px',
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 3.5],
          fov: 45,
          near: 0.1,
          far: 100,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <FlagScene
            width={width}
            height={height}
            windSpeed={windSpeed}
            waveIntensity={waveIntensity}
            color={color}
            secondaryColor={secondaryColor}
            showPole={showPole}
            enableControls={enableControls}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NAMED EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export { WavingFlag };
