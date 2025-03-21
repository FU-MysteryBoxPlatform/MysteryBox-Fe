"use client";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import Paginator from "@/app/components/Paginator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  useApproveAuctionRequest,
  useGetAllAuctions,
} from "@/hooks/api/useAuction";
import { cn } from "@/lib/utils";
import { Auction } from "@/types";
import dayjs from "dayjs";
import { Ellipsis } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useEffect, useRef, useState, useMemo, useContext } from "react";
import DatePicker from "react-date-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TableAuctionParticipant from "./components/TableAuctionParticipant";
import { GlobalContext } from "@/provider/global-provider";
import { toast } from "@/hooks/use-toast";

// Component Tabs
const FilterTabs = ({
  status,
  onChange,
}: {
  status: string;
  onChange: (value: string) => void;
}) => (
  <div className="grid grid-cols-3 gap-2 p-2 bg-gray-100 rounded-lg">
    {TABS.map((tab) => (
      <Button
        key={tab.value}
        variant={tab.value === status ? "default" : "outline"}
        className={cn(
          "py-2 text-sm font-medium transition-all",
          tab.value === status && "bg-[#E12E43] text-white hover:bg-[#c12739]"
        )}
        onClick={() => onChange(tab.value)}
      >
        {tab.title}
      </Button>
    ))}
  </div>
);

// Component chính
export default function AuctionManagementPage() {
  const router = useRouter();
  const { user } = useContext(GlobalContext);
  const searchParams = useSearchParams();
  const params = useMemo(
    () => queryString.parse(searchParams.toString()),
    [searchParams]
  );
  const page = Number(params.page || 1);
  const status = Array.isArray(params.status)
    ? params.status[0]
    : params.status || "1";
  const keyword = params.keyword as string | undefined;
  const startDate = params.startDate as string | undefined;
  const endDate = params.endDate as string | undefined;
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [participantModal, setParticipantModal] = useState(false);
  const [auctionId, setAuctionId] = useState("");
  const [isEnd, setIsEnd] = useState(false);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  const { mutate: mutateGetAuction, isPending } = useGetAllAuctions();
  const { mutate: approveAuctionRequest, isPending: pendingApprove } =
    useApproveAuctionRequest();

  const handleApprove = (requestId: string) => {
    approveAuctionRequest(
      {
        accountId: user?.id ?? "",
        auctionRequestId: requestId,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            toast({
              title: "Đã duyệt",
            });
          } else {
            toast({
              title: data.messages[0],
            });
          }
        },
      }
    );
  };

  const fetchAuctions = () => {
    mutateGetAuction(
      {
        keyword,
        pageNumber: page,
        pageSize: 10,
        status: Number(status),
        startTime: startDate,
        endTime: endDate,
      },
      {
        onSuccess: (data) => {
          console.log({ data });

          if (data.isSuccess) {
            setAuctions(data.result.items);
            setTotalPages(data.result.totalPages);
          }
        },
      }
    );
  };

  const handleFilterByKeyword = (value: string) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      router.push(
        `?${queryString.stringify({ ...params, keyword: value, page: "1" })}`
      );
    }, 1000);
  };

  const handleFilterByDate = (key: "startDate" | "endDate", date?: Date) => {
    const newParams: { [key: string]: any } = { ...params, page: "1" };
    newParams[key] = date ? dayjs(date).toISOString() : null;
    router.push(`?${queryString.stringify(newParams)}`);
  };

  useEffect(() => {
    fetchAuctions();
  }, [page, status, keyword, startDate, endDate]);

  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Quản lý đấu giá
          </CardTitle>
          <CardDescription className="text-gray-600">
            Theo dõi và quản lý tất cả các phiên đấu giá trên hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <FilterTabs
            status={status ?? "1"}
            onChange={(value) =>
              router.push(
                `?${queryString.stringify({
                  ...params,
                  status: value,
                  page: "1",
                })}`
              )
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Tìm kiếm từ khóa"
              defaultValue={keyword}
              onChange={(e) => handleFilterByKeyword(e.target.value)}
              className="h-10 rounded-lg border-gray-200"
            />
            <DatePicker
              className="w-full h-10 rounded-lg border-gray-200"
              value={startDate ? new Date(startDate) : null}
              onChange={(value) =>
                handleFilterByDate("startDate", value as Date)
              }
              clearIcon={null}
            />
            <DatePicker
              className="w-full h-10 rounded-lg border-gray-200"
              value={endDate ? new Date(endDate) : null}
              onChange={(value) => handleFilterByDate("endDate", value as Date)}
              clearIcon={null}
            />
          </div>

          {isPending ? (
            <div className="flex justify-center py-10">
              <LoadingIndicator />
            </div>
          ) : auctions.length > 0 ? (
            <>
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Tên</TableHead>
                    <TableHead>Vật phẩm</TableHead>
                    <TableHead>Giá bắt đầu</TableHead>
                    <TableHead>Giá hiện tại</TableHead>
                    <TableHead>Ngày bắt đầu</TableHead>
                    <TableHead>Ngày kết thúc</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auctions.map((auc) => (
                    <TableRow key={auc.auctionId} className="hover:bg-gray-100">
                      <TableCell>
                        {auc.account.firstName} {auc.account.lastName}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img
                            src={auc.inventory.product.imagePath}
                            alt={auc.inventory.product.name}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                          <p className="line-clamp-1">
                            {auc.inventory.product.name}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {auc.minimunBid.toLocaleString()} VND
                      </TableCell>
                      <TableCell>
                        {auc.currentBid.toLocaleString()} VND
                      </TableCell>
                      <TableCell>
                        {dayjs(auc.startTime).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell>
                        {dayjs(auc.endTime).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger>
                            <Button variant="ghost" size="sm">
                              <Ellipsis className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="grid gap-2 w-fit">
                            <Button
                              variant="ghost"
                              className="w-fit"
                              onClick={() => {
                                setParticipantModal(true);
                                setAuctionId(auc.auctionId);
                                setIsEnd(auc.statusId === 2);
                              }}
                            >
                              Danh sách tham dự
                            </Button>
                            <Button variant="ghost" className="w-fit">
                              Xem chi tiết
                            </Button>
                            {auc.statusId === 0 && (
                              <Button
                                variant="ghost"
                                className="w-fit"
                                onClick={() => handleApprove(auc.auctionId)}
                              >
                                Duyệt
                              </Button>
                            )}
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-6 flex justify-center">
                <Paginator
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(pageNumber) =>
                    router.push(
                      `?${queryString.stringify({
                        ...params,
                        page: pageNumber,
                      })}`
                    )
                  }
                  showPreviousNext
                />
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-gray-500">
              Không có phiên đấu giá nào
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={participantModal} onOpenChange={setParticipantModal}>
        <DialogContent className="max-w-[80vw]">
          <DialogHeader>
            <DialogTitle>Danh sách tham dự</DialogTitle>
          </DialogHeader>
          <TableAuctionParticipant auctionId={auctionId} isEnd={isEnd} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

const TABS = [
  { title: "Hoàn thành", value: "1" },
  { title: "Chờ duyệt", value: "0" },
  { title: "Đã từ chối", value: "2" },
];
