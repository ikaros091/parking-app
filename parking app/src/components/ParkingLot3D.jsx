import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Sky, Environment } from '@react-three/drei';
import { useState } from 'react';
import * as THREE from 'three';

// Simple 3D Car Component with better details
function Car({ position, color = '#ff6b6b', onClick, isOccupied }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <group 
      position={position} 
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      visible={isOccupied}
    >
      {/* Car Body - Main */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.6, 0.7, 0.9]} />
        <meshStandardMaterial 
          color={hovered ? '#ff8787' : color} 
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      
      {/* Car Roof/Cabin */}
      <mesh position={[0.15, 0.85, 0]} castShadow>
        <boxGeometry args={[0.9, 0.5, 0.75]} />
        <meshStandardMaterial 
          color={hovered ? '#ff8787' : color}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      
      {/* Windshield Front */}
      <mesh position={[0.6, 0.85, 0]} castShadow>
        <boxGeometry args={[0.1, 0.4, 0.7]} />
        <meshStandardMaterial 
          color="#1a1a2e"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Windshield Back */}
      <mesh position={[-0.3, 0.85, 0]} castShadow>
        <boxGeometry args={[0.1, 0.4, 0.7]} />
        <meshStandardMaterial 
          color="#1a1a2e"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Headlights */}
      <mesh position={[0.8, 0.35, 0.3]} castShadow>
        <boxGeometry args={[0.05, 0.15, 0.15]} />
        <meshStandardMaterial color="#ffeb3b" emissive="#ffeb3b" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.8, 0.35, -0.3]} castShadow>
        <boxGeometry args={[0.05, 0.15, 0.15]} />
        <meshStandardMaterial color="#ffeb3b" emissive="#ffeb3b" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Tail Lights */}
      <mesh position={[-0.8, 0.35, 0.3]} castShadow>
        <boxGeometry args={[0.05, 0.12, 0.12]} />
        <meshStandardMaterial color="#ff1744" emissive="#ff1744" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-0.8, 0.35, -0.3]} castShadow>
        <boxGeometry args={[0.05, 0.12, 0.12]} />
        <meshStandardMaterial color="#ff1744" emissive="#ff1744" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Wheels */}
      {[
        [0.6, 0.15, 0.55],
        [0.6, 0.15, -0.55],
        [-0.5, 0.15, 0.55],
        [-0.5, 0.15, -0.55]
      ].map((pos, i) => (
        <group key={i} position={pos}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.15, 16]} />
            <meshStandardMaterial color="#2d3436" metalness={0.3} roughness={0.7} />
          </mesh>
          {/* Rim */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.12, 0.12, 0.16, 6]} />
            <meshStandardMaterial color="#95a5a6" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}
      
      {/* Hover glow effect */}
      {hovered && (
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[1.2, 1.2, 0.1, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}

// Parking Slot Component with better styling
function ParkingSlot({ position, slotNumber, isOccupied, carNumber, onSlotClick, onCarClick }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <group position={position}>
      {/* Parking Slot Ground with border */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.01, 0]}
        receiveShadow
        onClick={!isOccupied ? onSlotClick : undefined}
        onPointerOver={() => !isOccupied && setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[2.2, 3.2]} />
        <meshStandardMaterial 
          color={isOccupied ? '#7f8c8d' : hovered ? '#3498db' : '#95a5a6'} 
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
      
      {/* Slot Border Lines - White marking */}
      <group position={[0, 0.02, 0]}>
        {/* Top line */}
        <mesh position={[0, 0, 1.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.2, 0.08]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Bottom line */}
        <mesh position={[0, 0, -1.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.2, 0.08]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Left line */}
        <mesh position={[-1.1, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.08, 3.2]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Right line */}
        <mesh position={[1.1, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.08, 3.2]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
      
      {/* Slot Number - 3D Text */}
      <Text
        position={[0, 0.03, -1.2]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.5}
        color={isOccupied ? "#ffffff" : "#2c3e50"}
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {slotNumber}
      </Text>
      
      {/* Status indicator */}
      <mesh position={[0, 0.03, 1.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.15, 16]} />
        <meshBasicMaterial color={isOccupied ? "#e74c3c" : "#2ecc71"} />
      </mesh>
      
      {/* Car */}
      {isOccupied && (
        <Car 
          position={[0, 0, 0]} 
          color={['#ff6b6b', '#e67e22', '#9b59b6', '#3498db', '#1abc9c'][slotNumber % 5]}
          onClick={onCarClick}
          isOccupied={isOccupied}
        />
      )}
    </group>
  );
}

// Main 3D Scene with improved lighting and environment
export default function ParkingLot3D({ slots, onSlotClick, onCarClick }) {
  const slotsPerRow = 3;
  const slotSpacingX = 3.5;
  const slotSpacingZ = 4.5;
  
  return (
    <Canvas
      shadows
      camera={{ position: [0, 15, 18], fov: 50 }}
      style={{ background: 'linear-gradient(to bottom, #2c3e50, #34495e)' }}
    >
      {/* Lighting Setup */}
      <ambientLight intensity={0.4} />
      
      {/* Main directional light with shadows */}
      <directionalLight
        position={[15, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />
      
      {/* Fill lights */}
      <pointLight position={[-15, 15, -10]} intensity={0.5} color="#74b9ff" />
      <pointLight position={[15, 15, -10]} intensity={0.5} color="#a29bfe" />
      
      {/* Hemisphere light for ambient bounce */}
      <hemisphereLight intensity={0.3} groundColor="#34495e" color="#74b9ff" />
      
      {/* Sky background */}
      <Sky sunPosition={[100, 20, 100]} />
      
      {/* Environment for reflections */}
      <Environment preset="sunset" />
      
      {/* Ground Plane - Parking Lot Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial 
          color="#2c3e50" 
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
      
      {/* Parking Lot Border/Curb */}
      {[
        { pos: [0, 0.2, -15], size: [50, 0.4, 1] },
        { pos: [0, 0.2, 15], size: [50, 0.4, 1] },
        { pos: [-25, 0.2, 0], size: [1, 0.4, 30] },
        { pos: [25, 0.2, 0], size: [1, 0.4, 30] }
      ].map((border, i) => (
        <mesh key={i} position={border.pos} castShadow>
          <boxGeometry args={border.size} />
          <meshStandardMaterial color="#7f8c8d" roughness={0.8} />
        </mesh>
      ))}
      
      {/* Entrance Sign */}
      <group position={[0, 2, -12]}>
        <mesh castShadow>
          <boxGeometry args={[6, 2, 0.2]} />
          <meshStandardMaterial color="#3498db" metalness={0.3} />
        </mesh>
        <Text
          position={[0, 0, 0.15]}
          fontSize={0.6}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          🚗 PARKING
        </Text>
      </group>
      
      {/* Parking Slots */}
      {slots.map((slot, index) => {
        const row = Math.floor(index / slotsPerRow);
        const col = index % slotsPerRow;
        const x = (col - slotsPerRow / 2 + 0.5) * slotSpacingX;
        const z = (row - Math.ceil(slots.length / slotsPerRow) / 2 + 0.5) * slotSpacingZ;
        
        return (
          <ParkingSlot
            key={slot.id}
            position={[x, 0, z]}
            slotNumber={slot.id}
            isOccupied={!slot.is_available}
            carNumber={slot.car_number}
            onSlotClick={() => onSlotClick(slot)}
            onCarClick={() => onCarClick(slot)}
          />
        );
      })}
      
      {/* Street Lamps */}
      {[
        [-8, 0, -10],
        [8, 0, -10],
        [-8, 0, 10],
        [8, 0, 10]
      ].map((pos, i) => (
        <group key={i} position={pos}>
          {/* Pole */}
          <mesh position={[0, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.15, 5, 8]} />
            <meshStandardMaterial color="#34495e" metalness={0.6} />
          </mesh>
          {/* Light */}
          <mesh position={[0, 5, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial 
              color="#ffd93d" 
              emissive="#ffd93d" 
              emissiveIntensity={0.8}
            />
          </mesh>
          <pointLight position={[0, 5, 0]} intensity={0.8} distance={12} color="#ffd93d" />
        </group>
      ))}
      
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={10}
        maxDistance={30}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}
