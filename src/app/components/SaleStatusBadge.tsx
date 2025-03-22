export default function SaleStatusBadge({ status }: { status: string }) {
  const statusMap: Record<
    string,
    { color: string; icon: React.ReactNode; name: string }
  > = {
    OutOfStock: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: <div className="w-2 h-2 rounded-full bg-green-500 mr-1 shrink-0" />,
      name: "Đã bán",
    },
    WaitingForApprove: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: (
        <div className="w-2 h-2 rounded-full bg-yellow-400 mr-1 shrink-0" />
      ),
      name: "Chờ duyệt",
    },
    Available: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: <div className="w-2 h-2 rounded-full bg-blue-500 mr-1 shrink-0" />,
      name: "Đã duyệt ",
    },
    Cancelled: {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: <div className="w-2 h-2 rounded-full bg-red-500 mr-1 shrink-0" />,
      name: "Đã hủy",
    },
    Suspended: {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: <div className="w-2 h-2 rounded-full bg-red-500 mr-1 shrink-0" />,
      name: "Cấm",
    },
  };

  const { color, icon, name } = statusMap[status] || {
    color: "bg-gray-100 text-gray-800 shrink-0",
    icon: null,
    name: "Không xác định",
  };

  return (
    <span
      className={`flex w-fit items-center px-2 py-1 rounded-full text-xs font-medium border ${color}`}
    >
      {icon}
      {name}
    </span>
  );
}
