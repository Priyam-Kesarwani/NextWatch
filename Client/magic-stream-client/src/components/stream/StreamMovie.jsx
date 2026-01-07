import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';

const StreamMovie = () => {

    let params = useParams();
    let key = params.yt_id;

    return (
        <div className="w-full h-[90vh] bg-black flex items-center justify-center overflow-hidden">
            {key != null && (
                <div className="w-full h-full">
                    <ReactPlayer 
                        controls={true} 
                        playing={true} 
                        url={`https://www.youtube.com/watch?v=${key}`}
                        width='100%' 
                        height='100%' 
                        config={{
                            youtube: {
                                playerVars: { showinfo: 1 }
                            }
                        }}
                    />
                </div>
            )}
        </div>
    )
}

export default StreamMovie