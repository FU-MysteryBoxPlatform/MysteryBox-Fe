"use client";;
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, ShoppingCart, TrendingUp } from "lucide-react";
import { formatPriceVND } from "@/lib/utils";
import { SalesChart } from "@/app/components/SalesChart";
import { CollectionTable } from "@/app/components/CollectionTable";
import { useGetStatistic, useGetStatisticForDashboard } from "@/hooks/api/useDashboard";
import { subMonths } from "date-fns";
import { DateRangePicker } from "@/app/components/DateRangePicker";


export default function Dashboard() {
 const today = new Date();
 const [dateRange, setDateRange] = useState<{
   from: Date;
   to: Date;
 }>({
   from: subMonths(today, 1),
   to: today,
 });

 // Get data based on selected date range
 const { data: dashboardData } = useGetStatisticForDashboard(
   dateRange.from.toISOString(),
   dateRange.to.toISOString()
 );
 const { data: dataStatistic } = useGetStatistic(
   dateRange.from.toISOString(),
   dateRange.to.toISOString()
 );

 // Sort daily sales by date
 const sortedDailySales = dashboardData?.result?.dailySalesPercentage?.sort(
   (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
 );

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold tracking-tight">
            Thống kê doanh thu
          </h2>
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </div>

    <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng doanh thu
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPriceVND(dataStatistic?.result.totalSaleProfit || 0)}
              </div>
             
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Số lượng đơn hàng
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dataStatistic?.result.numberOfOrder}
              </div>
             
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Giá trị trung bình mỗi đơn
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPriceVND(
                  (dataStatistic?.result.totalSaleProfit ?? 0) /
                    (dataStatistic?.result.numberOfOrder || 1)
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Tính trên {dataStatistic?.result.numberOfOrder} đơn hàng
              </p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo ngày</CardTitle>
            <CardDescription>
              Biểu đồ hiển thị doanh thu bán hàng theo ngày
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <SalesChart data={sortedDailySales || []} />
            <div className="mt-10">
              <CollectionTable
                collections={dataStatistic?.result?.bestBlindBoxList || []}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
