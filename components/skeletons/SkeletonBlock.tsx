interface SkeletonBlockProps {
  width?: string;
  height?: string;
  rounded?: boolean; // Para bordes redondeados
}

const SkeletonBlock: React.FC<SkeletonBlockProps> = ({ width = "100%", height = "1rem", rounded = false }) => {
  return (
    <div className={`bg-gray-700 animate-pulse ${rounded ? "rounded-full" : "rounded"}`} style={{ width, height }} />
  );
};

export default SkeletonBlock;
