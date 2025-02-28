import { Badge } from "@/components/ui/badge";

export default function RarityColorBadge({
  rarityName,
  dropRate,
}: {
  rarityName: string;
  dropRate: string;
}) {
  const getRarityColor = (rarityName: string) => {
    switch (rarityName) {
      case "COMMON":
        return "bg-gray-500";
      case "RARE":
        return "bg-blue-500";
      case "EPIC":
        return "bg-purple-500";
      case "LEGENDARY":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };
  return (
    <Badge className={getRarityColor(rarityName) + " text-white"}>
      {rarityName} ({dropRate}
      %)
    </Badge>
  );
}
