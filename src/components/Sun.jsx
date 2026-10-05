import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Sun = () => {
    const coreRef = useRef();
    const glowRef = useRef();

    useFrame(({ clock }) => {
        const elapsedTime = clock.getElapsedTime();

        if (coreRef.current) {
            coreRef.current.rotation.y = elapsedTime * 0.18;
            coreRef.current.rotation.x = Math.sin(elapsedTime * 0.24) * 0.08;
        }

        if (glowRef.current) {
            const pulse = 1 + Math.sin(elapsedTime * 1.4) * 0.035;
            glowRef.current.scale.setScalar(pulse);
        }
    });

    return (
        <group>
            <pointLight color="#ffb347" intensity={140} distance={45} decay={1.7} />

            <mesh ref={glowRef} raycast={() => null}>
                <sphereGeometry args={[2.45, 48, 48]} />
                <meshBasicMaterial
                    color="#ffb347"
                    transparent
                    opacity={0.18}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            <mesh raycast={() => null}>
                <sphereGeometry args={[1.8, 48, 48]} />
                <meshBasicMaterial
                    color="#ffef9f"
                    transparent
                    opacity={0.16}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            <mesh ref={coreRef} raycast={() => null}>
                <sphereGeometry args={[1.05, 64, 64]} />
                <meshStandardMaterial
                    color="#ff8c24"
                    emissive="#ffcc44"
                    emissiveIntensity={3.8}
                    roughness={0.35}
                />
            </mesh>

            <mesh rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
                <torusGeometry args={[1.18, 0.025, 12, 96]} />
                <meshBasicMaterial
                    color="#fff0a8"
                    transparent
                    opacity={0.5}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
};

export default Sun;
