import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const WelcomeScreen = ({ onGetStarted }) => {
  const mountRef = useRef(null);
  const animationRef = useRef(null);
  const sceneRef = useRef(null);
  const controlsRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    // Initialize Three.js only if mountRef exists
    if (!mountRef.current) return;

    // Three.js initialization
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    rendererRef.current = renderer;
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create floating elements
    const elements = [];
    const colors = [0x4285F4, 0xEA4335, 0xFBBC05, 0x34A853];
    const shapes = ['box', 'sphere', 'cylinder', 'torus'];

    for (let i = 0; i < 15; i++) {
      let geometry;
      const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
      
      switch(shapeType) {
        case 'box':
          geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
          break;
        case 'sphere':
          geometry = new THREE.SphereGeometry(0.3, 32, 32);
          break;
        case 'cylinder':
          geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 32);
          break;
        case 'torus':
          geometry = new THREE.TorusGeometry(0.3, 0.1, 16, 100);
          break;
      }

      const material = new THREE.MeshPhongMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        transparent: true,
        opacity: 0.8,
      });

      const element = new THREE.Mesh(geometry, material);
      element.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 10
      );
      element.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      element.userData = {
        speed: Math.random() * 0.02 + 0.01,
        rotationSpeed: Math.random() * 0.02 + 0.01,
        direction: new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize()
      };
      scene.add(element);
      elements.push(element);
    }

    camera.position.z = 5;

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      elements.forEach(element => {
        element.rotation.x += element.userData.rotationSpeed;
        element.rotation.y += element.userData.rotationSpeed;
        
        element.position.addScaledVector(element.userData.direction, element.userData.speed);

        // Bounce off boundaries
        if (Math.abs(element.position.x) > 5) element.userData.direction.x *= -1;
        if (Math.abs(element.position.y) > 3) element.userData.direction.y *= -1;
        if (Math.abs(element.position.z) > 5) element.userData.direction.z *= -1;
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (controlsRef.current) {
        controlsRef.current.dispose();
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (mountRef.current && rendererRef.current.domElement.parentNode === mountRef.current) {
          mountRef.current.removeChild(rendererRef.current.domElement);
        }
      }

      if (sceneRef.current) {
        sceneRef.current.traverse(object => {
          if (object.isMesh) {
            object.geometry?.dispose();
            object.material?.dispose();
          }
        });
      }
    };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div ref={mountRef} className="absolute inset-0 z-0" />
      
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-b from-transparent to-gray-100/50 p-8">
        <div className="max-w-2xl text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">CashCaddy</h1>
          <p className="text-xl font-bold text-black mb-8">
  Snap. Send. Expense handled.
</p>
        <p className="text-lg font-bold text-black mb-12">
  Cashcandy revolutionizes expense tracking - making it faster, smarter, and completely effortless.
</p>
          
          <div className="space-y-4">
            <button 
              onClick={onGetStarted}
              className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-200 transform hover:scale-105"
            >
              Get started 
            </button>
            
            <div className="flex items-center justify-center my-4">
              <div className="border-t border-gray-300 flex-grow"></div>
              <span className="px-4 text-gray-500">or</span>
              <div className="border-t border-gray-300 flex-grow"></div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-full flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.652.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                Continue
              </button>
              
              <button className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-full flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z"/>
                </svg>
                Email
              </button>
            </div>
            
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-4">
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;