"use client";

import { Button, Paper } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="h-screen flex justify-center items-center bg-slate-200">
      <Paper className="flex flex-col justify-center items-center rounded-xl p-12 h-[90%] w-[90%] min-h-[300px]" elevation={24}>
        <p className="text-xl md:text-2xl lg:text-4xl font-bold text-black py-2 text-center">
          Welcome to your favorite <span className="text-blue-500">Pantry Tracker</span>
        </p>
        <p className="font-semibold pt-1 text-center">
          Keep Your Pantry Organized and Efficient
        </p>
        <Button className="my-4 bg-blue-500" variant="contained" onClick={() => router.push('/signup')}>
          Get Started
        </Button>
        <Button variant="outlined" onClick={() => router.push('/signin')}>
          Log In
        </Button>
      </Paper>
    </div>
  );
}
