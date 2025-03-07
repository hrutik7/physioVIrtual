export function MenuHeader(props) {
    if(props.state === "Calibration"){
      return(
        <div className="text-neon-blue">
          <h3 className="text-2xl font-bold mb-4">Welcome to ergoSmart AI</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Ensure your webcam is on and positioned directly in front of you</li>
            <li>Sit upright with "good" posture, head and shoulders in frame</li>
            <li>Click the "Calibrate" button below</li>
            <li>Continue using your computer as usual. We'll notify you if you slouch!</li>
          </ol>
        </div>
      );
    } else if(props.state === "Tracking"){
      return(
        <div className="text-neon-green">
          <h3 className="text-2xl font-bold mb-4">Tracking Your Posture</h3>
          <p>To recalibrate, sit upright and click "Calibrate" again.</p>
        </div>
      );
    }
}
