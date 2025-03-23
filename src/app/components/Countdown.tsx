import { useCountdown } from "@/hooks/useCountdown";

interface TimeUnitProps {
  label: string;
  value: number;
}

function TimeUnit({ label, value }: TimeUnitProps) {
  return (
    <div className="flex-1 px-1 md:px-2 py-1 rounded-[4px] font-poppins w-full sm:w-[60px] flex flex-col items-center">
      <div
        className="text-black/15 text-[32px] md:text-[48px] xl:text-[64px] font-semibold tabular-nums leading-[30px] md:leading-[50px]"
        aria-label={`${value} ${label}`}
      >
        {value.toString().padStart(2, "0")}
      </div>
      <div className="text-black/80 text-xs md:text-lg mt-1 font-semibold">
        {label}
      </div>
    </div>
  );
}

export default function Countdown({ targetDate }: { targetDate: string }) {
  const { timeLeft } = useCountdown(targetDate);

  return (
    <div
      className="flex flex-wrap justify-between items-start gap-0 md:gap-4 text-start mb-2"
      role="timer"
      aria-live="polite"
    >
      <TimeUnit label="Ngày" value={timeLeft.days} />
      <p className="text-black/15 text-[32px] md:text-xl font-semibold leading-[30px] md:leading-[50px]">
        :
      </p>
      <TimeUnit label="Giờ" value={timeLeft.hours} />
      <p className="text-black/15 text-[32px] md:text-xl font-semibold leading-[30px] md:leading-[50px]">
        :
      </p>
      <TimeUnit label="Phút" value={timeLeft.minutes} />
      <p className="text-black/15 text-[32px] md:text-xl font-semibold leading-[30px] md:leading-[50px]">
        :
      </p>
      <TimeUnit label="Giây" value={timeLeft.seconds} />
    </div>
  );
}
