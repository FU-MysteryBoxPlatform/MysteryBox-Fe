"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

const LoginSchema = z.object({
  username: z.string().min(1, "Vui lòng nhập username"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type LoginForm = z.infer<typeof LoginSchema>;

export default function Login() {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const { handleSubmit, register, formState } = useForm<LoginForm>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    console.log({ data });
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Đăng nhập</CardTitle>
          <CardDescription>
            Bạn chưa có tài khoản?{" "}
            <Link href="register" className="text-blue-500 underline">
              Đăng ký ngay
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="login-form">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Tên đăng nhập</Label>
                <Input
                  id="username"
                  placeholder="Nhập tên đăng nhập"
                  {...register("username")}
                />
                {formState.errors.username && (
                  <p className="text-red-500 text-sm">
                    {formState.errors.username.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={isShowPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    className="pr-10"
                    {...register("password")}
                  />
                  {isShowPassword ? (
                    <EyeIcon
                      className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={() => setIsShowPassword(false)}
                    />
                  ) : (
                    <EyeClosedIcon
                      className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={() => setIsShowPassword(true)}
                    />
                  )}
                </div>
                {formState.errors.password && (
                  <p className="text-red-500 text-sm">
                    {formState.errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            form="login-form"
            className="w-full"
            onClick={handleSubmit(onSubmit)}
          >
            Đăng nhập
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
