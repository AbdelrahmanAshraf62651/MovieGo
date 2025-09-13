function Skeleton({ className = "" }) {
    return (
        <div className={`absolute inset-0 bg-gray-700/70 animate-pulse rounded-lg ${className}`} />
    );
}

export default Skeleton;
