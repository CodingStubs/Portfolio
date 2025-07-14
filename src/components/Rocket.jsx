// Rocket.jsx
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Rocket = ({ position = [0, 0, 0] }) => {
    const orbitRef = useRef();     // Handles orbit path
    const rocketRef = useRef();    // Handles rotation/orientation
    const [smoke, setSmoke] = useState([]);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();

        // Orbit position
        const radius = 5;
        const speed = 0.5;
        const x = Math.cos(t * speed) * radius + position[0];
        const z = Math.sin(t * speed) * radius + position[2];
        const y = Math.sin(t * speed) + position[1];
        // const y = 0;

        // const x = 0;
        // const y = 0;
        // const z = 15;

        orbitRef.current.position.set(x, y, z);

        // --- ROTATION LOGIC ---

        // Vector from rocket to origin (pointing inward)
        const toCenter = new THREE.Vector3(-x, -y, -z).normalize();

        // Define the rocket's up direction (its length axis)
        const up = new THREE.Vector3(0, 1, 0);

        // Compute quaternion that rotates the rocket so its length (Y-axis) is perpendicular to toCenter
        const sideAxis = new THREE.Vector3().crossVectors(up, toCenter).normalize(); // tangent vector (orbit direction)
        const perpUp = new THREE.Vector3().crossVectors(toCenter, sideAxis).normalize(); // adjusted "up" that's perpendicular to the orbit radius

        const m = new THREE.Matrix4().makeBasis(sideAxis, perpUp, toCenter);
        rocketRef.current.quaternion.setFromRotationMatrix(m);

        if (z > 0) {
            rocketRef.current.rotation.z = Math.PI / 2;
        } else {
            rocketRef.current.rotation.z = -Math.PI / 2;
        }

        // Update smoke trail
        setSmoke((prev) => {
            const newSmoke = [...prev, { position: [x, y, z], age: 0 }];
            return newSmoke
                .map((s) => ({ ...s, age: s.age + 0.02 }))
                .filter((s) => s.age < 1.5);
        });
    });

    return (
        <group>
            {/* Rocket orbiting group */}
            <group ref={orbitRef}>
                <group ref={rocketRef}>
                    {/* Body */}
                    <mesh>
                        <cylinderGeometry args={[0.05, 0.05, 0.5, 32]}/>
                        <meshStandardMaterial color="#6A0DAD" metalness={0.5}/>
                    </mesh>

                    {/* Window */}
                    <mesh position={[0, 0.08, -0.06]}>
                        <boxGeometry args={[0.03, 0.1, 0.01]}/>
                        <meshStandardMaterial color="#a39b99" emissive={"white"} emissiveIntensity={0.5}/>
                    </mesh>
                    <mesh position={[0, 0.08, 0.06]}>
                        <boxGeometry args={[0.03, 0.1, 0.01]}/>
                        <meshStandardMaterial color="#a39b99" emissive={"white"} emissiveIntensity={0.5}/>
                    </mesh>


                    {/* Nose cone */}
                    <mesh position={[0, 0.33, 0]}>
                        <coneGeometry args={[0.06, 0.165, 32]}/>
                        <meshStandardMaterial color="#FFD700" metalness={1}/>
                    </mesh>

                    {/* Tail flame ball */}
                    <mesh position={[0, -0.3, 0]}>
                        <sphereGeometry args={[0.04, 16, 16]}/>
                        <meshStandardMaterial emissive="orange" color="#FFA500"/>
                    </mesh>

                    {/* Side fins */}
                    <mesh position={[0.08, -0.2, 0]} rotation={[0, 0, Math.PI / 5]}>
                        <boxGeometry args={[0.025, 0.15, 0.05]}/>
                        <meshStandardMaterial color="#FFD700" metalness={1}/>
                    </mesh>
                    <mesh position={[-0.08, -0.2, 0]} rotation={[0, 0, -Math.PI / 5]}>
                        <boxGeometry args={[0.025, 0.15, 0.05]}/>
                        <meshStandardMaterial color="#FFD700" metalness={1}/>
                    </mesh>
                    <mesh position={[0, -0.2, 0.08]} rotation={[-Math.PI / 5, -Math.PI / 2, 0]}>
                        <boxGeometry args={[0.025, 0.15, 0.05]}/>
                        <meshStandardMaterial color="#FFD700" metalness={1}/>
                    </mesh>
                    <mesh position={[0, -0.2, -0.08]} rotation={[Math.PI / 5, -Math.PI / 2, 0]}>
                        <boxGeometry args={[0.025, 0.15, 0.05]}/>
                        <meshStandardMaterial color="#FFD700" metalness={1}/>
                    </mesh>
                </group>
            </group>

            {/* Smoke trail */}
            {smoke.map((s, i) => (
                <mesh key={i} position={s.position}>
                    <sphereGeometry args={[0.05 * (1 - s.age), 8, 8]}/>
                    <meshStandardMaterial
                        color="red"
                        transparent
                        opacity={0.5 - s.age}
                    />
                </mesh>
            ))}
        </group>
    );
};

export default Rocket;
