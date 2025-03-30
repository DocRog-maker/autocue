import WebViewer, { WebViewerInstance } from '@pdftron/webviewer';
import { useEffect, useRef, useState } from 'react';
import './App.css'

function App() {
  const viewer = useRef<HTMLDivElement>(null);
  const [wvInstance, setWvInstance] = useState<WebViewerInstance>();
  const licKey = 'license-key';
  useEffect(() => {
    WebViewer(
      {
        path: '/lib/webviewer',
        licenseKey: licKey,
        enableFilePicker: true,
      },
      viewer.current as HTMLDivElement
    ).then(async (instance) => {
      const { documentViewer } = instance.Core;
      documentViewer.addEventListener('documentLoaded', () => {
        setWvInstance(instance);
      })
    })

  }, []);

  const [myInterval, setMyInterval] = useState<number | null>(null)
  const [topPos, setTopPos] = useState(0)

  const MIN_DELAY = 9;
  const MAX_DELAY = 500;
  const [delay, setDelay] = useState(50)

  const faster = () => {
    const newDelay = delay - 10
    if (newDelay > MIN_DELAY) {
      setDelay(newDelay)
      initializeCue(newDelay)
    }
  }
  const slower = () => {
    const newDelay = delay + 10
    if (newDelay < MAX_DELAY) {
      setDelay(newDelay)
      initializeCue(newDelay)
    }
  }

  const stopCue = () => {
    initializeCue(0)
  }

  const initializeCue = (delay: number) => {
    if (myInterval) {
      clearInterval(myInterval);
      setMyInterval(null)
    }
    if (delay > 0) {
      let pos = topPos
      //We could refactor the following code so that the values are stored as state varibales.
      //for now though we will keep them here to demonstrate how they can be used.
      const documentViewer = wvInstance!.Core.documentViewer;
      const scrollViewElement = documentViewer.getScrollViewElement();
      const fin = documentViewer.getViewerElement().scrollHeight;
      var interval = setInterval(() => {
        scrollViewElement.scrollTo({
          top: pos,
          left: 0
        });
        //This is a kludgy solution - since scrolling will occur, while doing nothing until the 
        //scroll point reaches the bottom of the viewer element. In fact, once everything is visible
        //scrolling could stop.
        if (pos < fin) {
          //scrolling by 1 unit at a time means that the scroll action is smooth.
          pos = pos += 1;
          setTopPos(pos)
        }
        else {
          clearInterval(interval);
        }
      }, delay);
      setMyInterval(interval);
    }
  }

  return (
    <div className="App">
      <div className='button-div'>
        <div className='button-cue' onClick={() => initializeCue(delay)}><button>Start</button></div>
        <div className='button-cue' onClick={stopCue}><button>Stop</button></div>
        <div className='button-cue' onClick={slower}><button>Slower</button></div>
        <div className='button-cue' onClick={faster}><button>Faster</button></div>
      </div>
      <div className="webviewer" ref={viewer}></div>

    </div>
  );
}

export default App
