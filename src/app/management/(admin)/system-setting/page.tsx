"use client";

import LoadingIndicator from "@/app/components/LoadingIndicator";
import Paginator from "@/app/components/Paginator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  TConfiguration,
  useGetConfigurations,
  useUpdateConfiguration,
} from "@/hooks/api/useConfiguration";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const UpdateConfigurationSchema = z.object({
  name: z.string().optional(),
  vietnameseName: z.string().optional(),
  currentValue: z.string().optional(),
  unit: z.string().optional(),
});

type UpdateConfigurationForm = z.infer<typeof UpdateConfigurationSchema>;

export default function Page() {
  const [openEditModal, setOpenEditModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = queryString.parse(searchParams.toString());
  const page = params["page"] || 1;
  const [editedConfig, setEditedConfig] = useState<TConfiguration>();
  const { data, refetch } = useGetConfigurations(+(page as string), 10);
  const { mutate: mutateUpdateConfiguration, isPending } =
    useUpdateConfiguration();

  const { handleSubmit, register, setValue, getValues, formState } =
    useForm<UpdateConfigurationForm>({
      defaultValues: {
        name: editedConfig?.name,
        vietnameseName: editedConfig?.vietnameseName,
        currentValue: editedConfig?.currentValue,
        unit: editedConfig?.unit.id,
      },
      resolver: zodResolver(UpdateConfigurationSchema),
    });

  const onSubmit = (data: UpdateConfigurationForm) => {
    mutateUpdateConfiguration(
      {
        configurationId: editedConfig?.configurationId || "",
        name: data.name,
        vietnameseName: data.vietnameseName,
        currentValue: data.currentValue,
        unit: +(data.unit || 0),
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            toast({
              title: "Cập nhật thiết lập thành công!",
            });
            setOpenEditModal(false);
            setEditedConfig(undefined);
            refetch();
          } else {
            toast({
              title: data.messages[0],
            });
          }
        },
      }
    );
  };

  useEffect(() => {
    if (editedConfig) {
      setValue("name", editedConfig.name);
      setValue("vietnameseName", editedConfig.vietnameseName);
      setValue("currentValue", editedConfig.currentValue);
      setValue("unit", editedConfig.unit.id.toString());
    }
  }, [editedConfig, setValue]);

  return (
    <div className="w-full p-6">
      <Card>
        <CardHeader>
          <CardTitle>Quản lý hệ thống</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="mb-4">
            <TableHeader>
              <TableRow>
                <TableHead>Tên thiết lập</TableHead>
                <TableHead>Giá trị</TableHead>
                <TableHead>Đơn vị</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.result.items.map((config) => (
                <TableRow key={config.configurationId}>
                  <TableCell className="font-medium">
                    {config.vietnameseName}
                  </TableCell>
                  <TableCell className="md:table-cell">
                    {config.currentValue}
                  </TableCell>
                  <TableCell>
                    {config.unit.name === "Percent"
                      ? "%"
                      : config.unit.name === "VND"
                      ? "VNĐ"
                      : "--"}
                  </TableCell>
                  <TableCell>
                    <Edit
                      className="cursor-pointer"
                      onClick={() => {
                        setOpenEditModal(true);
                        setEditedConfig(config);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Paginator
            currentPage={+(page as string)}
            totalPages={data?.result.totalPages || 1}
            onPageChange={(pageNumber) => {
              params["page"] = pageNumber.toString();
              router.push(`?${queryString.stringify(params)}`);
            }}
            showPreviousNext
          />
        </CardContent>
      </Card>
      <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thiết lập</DialogTitle>
          </DialogHeader>
          <form className="grid gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="collectionName">Tên thiết lập</Label>
              <Input
                id="name"
                placeholder="Nhập tên thiết lập"
                {...register("name")}
              />
              {formState.errors.name && (
                <p className="text-red-500 text-sm">
                  {formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="collectionName">Tên tiếng Việt</Label>
              <Input
                id="vietnameseName"
                placeholder="Nhập tên tiếng Việt"
                {...register("vietnameseName")}
              />
              {formState.errors.vietnameseName && (
                <p className="text-red-500 text-sm">
                  {formState.errors.vietnameseName.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="collectionName">Giá trị</Label>
                <Input
                  id="currentValue"
                  placeholder="Nhập giá trị"
                  {...register("currentValue")}
                />
                {formState.errors.currentValue && (
                  <p className="text-red-500 text-sm">
                    {formState.errors.currentValue.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="collectionName">Đơn vị</Label>
                <Select
                  {...register("unit")}
                  value={getValues("unit") || "0"}
                  defaultValue={getValues("unit") || "0"}
                  onValueChange={(value) => setValue("unit", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Phần trăm (%)</SelectItem>
                    <SelectItem value="1">Việt Nam đồng (VND)</SelectItem>
                    <SelectItem value="2">Không xác định</SelectItem>
                  </SelectContent>
                </Select>
                {formState.errors.unit && (
                  <p className="text-red-500 text-sm">
                    {formState.errors.unit?.message}
                  </p>
                )}
              </div>
            </div>
          </form>
          <Button
            className="bg-[#E12E43] text-white hover:bg-[#B71C32]"
            onClick={handleSubmit(onSubmit)}
          >
            {isPending ? <LoadingIndicator /> : "Lưu thiết lập"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
