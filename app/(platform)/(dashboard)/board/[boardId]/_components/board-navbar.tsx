import { Board } from "@prisma/client";

interface BoardNavbarProps {
  data: Board;
}

const BoardNavbar = async ({ data }: BoardNavbarProps) => {
  return <div className="w-full h-14 bg-black/50 fixed top-14 flex items-center gap-x-4 px-6 text-white">BoardNavbar</div>;
};

export default BoardNavbar;
