// src/pages/ARPage.jsx
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

const ARPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Cleanup function for video resources when component unmounts
    return () => {
      const video = document.querySelector("#arjs-video");
      if (video) {
        const stream = video.srcObject;
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      }
    };
  }, []);

  return (
    <div className="h-screen w-screen relative">
      <a-scene
        embedded
        arjs="sourceType: webcam; 
              sourceWidth: 1280;
              sourceHeight: 960;
              displayWidth: 1280;
              displayHeight: 960;
              debugUIEnabled: true;"
        renderer="logarithmicDepthBuffer: true; antialias: true; alpha: true;"
        vr-mode-ui="enabled: false"
      >
        <a-assets>
          <a-asset-item id="house-model" src=""></a-asset-item>
        </a-assets>

        <a-marker
          preset="hiro"
          smooth="true"
          smoothCount="5"
          smoothTolerance="0.01"
          smoothThreshold="2"
          raycaster="objects: .clickable"
          emitevents="true"
          cursor="fuse: false; rayOrigin: mouse;"
        >
          {/* Testing cube to verify marker detection and positioning */}
          {/* <a-box
            position="0 0.5 0"
            scale="1 1 1"
            color="red"
            material="opacity: 0.9;"
          ></a-box> */}

          {/* House model - positioned slightly above the marker 
              We'll adjust these values once we can see the test cube */}
          <a-entity
            position="0 -.5 0"
            scale="0.1 0.1 0.1"
            rotation="40 0 0"
            gltf-model="/src/assets/models/scene.glb"
          ></a-entity>
        </a-marker>

        <a-entity camera></a-entity>
      </a-scene>

      <div className="fixed top-0 left-0 right-0 z-[10000] bg-black/50 p-4 text-white text-center">
        point camera at the marker
      </div>

      <button
        onClick={() => {
          navigate("/");
          window.location.reload(false);
        }}
        className="fixed top-4 left-4 z-[10000] bg-white/90 p-3 rounded-lg shadow-lg hover:bg-white flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to dashboard</span>
      </button>

      <style>{`
        .a-enter-vr { 
          display: none !important; 
        }

        #arjs-video {
          width: 100% !important;
          height: 100% !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          object-fit: cover !important;
          z-index: 999 !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        .a-canvas {
          width: 100% !important;
          height: 100% !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          z-index: 1000 !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        a-scene {
          position: fixed !important;
          width: 100% !important;
          height: 100% !important;
                    z-index: 1001 !important;

          top: 0 !important;
          left: 0 !important;
        }

        body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100% !important;
          overflow: hidden !important;
        }

        /* Show debug UI for development */
        .arjs-loader {
          display: block !important;
        }
      `}</style>
    </div>
  );
};

export default ARPage;
