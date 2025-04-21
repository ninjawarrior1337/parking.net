import { Link } from "@tanstack/react-router";

export function LotCard({
    lotId,
    availableSpaces,
  }: {
    lotId: string;
    availableSpaces: number;
  }) {
    return (
      <Link to="/lot/$lotId" params={{lotId}} className="w-full h-full shadow-xl p-2 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 cursor-pointer">
        <div className="flex flex-col h-full justify-items-center items-center bg-white rounded-lg py-4">
          <h1 className="text-5xl font-black">{lotId}</h1>
          <div className="h-1 bg-red-500 w-9/12 my-2"></div>
          <span className="text-green-500 text-xl">
            {availableSpaces} spaces available
          </span>
        </div>
      </Link>
    );
  }