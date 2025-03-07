import './App.css';
import React, {useRef, useEffect, useState} from 'react';
import {Pose} from '@mediapipe/pose';
import * as cam from '@mediapipe/camera_utils';
import * as mediapipePose from '@mediapipe/pose';
import {drawConnectors, drawLandmarks} from '@mediapipe/drawing_utils'
import Webcam from 'react-webcam';
import {Menu, btnSelected, setBtn} from './components/Menu';
import {LoadingScreen} from './components/LoadingScreen';
import {
  changeStyleProperty,
  badPosture,
  showNotification,
  speakFeedback,
  drawLine,
  drawCircle,
  shouldersLevel,
  backStraight
} from './utils/utilities'

// Dashboard Component
function Dashboard({ exerciseMode, repCount, postureFeedback }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl text-neon-blue mb-6">Dashboard</h2>
      
      {/* Exercise Stats Card */}
      <div className="bg-deep-space rounded-xl p-6 mb-6">
        <h3 className="text-xl text-neon-blue mb-4">Exercise Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-space-gray p-4 rounded-lg">
            <p className="text-neon-green text-sm">Current Exercise</p>
            <p className="text-neon-blue text-lg">{exerciseMode}</p>
          </div>
          <div className="bg-space-gray p-4 rounded-lg">
            <p className="text-neon-green text-sm">Repetitions</p>
            <p className="text-neon-blue text-lg">{repCount}/10</p>
          </div>
          <div className="bg-space-gray p-4 rounded-lg">
            <p className="text-neon-green text-sm">Posture Status</p>
            <p className={`text-lg ${postureFeedback?.includes("Great") ? "text-green-400" : "text-red-400"}`}>
              {postureFeedback?.includes("Great") ? "Good" : "Needs Improvement"}
            </p>
          </div>
          <div className="bg-space-gray p-4 rounded-lg">
            <p className="text-neon-green text-sm">Session Duration</p>
            <p className="text-neon-blue text-lg">00:15:30</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-deep-space rounded-xl p-6">
        <h3 className="text-xl text-neon-blue mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="bg-space-gray p-4 rounded-lg">
            <p className="text-neon-green">Last Exercise: {exerciseMode}</p>
            <p className="text-neon-blue">Completed Reps: {repCount}</p>
            <p className="text-sm text-gray-400">2 minutes ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Virtual Assistant Component
function VirtualAssistant({ exerciseMode, postureFeedback, onModeChange }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl text-neon-blue mb-6">Virtual Assistant</h2>
      
      {/* Exercise Selection */}
      <div className="bg-deep-space rounded-xl p-6 mb-6">
        <h3 className="text-xl text-neon-blue mb-4">Exercise Selection</h3>
        <div className="space-y-3">
          <button 
            onClick={() => onModeChange('posture')}
            className={`w-full p-3 rounded-lg ${exerciseMode === 'posture' ? 'bg-neon-blue text-deep-space' : 'bg-space-gray text-neon-blue'}`}
          >
            Posture Check
          </button>
          <button 
            onClick={() => onModeChange('mckenzie')}
            className={`w-full p-3 rounded-lg ${exerciseMode === 'mckenzie' ? 'bg-neon-blue text-deep-space' : 'bg-space-gray text-neon-blue'}`}
          >
            McKenzie Press-Up
          </button>
          <button 
            onClick={() => onModeChange('bridging')}
            className={`w-full p-3 rounded-lg ${exerciseMode === 'bridging' ? 'bg-neon-blue text-deep-space' : 'bg-space-gray text-neon-blue'}`}
          >
            Bridging
          </button>
        </div>
      </div>

      {/* Current Feedback */}
      <div className="bg-deep-space rounded-xl p-6">
        <h3 className="text-xl text-neon-blue mb-4">Real-time Feedback</h3>
        <div className="bg-space-gray p-4 rounded-lg">
          <p className="text-neon-green">{postureFeedback}</p>
        </div>
      </div>
    </div>
  );
}

