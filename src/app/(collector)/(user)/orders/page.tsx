import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";

export default function Page() {
  return (
    <div>
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-16 py-10">
        <div className="my-10">
          <p className="text-xl md:text-2xl font-semibold mb-2 md:mb-4">
            Đơn hàng của bạn
          </p>
          <div>
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>Quản lý tất cả đơn hàng của bạn</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sm:table-cell">
                        Mã đơn hàng
                      </TableHead>
                      <TableHead>Tên khách hàng</TableHead>
                      <TableHead>Thanh toán</TableHead>
                      <TableHead className="md:table-cell">Tổng tiền</TableHead>
                      <TableHead className="md:table-cell">
                        Tên sản phẩm
                      </TableHead>
                      <TableHead className="md:table-cell">
                        Ngày đặt hàng
                      </TableHead>
                      <TableHead className="md:table-cell">
                        Trạng thái
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ORDERS.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="sm:table-cell">
                          {order.no}
                        </TableCell>
                        <TableCell className="font-medium">
                          {order.customerName}
                        </TableCell>
                        <TableCell className="md:table-cell">
                          {order.paymentStatus}
                        </TableCell>
                        <TableCell className="md:table-cell">
                          {order.totalPrice}
                        </TableCell>
                        <TableCell className="md:table-cell">
                          {order.productName}
                        </TableCell>
                        <TableCell className="md:table-cell">
                          {dayjs(order.createdAt).format("YYYY-MM-DD HH:mm A")}
                        </TableCell>
                        <TableCell
                          className={cn(
                            order.status === "PENDING"
                              ? "text-yellow-500"
                              : order.status === "CANCEL"
                              ? "text-red-500"
                              : "text-green-500"
                          )}
                        >
                          {order.status === "PENDING"
                            ? "Đang xử lý"
                            : order.status === "CANCEL"
                            ? "Đã hủy"
                            : "Thành công"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

const ORDERS = [
  {
    id: 1,
    no: 300,
    customerName: "Thanh",
    paymentStatus: "Đã thanh toán",
    totalPrice: 1000,
    productName: "Túi mù",
    quantity: 1,
    createdAt: "2023-03-01 12:00:00",
    status: "PENDING",
  },
  {
    id: 1,
    no: 300,
    customerName: "Thanh",
    paymentStatus: "Đã thanh toán",
    totalPrice: 1000,
    productName: "Túi mù",
    quantity: 1,
    createdAt: "2023-03-01 12:00:00",
    status: "SUCCESS",
  },
  {
    id: 1,
    no: 300,
    customerName: "Thanh",
    paymentStatus: "Đã thanh toán",
    totalPrice: 1000,
    productName: "Túi mù",
    quantity: 1,
    createdAt: "2023-03-01 12:00:00",
    status: "CANCEL",
  },
];
