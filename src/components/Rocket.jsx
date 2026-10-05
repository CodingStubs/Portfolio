// Rocket.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const SMOKE_COUNT = 44;
const EXPLOSION_COUNT = 34;
const SMOKE_LIFETIME = 1.35;
const EXPLOSION_DURATION = 1.1;
const RESPAWN_DELAY = 2.2;
const ENTRY_DURATION = 1.8;
const DEFAULT_CAMERA_POSITION = new THREE.Vector3(-9, 4, 27);

const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);

const Rocket = ({ position = [0, 0, 0], isRocketPov = false, onRocketPhaseChange }) => {
    const { camera } = useThree();
    const orbitRef = useRef();     // Handles orbit path
    const rocketRef = useRef();    // Handles rotation/orientation
    const smokeRef = useRef();
    const explosionRef = useRef();

    const phaseRef = useRef('flying');
    const phaseStartRef = useRef(0);
    const latestTimeRef = useRef(0);
    const smokeCursorRef = useRef(0);
    const lastSmokeAtRef = useRef(0);
    const respawnStartRef = useRef(new THREE.Vector3(-12, 1.5, 8));
    const explosionOriginRef = useRef(new THREE.Vector3());
    const [phase, setPhaseState] = useState('flying');

    const smokeSlots = useRef(
        Array.from({ length: SMOKE_COUNT }, () => ({
            age: SMOKE_LIFETIME + 1,
            position: new THREE.Vector3(),
        }))
    );

    const explosionSlots = useRef(
        Array.from({ length: EXPLOSION_COUNT }, () => ({
            velocity: new THREE.Vector3(),
            position: new THREE.Vector3(),
        }))
    );

    const scratch = useMemo(() => ({
        current: new THREE.Vector3(),
        target: new THREE.Vector3(),
        travelDirection: new THREE.Vector3(),
        noseAxis: new THREE.Vector3(0, 1, 0),
        boostOrigin: new THREE.Vector3(),
        cameraPosition: new THREE.Vector3(),
        cameraTarget: new THREE.Vector3(),
        toPlanets: new THREE.Vector3(),
        dummy: new THREE.Object3D(),
    }), []);

    useEffect(() => {
        if (!isRocketPov) {
            camera.position.copy(DEFAULT_CAMERA_POSITION);
            camera.lookAt(0, 0, 0);
        }
    }, [camera, isRocketPov]);

    const setPhase = (nextPhase, elapsedTime) => {
        phaseRef.current = nextPhase;
        phaseStartRef.current = elapsedTime;
        setPhaseState(nextPhase);
        onRocketPhaseChange?.(nextPhase);
    };

    const getOrbitPosition = (elapsedTime, target) => {
        const radius = 12.2;
        const speed = 0.5;

        target.set(
            Math.cos(elapsedTime * speed) * radius + position[0],
            Math.sin(elapsedTime * speed) + position[1],
            Math.sin(elapsedTime * speed) * radius + position[2],
        );
    };

    const getOrbitVelocity = (elapsedTime, target) => {
        const radius = 12.2;
        const speed = 0.5;
        const orbitTime = elapsedTime * speed;

        target.set(
            -Math.sin(orbitTime) * radius * speed,
            Math.cos(orbitTime) * speed,
            Math.cos(orbitTime) * radius * speed,
        );
    };

    const orientRocket = (travelDirection) => {
        if (!rocketRef.current) {
            return;
        }

        rocketRef.current.quaternion.setFromUnitVectors(
            scratch.noseAxis,
            travelDirection.normalize(),
        );
    };

    const getRocketLocalPosition = (localPosition, target) => {
        target.set(...localPosition);
        rocketRef.current.localToWorld(target);
    };

    const getBoostOrigin = (target) => {
        rocketRef.current.updateWorldMatrix(true, false);
        getRocketLocalPosition([0, -0.38, 0], target);
    };

    const updateRocketPov = () => {
        if (!isRocketPov || phaseRef.current === 'entering') {
            return;
        }

        if (phaseRef.current === 'hidden') {
            scratch.cameraPosition.set(0, 14, 18);
            scratch.cameraTarget.set(0, 18, 0);
            camera.position.lerp(scratch.cameraPosition, 0.04);
            camera.lookAt(scratch.cameraTarget);
            return;
        }

        if (phaseRef.current !== 'flying') {
            return;
        }

        rocketRef.current.updateWorldMatrix(true, false);
        scratch.cameraTarget.set(0, 0, 0);
        scratch.toPlanets.subVectors(scratch.cameraTarget, orbitRef.current.position).normalize();
        scratch.cameraPosition
            .copy(orbitRef.current.position)
            .addScaledVector(scratch.toPlanets, -0.6);
        scratch.cameraPosition.y += 0.25;

        camera.position.lerp(scratch.cameraPosition, 0.35);
        camera.lookAt(scratch.cameraTarget);
    };

    const addSmoke = (worldPosition, elapsedTime) => {
        if (elapsedTime - lastSmokeAtRef.current < 0.05) {
            return;
        }

        lastSmokeAtRef.current = elapsedTime;
        const slot = smokeSlots.current[smokeCursorRef.current];
        slot.position.copy(worldPosition);
        slot.age = 0;
        smokeCursorRef.current = (smokeCursorRef.current + 1) % SMOKE_COUNT;
    };

    const updateSmoke = (delta) => {
        if (!smokeRef.current) {
            return;
        }

        smokeSlots.current.forEach((slot, index) => {
            slot.age += delta;
            const progress = Math.min(slot.age / SMOKE_LIFETIME, 1);
            const scale = slot.age < SMOKE_LIFETIME ? 0.12 * (1 - progress) + 0.015 : 0.001;

            scratch.dummy.position.copy(slot.position);
            scratch.dummy.scale.setScalar(scale);
            scratch.dummy.updateMatrix();
            smokeRef.current.setMatrixAt(index, scratch.dummy.matrix);
        });

        smokeRef.current.instanceMatrix.needsUpdate = true;
    };

    const seedExplosion = (origin) => {
        explosionOriginRef.current.copy(origin);

        explosionSlots.current.forEach((slot, index) => {
            const angle = (index / EXPLOSION_COUNT) * Math.PI * 2;
            const vertical = ((index % 7) - 3) / 5;
            const speed = 2.4 + (index % 5) * 0.45;

            slot.position.copy(origin);
            slot.velocity.set(
                Math.cos(angle) * speed,
                vertical * speed,
                Math.sin(angle) * speed,
            );
        });
    };

    const updateExplosion = (delta, elapsedTime) => {
        if (!explosionRef.current) {
            return;
        }

        const exploding = phaseRef.current === 'exploding';
        const progress = exploding
            ? Math.min((elapsedTime - phaseStartRef.current) / EXPLOSION_DURATION, 1)
            : 1;

        explosionSlots.current.forEach((slot, index) => {
            if (exploding) {
                slot.position.addScaledVector(slot.velocity, delta);
            } else {
                slot.position.copy(explosionOriginRef.current);
            }

            const scale = exploding ? 0.11 * (1 - progress) + 0.015 : 0.001;
            scratch.dummy.position.copy(slot.position);
            scratch.dummy.scale.setScalar(scale);
            scratch.dummy.updateMatrix();
            explosionRef.current.setMatrixAt(index, scratch.dummy.matrix);
        });

        explosionRef.current.instanceMatrix.needsUpdate = true;
    };

    useFrame(({ clock }, delta) => {
        if (!orbitRef.current || !rocketRef.current) {
            return;
        }

        const elapsedTime = clock.getElapsedTime();
        latestTimeRef.current = elapsedTime;
        getOrbitPosition(elapsedTime, scratch.target);

        const phaseAge = elapsedTime - phaseStartRef.current;

        if (phaseRef.current === 'flying') {
            orbitRef.current.visible = true;
            orbitRef.current.position.copy(scratch.target);
            getOrbitVelocity(elapsedTime, scratch.travelDirection);
            orientRocket(scratch.travelDirection);
            getBoostOrigin(scratch.boostOrigin);
            addSmoke(scratch.boostOrigin, elapsedTime);
        } else if (phaseRef.current === 'entering') {
            orbitRef.current.visible = true;
            const progress = Math.min(phaseAge / ENTRY_DURATION, 1);
            scratch.current.lerpVectors(respawnStartRef.current, scratch.target, easeOutCubic(progress));
            orbitRef.current.position.copy(scratch.current);
            scratch.travelDirection.subVectors(scratch.target, scratch.current);
            if (scratch.travelDirection.lengthSq() < 0.0001) {
                getOrbitVelocity(elapsedTime, scratch.travelDirection);
            }
            orientRocket(scratch.travelDirection);
            getBoostOrigin(scratch.boostOrigin);
            addSmoke(scratch.boostOrigin, elapsedTime);

            if (progress >= 1) {
                setPhase('flying', elapsedTime);
            }
        } else {
            orbitRef.current.visible = false;

            if (phaseRef.current === 'exploding' && phaseAge >= EXPLOSION_DURATION) {
                setPhase('hidden', elapsedTime);
            } else if (phaseRef.current === 'hidden' && phaseAge >= RESPAWN_DELAY) {
                const side = scratch.target.x > 0 ? -1 : 1;
                respawnStartRef.current.set(14 * side, scratch.target.y + 1.5, 8);
                setPhase('entering', elapsedTime);
            }
        }

        if (rocketRef.current) {
            rocketRef.current.visible = !(isRocketPov && phaseRef.current === 'flying');
        }
        updateRocketPov();
        updateSmoke(delta);
        updateExplosion(delta, elapsedTime);
    });

    const handleClick = (event) => {
        event.stopPropagation();

        if (phaseRef.current !== 'flying' && phaseRef.current !== 'entering') {
            return;
        }

        seedExplosion(orbitRef.current.position);
        setPhase('exploding', latestTimeRef.current);
    };

    return (
        <group>
            {/* Rocket orbiting group */}
            <group ref={orbitRef} onClick={handleClick} onPointerDown={handleClick}>
                <group ref={rocketRef}>
                    {/* Invisible hit target so the tiny rocket is easy to click. */}
                    <mesh onClick={handleClick} onPointerDown={handleClick}>
                        <sphereGeometry args={[1.15, 12, 12]}/>
                        <meshBasicMaterial transparent opacity={0} depthWrite={false}/>
                    </mesh>

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

            <instancedMesh ref={smokeRef} args={[null, null, SMOKE_COUNT]} frustumCulled={false}>
                <sphereGeometry args={[1, 8, 8]}/>
                <meshStandardMaterial color="red" transparent opacity={0.3}/>
            </instancedMesh>

            <instancedMesh
                ref={explosionRef}
                args={[null, null, EXPLOSION_COUNT]}
                frustumCulled={false}
                visible={phase === 'exploding'}
            >
                <sphereGeometry args={[1, 10, 10]}/>
                <meshStandardMaterial color="#ff6b1a" emissive="#ff8c00" emissiveIntensity={1.6}/>
            </instancedMesh>
        </group>
    );
};

export default Rocket;