// Voice Assistant Component
function VoiceAssistant({ postureFeedback }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleSpeak = (text) => {
    if (!isSpeaking && text) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Add speech recognition logic here
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl text-neon-blue mb-6">Voice Assistant</h2>
      
      {/* Voice Controls */}
      <div className="bg-deep-space rounded-xl p-6 mb-6">
        <h3 className="text-xl text-neon-blue mb-4">Voice Controls</h3>
        <div className="space-y-4">
          <button 
            onClick={() => handleSpeak(postureFeedback)}
            disabled={isSpeaking}
            className={`w-full p-4 rounded-lg ${isSpeaking ? 'bg-gray-600' : 'bg-neon-blue'} text-deep-space`}
          >
            {isSpeaking ? 'Speaking...' : 'Speak Feedback'}
          </button>
          <button 
            onClick={toggleListening}
            className={`w-full p-4 rounded-lg ${isListening ? 'bg-red-500' : 'bg-space-gray'} text-neon-blue`}
          >
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </button>
        </div>
      </div>

      {/* Voice Commands */}
      <div className="bg-deep-space rounded-xl p-6">
        <h3 className="text-xl text-neon-blue mb-4">Available Commands</h3>
        <div className="space-y-2">
          <div className="bg-space-gray p-3 rounded-lg">
            <p className="text-neon-green">"Start exercise"</p>
          </div>
          <div className="bg-space-gray p-3 rounded-lg">
            <p className="text-neon-green">"Switch to [exercise name]"</p>
          </div>
          <div className="bg-space-gray p-3 rounded-lg">
            <p className="text-neon-green">"Read feedback"</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sidebar Component
function Sidebar({ currentRoute, onRouteChange }) {
  return (
    <div className="bg-deep-space w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-neon-blue text-2xl font-bold">ErgoSmart</h1>
      </div>
      
      <nav className="space-y-2">
        <button 
          onClick={() => onRouteChange('dashboard')}
          className={`w-full p-3 rounded-lg text-left ${currentRoute === 'dashboard' ? 'bg-neon-blue text-deep-space' : 'text-neon-blue hover:bg-space-gray'}`}
        >
          📊 Dashboard
        </button>
        <button 
          onClick={() => onRouteChange('virtual-assistant')}
          className={`w-full p-3 rounded-lg text-left ${currentRoute === 'virtual-assistant' ? 'bg-neon-blue text-deep-space' : 'text-neon-blue hover:bg-space-gray'}`}
        >
          🤖 Virtual Assistant
        </button>
        <button 
          onClick={() => onRouteChange('voice-assistant')}
          className={`w-full p-3 rounded-lg text-left ${currentRoute === 'voice-assistant' ? 'bg-neon-blue text-deep-space' : 'text-neon-blue hover:bg-space-gray'}`}
        >
          🎤 Voice Assistant
        </button>
      </nav>
    </div>
  );
}

function App() {
  //reference to canvas & webcam
  const canvasRef = useRef(null);
  const webcamRef = useRef(null);

  //reference to the current posture
  const postureRef = useRef(null); //value of 1 is bad, 0 is good, -1 is undetected
  
  let goodPosture = null; 
  const [loaded, setLoaded] = useState(false);
  let badPostureCount = 0; //variable keeps track of the # of frames the user has bad posture

  const [lastAudioFeedbackTime, setLastAudioFeedbackTime] = useState(0);
  const audioFeedbackInterval = 30000; // 30 seconds

  const [postureFeedback, setPostureFeedback] = useState('');
  const [exerciseMode, setExerciseMode] = useState('posture'); // 'posture', 'mckenzie', or 'bridging'
  const [repCount, setRepCount] = useState(0);
  const [exerciseState, setExerciseState] = useState('start'); // 'start', 'hold', 'return'
  const [holdTimer, setHoldTimer] = useState(0);
  const [currentRoute, setCurrentRoute] = useState('dashboard');

  function getPostureFeedback(landmarks, goodPosture) {
    let feedback = [];

    // Check head position
    const headYDiff = landmarks[0].y - goodPosture[0].y;
    if (headYDiff > 0.03) {
      feedback.push("Lift your head slightly");
    } else if (headYDiff < -0.03) {
      feedback.push("Lower your head slightly");
    }

    // Check shoulders
    const shoulderYDiff = Math.abs(landmarks[11].y - landmarks[12].y);
    if (shoulderYDiff > 0.02) {
      if (landmarks[11].y > landmarks[12].y) {
        feedback.push("Level your shoulders by raising your left shoulder");
      } else {
        feedback.push("Level your shoulders by raising your right shoulder");
      }
    }

    // Check back straightness
    const midShoulder = {
      x: (landmarks[11].x + landmarks[12].x) / 2,
      y: (landmarks[11].y + landmarks[12].y) / 2
    };
    const midHip = {
      x: (landmarks[23].x + landmarks[24].x) / 2,
      y: (landmarks[23].y + landmarks[24].y) / 2
    };
    const midKnee = {
      x: (landmarks[25].x + landmarks[26].x) / 2,
      y: (landmarks[25].y + landmarks[26].y) / 2
    };

    const backAngle = Math.atan2(midHip.y - midShoulder.y, midHip.x - midShoulder.x);
    const goodBackAngle = Math.atan2(
      (goodPosture[23].y + goodPosture[24].y) / 2 - (goodPosture[11].y + goodPosture[12].y) / 2,
      (goodPosture[23].x + goodPosture[24].x) / 2 - (goodPosture[11].x + goodPosture[12].x) / 2
    );

    if (Math.abs(backAngle - goodBackAngle) > 0.1) {
      if (backAngle > goodBackAngle) {
        feedback.push("Straighten your back by sitting up more");
      } else {
        feedback.push("Relax your back slightly");
      }
    }

    // Check if leaning too far forward or backward
    const shoulderToHipAngle = Math.atan2(midHip.y - midShoulder.y, midHip.x - midShoulder.x);
    const goodShoulderToHipAngle = Math.atan2(
      (goodPosture[23].y + goodPosture[24].y) / 2 - (goodPosture[11].y + goodPosture[12].y) / 2,
      (goodPosture[23].x + goodPosture[24].x) / 2 - (goodPosture[11].x + goodPosture[12].x) / 2
    );

    if (shoulderToHipAngle - goodShoulderToHipAngle > 0.1) {
      feedback.push("Sit back slightly, you're leaning too far forward");
    } else if (goodShoulderToHipAngle - shoulderToHipAngle > 0.1) {
      feedback.push("Sit up slightly, you're leaning too far backward");
    }

    // Check for hunched shoulders
    const neckLength = Math.hypot(landmarks[0].x - midShoulder.x, landmarks[0].y - midShoulder.y);
    const goodNeckLength = Math.hypot(
      goodPosture[0].x - ((goodPosture[11].x + goodPosture[12].x) / 2),
      goodPosture[0].y - ((goodPosture[11].y + goodPosture[12].y) / 2)
    );
    if (neckLength < goodNeckLength * 0.95) {
      feedback.push("Relax your shoulders and stretch your neck");
    }

    // Provide positive feedback if posture is good
    if (feedback.length === 0) {
      feedback.push("Great posture! Keep it up!");
    }

    return feedback.join(". ");
  }

  function calculateMcKenzieAccuracy(landmarks) {
    if (!landmarks) return null;

    let feedback = [];
    
    // Get relevant landmarks
    const shoulders = {
      x: (landmarks[11].x + landmarks[12].x) / 2,
      y: (landmarks[11].y + landmarks[12].y) / 2
    };
    const hips = {
      x: (landmarks[23].x + landmarks[24].x) / 2,
      y: (landmarks[23].y + landmarks[24].y) / 2
    };
    
    // Check if lying prone (on stomach)
    if (shoulders.y < hips.y) {
      feedback.push("Lie face down on your stomach");
      return feedback.join(". ");
    }
    
    // Check elbow position for proper press-up
    const elbowAngle = Math.abs(Math.atan2(
      landmarks[14].y - landmarks[12].y,
      landmarks[14].x - landmarks[12].x
    ));
    
    // Check upper body elevation
    const upperBodyElevation = shoulders.y - hips.y;
    
    // Check if arms are straight in press-up
    if (elbowAngle > 0.3) {
      feedback.push("Straighten your arms to push up your upper body");
    }
    
    // Check if lifted high enough
    if (upperBodyElevation > -0.2) {
      feedback.push("Push up your chest higher");
    }
    
    // Check if hips are staying on the ground
    const hipLevel = Math.abs(landmarks[23].y - landmarks[24].y);
    if (hipLevel > 0.05) {
      feedback.push("Keep your hips flat on the ground");
    }
    
    // Check if neck is in neutral position
    const neckAngle = Math.abs(Math.atan2(
      landmarks[0].y - shoulders.y,
      landmarks[0].x - shoulders.x
    ));
    if (neckAngle > 0.3) {
      feedback.push("Keep your neck neutral, look down at the floor");
    }

    return feedback.join(". ");
  }

  function calculateBridgingAccuracy(landmarks) {
    if (!landmarks) return null;

    let feedback = [];
    
    // Get relevant landmarks
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    
    // Calculate hip height relative to shoulders
    const hipHeight = (leftHip.y + rightHip.y) / 2;
    const shoulderHeight = (leftShoulder.y + rightShoulder.y) / 2;
    
    // Check if hips are raised enough
    if (Math.abs(hipHeight - shoulderHeight) < 0.1) {
      feedback.push("Lift your hips higher");
    }
    
    // Check if bridge is level
    const hipLevelness = Math.abs(leftHip.y - rightHip.y);
    if (hipLevelness > 0.05) {
      feedback.push("Keep your hips level");
    }
    
    // Check if shoulders are stable
    const shoulderStability = Math.abs(leftShoulder.y - rightShoulder.y);
    if (shoulderStability > 0.05) {
      feedback.push("Keep your shoulders stable on the ground");
    }

    return feedback.join(". ");
  }

  function getExerciseInstructions() {
    const instructions = {
      mckenzie: {
        title: "McKenzie Press-Up Exercise",
        description: "This exercise helps centralize pain and reduce disc pressure in PIVD, promoting disc rehydration and healing.",
        steps: [
          "Lie face down on a firm surface",
          "Place your hands palm down under your shoulders",
          "Keep your hips and legs relaxed on the ground",
          "Gradually push up with your arms, lifting your upper body",
          "Keep your hips and lower body relaxed on the floor",
          "Hold the position at the top for 3 seconds",
          "Slowly lower back down",
          "Rest for 2 seconds before the next repetition"
        ],
        tips: [
          "Don't force the movement if it causes pain",
          "Keep your neck in a neutral position",
          "Breathe normally throughout the exercise",
          "Start with 10 repetitions, 3-4 times daily",
          "Stop if you feel increased leg pain or numbness"
        ]
      },
      bridging: {
        title: "Bridging Exercise",
        description: "This exercise strengthens your core, glutes, and lower back muscles.",
        steps: [
          "Lie on your back on a firm surface",
          "Bend your knees and place feet flat on the floor, hip-width apart",
          "Keep arms at your sides, palms down",
          "Breathe in deeply",
          "As you exhale, slowly lift your hips off the floor",
          "Create a straight line from shoulders to knees",
          "Hold this position for 3 seconds",
          "Slowly lower your hips back to the starting position"
        ],
        tips: [
          "Keep your core engaged throughout the exercise",
          "Don't arch your lower back",
          "Keep your shoulders firmly on the ground",
          "Perform 8-10 repetitions, 3 times daily"
        ]
      }
    };
    return instructions[exerciseMode] || null;
  }

  //run this function when pose results are determined
  function onResults(results){
    if(!loaded){ 
      setLoaded(true);
      console.log("HPE model finished loading.");
      changeStyleProperty("--loader-display","none");
    }

    if (!results.poseLandmarks) { //if the model is unable to detect a pose 
      console.log("No pose detected.");
      postureRef.current = -1;//change pose state to "undetected", can't track pose
      changeStyleProperty("--btn-color","rgba(0, 105, 237, 0.25)"); //fade out the calubrate button by reducing opacity
      return;
    }

    let landmarks = results.poseLandmarks;
    postureRef.current = null;
    changeStyleProperty("--btn-color","rgba(0, 105, 237, 1)"); //make the calibrate button solid

    canvasRef.current.width = webcamRef.current.video.videoWidth;
    canvasRef.current.height = webcamRef.current.video.videoHeight;

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    canvasCtx.globalCompositeOperation = 'source-over';
    
    let connectionColor = '#00FF00'; // Default green
    let landmarkColor = '#00FF00';

    // Determine color based on exercise mode and feedback
    if (exerciseMode === 'mckenzie') {
      const mckenzieFeedback = calculateMcKenzieAccuracy(landmarks);
      connectionColor = mckenzieFeedback ? '#FF0000' : '#00FF00';
      landmarkColor = mckenzieFeedback ? '#FF0000' : '#00FF00';
      
      if (!mckenzieFeedback) {
        setHoldTimer(prev => prev + 1);
        if (holdTimer > 90) {
          setRepCount(prev => prev + 1);
          setHoldTimer(0);
          speakFeedback("Good rep! Slowly lower down and prepare for next press-up");
        }
      }
      setPostureFeedback(mckenzieFeedback || `Hold position. ${Math.floor(holdTimer/30)} seconds`);
    } 
    else if (exerciseMode === 'bridging') {
      const bridgingFeedback = calculateBridgingAccuracy(landmarks);
      connectionColor = bridgingFeedback ? '#FF0000' : '#00FF00';
      landmarkColor = bridgingFeedback ? '#FF0000' : '#00FF00';
      
      if (!bridgingFeedback) {
        setHoldTimer(prev => prev + 1);
        if (holdTimer > 90) {
          setRepCount(prev => prev + 1);
          setHoldTimer(0);
          speakFeedback("Good rep! Lower your hips slowly");
        }
      }
      setPostureFeedback(bridgingFeedback || `Hold bridge. ${Math.floor(holdTimer/30)} seconds`);
    }
    else if (goodPosture && results.poseLandmarks) {
      const feedback = getPostureFeedback(landmarks, goodPosture);
      setPostureFeedback(feedback);
      
      if (feedback.includes("Great posture!")) {
        connectionColor = '#00FF00';
        landmarkColor = '#00FF00';
        changeStyleProperty('--posture-status',"'GOOD'");
        badPostureCount = 0;
      } else {
        connectionColor = '#FF0000';
        landmarkColor = '#FF0000';
        changeStyleProperty('--posture-status',"'NEEDS IMPROVEMENT'");
        badPostureCount++;
      }
    }

    // Draw the skeleton with the determined colors
    drawConnectors(canvasCtx, results.poseLandmarks, mediapipePose.POSE_CONNECTIONS,
                   {color: connectionColor, lineWidth: 4});
    drawLandmarks(canvasCtx, results.poseLandmarks,
                  {color: landmarkColor, lineWidth: 2});
    canvasCtx.restore();

    if(btnSelected){
      goodPosture = landmarks; //obtain a copy of the "good pose"
      console.log("Calibrate button was clicked. New landmarks have been saved.");
      setBtn(false);
    }

    if(!goodPosture){ //the calibrate button has not been selected yet
      return;
    }
    
    //determine if the user's posture is bad or not
    if(badPosture(landmarks, goodPosture)){
      badPostureCount++;
      changeStyleProperty('--posture-status',"'BAD'"); //maybe move this inside conditional
      if(badPostureCount >= 60){ //60 frames = 2 seconds of bad posture
        showNotification("Correct your posture!");
        
        // Add audio feedback
        const currentTime = Date.now();
        if (currentTime - lastAudioFeedbackTime > audioFeedbackInterval) {
          speakFeedback(postureFeedback || "Your posture needs correction. Please sit up straight.");
          setLastAudioFeedbackTime(currentTime);
        }
        
        badPostureCount = 0;
      }
    }else{
      badPostureCount = 0;
      changeStyleProperty('--posture-status',"'GOOD'");
    }
  }

  useEffect(()=>{
    const pose = new Pose({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }});
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    pose.onResults(onResults);
    
    if(
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null
    ) {
      const camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => { //this block runs once every frame
          await pose.send({image: webcamRef.current.video});
        },
        width: 640,
        height: 480
      });
      camera.start();
    }

    if(!("Notification" in window)) {
      alert("Browser does not support desktop notification");
    } else {
      Notification.requestPermission();
    }

  }, []);
  
  const handleModeChange = (mode) => {
    setExerciseMode(mode);
    setRepCount(0);
  };

  // Render the current route content
  const renderRouteContent = () => {
    switch(currentRoute) {
      case 'dashboard':
        return <Dashboard 
          exerciseMode={exerciseMode}
          repCount={repCount}
          postureFeedback={postureFeedback}
        />;
      case 'virtual-assistant':
        return <VirtualAssistant 
          exerciseMode={exerciseMode}
          postureFeedback={postureFeedback}
          onModeChange={handleModeChange}
        />;
      case 'voice-assistant':
        return <VoiceAssistant 
          postureFeedback={postureFeedback}
        />;
      default:
        return <Dashboard 
          exerciseMode={exerciseMode}
          repCount={repCount}
          postureFeedback={postureFeedback}
        />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {!loaded && <LoadingScreen />}
      <div className="flex">
        <Sidebar 
          currentRoute={currentRoute}
          onRouteChange={setCurrentRoute}
        />
        <div className="flex-grow">
          {renderRouteContent()}
          <div className={`App bg-gradient-to-br from-deep-space to-space-gray flex flex-col items-center justify-center p-4 sm:p-8 ${!loaded ? 'hidden' : ''}`}>
            <div className="w-full max-w-7xl mx-auto flex flex-col xl:flex-row items-center justify-center space-y-8 xl:space-y-0 xl:space-x-8">
              <div className="flex flex-col space-y-4">
                <Menu postureRef={postureRef} />
                {exerciseMode !== 'posture' && getExerciseInstructions() && (
                  <div className="bg-deep-space p-4 rounded-xl">
                    <h3 className="text-lg font-semibold mb-2 text-neon-blue">{getExerciseInstructions().title}</h3>
                    <p className="text-sm mb-4 text-neon-green">{getExerciseInstructions().description}</p>
                    <div className="mb-4">
                      <h4 className="text-md font-semibold mb-2 text-neon-blue">Steps:</h4>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        {getExerciseInstructions().steps.map((step, index) => (
                          <li key={index} className="text-neon-blue">{step}</li>
                        ))}
                      </ol>
                    </div>
                    <div>
                      <h4 className="text-md font-semibold mb-2 text-neon-blue">Important Tips:</h4>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        {getExerciseInstructions().tips.map((tip, index) => (
                          <li key={index} className="text-neon-green">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              <div className="display relative rounded-3xl overflow-hidden w-full max-w-lg xl:max-w-xl bg-deep-space">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-green opacity-5 z-10"></div>
                <Webcam
                  ref={webcamRef}
                  className="webcam rounded-3xl w-full opacity-90"
                  width="100%"
                  height="auto"
                />
                <canvas
                  ref={canvasRef}
                  className="canvas absolute top-0 left-0 rounded-3xl w-full h-full z-20"
                />
                <div className="absolute top-4 left-4 bg-deep-space bg-opacity-70 text-neon-blue px-3 py-1 rounded-full text-sm font-medium z-30 backdrop-filter backdrop-blur-sm">
                  {exerciseMode === 'posture' ? 'Posture Mode' : `${exerciseMode === 'mckenzie' ? 'McKenzie Press-Up' : 'Bridging'} Exercise`}
                </div>
                {postureFeedback && (
                  <div className="absolute bottom-4 left-4 right-4 bg-deep-space bg-opacity-70 text-neon-green px-3 py-2 rounded-lg text-sm font-medium z-30 backdrop-filter backdrop-blur-sm">
                    {postureFeedback}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-deep-space text-neon-blue py-2 text-center">
        <p className="text-sm">made with 💌 by Prince</p>
      </footer>
    </div>
  );
}

export default App;
