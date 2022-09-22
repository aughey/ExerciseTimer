import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function PlayWave({ file, play }: { file: string, play: boolean }) {
  const audioref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (play) {
      audioref.current?.play();
    }
  }, [play]);

  return (<div>
    <audio ref={audioref} src={file} preload="true" />
  </div>);
}

function PlayCount({ count }: { count: number }) {
  const numbers: { [key: number]: string } = {
    5: "five.wav",
    4: "four.wav",
    3: "three.wav",
    2: "two.wav",
    1: "one.wav"
  };


  return (
    <div>
      {Object.keys(numbers).map(n => parseInt(n)).map((n, i) => (<PlayWave file={numbers[n]} play={count === n} />))}
    </div>
  )

}

function RunAction({ action, whenComplete }: { action: number, whenComplete: () => void }) {
  var [time, setTime] = useState(0);

  useEffect(() => {
    let starttime = Date.now();

    const Tick = () => {
      var diff = Date.now() - starttime;
      var seconds = (diff / 1000);
      var countdown = action - seconds;
      if (countdown < 0) {
        stop()
        whenComplete()
        countdown = 0;
      }
      setTime(Math.ceil(countdown));
    }

    let interval = setInterval(Tick, 100);
    const stop = () => clearInterval(interval);
    return stop;
  }, [action, whenComplete]);

  return (<div>
    <p>Running Action: {action}</p>
    <div className="timer">{time}</div>
    <PlayCount count={time} />
  </div>)
}

function RunActions({ actions }: { actions: number[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [actions]);

  const WhenComplete = () => {
    if (index < actions.length - 1) {
      setIndex(index + 1);
    }
  }

  return (<div>
    <div>Actions: {JSON.stringify(actions)}, Index: {index}</div>
    <RunAction action={actions[index] || 0} whenComplete={WhenComplete} />
  </div>)
}

function App() {
  var [code, setCode] = useState("6 5 4");
  var [actions, setActions] = useState<number[]>([]);
  var [running, setRunning] = useState(false);

  useEffect(() => {
    if(running) {
    setActions(code.split(" ").map((x) => parseInt(x)));
    } else {
      setActions([]);
    }
  }, [code, running])

  return (
    <div className="App">
      <input value={code} onChange={e => setCode(e.target.value)} type="text" />
      <button onClick={() => setRunning(!running)}>{running ? "Stop Set" : "Run Set"}</button>
      <RunActions actions={actions} />
    </div>
  );
}

export default App;