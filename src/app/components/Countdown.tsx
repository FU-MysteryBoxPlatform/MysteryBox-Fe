import { useCountdown } from "@/hooks/useCountdown";

interface TimeUnitProps {
  label: string;
  value: number;
}

function TimeUnit({ label, value }: TimeUnitProps) {
  return (
    <div className="flex-1 px-2 md:px-3 py-1 rounded-[6px] font-poppins w-full sm:w-[76px] flex flex-col items-center">
      <div
        className="text-black/15 text-[48px] md:text-[64px] xl:text-[96px] font-semibold tabular-nums leading-[40px] md:leading-[75px]"
        aria-label={`${value} ${label}`}
      >
        {value.toString().padStart(2, "0")}
      </div>
      <div className="text-black/80 text-sm md:text-2xl mt-1.5 font-semibold">
        {label}
      </div>
    </div>
  );
}

export default function Countdown({ targetDate }: { targetDate: string }) {
  const { timeLeft } = useCountdown(targetDate);

  return (
    <div
      className="flex flex-wrap justify-between items-start gap-0 md:gap-6 text-start mb-2"
      role="timer"
      aria-live="polite"
    >
      <TimeUnit label="Ngày" value={timeLeft.days} />
      <p className="text-black/15 text-[48px] md:text-[64px] xl:text-[96px] font-semibold leading-[40px] md:leading-[75px]">
        :
      </p>
      <TimeUnit label="Giờ" value={timeLeft.hours} />
      <p className="text-black/15 text-[48px] md:text-[64px] xl:text-[96px] font-semibold leading-[40px] md:leading-[75px]">
        :
      </p>
      <TimeUnit label="Phút" value={timeLeft.minutes} />
      <p className="text-black/15 text-[48px] md:text-[64px] xl:text-[96px] font-semibold leading-[40px] md:leading-[75px]">
        :
      </p>
      <TimeUnit label="Giây" value={timeLeft.seconds} />
    </div>
  );
}
