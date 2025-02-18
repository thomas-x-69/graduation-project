import { Html } from "@react-three/drei";
import { Loader2 } from "lucide-react";

const LoadingIndicator = ({ position, isInitialLoad }) => {
  const text = isInitialLoad ? "Loading..." : "Moving...";

  return (
    <Html position={[position.x, position.y + 1, position.z]} center>
      <div className="flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm">
        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
        <span className="text-sm text-gray-700 font-medium">{text}</span>
      </div>
    </Html>
  );
};

export default LoadingIndicator;
