import { MinusIcon, PlusIcon } from "lucide-react";

type CounterProps = {
  count?: number;
  onIncrease?: () => void;
  onDecrease?: () => void;
};

export default function Counter({
  count = 0,
  onIncrease,
  onDecrease,
}: CounterProps) {
  return (
    <div className="px-3 py-2 border border-gray-300 rounded-md w-fit flex items-center gap-3">
      <MinusIcon
        className="cursor-pointer hover:bg-gray-100 rounded-sm"
        onClick={onDecrease}
      />
      <p className="select-none font-semibold">{count}</p>
      <PlusIcon
        className="cursor-pointer hover:bg-gray-100 rounded-sm"
        onClick={onIncrease}
      />
    </div>
  );
}
