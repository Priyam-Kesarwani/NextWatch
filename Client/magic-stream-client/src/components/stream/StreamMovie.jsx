import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ReactPlayer from 'react-player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const StreamMovie = () => {
    const params = useParams();
    const navigate = useNavigate();
    const key = params.yt_id;
    const [error, setError] = useState(false);
    const [isReady, setIsReady] = useState(false);

    // Check if video ID is valid
    if (!key || key.trim() === '') {
        return (
            <div className="w-full h-[90vh] bg-black flex items-center justify-center">
                <div className="text-center text-white p-8">
                    <FontAwesomeIcon 
                        icon={faTriangleExclamation} 
                        className="text-6xl text-yellow-500 mb-4"
                    />
                    <h2 className="text-2xl font-bold mb-2">Video Not Available</h2>
                    <p className="text-gray-400 mb-6">This video is not available at the moment.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition flex items-center gap-2 mx-auto"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const handleError = () => {
        setError(true);
    };

    const handleReady = () => {
        setIsReady(true);
    };

    // Show error state if video fails to load
    if (error) {
        return (
            <div className="w-full h-[90vh] bg-black flex items-center justify-center">
                <div className="text-center text-white p-8">
                    <FontAwesomeIcon 
                        icon={faTriangleExclamation} 
                        className="text-6xl text-yellow-500 mb-4"
                    />
                    <h2 className="text-2xl font-bold mb-2">Video Not Available</h2>
                    <p className="text-gray-400 mb-6">
                        This video could not be loaded. It may have been removed or is not available in your region.
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition flex items-center gap-2 mx-auto"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-[90vh] bg-black flex items-center justify-center overflow-hidden">
            <div className="w-full h-full relative">
                <ReactPlayer 
                    controls={true} 
                    playing={true} 
                    url={`https://www.youtube.com/watch?v=${key}`}
                    width='100%' 
                    height='100%' 
                    onError={handleError}
                    onReady={handleReady}
                    config={{
                        youtube: {
                            playerVars: { 
                                showinfo: 1,
                                modestbranding: 1
                            }
                        }
                    }}
                />
                {!isReady && !error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="text-white text-lg">Loading video...</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StreamMovie