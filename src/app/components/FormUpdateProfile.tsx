import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/provider/global-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

const UpdateProfileSchema = z.object({
  firstName: z.string().min(1, "Vui lòng nhập tên"),
  lastName: z.string().min(1, "Vui lòng nhập họ"),
  gender: z.string().optional(),
});

type UpdateProfileForm = z.infer<typeof UpdateProfileSchema>;

export default function FormUpdateProfile() {
  const { user } = useContext(GlobalContext);
  const [dob, setDob] = useState<Date | undefined>(new Date());
  const { handleSubmit, register, formState, setValue } =
    useForm<UpdateProfileForm>({
      defaultValues: {
        firstName: user?.firstName,
        lastName: user?.lastName,
      },
      resolver: zodResolver(UpdateProfileSchema),
    });

  const onsubmit = (data: UpdateProfileForm) => {
    console.log({ ...data, dob: dob?.toISOString() });
  };

  useEffect(() => {
    setValue("firstName", user?.firstName || "");
    setValue("lastName", user?.lastName || "");
    setValue("gender", user?.gender ? "1" : "0");
  }, [setValue, user]);

  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
      onSubmit={handleSubmit(onsubmit)}
    >
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="name">Tên</Label>
        <Input
          id="firstName"
          placeholder="Nhập tên"
          {...register("firstName")}
        />
        {formState.errors.firstName && (
          <p className="text-red-500 text-sm">
            {formState.errors.firstName.message}
          </p>
        )}
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="name">Họ</Label>
        <Input id="lastName" placeholder="Nhập họ" {...register("lastName")} />
        {formState.errors.firstName && (
          <p className="text-red-500 text-sm">
            {formState.errors.firstName.message}
          </p>
        )}
      </div>
      <div className="flex flex-col space-y-1.5 col-span-2">
        <Label htmlFor="name">Giới tính</Label>
        <Select
          {...register("gender")}
          defaultValue={user?.gender ? "1" : "0"}
          onValueChange={(value) => setValue("gender", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn giới tính" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Nam</SelectItem>
            <SelectItem value="0">Nữ</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col space-y-1.5 col-span-2">
        <Label htmlFor="name">Ngày sinh</Label>
        <Calendar
          mode="single"
          selected={dob}
          onSelect={setDob}
          className="rounded-md border w-fit"
        />
      </div>
      <Button
        type="submit"
        className="col-span-2 bg-[#E12E43] text-white hover:bg-[#B71C32]"
      >
        Cập nhật
      </Button>
    </form>
  );
}
