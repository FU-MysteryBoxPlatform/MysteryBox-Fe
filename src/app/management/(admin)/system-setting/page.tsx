"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { Edit } from "lucide-react";
import {
  TConfiguration,
  useGetConfigurations,
  useUpdateConfiguration,
} from "@/hooks/api/useConfiguration";

// Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import Paginator from "@/app/components/Paginator";

// Schema
const UpdateConfigurationSchema = z.object({
  name: z.string().min(1, "Tên thiết lập không được để trống"),
  vietnameseName: z.string().min(1, "Tên tiếng Việt không được để trống"),
  currentValue: z.string().min(1, "Giá trị không được để trống"),
  unit: z.string().min(1, "Vui lòng chọn đơn vị"),
});

type UpdateConfigurationForm = z.infer<typeof UpdateConfigurationSchema>;

export default function ConfigurationManagement() {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editedConfig, setEditedConfig] = useState<TConfiguration | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = queryString.parse(searchParams.toString());
  const page = Number(params["page"] || 1);

  const { data, refetch, isLoading } = useGetConfigurations(page, 10);
  const { mutate: updateConfiguration, isPending } = useUpdateConfiguration();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm<UpdateConfigurationForm>({
    resolver: zodResolver(UpdateConfigurationSchema),
    defaultValues: {
      name: "",
      vietnameseName: "",
      currentValue: "",
      unit: "",
    },
  });

  // Form submission handler
  const onSubmit = (data: UpdateConfigurationForm) => {
    if (!editedConfig) return;

    updateConfiguration(
      {
        configurationId: editedConfig.configurationId,
        name: data.name,
        vietnameseName: data.vietnameseName,
        currentValue: data.currentValue,
        unit: Number(data.unit),
      },
      {
        onSuccess: (response) => {
          if (response.isSuccess) {
            toast({ title: "Cập nhật thành công!", variant: "default" });
            setOpenEditModal(false);
            refetch();
          } else {
            toast({ title: response.messages[0], variant: "destructive" });
          }
        },
        onError: () => {
          toast({ title: "Đã có lỗi xảy ra", variant: "destructive" });
        },
      }
    );
  };

  // Update form values when editedConfig changes
  useEffect(() => {
    if (editedConfig) {
      reset({
        name: editedConfig.name,
        vietnameseName: editedConfig.vietnameseName,
        currentValue: editedConfig.currentValue,
        unit: editedConfig.unit.id.toString(),
      });
    }
  }, [editedConfig, reset]);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    router.push(`?${queryString.stringify({ ...params, page: pageNumber })}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-lg border-none">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý thiết lập hệ thống
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý và chỉnh sửa các thông số hệ thống
          </p>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <LoadingIndicator />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">
                      Tên thiết lập
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Giá trị
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Đơn vị
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Hành động
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.result.items.map((config) => (
                    <TableRow
                      key={config.configurationId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-medium text-gray-800">
                        {config.vietnameseName}
                      </TableCell>
                      <TableCell>
                        {config.unit.name === "Percent"
                          ? `${Number(config.currentValue) * 100}`
                          : config.currentValue}
                      </TableCell>
                      <TableCell>
                        {config.unit.name === "Percent"
                          ? "%"
                          : config.unit.name === "VND"
                          ? "VNĐ"
                          : "--"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditedConfig(config);
                            setOpenEditModal(true);
                          }}
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {data&& data?.result.totalPages > 1 && (
                <div className="mt-6 flex justify-end">
                  <Paginator
                    currentPage={page}
                    totalPages={data.result.totalPages}
                    onPageChange={handlePageChange}
                    showPreviousNext
                  />
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
        <DialogContent className="sm:max-w-[500px] rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Chỉnh sửa thiết lập
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">
                Tên thiết lập
              </Label>
              <Input
                id="name"
                {...register("name")}
                className="focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vietnameseName" className="text-gray-700">
                Tên tiếng Việt
              </Label>
              <Input
                id="vietnameseName"
                {...register("vietnameseName")}
                className="focus:ring-2 focus:ring-blue-500"
              />
              {errors.vietnameseName && (
                <p className="text-sm text-red-500">
                  {errors.vietnameseName.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentValue" className="text-gray-700">
                  Giá trị
                </Label>
                <Input
                  id="currentValue"
                  {...register("currentValue")}
                  className="focus:ring-2 focus:ring-blue-500"
                />
                {errors.currentValue && (
                  <p className="text-sm text-red-500">
                    {errors.currentValue.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit" className="text-gray-700">
                  Đơn vị
                </Label>
                <Select
                  value={getValues("unit")}
                  onValueChange={(value) => setValue("unit", value)}
                >
                  <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Chọn đơn vị" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Phần trăm (%)</SelectItem>
                    <SelectItem value="1">Việt Nam đồng (VNĐ)</SelectItem>
                    <SelectItem value="2">Không xác định</SelectItem>
                  </SelectContent>
                </Select>
                {errors.unit && (
                  <p className="text-sm text-red-500">{errors.unit.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenEditModal(false)}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isPending}
              >
                {isPending ? <LoadingIndicator /> : "Lưu thay đổi"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
