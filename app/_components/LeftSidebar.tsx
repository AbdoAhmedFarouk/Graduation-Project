import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { ArrowLeft, Menu, Search, Square } from "lucide-react";

export default function LeftSidebar() {
  return (
    <div className="absolute flex flex-col text-secondary max-h-[666px] h-full left-5 top-5 bg-surface w-60 rounded-2xl p-3">
      <div className="flex items-center justify-between text-sm pb-3">
        <div className="flex items-center gap-2">
          <span className="hover:text-secondary text-secondary/50">
            <ArrowLeft size={16} />
          </span>
          <p>Untitled</p>
        </div>

        <span className="hover:text-secondary text-secondary/50">
          <Menu size={18} />
        </span>
      </div>

      <hr className="w-full bg-secondary/40 h-[1px] border-0" />

      <div className="flex items-center justify-center gap-4 w-full mt-4 pb-3">
        <Button variant="customVariant">Objects</Button>
        <Button variant="customVariant">Assets</Button>
      </div>

      <hr className="w-full bg-secondary/40 h-[1px] border-0" />

      <div className="mt-4 text-secondary flex flex-col flex-1">
        <div className="relative">
          <Input
            className="border-0 bg-borders ps-10 focus-visible:ring-[1px]"
            placeholder="Search"
          />
          <span className="absolute left-2 top-1/2 -translate-y-1/2">
            <Search size={16} />
          </span>
        </div>

        <ul className="mt-4 text-secondary/80 text-sm *:not-last:before:h-full *:p-1 flex-1 overflow-y-auto">
          <li
            className="relative before:absolute before:left-0 before:top-0 before:bg-secondary/50 before:h-3/5
              before:w-[1px] ps-4 after:absolute after:left-[1px] after:bg-secondary/50 after:w-2
              after:h-[1px] after:top-3/5 flex items-center gap-3 hover:bg-borders"
          >
            <span>
              <Square size={20} className="mt-0.5" />
            </span>
            Square
          </li>
          <li
            className="relative before:absolute before:left-0 before:top-0 before:bg-secondary/50 before:h-3/5
              before:w-[1px] ps-4 after:absolute after:left-[1px] after:bg-secondary/50 after:w-2
              after:h-[1px] after:top-3/5 flex items-center gap-3 hover:bg-borders"
          >
            <span>
              <Square size={20} className="mt-0.5" />
            </span>
            Square
          </li>
          <li
            className="relative before:absolute before:left-0 before:top-0 before:bg-secondary/50 before:h-3/5
              before:w-[1px] ps-4 after:absolute after:left-0 after:bg-secondary/50 after:w-2
              after:h-[1px] after:top-3/5 flex items-center gap-3 hover:bg-borders"
          >
            <span>
              <Square size={20} className="mt-0.5" />
            </span>
            Square
          </li>
        </ul>
      </div>
    </div>
  );
}
