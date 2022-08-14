import { FC, useCallback, useEffect, useRef, useState } from 'react';

type TimerControllerProps = {
  record: boolean;
};

const TimerController: FC<TimerControllerProps> = (props) => {
  const [renderedStreamDuration, setRenderedStreamDuration] =
      useState('00:00:00'),
    streamDuration = useRef(0),
    previousTime = useRef(0),
    [isStartTimer, setIsStartTimer] = useState(false),
    [isStopTimer, setIsStopTimer] = useState(false),
    [isPauseTimer, setIsPauseTimer] = useState(false),
    [isResumeTimer, setIsResumeTimer] = useState(false),
    isStartBtnDisabled = isPauseTimer || isResumeTimer || isStartTimer,
    isStopBtnDisabled = !(isPauseTimer || isResumeTimer || isStartTimer);

  let requestAnimationFrameId = 0;

  const updateTimer = useCallback(() => {
    let now = performance.now();
    let dt = now - previousTime.current;

    if (dt >= 1000) {
      streamDuration.current = streamDuration.current + Math.round(dt / 1000);
      const formattedStreamDuration = new Date(streamDuration.current * 1000)
        .toISOString()
        .substr(11, 8);
      setRenderedStreamDuration(formattedStreamDuration);
      previousTime.current = now;
    }
    requestAnimationFrameId = requestAnimationFrame(updateTimer);
  }, []);

  const startTimer = useCallback(() => {
    previousTime.current = performance.now();
    requestAnimationFrameId = requestAnimationFrame(updateTimer);
  }, [updateTimer]);

  useEffect(() => {
    if (props.record) {
      startHandler();
    } else {
      stopHandler();
    }
    if (isStartTimer && !isStopTimer) {
      startTimer();
    }
    if (isStopTimer && !isStartTimer) {
      streamDuration.current = 0;
      cancelAnimationFrame(requestAnimationFrameId);
      setRenderedStreamDuration('00:00:00');
    }
  }, [
    isStartTimer,
    isStopTimer,
    startTimer,
    props.record,
    requestAnimationFrameId,
  ]);

  const startHandler = () => {
    setIsStartTimer(true);
    setIsStopTimer(false);
  };

  const stopHandler = () => {
    setIsStopTimer(true);
    setIsStartTimer(false);
    setIsPauseTimer(false);
    setIsResumeTimer(false);
  };

  return (
    <div className='timer-controller-wrapper'>{renderedStreamDuration}s</div>
  );
};

export default TimerController;
