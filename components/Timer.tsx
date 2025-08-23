import { useEffect } from 'react';
const Timer = ({
  dispatch,
  secondsRemaining,
}: {
  dispatch: any;
  secondsRemaining: number;
}) => {
  const mins = Math.floor(secondsRemaining / 60);
  const seconds = Math.floor(secondsRemaining % 60);

  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: 'tick' });
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-xl border border-gray-200 px-4 py-3">
      {mins < 10 && '0'}
      {mins}:{seconds < 10 && '0'}
      {seconds}
    </div>
  );
};

export default Timer;
