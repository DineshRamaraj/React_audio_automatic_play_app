import React, { useRef, useState, useEffect, useCallback } from "react";

function Main() {
  const audioRefs = useRef([null, null, null]);
  const [currentAudio, setCurrentAudio] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Start button handler
  const handleStart = () => {
    setCurrentAudio(0);
    setProgress(0);
    setIsPlaying(true);
    audioRefs.current[0]?.play();
  };

  // Handle when an audio finishes
  const handleEnded = () => {
    if (currentAudio < audioRefs.current.length - 1) {
      setCurrentAudio((prev) => prev + 1);
    } else {
      setIsPlaying(false); // All audios finished, show the button
    }
  };

  // Update progress based on current audio playback
  const updateProgress = useCallback(() => {
    const audio = audioRefs.current[currentAudio];
    if (audio) {
      const progress = (audio.currentTime / audio.duration) * 100;
      setProgress(progress);
    }
  }, [currentAudio]);

  // Seek functionality to update the playback position
  const handleSeek = (e) => {
    const audio = audioRefs.current[currentAudio];
    if (audio) {
      const newProgress = (e.nativeEvent.offsetX / e.target.offsetWidth) * 100;
      audio.currentTime = (newProgress / 100) * audio.duration;
      setProgress(newProgress);
    }
  };

  useEffect(() => {
    const audio = audioRefs.current[currentAudio];
    if (audio && isPlaying) {
      audio.play();
      audio.addEventListener("timeupdate", updateProgress);
    }
    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", updateProgress);
      }
    };
  }, [currentAudio, isPlaying, updateProgress]);

  return (
    <div>
      {/* Display all audio controls */}
      {[
        "alarms/alarm_clock.ogg",
        "emergency/ambulance_siren.ogg",
        "impacts/bamboo_drop_and_tumble.ogg",
      ].map((src, index) => (
        <div key={index} style={{ marginBottom: "20px" }}>
          <audio
            ref={(el) => (audioRefs.current[index] = el)}
            src={`https://actions.google.com/sounds/v1/${src}`}
            controls
            onEnded={handleEnded}
          />
          {/* Individual progress bar for each audio */}
          {/* <div
            style={{
              width: "100%",
              background: "#ddd",
              height: "10px",
              cursor: "pointer",
              position: "relative",
              marginTop: "10px",
            }}
            onClick={(e) => {
              const audio = audioRefs.current[index];
              if (audio) {
                const newProgress = (e.nativeEvent.offsetX / e.target.offsetWidth) * 100;
                audio.currentTime = (newProgress / 100) * audio.duration;
                setProgress(newProgress);
              }
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                background: "blue",
                height: "10px",
                transition: "width 0.1s linear",
              }}
            /> 
          </div>*/}
        </div>
      ))}

      {/* Start button */}
      {!isPlaying && <button onClick={handleStart}>Start Playing</button>}

      {/* Progress bar for the current audio */}
      {isPlaying && (
        <div>
          <p>Playing Audio {currentAudio + 1}</p>
          <div
            style={{
              width: "100%",
              background: "#ddd",
              height: "10px",
              cursor: "pointer",
              position: "relative",
            }}
            onClick={handleSeek}
          >
            <div
              style={{
                width: `${progress}%`,
                background: "blue",
                height: "10px",
                transition: "width 0.1s linear",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Main;
