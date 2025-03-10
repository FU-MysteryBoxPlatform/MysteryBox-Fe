"use client";;
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { History } from "lucide-react";
import { useAllSaleByAccountId } from "@/hooks/api/useSale";
import { useContext } from "react";
import { GlobalContext } from "@/provider/global-provider";
import { formatDate, formatPriceVND } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import Paginator from "@/app/components/Paginator";
import Link from "next/link";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import SaleStatusBadge from "@/app/components/SaleStatusBadge";



export default function Page() {
  const { user } = useContext(GlobalContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = queryString.parse(searchParams.toString());
  const page = params["page"] || 1;
  const { data, isPending } = useAllSaleByAccountId(user?.id ?? "", +page, 10);
  const totalPages = data?.result.totalPages ?? 0;
  return (
    <div className="p-6  rounded-lg flex-1 max-md:w-full">
      <Card className="border shadow-sm pb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Lịch Sử Rao Bán
          </CardTitle>
          <CardDescription>
            Danh sách các vật phẩm bạn đã từng rao bán và trạng thái của chúng.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPending && (
            <div className="w-full flex items-center justify-center mb-10">
              <LoadingIndicator />
            </div>
          )}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Vật Phẩm</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Phí sàn</TableHead>
                  <TableHead>Gía list sàn</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Duyệt bởi
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Ngày duyệt
                  </TableHead>
                  <TableHead>Trạng Thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.result.items.map((item) => (
                  <TableRow key={item.saleId} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <Link href={`/sale-detail/${item.saleId}`}>
                        {item.saleId.substring(0, 8)}
                      </Link>
                    </TableCell>
                    <TableCell>{item.inventory.product.name}</TableCell>
                    <TableCell>{formatPriceVND(item.unitPrice)} </TableCell>
                    <TableCell>{formatPriceVND(item.totalFee)} </TableCell>
                    <TableCell>{formatPriceVND(item.totalAmount)} </TableCell>

                    <TableCell className="hidden md:table-cell">
                      {item.updateByAccount?.firstName || "-"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(item.updateDate) || "-"}
                    </TableCell>
                    <TableCell>
                      <SaleStatusBadge status={item.saleStatus.name} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {data && data?.result?.items?.length > 0 ? (
          <Paginator
            currentPage={+(page as string)}
            totalPages={totalPages}
            onPageChange={(pageNumber) => {
              params["page"] = pageNumber.toString();
              router.push(`?${queryString.stringify(params)}`);
            }}
            showPreviousNext
          />
        ) : (
          <div className="w-full text-center mt-10">
            Không có lịch sử rao bán nào
          </div>
        )}
      </Card>
    </div>
  );
}
