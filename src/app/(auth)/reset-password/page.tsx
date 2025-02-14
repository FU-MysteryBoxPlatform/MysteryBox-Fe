"use client";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";

const ResetPasswordSchema = z.object({
  email: z.string().email("Vui lòng nhập email hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>;

export default function Page() {
  const { handleSubmit, register, formState } = useForm<ResetPasswordForm>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(ResetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordForm) => {
    console.log({ data });
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Đặt lại mật khẩu</CardTitle>
          <CardDescription>
            Nhập email của bạn và nhập lại mật khẩu mới
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="login-form" className="mb-2">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Email</Label>
                <Input
                  id="email"
                  placeholder="Nhập email"
                  {...register("email")}
                />
                {formState.errors.email && (
                  <p className="text-red-500 text-sm">
                    {formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>
          </form>
          <div className="mt-2 text-sm">
            Bạn đã có tài khoản?{" "}
            <Link href="login" className="text-blue-500 underline">
              Đăng nhập
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            form="login-form"
            className="w-full"
            onClick={handleSubmit(onSubmit)}
          >
            Gửi
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
