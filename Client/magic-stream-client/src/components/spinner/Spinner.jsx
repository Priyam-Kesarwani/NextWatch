const Spinner = () => {
    return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="w-16 h-16 border-4 border-gray-800 border-t-primary rounded-full animate-spin spinner-glow"></div>
        </div>
    );
}

export default Spinner;