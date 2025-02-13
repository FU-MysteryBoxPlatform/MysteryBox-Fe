"use client";
import Counter from "@/app/components/Counter";
import GiftUnbox from "@/app/components/GiftUnbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useParams } from "next/navigation";
import { useState } from "react";
import Confetti from "react-confetti";

export default function Page() {
  const { id } = useParams();
  const [count, setCount] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div>
      Product detail page {id} {count}
      <Counter
        count={count}
        onIncrease={() => setCount((count) => count + 1)}
        onDecrease={() => setCount((count) => count - 1)}
      />
      <Dialog>
        <DialogClose className="hidden"></DialogClose>
        <DialogTrigger>Open gift box</DialogTrigger>
        <DialogContent className="flex items-center justify-center p-0 border-none bg-transparent w-fit shadow-none flex-col [&>button]:hidden">
          <GiftUnbox onOpen={() => setOpenDialog(true)} />
        </DialogContent>
      </Dialog>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="h-[50vh]">
          Chuc mung ban da nhan duoc
          {openDialog && <Confetti className="w-full h-full" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
