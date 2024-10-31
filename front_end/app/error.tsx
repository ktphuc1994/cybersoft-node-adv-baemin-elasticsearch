'use client'; // Error components must be Client Components

import { useEffect } from 'react';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

const AppErrorPage = ({ error, reset }: Props) => {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
};

export default AppErrorPage;
